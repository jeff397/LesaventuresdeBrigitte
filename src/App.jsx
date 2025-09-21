import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import Header from "./components/Header/Header";
import DashboardPage from "./pages/DashboardPage";
import NewArticle from "./pages/Dashboard/NewArticle";
import EditArticle from "./pages/Dashboard/EditArticle";
import BlogArticles from "./components/BlogArticles/BlogArticles";
import ArticleDetail from "./components/ArticleDetail/ArticleDetail";
import DashboardComments from "./pages/DashboardComments";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/new" element={<NewArticle />} />
        <Route path="/dashboard/edit/:id" element={<EditArticle />} />
        <Route
          path="/admin/comments"
          element={
            <AdminRoute>
              <DashboardComments />
            </AdminRoute>
          }
        />
        <Route path="/blog/:blogName" element={<BlogArticles />} />
        <Route path="/article/:slug" element={<ArticleDetail />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
