"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  ToastErrorMessage,
  ToastSuccessMessage,
} from "@/components/ui/toast-messages";
import axios from "axios";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { data: session }: any = useSession();
  const router = useRouter();

  const userSchema = yup.object({
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email format")
      .test(
        "email-domain",
        "Email must be from UMT domain",
        (value) => value?.endsWith("@umt.edu.pk") || false
      )
      .test(
        "emp_username-exists",
        "Email is not registered",
        async (value, schema) => {
          try {
            const response = await axios.post("/api/users/verifyemail", {
              email: value,
              id: schema.parent.id,
              action: "create",
            });
            const isExist = !response.data as any;
            return value && isExist;
          } catch (error) {
            ToastErrorMessage(error);
          }
        }
      ),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: userSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const response = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
          callbackUrl: "/",
        });

        if (response?.error) {
          ToastErrorMessage(response.error);
        } else if (response?.ok) {
          ToastSuccessMessage("Login successful");
        } else {
          ToastErrorMessage("Authentication failed");
        }
      } catch (error: any) {
        ToastErrorMessage(error.message || "An error occurred during login");
      }
    },
  });

  useEffect(() => {
    if (session?.user) {
      if (session?.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [session]);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="flex items-center justify-center space-x-2 mb-6"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">
            UMT Lost & Found
          </span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to your account to access the Lost & Found portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="your.email@umt.edu.pk"
                  required
                  className="my-2"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-xs text-orange-500">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative my-2">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-xs text-orange-500">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={formik.values.rememberMe}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("rememberMe", checked)
                    }
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    New to UMT Lost & Found?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/auth/register">
                  <Button variant="outline" className="w-full">
                    Create an Account
                  </Button>
                </Link>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Demo Credentials:
              </h4>
              <div className="text-xs text-blue-800 space-y-1">
                <p>
                  <strong>Admin:</strong> admin@umt.edu.pk / admin123
                </p>
                <p>
                  <strong>Student:</strong> student@umt.edu.pk / student123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
