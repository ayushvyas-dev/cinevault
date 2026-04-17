import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "CineVault — Discover Popular Movies",
  description:
    "Browse and search through thousands of movies from The Movie Database (TMDB). Discover popular films, check ratings, and explore detailed movie information.",
  keywords: ["movies", "TMDB", "film", "cinema", "popular movies", "search movies"],
  openGraph: {
    title: "CineVault — Discover Popular Movies",
    description: "Browse and search through thousands of movies from TMDB.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
