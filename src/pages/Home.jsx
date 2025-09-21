import React from "react";
import HomeContent from "../components/HomeContent/HomeContent";

const HomePage = () => {
  return (
    <main>
      <HomeContent
        heroTitle="Bienvenue sur mon blog"
        heroSubtitle="Découvrez mes articles récents"
        maxArticles={5}
      />
    </main>
  );
};

export default HomePage;
