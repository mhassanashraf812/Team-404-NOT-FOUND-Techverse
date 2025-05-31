import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";
import SocketProvider from "@/components/providers/SocketProvider";

export const metadata: Metadata = {
  title: "Lost AnD Found",
};

export default function RootLayout({
  children,
  params: { session },
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <html lang="en">
      <AuthProvider session={session}>
        <Toaster
          position="top-right"
          richColors
          expand={true}
          toastOptions={{
            unstyled: true,
            style: {
              background: "#ffffff",
              display: "flex",
              gap: "4px",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 10px",
              borderRadius: "5px",
              right: 0,
              top: 0,
            },
            classNames: {
              cancelButton: "bg-white",
              closeButton: "bg-white",
            },
          }}
        />
        <body>
          <SocketProvider>{children}</SocketProvider>
        </body>
      
      </AuthProvider>
    </html>
  );
}
