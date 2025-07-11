// AuthProvider.tsx
"use client";
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children, session }: any) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
