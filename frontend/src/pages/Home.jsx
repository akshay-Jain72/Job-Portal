
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = () => {
    navigate(
      `/jobs?search=${encodeURIComponent(search.trim())}&location=${encodeURIComponent(location.trim())}`
    );
    setMenuOpen(false);
  };

  const searchCategory = (category) => {
    navigate(`/jobs?search=${encodeURIComponent(category)}&location=`);
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const popularSearches = [
    "React Developer",
    "Frontend",
    "Java",
    "Remote",
  ];

  const categories = [
    {
      icon: "fa-code",
      name: "Technology",
      description: "Software, IT & Development",
      color: "blue",
      search: "Technology",
    },
    {
      icon: "fa-pen-ruler",
      name: "Design",
      description: "UI, UX & Graphic Design",
      color: "purple",
      search: "Design",
    },
    {
      icon: "fa-bullhorn",
      name: "Marketing",
      description: "Digital & Brand Marketing",
      color: "orange",
      search: "Marketing",
    },
    {
      icon: "fa-chart-line",
      name: "Finance",
      description: "Banking & Accounting",
      color: "green",
      search: "Finance",
    },
    {
      icon: "fa-headset",
      name: "Customer Support",
      description: "Support & Customer Success",
      color: "pink",
      search: "Customer Support",
    },
    {
      icon: "fa-database",
      name: "Data & Analytics",
      description: "Data Science & Analytics",
      color: "cyan",
      search: "Data",
    },
    {
      icon: "fa-building",
      name: "Management",
      description: "Business & Operations",
      color: "yellow",
      search: "Management",
    },
    {
      icon: "fa-mobile-screen",
      name: "Product",
      description: "Product & Mobile Development",
      color: "red",
      search: "Product",
    },
  ];

  const benefits = [
    {
      icon: "fa-magnifying-glass",
      title: "Discover opportunities",
      description:
        "Explore opportunities that match your skills, interests and career goals.",
    },
    {
      icon: "fa-user-check",
      title: "Apply with confidence",
      description:
        "Create your profile and connect with companies looking for your talent.",
    },
    {
      icon: "fa-rocket",
      title: "Grow your career",
      description:
        "Take the next step towards your dream career and new possibilities.",
    },
  ];

  return (
    <div className="home-page">

      {/* NAVBAR */}
      <nav className={`home-navbar ${menuOpen ? "menu-active" : ""}`}>

        {/* LOGO */}
        <Link to="/" className="home-logo" onClick={closeMenu}>
          <span className="logo-icon">
            <i className="fa-solid fa-briefcase"></i>
          </span>

          <span>
            Job<span className="home-logo-accent">Portal</span>
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="home-nav-links">
          <a href="#jobs" onClick={closeMenu}>Find Jobs</a>
          <a href="#categories" onClick={closeMenu}>Categories</a>
          <a href="#how-it-works" onClick={closeMenu}>How it works</a>
          <a href="#about" onClick={closeMenu}>About</a>
        </div>

        {/* DESKTOP BUTTONS */}
        <div className="home-nav-buttons">
          <Link to="/login" className="nav-login" onClick={closeMenu}>
            Login
          </Link>

          <Link to="/register" className="nav-register" onClick={closeMenu}>
            Get Started <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          type="button"
          className="home-hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>

        {/* MOBILE MENU */}
        <div className={`home-mobile-menu ${menuOpen ? "open" : ""}`}>
          <a href="#jobs" onClick={closeMenu}>
            <i className="fa-solid fa-magnifying-glass"></i>
            Find Jobs
          </a>

          <a href="#categories" onClick={closeMenu}>
            <i className="fa-solid fa-layer-group"></i>
            Categories
          </a>

          <a href="#how-it-works" onClick={closeMenu}>
            <i className="fa-solid fa-circle-info"></i>
            How it works
          </a>

          <a href="#about" onClick={closeMenu}>
            <i className="fa-solid fa-building"></i>
            About
          </a>

          <Link to="/login" onClick={closeMenu}>
            <i className="fa-solid fa-right-to-bracket"></i>
            Login
          </Link>

          <Link
            to="/register"
            className="home-mobile-register"
            onClick={closeMenu}
          >
            Get Started
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-background"></div>

        <div className="home-hero-content">

          <div className="home-hero-tag">
            <span className="home-tag-dot"></span>
            Your career journey starts here
          </div>

          <h1>
            Find your dream job.
            <br />
            <span>Build your future.</span>
          </h1>

          <p className="home-hero-description">
            Discover exciting opportunities, connect with top companies
            and take your career to the next level.
          </p>

          {/* SEARCH BOX */}
          <div className="home-search-box">

            <div className="home-search-field">
              <div className="home-search-icon">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>

              <div className="home-search-input-wrapper">
                <label>What are you looking for?</label>

                <input
                  type="text"
                  placeholder="Job title, skill or company"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
              </div>
            </div>

            <div className="home-search-divider"></div>

            <div className="home-search-field">
              <div className="home-search-icon">
                <i className="fa-solid fa-location-dot"></i>
              </div>

              <div className="home-search-input-wrapper">
                <label>Location</label>

                <input
                  type="text"
                  placeholder="City or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              className="home-search-button"
              onClick={handleSearch}
            >
              Search Jobs
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          {/* POPULAR SEARCHES */}
          <div className="home-popular-searches">
            <span className="popular-label">Popular:</span>

            {popularSearches.map((item) => (
              <button
                type="button"
                key={item}
                className="home-popular-tag"
                onClick={() => searchCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {/* TRUST */}
          <div className="home-hero-trust">
            <div className="home-trust-icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>

            <span>
              Explore opportunities and find the right fit for you
            </span>
          </div>
        </div>

        {/* HERO VISUAL */}
        <div className="home-hero-visual">

          <div className="home-hero-orb home-orb-one"></div>
          <div className="home-hero-orb home-orb-two"></div>

          <div className="home-visual-card">

            <div className="home-visual-card-header">
              <div>
                <span className="home-visual-small-label">
                  CAREER OPPORTUNITIES
                </span>
                <h3>Explore your future</h3>
              </div>

              <div className="home-visual-header-icon">
                <i className="fa-solid fa-briefcase"></i>
              </div>
            </div>

            <div className="home-visual-highlight">
              <div className="home-highlight-icon">
                <i className="fa-solid fa-rocket"></i>
              </div>

              <div>
                <strong>Your next opportunity</strong>
                <span>Could be just one click away</span>
              </div>
            </div>

            <div className="home-visual-job-list">

              <div className="home-visual-job">
                <div className="home-job-company-icon home-job-react">
                  <i className="fa-brands fa-react"></i>
                </div>

                <div className="home-job-info">
                  <strong>React Developer</strong>
                  <small>Frontend Development</small>
                </div>

                <i className="fa-solid fa-arrow-up-right-from-square home-job-arrow"></i>
              </div>

              <div className="home-visual-job">
                <div className="home-job-company-icon home-job-code">
                  <i className="fa-solid fa-code"></i>
                </div>

                <div className="home-job-info">
                  <strong>Software Engineer</strong>
                  <small>Software & Engineering</small>
                </div>

                <i className="fa-solid fa-arrow-up-right-from-square home-job-arrow"></i>
              </div>

              <div className="home-visual-job">
                <div className="home-job-company-icon home-job-design">
                  <i className="fa-solid fa-pen-ruler"></i>
                </div>

                <div className="home-job-info">
                  <strong>UI/UX Designer</strong>
                  <small>Creative & Design</small>
                </div>

                <i className="fa-solid fa-arrow-up-right-from-square home-job-arrow"></i>
              </div>
            </div>

            <div className="home-visual-footer">
              <i className="fa-solid fa-shield-halved"></i>
              <span>Discover. Apply. Grow.</span>
            </div>
          </div>

          {/* FLOATING BADGE */}
          <div className="home-floating-badge">
            <div className="home-floating-badge-icon">
              <i className="fa-solid fa-check"></i>
            </div>

            <div>
              <strong>Career growth</strong>
              <span>Starts with you</span>
            </div>
          </div>

          <div className="home-floating-mini">
            <i className="fa-solid fa-star"></i>
            <span>Find your potential</span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="home-stats">
        <div className="home-stat-item">
          <div className="home-stat-icon">
            <i className="fa-solid fa-briefcase"></i>
          </div>
          <div>
            <h3>Career opportunities</h3>
            <p>Explore a variety of roles</p>
          </div>
        </div>

        <div className="home-stat-item">
          <div className="home-stat-icon">
            <i className="fa-solid fa-building"></i>
          </div>
          <div>
            <h3>Multiple companies</h3>
            <p>Discover new employers</p>
          </div>
        </div>

        <div className="home-stat-item">
          <div className="home-stat-icon">
            <i className="fa-solid fa-user-tie"></i>
          </div>
          <div>
            <h3>Career development</h3>
            <p>Take your next step</p>
          </div>
        </div>

        <div className="home-stat-item">
          <div className="home-stat-icon">
            <i className="fa-solid fa-bolt"></i>
          </div>
          <div>
            <h3>Easy job search</h3>
            <p>Find jobs in less time</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="home-categories" id="categories">
        <div className="home-section-heading">
          <div>
            <span className="home-section-label">EXPLORE CAREERS</span>
            <h2>Explore popular categories</h2>
            <p>
              Find opportunities across different industries
              and discover where your skills fit best.
            </p>
          </div>

          <Link to="/jobs" className="home-section-link">
            Explore all jobs
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        <div className="home-category-grid">
          {categories.map((category) => (
            <button
              type="button"
              className="home-category-card"
              key={category.name}
              onClick={() => searchCategory(category.search)}
            >
              <div className={`category-icon category-${category.color}`}>
                <i className={`fa-solid ${category.icon}`}></i>
              </div>

              <h3>{category.name}</h3>
              <p>{category.description}</p>

              <div className="home-category-arrow">
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="home-featured" id="jobs">

        <div className="home-featured-banner">
          <div className="home-featured-banner-content">
            <span className="home-section-label">
              YOUR NEXT CAREER MOVE
            </span>

            <h2>
              Opportunities are waiting
              <span> for you.</span>
            </h2>

            <p>
              Browse the latest job listings, find a role that matches
              your skills and make your next career move.
            </p>

            <Link to="/jobs" className="home-featured-banner-btn">
              Browse Jobs
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          <div className="home-featured-banner-visual">
            <div className="home-featured-illustration">
              <i className="fa-solid fa-laptop"></i>

              <div className="home-illustration-check">
                <i className="fa-solid fa-check"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="home-section-heading home-featured-heading">
          <div>
            <span className="home-section-label">JOB DISCOVERY</span>
            <h2>Find your perfect match</h2>
            <p>
              Start exploring jobs and discover new career opportunities.
            </p>
          </div>

          <Link to="/jobs" className="home-section-link">
            View all jobs
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        <div className="home-featured-placeholder">
          <div className="featured-placeholder-icon">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>

          <span className="home-placeholder-label">
            START YOUR SEARCH
          </span>

          <h3>Find a role that fits your ambition</h3>

          <p>
            Search available jobs by skills, job title or location
            and discover opportunities that could shape your future.
          </p>

          <Link to="/jobs" className="featured-browse-btn">
            Explore Available Jobs
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="home-how-it-works" id="how-it-works">
        <div className="home-section-heading home-how-heading">
          <div>
            <span className="home-section-label">SIMPLE PROCESS</span>
            <h2>How JobPortal works</h2>
            <p>
              Your journey to a new career starts with three simple steps.
            </p>
          </div>
        </div>

        <div className="home-steps-grid">
          {benefits.map((benefit, index) => (
            <div className="home-step-card" key={benefit.title}>
              <div className="home-step-number">
                0{index + 1}
              </div>

              <div className="home-step-icon">
                <i className={`fa-solid ${benefit.icon}`}></i>
              </div>

              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RECRUITER CTA */}
      <section className="home-recruiter-section">
        <div className="home-recruiter-card">
          <div className="home-recruiter-content">
            <span className="home-recruiter-label">
              FOR EMPLOYERS
            </span>

            <h2>
              Find the right talent.
              <br />
              <span>Build your dream team.</span>
            </h2>

            <p>
              Connect with talented professionals, post job openings
              and discover people who can help your business grow.
            </p>

            <Link to="/register" className="home-recruiter-btn">
              Start Hiring
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          <div className="home-recruiter-visual">
            <div className="home-recruiter-icon">
              <i className="fa-solid fa-users"></i>
            </div>

            <div className="home-recruiter-decoration home-recruiter-decoration-one">
              <i className="fa-solid fa-user"></i>
            </div>

            <div className="home-recruiter-decoration home-recruiter-decoration-two">
              <i className="fa-solid fa-user-tie"></i>
            </div>

            <div className="home-recruiter-decoration home-recruiter-decoration-three">
              <i className="fa-solid fa-user-check"></i>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="home-final-cta">
        <div className="home-final-cta-icon">
          <i className="fa-solid fa-rocket"></i>
        </div>

        <h2>Ready for your next big opportunity?</h2>

        <p>
          Create your account, explore opportunities and take
          the first step towards your dream career.
        </p>

        <div className="home-final-cta-buttons">
          <Link to="/register" className="home-final-primary">
            Create Account
            <i className="fa-solid fa-arrow-right"></i>
          </Link>

          <Link to="/jobs" className="home-final-secondary">
            Browse Jobs
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer" id="about">
        <div className="home-footer-main">

          <div className="home-footer-brand">
            <Link to="/" className="home-logo">
              <span className="logo-icon">
                <i className="fa-solid fa-briefcase"></i>
              </span>

              <span>
                Job<span className="home-logo-accent">Portal</span>
              </span>
            </Link>

            <p>
              Connecting talent with opportunity.
              Find your next career move with JobPortal.
            </p>
          </div>

          <div className="home-footer-column">
            <h4>For Candidates</h4>
            <Link to="/jobs">Browse Jobs</Link>
            <Link to="/register">Create Account</Link>
            <Link to="/login">Candidate Login</Link>
          </div>

          <div className="home-footer-column">
            <h4>For Employers</h4>
            <Link to="/register">Post a Job</Link>
            <Link to="/register">Create Account</Link>
            <Link to="/login">Recruiter Login</Link>
          </div>

          <div className="home-footer-column">
            <h4>Explore</h4>
            <a href="#categories">Categories</a>
            <a href="#how-it-works">How it works</a>
            <a href="#jobs">Opportunities</a>
          </div>
        </div>

        <div className="home-footer-bottom">
          <span>
            © 2026 JobPortal. All rights reserved.
          </span>

          <span className="home-footer-bottom-note">
            Built for your career journey.
          </span>
        </div>
      </footer>

    </div>
  );
}

export default Home;
