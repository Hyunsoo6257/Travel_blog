import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import UserManagement from "./pages/UserManagement.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Profile from "./pages/Profile.jsx";
import CreateArticle from "./pages/CreateArticle.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";
import MyArticles from "./pages/MyArticles.jsx";
import SavedArticles from "./pages/SavedArticles.jsx";
import CategoryPage from "./pages/CategoryPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-article" element={<CreateArticle />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-articles" element={<MyArticles />} />
          <Route path="/saved-articles" element={<SavedArticles />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
