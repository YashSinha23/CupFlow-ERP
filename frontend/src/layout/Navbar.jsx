import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NAV_ITEMS } from "./navConfig";
import styles from "./Navbar.module.css";
import cupflowLogo from "../assets/logo.png";

export function Navbar() {
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const navRef = useRef(null);
  const linksRef = useRef(null);
  const profileRef = useRef(null);

  const visibleItems = NAV_ITEMS.filter(
    (item) => item.roles === null || item.roles.includes(user.role),
  );

  useEffect(() => {
    function checkOverflow() {
      if (!navRef.current || !linksRef.current) {
        return;
      }

      const navbarWidth = navRef.current.clientWidth;
      const linksWidth = linksRef.current.scrollWidth;

      const requiredWidth = linksWidth + 420;

      setCollapsed(requiredWidth > navbarWidth);
    }

    const observer = new ResizeObserver(checkOverflow);

    if (navRef.current) {
      observer.observe(navRef.current);
    }

    checkOverflow();

    return () => {
      observer.disconnect();
    };
  }, [visibleItems.length]);

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

  const handleLogout = () => {
    setProfileOpen(false);
    setMenuOpen(false);
    logout();
  };

  return (
    <nav ref={navRef} className={styles.navbar}>
      {/* Brand */}
      <div className={styles.brand}>
        <img src={cupflowLogo} alt="CupFlow ERP" className={styles.logo} />
        {/* <h1>CupFlow ERP</h1> */}
      </div>

      {/* Desktop Navigation */}
      <div
        ref={linksRef}
        className={collapsed ? styles.hiddenLinks : styles.navLinks}
      >
        {visibleItems.map((item) => (
          <Link key={item.path} to={item.path} className={styles.link}>
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </div>

      {/* Right Side */}
      <div className={styles.rightSection}>
        {/* Collapsed Menu */}
        {collapsed && (
          <div className={styles.menuWrapper}>
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => {
                setMenuOpen(!menuOpen);
                setProfileOpen(false);
              }}
            >
              ☰
            </button>

            {menuOpen && (
              <div className={styles.dropdown}>
                {visibleItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={styles.dropdownLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Profile */}
        <div ref={profileRef} className={styles.profileWrapper}>
          <button
            type="button"
            className={styles.profileButton}
            onClick={() => {
              setProfileOpen(!profileOpen);
              setMenuOpen(false);
            }}
          >
            <span className={styles.profileIcon}>👤</span>

            <span className={styles.welcomeText}>Welcome, {user.fullName}</span>

            <span className={styles.profileArrow}>▾</span>
          </button>

          {profileOpen && (
            <div className={styles.profileDropdown}>
              <div className={styles.profileInfo}>
                <div className={styles.profileAvatar}>
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>

                <div className={styles.profileName}>{user.fullName}</div>
              </div>

              <div className={styles.profileDivider} />

              <button
                type="button"
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                <span>↪</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
