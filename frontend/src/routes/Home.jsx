import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NAV_GROUPS } from "../layout/navConfig";
import styles from "./Home.module.css";

const MODULE_DESCRIPTIONS = {
  "User accounts": "Manage staff login accounts, roles, and system access.",
  Materials: "Manage raw materials used in manufacturing.",
  Products: "Manage cup specifications and their bills of materials.",
  "Stock overview": "Monitor available stock and low-stock materials.",
  Orders: "Create orders and track their progress.",
};

export function Home() {
  const { user } = useAuth();

  const visibleModules = NAV_GROUPS.flatMap((group) => group.items).filter(
    (item) =>
      item.available &&
      item.label !== "Dashboard" &&
      (item.roles === null || item.roles.includes(user.role)),
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <h1>Welcome, {user.fullName}</h1>

          <p>
            Here is an overview of your CupFlow ERP system today. Access key
            modules below to manage operations.
          </p>
        </div>

        {visibleModules.some((item) => item.label === "Orders") && (
          <Link to="/orders" className={styles.newOrderButton}>
            <span>+</span>
            New Order
          </Link>
        )}
      </section>

      <section className={styles.modules}>
        {visibleModules.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.iconBox}>
                  <Icon size={22} />
                </div>

                <span className={styles.arrow}>→</span>
              </div>

              <h2>{item.label}</h2>

              <p>{MODULE_DESCRIPTIONS[item.label]}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
