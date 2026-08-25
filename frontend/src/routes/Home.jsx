import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NAV_ITEMS } from "../layout/navConfig";
import styles from "./Home.module.css";

const MODULE_DESCRIPTIONS = {
    Users: "Manage staff accounts, roles, permissions, and system access.",
    Materials:
        "Define raw materials, track supplier information, and manage cost parameters.",
    Inventory:
        "Monitor stock levels, track stock movements, and manage replenishments.",
    Orders:
        "Process customer orders, manage order flow, and track order status.",
    BOM: "Configure Bill of Materials, manage product recipes, and control BOM entries.",
    Production:
        "Manage production stages and monitor manufacturing progress.",
    Dispatch:
        "Coordinate completed orders and manage outgoing shipments.",
};

export function Home() {
    const { user } = useAuth();

    const visibleModules = NAV_ITEMS.filter(
        (item) =>
            item.roles === null ||
            item.roles.includes(user.role)
    );

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div>
                    <h1>Welcome, {user.fullName}</h1>

                    <p>
                        Here is an overview of your CupFlow ERP system today.
                        Access key modules below to manage operations.
                    </p>
                </div>

                {visibleModules.some((item) => item.label === "Orders") && (
                    <Link
                        to="/orders"
                        className={styles.newOrderButton}
                    >
                        <span>+</span>
                        New Order
                    </Link>
                )}
            </section>

            <section className={styles.modules}>
                {visibleModules.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={styles.card}
                        >
                            <div className={styles.cardTop}>
                                <div className={styles.iconBox}>
                                    <Icon size={22} />
                                </div>

                                <span className={styles.arrow}>
                                    →
                                </span>
                            </div>

                            <h2>{item.label}</h2>

                            <p>
                                {MODULE_DESCRIPTIONS[item.label]}
                            </p>
                        </Link>
                    );
                })}
            </section>
        </div>
    );
}