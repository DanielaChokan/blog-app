import { ReactNode } from "react";
import "./globals.css";
import styles from "./layout.module.css";

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className={styles.body}>{children}</body>
		</html>
	);
}
