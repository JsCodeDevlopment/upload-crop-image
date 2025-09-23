import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ImageCropField - Componente de Upload e Crop de Imagens",
  description:
    "Componente React avançado para upload, crop e redimensionamento de imagens com suporte a rotação, zoom e formatos personalizados.",
  keywords: [
    "React",
    "Next.js",
    "upload",
    "crop",
    "imagens",
    "componente",
    "image-cropper",
  ],
  authors: [{ name: "Jonatas Silva" }],
  creator: "Jonatas Silva",
  publisher: "Jonatas Silva",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://upload-crop-image.vercel.app/"),
  openGraph: {
    title: "ImageCropField - Componente de Upload e Crop de Imagens",
    description:
      "Componente React avançado para upload, crop e redimensionamento de imagens com suporte a rotação, zoom e formatos personalizados.",
    type: "website",
    locale: "pt_BR",
    siteName: "ImageCropField",
    images: [
      {
        url: "/Cut.png",
        width: 1200,
        height: 630,
        alt: "ImageCropField - Componente de Upload e Crop de Imagens",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
