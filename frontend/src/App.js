import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetch("/api/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend unavailable");
        }
        return response.json();
      })
      .then((data) => {
        setBackendStatus(data.status === "UP" ? "UP" : "DOWN");
      })
      .catch(() => {
        setBackendStatus("DOWN");
      });
  }, []);

  const products = [
    {
      name: "Mountain Pro",
      category: "Mountain Bike",
      price: "₹45,999",
      emoji: "🚵",
      color: "#e8f5e9"
    },
    {
      name: "E-Bike X1",
      category: "Electric Bike",
      price: "₹79,999",
      emoji: "⚡",
      color: "#fff8e1"
    },
    {
      name: "City Cruiser",
      category: "City Bike",
      price: "₹29,999",
      emoji: "🚲",
      color: "#e3f2fd"
    },
    {
      name: "Trail Master",
      category: "Adventure Bike",
      price: "₹59,999",
      emoji: "🏔️",
      color: "#f3e5f5"
    }
  ];

  const addToCart = () => {
    setCartCount(cartCount + 1);
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">
          🚴 <span>ShopSphere</span>
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#bikes">Bikes</a>
          <a href="#categories">Categories</a>
          <a href="#about">About</a>
        </nav>

        <button className="cart-button">
          🛒 Cart ({cartCount})
        </button>
      </header>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="hero-label">PREMIUM BIKES • BUILT FOR ADVENTURE</p>

          <h1>
            Ride Further.
            <br />
            <span>Ride Smarter.</span>
          </h1>

          <p className="hero-text">
            Discover premium bikes designed for city rides,
            mountain adventures and everything in between.
          </p>

          <div className="hero-buttons">
            <a href="#bikes" className="primary-button">
              Shop Bikes →
            </a>

            <a href="#categories" className="secondary-button">
              Explore Categories
            </a>
          </div>
        </div>

        <div className="hero-bike">
          <div className="bike-circle">
            🚴
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories" id="categories">
        <div className="section-heading">
          <p>EXPLORE OUR COLLECTION</p>
          <h2>Find Your Perfect Ride</h2>
        </div>

        <div className="category-grid">
          <div className="category-card">
            <div className="category-icon">🚵</div>
            <h3>Mountain Bikes</h3>
            <p>Built for trails and tough terrain.</p>
          </div>

          <div className="category-card">
            <div className="category-icon">⚡</div>
            <h3>E-Bikes</h3>
            <p>Power your ride with electric performance.</p>
          </div>

          <div className="category-card">
            <div className="category-icon">🚲</div>
            <h3>City Bikes</h3>
            <p>Perfect for everyday urban journeys.</p>
          </div>

          <div className="category-card">
            <div className="category-icon">🪖</div>
            <h3>Accessories</h3>
            <p>Gear up for every adventure.</p>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="products" id="bikes">
        <div className="section-heading">
          <p>SHOPSPHERE COLLECTION</p>
          <h2>Featured Bikes</h2>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.name}>

              <div
                className="product-image"
                style={{ backgroundColor: product.color }}
              >
                <span>{product.emoji}</span>
              </div>

              <div className="product-info">
                <p className="product-category">
                  {product.category}
                </p>

                <h3>{product.name}</h3>

                <div className="rating">
                  ⭐⭐⭐⭐⭐
                </div>

                <div className="product-bottom">
                  <strong>{product.price}</strong>

                  <button onClick={addToCart}>
                    Add to Cart
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* OFFER */}
      <section className="offer">
        <div>
          <p className="offer-label">LIMITED TIME OFFER</p>

          <h2>
            Gear Up & Save
          </h2>

          <p>
            Get up to 20% off selected bikes and accessories.
          </p>
        </div>

        <button>
          Shop Offers →
        </button>
      </section>

      {/* WHY SHOPSPHERE */}
      <section className="why" id="about">
        <div className="section-heading">
          <p>WHY SHOPSPHERE</p>
          <h2>Everything You Need For The Ride</h2>
        </div>

        <div className="why-grid">

          <div>
            <div className="why-icon">✓</div>
            <h3>Premium Quality</h3>
            <p>
              Carefully selected bikes built for performance
              and reliability.
            </p>
          </div>

          <div>
            <div className="why-icon">🚚</div>
            <h3>Fast Delivery</h3>
            <p>
              Get your new bike delivered safely and quickly.
            </p>
          </div>

          <div>
            <div className="why-icon">🔒</div>
            <h3>Secure Shopping</h3>
            <p>
              Your shopping experience is designed with
              security in mind.
            </p>
          </div>

          <div>
            <div className="why-icon">💬</div>
            <h3>Expert Support</h3>
            <p>
              Our team is ready to help you choose your
              perfect ride.
            </p>
          </div>

        </div>
      </section>

      {/* DEVOPS STATUS */}
      <section className="devops">
        <div className="section-heading">
          <p>PLATFORM STATUS</p>
          <h2>Powered By Cloud-Native Technology</h2>
        </div>

        <div className="status-grid">

          <div className="status-card">
            <div className="status-dot"></div>
            <h3>Frontend</h3>
            <strong>ONLINE</strong>
            <p>React + Nginx</p>
          </div>

          <div className="status-card">
            <div
              className={`status-dot ${
                backendStatus === "UP" ? "" : "down"
              }`}
            ></div>

            <h3>Backend</h3>

            <strong>
              {backendStatus}
            </strong>

            <p>Node.js + Express</p>
          </div>

          <div className="status-card">
            <div className="status-dot"></div>
            <h3>Deployment</h3>
            <strong>AUTOMATED</strong>
            <p>GitHub Actions</p>
          </div>

          <div className="status-card">
            <div className="status-dot"></div>
            <h3>Platform</h3>
            <strong>RUNNING</strong>
            <p>AWS EKS + Argo CD</p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          🚴 ShopSphere Bikes
        </div>

        <p>
          Ride Further. Ride Smarter.
        </p>

        <p className="copyright">
          © 2026 ShopSphere. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

export default App;
