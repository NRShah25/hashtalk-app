/**
 * @module layout.tsx
 * @description This module provides the main layout structure for the application.
 * @requires next
 * @requires next/font/google
 * @requires @clerk/nextjs
 * @requires @/lib/utils
 * @requires @/components/providers/theme-provider
 * @requires @/components/providers/modal-provider
 * @requires @/components/providers/socket-provider
 * @requires @/components/providers/query-provider
 */

import './globals.css';

import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ModalProvider } from '@/components/providers/modal-provider';
import { SocketProvider } from '@/components/providers/socket-provider';
import { QueryProvider } from '@/components/providers/query-provider';

const font = Open_Sans({ subsets: ['latin'] });

/** Metadata for the application. */
export const metadata: Metadata = {
    title: '#talk',
    description: 'Generated by create next app',
};

/**
 * Represents the root layout of the application.
 * 
 * This component encompasses the various providers and global styles needed for the application.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {React.ReactNode} Returns the structured layout of the application.
 */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
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
                        storageKey="discord-theme"
                    >
                        <SocketProvider>
                            <ModalProvider />
                            <QueryProvider>
                                {children}
                            </QueryProvider>
                        </SocketProvider>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}