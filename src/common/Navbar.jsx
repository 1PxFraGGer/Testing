
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import "./Navbar.css";
import logo from "../assets/Gedu_Connect_Logo.svg";

/* ==========================================
   RESPONSIVE VIEWPORT DETECTION
========================================== */

const getIsMobile = () => {
  if (typeof window === "undefined") return false;

  const width = window.innerWidth;
  const height = window.innerHeight;

  const desktopPortrait =
    width >= 901 &&
    width <= 1200 &&
    height > width;

  return width <= 1200 && !desktopPortrait;
};

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [resourceOpen, setResourceOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [services, setServices] = useState([]);
  const [isMobile, setIsMobile] = useState(getIsMobile);

  const serviceTimer = useRef(null);
  const resourceTimer = useRef(null);
  const navRef = useRef(null);

  /* ==========================================
     STICKY NAVBAR
  ========================================== */

  useEffect(() => {
    const onScroll = () => {
      setSticky(window.scrollY > 80);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* ==========================================
     RESPONSIVE VIEWPORT
  ========================================== */

  useEffect(() => {
    const onResize = () => {
      const mobile = getIsMobile();

      setIsMobile(mobile);

      if (!mobile) {
        setMenuOpen(false);
      }

      setServiceOpen(false);
      setResourceOpen(false);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* ==========================================
     BODY SCROLL LOCK
  ========================================== */

  useEffect(() => {
    document.body.style.overflow =
      menuOpen && isMobile ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, isMobile]);

  /* ==========================================
     CLICK OUTSIDE
  ========================================== */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setServiceOpen(false);
        setResourceOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* ==========================================
     FETCH SERVICES
  ========================================== */

  useEffect(() => {
    let mounted = true;

    api
      .get("/public/services")
      .then((res) => {
        if (mounted) {
          setServices(
            Array.isArray(res.data) ? res.data : []
          );
        }
      })
      .catch((err) => {
        console.error(
          "Failed to load services:",
          err
        );
      });

    return () => {
      mounted = false;
    };
  }, []);

  /* ==========================================
     CLEANUP TIMERS
  ========================================== */

  useEffect(() => {
    return () => {
      clearTimeout(serviceTimer.current);
      clearTimeout(resourceTimer.current);
    };
  }, []);

  /* ==========================================
     CLOSE ALL
  ========================================== */

  const closeAll = () => {
    clearTimeout(serviceTimer.current);
    clearTimeout(resourceTimer.current);

    setMenuOpen(false);
    setServiceOpen(false);
    setResourceOpen(false);
  };

  /* ==========================================
     SERVICE DROPDOWN
  ========================================== */

  const handleServiceEnter = () => {
    if (isMobile) return;

    clearTimeout(serviceTimer.current);
    clearTimeout(resourceTimer.current);

    setResourceOpen(false);
    setServiceOpen(true);
  };

  const handleServiceLeave = () => {
    if (isMobile) return;

    clearTimeout(serviceTimer.current);

    serviceTimer.current = setTimeout(() => {
      setServiceOpen(false);
    }, 140);
  };

  const handleServiceClick = () => {
    clearTimeout(serviceTimer.current);
    clearTimeout(resourceTimer.current);

    setServiceOpen((prev) => !prev);
    setResourceOpen(false);
  };

  /* ==========================================
     RESOURCE DROPDOWN
  ========================================== */

  const handleResourceEnter = () => {
    if (isMobile) return;

    clearTimeout(resourceTimer.current);
    clearTimeout(serviceTimer.current);

    setServiceOpen(false);
    setResourceOpen(true);
  };

  const handleResourceLeave = () => {
    if (isMobile) return;

    clearTimeout(resourceTimer.current);

    resourceTimer.current = setTimeout(() => {
      setResourceOpen(false);
    }, 140);
  };

  const handleResourceClick = () => {
    clearTimeout(resourceTimer.current);
    clearTimeout(serviceTimer.current);

    setResourceOpen((prev) => !prev);
    setServiceOpen(false);
  };

  /* ==========================================
     MOBILE MENU
  ========================================== */

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setServiceOpen(false);
    setResourceOpen(false);
  };

  /* ==========================================
     RENDER
  ========================================== */

  return (
    <>
      <nav
        ref={navRef}
        className={`nav-bottom${sticky ? " sticky" : ""}`}
        role="navigation"
        aria-label="Main navigation"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            closeAll();
          }
        }}
      >
        {/* LOGO */}

        <div className="logo-wrap">
          <Link
            to="/"
            onClick={closeAll}
            aria-label="Go to homepage"
          >
            <img
              src={logo}
              alt="G Educonnect"
            />
          </Link>
        </div>

        {/* MOBILE HAMBURGER */}

        <button
          id="menuToggle"
          type="button"
          onClick={toggleMenu}
          aria-label={
            menuOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={menuOpen}
          aria-controls="primary-navigation-menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* NAVIGATION MENU */}

        <div
          id="primary-navigation-menu"
          className={`menu${menuOpen ? " open" : ""}`}
        >
          {/* MOBILE DRAWER LOGO */}

          {isMobile && (
            <div className="mobile-menu-header">
              <Link
                to="/"
                onClick={closeAll}
              >
                <img
                  src={logo}
                  alt="G Educonnect"
                />
              </Link>
            </div>
          )}

          <ul role="menubar">

            {/* ABOUT US */}

            <li role="none">
              <Link
                to="/about"
                onClick={closeAll}
                role="menuitem"
                className="nav-roll"
              >
                <div className="nav-roll-inner">
                  <span className="nav-text">
                    About Us
                  </span>

                  <span className="nav-text-hover">
                    About Us
                  </span>
                </div>
              </Link>
            </li>

            {/* SERVICES */}

            <li
              className="has-submenu"
              role="none"
              onMouseEnter={handleServiceEnter}
              onMouseLeave={handleServiceLeave}
            >
              <div
                className="submenu-title"
                role="menuitem"
                tabIndex={0}
                aria-haspopup="true"
                aria-expanded={serviceOpen}
                onClick={handleServiceClick}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    handleServiceClick();
                  }
                }}
              >
                <div className="nav-roll services-roll">
                  <div className="nav-roll-inner">
                    <span className="nav-text">
                      Our Services
                    </span>

                    <span className="nav-text-hover">
                      Our Services
                    </span>
                  </div>
                </div>

                <span
                  className={`toggle-icon${
                    serviceOpen ? " open" : ""
                  }`}
                >
                  +
                </span>
              </div>

              <ul
                className={`submenu${
                  serviceOpen ? " visible" : ""
                }`}
                role="menu"
                onMouseEnter={handleServiceEnter}
                onMouseLeave={handleServiceLeave}
              >
                {services.length === 0 && (
                  <li
                    style={{
                      padding: "14px 16px",
                      color: "#999",
                      fontSize: 13,
                    }}
                  >
                    No services available
                  </li>
                )}

                {services.map((service) => (
                  <li
                    key={service.id}
                    role="none"
                  >
                    <Link
                      to={`/services/${
                        service.page_link ||
                        service.slug ||
                        service.id
                      }`}
                      onClick={closeAll}
                      role="menuitem"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* CONSULTANT NETWORK */}

            <li role="none">
              <Link
                to="/consultantNetwork"
                onClick={closeAll}
                role="menuitem"
                className="nav-roll"
              >
                <div className="nav-roll-inner">
                  <span className="nav-text">
                    Consultant Network
                  </span>

                  <span className="nav-text-hover">
                    Consultant Network
                  </span>
                </div>
              </Link>
            </li>

            {/* RESOURCES */}

            <li
              className="has-submenu"
              role="none"
              onMouseEnter={handleResourceEnter}
              onMouseLeave={handleResourceLeave}
            >
              <div
                className="submenu-title"
                role="menuitem"
                tabIndex={0}
                aria-haspopup="true"
                aria-expanded={resourceOpen}
                onClick={handleResourceClick}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    handleResourceClick();
                  }
                }}
              >
                <div className="nav-roll resources-roll">
                  <div className="nav-roll-inner">
                    <span className="nav-text">
                      Resources
                    </span>

                    <span className="nav-text-hover">
                      Resources
                    </span>
                  </div>
                </div>

                <span
                  className={`toggle-icon${
                    resourceOpen ? " open" : ""
                  }`}
                >
                  +
                </span>
              </div>

              <ul
                className={`submenu${
                  resourceOpen ? " visible" : ""
                }`}
                role="menu"
                onMouseEnter={handleResourceEnter}
                onMouseLeave={handleResourceLeave}
              >
                <li role="none">
                  <Link
                    to="/blog"
                    onClick={closeAll}
                    role="menuitem"
                  >
                    Blog
                  </Link>
                </li>

                <li role="none">
                  <Link
                    to="/gallery"
                    onClick={closeAll}
                    role="menuitem"
                  >
                    Gallery
                  </Link>
                </li>

                <li role="none">
                  <Link
                    to="/clients"
                    onClick={closeAll}
                    role="menuitem"
                  >
                    Clients &amp; Partners
                  </Link>
                </li>

                <li role="none">
                  <Link
                    to="/compare"
                    onClick={closeAll}
                    role="menuitem"
                  >
                    Compare Universities
                  </Link>
                </li>

                <li role="none">
                  <Link
                    to="/top-universities"
                    onClick={closeAll}
                    role="menuitem"
                  >
                    Top Universities
                  </Link>
                </li>

                <li role="none">
                  <Link
                    to="/exams"
                    onClick={closeAll}
                    role="menuitem"
                  >
                    Exams
                  </Link>
                </li>

                <li role="none">
                  <Link
                    to="/testimonial"
                    onClick={closeAll}
                    role="menuitem"
                  >
                    Testimonials
                  </Link>
                </li>

                <li role="none">
                  <Link
                    to="/careerpage"
                    onClick={closeAll}
                    role="menuitem"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </li>

            {/* CONTACT */}

            <li role="none">
              <Link
                to="/contact"
                onClick={closeAll}
                role="menuitem"
                className="nav-roll"
              >
                <div className="nav-roll-inner">
                  <span className="nav-text">
                    Contact Us
                  </span>

                  <span className="nav-text-hover">
                    Contact Us
                  </span>
                </div>
              </Link>
            </li>
          </ul>

          {/* ENQUIRE NOW */}

          <div className="cta">
            <a
              href="https://admissions.geduconnect.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeAll}
            >
              Enquire Now
            </a>
          </div>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}

      {menuOpen && isMobile && (
        <div
          className="menu-overlay"
          onClick={closeAll}
          role="presentation"
          aria-hidden="true"
        />
      )}
    </>
  );
};
