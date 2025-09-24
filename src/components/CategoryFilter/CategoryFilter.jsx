import { useState, useEffect } from "react";
import "./categoryFilter.css";

function CategoryFilter({ categories, selectedCategory, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  console.log("API_URL:", import.meta.env.VITE_API_URL);

  useEffect(() => {
    setIsOpen(false);
  }, [selectedCategory]);

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
