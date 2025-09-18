import { useEffect, useState } from "react";
import { getArticles } from "../services/articles";
import { getCategories } from "../services/categories";
import Hero from "../components/Hero/Hero";
import CategoryFilter from "../components/CategoryFilter/CategoryFilter";

function Home() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const articlesData = await getArticles();
      setArticles(articlesData);

      const categoriesData = await getCategories();
      setCategories(categoriesData);
    };
    fetchData();
  }, []);

  const filteredArticles = selectedCategory
    ? articles.filter((a) => a.categoryId === selectedCategory._id)
    : articles;

  return (
    <div>
      <Hero
        title="Bienvenue sur Les aventures de Brigitte"
        subtitle="Découvrez nos articles et nos photos"
        imageUrl="assets/images/hero.webp"
      />

      <CategoryFilter
        categories={categories}
        onSelect={(cat) => setSelectedCategory(cat)}
      />

      <h1>Articles du Blog</h1>

      {filteredArticles.map((article) => (
        <div key={article._id}>
          <h2>{article.title}</h2>
          <p>{article.content.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
}

export default Home;
