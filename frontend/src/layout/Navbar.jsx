import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NAV_GROUPS } from "./navConfig";
import styles from "./Navbar.module.css";

const PAGE_DESCRIPTIONS = {
  "/": "Overview of your manufacturing operations",
  "/orders": "Track customer orders from reservation to dispatch",
  "/manufacturing/production": "Monitor work moving across production stages",
  "/cups": "Manage product specifications and bills of materials",
  "/materials": "Manage raw materials and reorder thresholds",
  "/inventory": "Review current stock and material availability",
  "/inventory/movements": "Review receipts, reservations, and consumption",
  "/inventory/reservations": "Track material reserved for active orders",
  "/users": "Manage staff accounts, roles, and access",
  "/employees": "Employee management workspace",
  "/admin/settings": "Configure workspace preferences",
};

export function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
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
  const currentPage = NAV_GROUPS.flatMap((group) => group.items).find(
    (item) => item.path === pathname,
  );
  const workspaceTitle = currentPage?.label ?? "CupFlow workspace";
  const workspaceSubtitle = PAGE_DESCRIPTIONS[pathname] ?? "Manufacturing operations workspace";

  return (
    <header className={styles.navbar}>
      <div className={styles.workspace}>
        <span className={styles.workspaceTitle}>{workspaceTitle}</span>
        <span className={styles.workspaceSubtitle}>{workspaceSubtitle}</span>
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
