import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "AITeacher — Sun'iy Intellektni O'rganing",
  description: "O'zbekistondagi eng yaxshi AI o'quv platformasi. Groq, ChatGPT, Machine Learning, Prompt Engineering va boshqa AI mavzularini o'rganing.",
  keywords: "AI, sun'iy intellekt, machine learning, deep learning, prompt engineering, o'zbek",
  openGraph: {
    title: "AITeacher Platform",
    description: "Sun'iy intellektni o'rganishning yangi yo'li",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body>
        {/* Aurora background orbs */}
        <div className="orb orb-purple" aria-hidden="true" />
        <div className="orb orb-cyan" aria-hidden="true" />
        <div className="orb orb-amber" aria-hidden="true" />

        {/* Stars */}
        <div className="stars-bg" aria-hidden="true" />

        <div className="relative z-10">
          {children}
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0E0E26',
              color: '#F8FAFC',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#10B981', secondary: '#0E0E26' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#0E0E26' },
            },
          }}
        />
      </body>
    </html>
  );
}
