"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, AlertCircle, CheckCircle, Camera, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  ToastErrorMessage,
  ToastSuccessMessage,
} from "@/components/ui/toast-messages";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function ReportPage() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"lost" | "found">("lost");
  const router = useRouter();
  const categories = [
    "Electronics",
    "Bags & Backpacks",
    "Documents & IDs",
    "Books & Stationery",
    "Personal Items",
    "Clothing & Accessories",
    "Sports Equipment",
    "Other",
  ];

  const locations = [
    "Library - Ground Floor",
    "Library - 1st Floor",
    "Library - 2nd Floor",
    "Engineering Building",
    "Computer Lab A",
    "Computer Lab B",
    "Cafeteria",
    "Main Entrance",
    "Parking Area",
    "Sports Complex",
    "Auditorium",
    "Admin Block",
  ];

  const commonTags = [
    "urgent",
    "valuable",
    "sentimental",
    "electronic",
    "personal",
    "academic",
    "work-related",
    "gift",
    "new",
    "damaged",
  ];

  const itemSchema = yup.object({
    title: yup.string().required("Title is required"),
    category: yup.string().required("Category is required"),
    description: yup.string().required("Description is required"),
    location: yup.string().required("Location is required"),
    date: yup.date().required("Date is required"),
    time: yup.string().required("Time is required"),
    additionalInfo: yup.string(),
    phone: yup.string().required("Phone number is required"),
    currentLocation: yup.string().when("type", {
      is: "found",
      then: (schema) => schema.required("Current location is required"),
      otherwise: (schema) => schema.optional(),
    }),
    email: yup.string().email("Invalid email address").optional(),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      category: "",
      description: "",
      location: "",
      date: "",
      time: "",
      additionalInfo: "",
      phone: "",
      currentLocation: "",
      type: "lost" as "lost" | "found",
      email: "",
    },
    validationSchema: itemSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          images: selectedImages,
          tags: selectedTags,
          type: activeTab.toUpperCase() as "LOST" | "FOUND",
          dateFound:
            activeTab === "found"
              ? new Date(`${values.date}T${values.time}`)
              : null,
          dateLost:
            activeTab === "lost"
              ? new Date(`${values.date}T${values.time}`)
              : null,
        };

        const response = await axios.post("/api/items/report", payload);

        ToastSuccessMessage("Item reported successfully");
        formik.resetForm();
        setSelectedImages([]);
        setSelectedTags([]);
        router.push("/dashboard");
      } catch (error: any) {
        ToastErrorMessage(error.message || "Failed to report item");
      }
    },
  });

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];

      for (const file of Array.from(files)) {
        if (file.size > 0.5 * 1024 * 1024) {
          // 10MB limit
          ToastErrorMessage("Image size should be less than 500KB");
          continue;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          newImages.push(base64String);
          setSelectedImages((prev) => [...prev, base64String]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  UMT Lost & Found
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/browse">
                <Button variant="outline">Browse Items</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Report an Item
          </h1>
          <p className="text-gray-600">
            Help us reunite lost items with their owners or find the owner of
            something you found
          </p>
        </div>

        <Tabs
          defaultValue="lost"
          className="space-y-6"
          onValueChange={(value) => {
            setActiveTab(value as "lost" | "found");
            formik.setFieldValue("type", value);
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lost" className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>I Lost Something</span>
            </TabsTrigger>
            <TabsTrigger value="found" className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>I Found Something</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lost">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Report Lost Item
                </CardTitle>
                <CardDescription>
                  Provide detailed information about your lost item to help
                  others identify and return it to you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Basic Information
                    </h3>

                    <div>
                      <Label htmlFor="title">Item Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g., iPhone 14 Pro - Space Black"
                        className="mt-1"
                      />
                      {formik.touched.title && formik.errors.title && (
                        <p className="text-xs text-orange-500">
                          {formik.errors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        name="category"
                        value={formik.values.category}
                        onValueChange={(value) =>
                          formik.setFieldValue("category", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formik.touched.category && formik.errors.category && (
                        <p className="text-xs text-orange-500">
                          {formik.errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">
                        Detailed Description *
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Describe your item in detail - color, brand, model, distinctive features, condition, etc."
                        className="mt-1 min-h-[100px]"
                      />
                      {formik.touched.description &&
                        formik.errors.description && (
                          <p className="text-xs text-orange-500">
                            {formik.errors.description}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Location and Time */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Location & Time Details
                    </h3>

                    <div>
                      <Label htmlFor="location">Last Known Location *</Label>
                      <Select
                        name="location"
                        value={formik.values.location}
                        onValueChange={(value) =>
                          formik.setFieldValue("location", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Where did you last see your item?" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formik.touched.location && formik.errors.location && (
                        <p className="text-xs text-orange-500">
                          {formik.errors.location}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Date Lost *</Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          value={formik.values.date}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="mt-1"
                        />
                        {formik.touched.date && formik.errors.date && (
                          <p className="text-xs text-orange-500">
                            {formik.errors.date}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="time">Approximate Time *</Label>
                        <Input
                          id="time"
                          name="time"
                          type="time"
                          value={formik.values.time}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="mt-1"
                        />
                        {formik.touched.time && formik.errors.time && (
                          <p className="text-xs text-orange-500">
                            {formik.errors.time}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="additionalInfo">
                        Additional Location Details
                      </Label>
                      <Textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formik.values.additionalInfo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Any additional details about where you might have lost it..."
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Images */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Images
                    </h3>
                    <p className="text-sm text-gray-600">
                      Upload photos of your item (if you have any) to help with
                      identification
                    </p>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="lost-image-upload"
                      />
                      <label
                        htmlFor="lost-image-upload"
                        className="cursor-pointer"
                      >
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          Click to upload images or drag and drop
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          PNG, JPG up to 10MB each
                        </p>
                      </label>
                    </div>

                    {selectedImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Upload ${index + 1}`}
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
                  </div>

                  {/* Tags */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Tags
                    </h3>
                    <p className="text-sm text-gray-600">
                      Add tags to help categorize your item
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {commonTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => addTag(tag)}
                          className={`px-3 py-1 rounded-full text-sm border ${
                            selectedTags.includes(tag)
                              ? "bg-blue-100 border-blue-300 text-blue-800"
                              : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="text-sm font-medium text-gray-700">
                          Selected tags:
                        </span>
                        {selectedTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center space-x-1"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Contact Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="+92 300 1234567"
                          className="mt-1"
                        />
                        {formik.touched.phone && formik.errors.phone && (
                          <p className="text-xs text-orange-500">
                            {formik.errors.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        {/* <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={formik.values.email}
                          className="mt-1 bg-gray-50"
                        /> */}
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex space-x-4 pt-6">
                    <Button
                      type="submit"
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      disabled={formik.isSubmitting}
                    >
                      {formik.isSubmitting
                        ? "Submitting..."
                        : "Report Lost Item"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="found">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Report Found Item
                </CardTitle>
                <CardDescription>
                  Help return a found item to its rightful owner by providing
                  detailed information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Basic Information
                    </h3>

                    <div>
                      <Label htmlFor="title">Item Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g., Blue Jansport Backpack"
                        className="mt-1"
                      />
                      {formik.touched.title && formik.errors.title && (
                        <p className="text-xs text-orange-500">
                          {formik.errors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        name="category"
                        value={formik.values.category}
                        onValueChange={(value) =>
                          formik.setFieldValue("category", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category}
                              value={category
                                .toLowerCase()
                                .replace(/\s+/g, "-")}
                            >
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formik.touched.category && formik.errors.category && (
                        <p className="text-xs text-orange-500">
                          {formik.errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">
                        Detailed Description *
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Describe the found item in detail - color, brand, model, condition, contents (if applicable), etc."
                        className="mt-1 min-h-[100px]"
                      />
                      {formik.touched.description &&
                        formik.errors.description && (
                          <p className="text-xs text-orange-500">
                            {formik.errors.description}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Location and Time */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Location & Time Details
                    </h3>

                    <div>
                      <Label htmlFor="location">Where You Found It *</Label>
                      <Select
                        name="location"
                        value={formik.values.location}
                        onValueChange={(value) =>
                          formik.setFieldValue("location", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select the location where you found the item" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem
                              key={location}
                              value={location
                                .toLowerCase()
                                .replace(/\s+/g, "-")}
                            >
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formik.touched.location && formik.errors.location && (
                        <p className="text-xs text-orange-500">
                          {formik.errors.location}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Date Found *</Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          value={formik.values.date}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="mt-1"
                        />
                        {formik.touched.date && formik.errors.date && (
                          <p className="text-xs text-orange-500">
                            {formik.errors.date}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="time">Approximate Time</Label>
                        <Input
                          id="time"
                          name="time"
                          type="time"
                          value={formik.values.time}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="currentLocation">
                        Current Location of Item *
                      </Label>
                      <Textarea
                        id="currentLocation"
                        name="currentLocation"
                        value={formik.values.currentLocation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Where is the item currently stored? (e.g., Security office, with me, etc.)"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Images */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Images *
                    </h3>
                    <p className="text-sm text-gray-600">
                      Upload clear photos of the found item to help the owner
                      identify it
                    </p>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="found-image-upload"
                      />
                      <label
                        htmlFor="found-image-upload"
                        className="cursor-pointer"
                      >
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          Click to upload images or drag and drop
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          PNG, JPG up to 10MB each
                        </p>
                      </label>
                    </div>

                    {selectedImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Upload ${index + 1}`}
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
                  </div>

                  {/* Tags */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Tags
                    </h3>
                    <p className="text-sm text-gray-600">
                      Add tags to help categorize the found item
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {commonTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => addTag(tag)}
                          className={`px-3 py-1 rounded-full text-sm border ${
                            selectedTags.includes(tag)
                              ? "bg-blue-100 border-blue-300 text-blue-800"
                              : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="text-sm font-medium text-gray-700">
                          Selected tags:
                        </span>
                        {selectedTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center space-x-1"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Contact Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="+92 300 1234567"
                          className="mt-1"
                        />
                        {formik.touched.phone && formik.errors.phone && (
                          <p className="text-xs text-orange-500">
                            {formik.errors.phone}
                          </p>
                        )}
                      </div>
                      {/* <div>
                        <Label htmlFor="email">Email (Auto-filled)</Label>
                        <Input
                          id="email"
                          value="john.doe@umt.edu.pk"
                          disabled
                          className="mt-1 bg-gray-50"
                        />
                      </div> */}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex space-x-4 pt-6">
                    <Button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={formik.isSubmitting}
                    >
                      {formik.isSubmitting
                        ? "Submitting..."
                        : "Report Found Item"}
                    </Button>
                    <Button type="button" variant="outline" className="flex-1">
                      Save as Draft
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
