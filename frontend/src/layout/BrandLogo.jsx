import styles from "./BrandLogo.module.css";

export function BrandLogo() {
  return (
    <div className={styles.brandLockup} role="img" aria-label="CupFlow Manufacturing">
      <span className={styles.mark} aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M18 8c-4-3 4-4 1-7M28 10c-4-3 4-4 1-7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M11 17h23l-2.2 17.4a4 4 0 0 1-4 3.5h-10a4 4 0 0 1-4-3.5L11 17Z"
            fill="currentColor"
            opacity=".16"
          />
          <path
            d="M11 17h23l-2.2 17.4a4 4 0 0 1-4 3.5h-10a4 4 0 0 1-4-3.5L11 17Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M34 21h2.5a5 5 0 0 1 0 10H33M16 24h13M17 30h11M12 42h23"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path d="M20 13h8" stroke="#70d6c2" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </span>
      <span className={styles.wordmark}>
        <span className={styles.name}><span>Cup</span><strong>Flow</strong></span>
        <span className={styles.caption}>MANUFACTURING</span>
      </span>
    </div>
  );
}
