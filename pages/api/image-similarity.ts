
import type { NextApiRequest, NextApiResponse } from 'next';

const CLOUD_NAME = process.env.CLOUDINARY_NAME;
const API_KEY = process.env.CLOUDINARY_KEY;
const API_SECRET = process.env.CLOUDINARY_SECRET;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY!;

const getFoundItemsFromCloudinary = async () => {
  const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/tags/found-item`, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const data = await res.json();
  return data.resources.map((img: any) => ({
    imageUrl: img.secure_url,
  }));
};

const getEmbeddingFromUrl = async (imageUrl: string): Promise<number[]> => {
  const res = await fetch("https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: imageUrl }),
  });

  const result = await res.json();
  return result[0];  
};

const cosineSimilarity = (vecA: number[], vecB: number[]) => {
  const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { imageUrl } = req.body;
  if (!imageUrl) return res.status(400).json({ error: "imageUrl is required" });

  try {
    const lostEmbedding = await getEmbeddingFromUrl(imageUrl);

    const foundImages = await getFoundItemsFromCloudinary();

    const foundWithEmbeddings = await Promise.all(
      foundImages.map(async (item:any) => {
        const embedding = await getEmbeddingFromUrl(item.imageUrl);  
        const similarity = cosineSimilarity(lostEmbedding, embedding);
        return { ...item, similarity };
      })
    );

    const topMatches = foundWithEmbeddings
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    res.status(200).json(topMatches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image similarity failed." });
  }
}
