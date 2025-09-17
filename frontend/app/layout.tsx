import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Agent Todo - AI-Powered Task Management',
  description: 'Transform your productivity with AI-powered task management. Create, organize, and complete tasks using intelligent agents that understand natural language.',
  icons: {
    icon: 'favicon.svg',
    shortcut: 'favicon.svg',
    apple: 'favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
