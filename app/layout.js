

import { AuthProvider } from '@/components/providers/AuthProvider';
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const metadata = {
  title: "CRM System",
  description: "Customer Relationship Management System",
};

import { QueryProvider } from '@/components/providers/QueryProvider';
import { Toaster } from 'sonner';


export default function RootLayout({ children }) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <QueryProvider>
              <Toaster position="top-right" richColors closeButton />
              {children}
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
