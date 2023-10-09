import './globals.css';
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ModalProvider } from '@/components/providers/modal-provider';

const font = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '#talk',
  description: 'Join the conversation revolution.',
};

/**
 * RootLayout component.
 * 
 * Provides the foundational layout structure for pages in the application.
 * 
 * @param children - The child components or elements that are rendered within this layout.
 * @returns The component rendering the layout structure.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(
          font.className,
          "bg-white dark:bg-[#313338]"
        )}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="dark-mode"
          >
            <ModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}