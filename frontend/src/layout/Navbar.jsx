import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./Navbar.module.css";

export function Navbar() {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleLogout() {
    setProfileOpen(false);
    logout();
  }

  const initials = user?.fullName?.charAt(0).toUpperCase() ?? "?";
  const roleLabel = user?.role?.replaceAll("_", " ") ?? "";

  return (
    <header className={styles.navbar}>
      <div className={styles.workspace}>
        <span className={styles.workspaceTitle}>CupFlow ERP</span>
        <span className={styles.workspaceSubtitle}>
          Manufacturing workspace
        </span>
      </div>

      <div className={styles.profileWrapper} ref={profileRef}>
        <button
          type="button"
          className={styles.profileButton}
          aria-expanded={profileOpen}
          aria-haspopup="menu"
          onClick={() => setProfileOpen((open) => !open)}
        >
          <span className={styles.profileAvatar} aria-hidden="true">
            {initials}
          </span>

          <span className={styles.profileText}>
            <span className={styles.profileName}>{user?.fullName}</span>
            <span className={styles.profileRole}>{roleLabel}</span>
          </span>

          <span className={styles.profileArrow} aria-hidden="true">
            ▾
          </span>
        </button>

        {profileOpen && (
          <div className={styles.profileDropdown} role="menu">
            <div className={styles.dropdownUser}>
              <strong>{user?.fullName}</strong>
              <span>{roleLabel}</span>
            </div>

            <button
              type="button"
              className={styles.logoutButton}
              role="menuitem"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}