"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import {
  ToastErrorMessage,
  ToastSuccessMessage,
} from "@/components/ui/toast-messages";
import axios from "axios";
// Password requirements for validation
const passwordRequirements = [
  { label: "At least 8 characters long", regex: "^.{8,}$" },
  { label: "Contains at least one uppercase letter", regex: "^.*[A-Z].*$" },
  { label: "Contains at least one lowercase letter", regex: "^.*[a-z].*$" },
  { label: "Contains at least one number", regex: "^.*[0-9].*$" },
  {
    label: "Contains at least one special character",
    regex: `^.*[!@#$%^&*()_+\\-=\\[\\]{};':"\\|,.<>\\/?].*$`,
  },
];

// Initial form values
const initialValues = {
  name: "",
  email: "",
  studentId: "",
  phone: "",
  department: "",
  role: "STUDENT",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

// Validation schema
const validationSchema = yup.object({
  name: yup
    .string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .matches(/@umt\.edu\.pk$/, "Must be a UMT email address")
    .test(
      "emp_username-exists",
      "Email already taken",
      async (value, schema) => {
        try {
          const response = await axios.post("/api/users/verifyemail", {
            email: value,
            id: schema.parent.id,
            action: "create",
          });
          const isExist = response.data;
          return value && isExist;
        } catch (error) {
          ToastErrorMessage(error);
        }
      }
    ),
  studentId: yup
    .string()
    .when("role", {
      is: "STUDENT",
      then: (schema) => schema.required("Student ID is required for students"),
      otherwise: (schema) => schema.optional(),
    })
    .matches(
      /^\d{4}-[A-Z]{2}-\d{1,3}$/,
      "Invalid student ID format (e.g., 2021-CS-123)"
    ),
  phone: yup
    .string()
    .matches(
      /^\+92\s?\d{3}\s?\d{7}$/,
      "Invalid phone number format (e.g., +923001234567)"
    )
    .optional(),
  department: yup.string().required("Department is required"),
  role: yup
    .string()
    .oneOf(["STUDENT", "FACULTY", "ADMIN"], "Invalid role")
    .required("Role is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
  acceptTerms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const departments = [
    "Computer Science",
    "Software Engineering",
    "Information Technology",
    "Business Administration",
    "Engineering",
    "Management Sciences",
    "Economics",
    "English",
    "Other",
  ];

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        await axios.post("/api/users/register", values);
        ToastSuccessMessage("Account created successfully");
        router.push("/auth/login");
      } catch (error) {
        ToastErrorMessage(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

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
              Create Account
            </CardTitle>
            <CardDescription>
              Join the UMT Lost & Found community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Hassan"
                    className={`my-2 ${
                      formik.touched.name && formik.errors.name
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {formik.errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">UMT Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="john.doe@umt.edu.pk"
                    className={`my-2 ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    name="role"
                    value={formik.values.role}
                    onValueChange={(value) =>
                      formik.setFieldValue("role", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="FACULTY">Faculty</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {formik.touched.role && formik.errors.role && (
                    <p className="text-sm text-red-500 mt-1">
                      {formik.errors.role}
                    </p>
                  )}
                </div>

                {formik.values.role === "STUDENT" && (
                  <div>
                    <Label htmlFor="studentId">Student ID *</Label>
                    <Input
                      id="studentId"
                      name="studentId"
                      type="text"
                      value={formik.values.studentId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="e.g., 2021-CS-123"
                      className={`my-2 ${
                        formik.touched.studentId && formik.errors.studentId
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {formik.touched.studentId && formik.errors.studentId && (
                      <p className="text-sm text-red-500 mt-1">
                        {formik.errors.studentId}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    name="department"
                    value={formik.values.department}
                    onValueChange={(value) =>
                      formik.setFieldValue("department", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem
                          key={dept}
                          value={dept.toLowerCase().replace(/\s+/g, "-")}
                        >
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.touched.department && formik.errors.department && (
                    <p className="text-sm text-red-500 mt-1">
                      {formik.errors.department}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="+92 300 1234567"
                    className={`my-2 ${
                      formik.touched.phone && formik.errors.phone
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-sm text-red-500 mt-1">
                      {formik.errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative my-2">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Create a strong password"
                      className={
                        formik.touched.password && formik.errors.password
                          ? "border-red-500"
                          : ""
                      }
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
                    <p className="text-sm text-red-500 mt-1">
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative my-2">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Confirm your password"
                      className={
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                          ? "border-red-500"
                          : ""
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">
                        {formik.errors.confirmPassword}
                      </p>
                    )}
                </div>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Password Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 my-1">
                        <Checkbox
                          checked={
                            formik.values.password?.match(req.regex)
                              ? true
                              : false
                          }
                          disabled
                        />
                        <p className="text-sm text-gray-500">{req.label}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formik.values.acceptTerms}
                  onCheckedChange={(checked: any) =>
                    formik.setFieldValue("acceptTerms", checked)
                  }
                  className="mt-1"
                />
                <Label
                  htmlFor="acceptTerms"
                  className="text-sm text-gray-600 leading-5"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {formik.touched.acceptTerms && formik.errors.acceptTerms && (
                <p className="text-sm text-red-500">
                  {formik.errors.acceptTerms}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
