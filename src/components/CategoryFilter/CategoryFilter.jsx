import { useState } from "react";
import "./categoryFilter.css";

function CategoryFilter({ categories, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (cat) => {
    onSelect(cat);
    setIsOpen(false);
  };

  return (
    <section className="category-filter">
      <div className="dropdown">
        <button className="filter-button" onClick={() => setIsOpen(!isOpen)}>
          Veuillez sélectionner une catégorie ▾
        </button>

        {isOpen && (
          <ul className="dropdown-menu">
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
