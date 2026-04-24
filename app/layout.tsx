import { ReactNode } from "react";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#eef2ff_0%,transparent_55%),linear-gradient(180deg,#f9fafb_0%,#f3f4f6_100%)] text-gray-900 font-sans leading-relaxed">
                <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
                    <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto] items-center gap-3 px-5 py-3 md:px-9 md:py-4">
                        <h1 className="text-[clamp(1.25rem,1.6vw,1.6rem)] font-bold leading-tight tracking-tight">
                            My Blog
                        </h1>
                        <SiteHeader />
                    </div>
                </header>
                <div
                    id="auth-form-slot"
                    className="mx-auto flex w-full max-w-6xl justify-center px-5 pt-2 md:px-9 md:pt-3"
                />
                <main className="w-full">{children}</main>
            </body>
        </html>
    );
}
