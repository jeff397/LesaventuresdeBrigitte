import "./hero.css";

function Hero({ title, subtitle, imageUrl, blogs }) {
  return (
    <section className="hero" style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className="overlay"></div>

      <div className="hero-content">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}

        {/* Carte des anciens blogs */}
        {blogs && blogs.length > 0 && (
          <div className="hero-card">
            <h3>Mes anciens blogs</h3>
            <ul>
              {blogs.map((blog) => (
                <li key={blog.url}>
                  <a href={blog.url} target="_blank" rel="noopener noreferrer">
                    {blog.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export default Hero;
