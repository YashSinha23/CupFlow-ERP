import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NAV_GROUPS } from "./navConfig";
import styles from "./Sidebar.module.css";
import cupflowLogo from "../assets/logo.png";

export function Sidebar() {
  const { user } = useAuth();

  const visibleGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => item.roles === null || item.roles.includes(user?.role),
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <img src={cupflowLogo} alt="CupFlow ERP" className={styles.logo} />
      </div>

      <nav className={styles.navigation} aria-label="Main navigation">
        {visibleGroups.map((group) => (
          <section className={styles.navGroup} key={group.label}>
            <h2 className={styles.groupLabel}>{group.label}</h2>

            <div className={styles.groupItems}>
              {group.items.map((item) => {
                const Icon = item.icon;

                if (!item.available) {
                  return (
                    <div
                      className={`${styles.navItem} ${styles.disabledItem}`}
                      key={item.path}
                      aria-disabled="true"
                      title="Planned"
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span>{item.label}</span>
                      <span className={styles.plannedLabel}>Planned</span>
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `${styles.navItem} ${isActive ? styles.activeItem : ""}`
                    }
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>Manufacturing ERP</div>
    </aside>
  );
}