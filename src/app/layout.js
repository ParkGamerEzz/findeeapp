import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FINDEE",
  description: "FINDEE EASY TO FIND",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet"/>
        </head>
      <body className={inter.className}>{children}</body>
      
    </html>
  );
}
