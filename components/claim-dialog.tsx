"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, X } from "lucide-react";
import {
  ToastErrorMessage,
  ToastSuccessMessage,
} from "@/components/ui/toast-messages";
import axios from "axios";

interface Item {
  id: string;
  title: string;
  description: string;
  type: "LOST" | "FOUND";
  status: "ACTIVE" | "CLAIMED" | "RETURNED" | "EXPIRED" | "ARCHIVED";
  location: string;
  dateFound: string | null;
  dateLost: string | null;
  images: string[];
  tags: string[];
  category: string | null;
  createdAt: string;
  updatedAt: string;
  claims: any[];
}

interface ClaimDialogProps {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const claimSchema = yup.object({
  description: yup
    .string()
    .required("Description is required")
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description must not exceed 500 characters"),
  proofImages: yup
    .array()
    .of(yup.string())
    .min(1, "At least one proof image is required")
    .max(5, "Maximum 5 images allowed"),
});

export function ClaimDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
}: ClaimDialogProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      description: "",
      proofImages: [] as string[],
    },
    validationSchema: claimSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        await axios.post("/api/claims/create", {
          itemId: item.id,
          description: values.description,
          proofImages: selectedImages,
        });

        ToastSuccessMessage("Claim submitted successfully");
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      } catch (error: any) {
        ToastErrorMessage(error.message || "Failed to submit claim");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];

      for (const file of Array.from(files)) {
        if (file.size > 0.5 * 1024 * 1024) {
          // 500KB limit
          ToastErrorMessage("Image size should be less than 500KB");
          continue;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          newImages.push(base64String);
          setSelectedImages((prev) => [...prev, base64String]);
          formik.setFieldValue("proofImages", [
            ...selectedImages,
            base64String,
          ]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    formik.setFieldValue("proofImages", newImages);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {item.type === "LOST" ? "I Found This Item" : "This is My Item"}
          </DialogTitle>
          <DialogDescription>
            {item.type === "LOST"
              ? "Provide details about where and when you found this item to help verify your claim."
              : "Provide proof of ownership to help verify your claim."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">
                {item.type === "LOST"
                  ? "Where and when did you find this item?"
                  : "How can you prove this item belongs to you?"}
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={
                  item.type === "LOST"
                    ? "I found this item at... It was located..."
                    : "This is my item because... I can prove ownership by..."
                }
                className="mt-1 min-h-[100px]"
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {formik.errors.description}
                </p>
              )}
            </div>

            <div>
              <Label>Proof Images</Label>
              <p className="text-sm text-gray-500 mb-2">
                Upload images that help verify your claim (e.g., item details,
                location, or proof of ownership)
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="claim-image-upload"
                />
                <label htmlFor="claim-image-upload" className="cursor-pointer">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Click to upload images or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG up to 500KB each
                  </p>
                </label>
              </div>

              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Proof ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {formik.touched.proofImages && formik.errors.proofImages && (
                <p className="text-xs text-red-500 mt-1">
                  {formik.errors.proofImages}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Claim"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
