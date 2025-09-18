// src/components/Hero.jsx
import "./hero.css";

function Hero({ title, subtitle, imageUrl }) {
  return (
    <section className="hero" style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className="overlay"></div>
      <div className="hero-content">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}

export default Hero;
