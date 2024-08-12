import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Blog from "./pages/Blog";
import Blogs from "./pages/Blogs";
import { CreateBlog } from "./pages/CreateBlog";
import { MantineProvider } from "@mantine/core";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import { Header } from "./components/Header/Header";

function App() {
  const theme = useContext(ThemeContext);

  return (
    <div className="">
      <MantineProvider forceColorScheme={theme === "light" ? "light" : "dark"}>
        <Header />
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/create-blog" element={<CreateBlog />} />
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </div>
  );
}

export default App;
