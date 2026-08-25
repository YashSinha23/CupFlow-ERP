import { Navbar } from "./Navbar";
import styles from "./Layout.module.css";

export function Layout({ children }) {
    return (
        <div className={styles.layout}>
            <Navbar />

            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}