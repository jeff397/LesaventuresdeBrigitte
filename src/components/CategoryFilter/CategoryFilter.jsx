import { useState, useEffect } from "react";
import API from "../../api";
import "./categoryFilter.css";

function CategoryFilter({ selectedCategory, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setIsOpen(false);
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("API_URL:", import.meta.env.VITE_API_URL);
        const res = await API.get("/categories");
        console.log("Categories fetched:", res.data);
        setCategories(res.data);
      } catch (err) {
        console.error("Erreur fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSelect = (cat) => {
    onSelect(cat);
    setIsOpen(false);
  };

  return (
    <section className="category-filter">
      <div className="dropdown">
        <button
          className={`filter-button ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedCategory ? selectedCategory.title : "Toutes les catégories"}{" "}
          ▾
        </button>

        {isOpen && (
          <ul className="dropdown-menu">
            <li onClick={() => handleSelect(null)}>Toutes les catégories</li>
            {categories.map((cat) => (
              <li key={cat._id} onClick={() => handleSelect(cat)}>
                {cat.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default CategoryFilter;
