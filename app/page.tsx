import PasswordGenerator from "@/components/password-generator";
import { ThemeProvider } from "@/components/theme-provider";

export default function Home() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme-preference">
      <main className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
        <PasswordGenerator />
      </main>
    </ThemeProvider>
  );
}
