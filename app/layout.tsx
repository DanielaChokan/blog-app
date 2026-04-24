import { ReactNode } from "react";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import styles from "./layout.module.css";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className={styles.body}>
                <header className={styles.siteHeader}>
                    <div className={styles.siteHeaderInner}>
                        <h1 className={styles.siteTitle}>My Blog</h1>
                        <SiteHeader />
                    </div>
                </header>
                <div id="auth-form-slot" className={styles.authFormSlot} />
                <main className={styles.mainContent}>{children}</main>
            </body>
        </html>
    );
}
