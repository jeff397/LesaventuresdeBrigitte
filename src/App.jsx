import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header/Header";
import DashboardPage from "./pages/DashboardPage";
import NewArticle from "./pages/Dashboard/NewArticle";
import EditArticle from "./pages/Dashboard/EditArticle";
import BlogArticles from "./components/BlogArticles/BlogArticles";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/new" element={<NewArticle />} />
        <Route path="/dashboard/edit/:id" element={<EditArticle />} />
        <Route path="/blog/:blogName" element={<BlogArticles />} />
      </Routes>
    </Router>
  );
}

export default App;
