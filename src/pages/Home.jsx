import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getArticles } from "../services/articles";
import { getCategories } from "../services/categories";
import Hero from "../components/Hero/Hero";
import CategoryFilter from "../components/CategoryFilter/CategoryFilter";
import LatestArticles from "../components/LatestArticles/LatestArticles";

function Home() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.resetCategory) {
      setSelectedCategory(null);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articlesData = await getArticles();
        setArticles(articlesData);

        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Erreur chargement articles ou catégories", err);
      }
    };
    fetchData();
  }, []);

  const getArticleCategoryId = (a) => {
    if (!a || a.category == null) return null;

    if (typeof a.category === "object") {
      return String(a.category._id ?? a.category.id ?? "");
    }

    return String(a.category);
  };

  const selectedCatId = selectedCategory
    ? String(selectedCategory._id ?? selectedCategory.id ?? "")
    : null;

  const filteredArticles = articles
    .filter((a) => {
      if (!selectedCatId) return true;
      return getArticleCategoryId(a) === selectedCatId;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div>
      <Hero
        title="Planète Brigitte"
        subtitle="Retrouvez mes articles et mes anciens blogs"
        imageUrl="assets/images/hero.webp"
        blogs={[
          { name: "Villers-sur-Authie", url: "https://blog1.overblog.com" },
          {
            name: "D'hier et d'aujourd'hui",
            url: "https://blog2.overblog.com",
          },
          { name: "Somme-photos", url: "https://blog3.overblog.com" },
        ]}
      />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={(cat) => setSelectedCategory(cat)}
      />

      <LatestArticles articles={filteredArticles} />
    </div>
  );
}

export default Home;
