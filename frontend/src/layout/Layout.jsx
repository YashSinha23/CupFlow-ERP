import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import styles from "./Layout.module.css";

export function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.mainArea}>
        <Navbar />

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}