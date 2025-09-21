import "./footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <h3>Planète Brigitte</h3>
        <p>
          Bienvenue sur mon blog personnel dédié à la découverte, aux souvenirs
          et au partage.
        </p>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Planète Brigitte. Tous droits
        réservés.
      </div>
    </footer>
  );
}

export default Footer;
