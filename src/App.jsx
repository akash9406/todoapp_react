import Home from "./pages/Home";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import { useContext, useEffect } from "react";
import { Context, server } from "./main";
import axios from "axios";
function App() {
  const { setUser, setIsAuthenticated, setLoading } = useContext(Context);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${server}/users/me`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user);
        setIsAuthenticated(true);
        setLoading(false);
      })
      .catch((error) => {
        setUser({});
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, []);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
