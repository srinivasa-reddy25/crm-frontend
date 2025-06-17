import { ThemeProvider } from "@/components/ui/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="flex-grow flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}