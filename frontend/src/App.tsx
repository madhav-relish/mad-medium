import { useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import { ThemeContext } from './context/ThemeContext';
import { SnackbarProvider } from 'notistack';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Blog from './pages/Blog';
import Blogs from './pages/Blogs';
import { CreateBlog } from './pages/CreateBlog';
import { Header } from './components/Header/Header';
import Home from './pages/Home';
import ManageBlogs from './pages/ManageBlogs';

function App() {
  const { theme } = useContext(ThemeContext);

  const myTheme = createTheme({
    black: "#000",
    focusRing: "always",
   
    colors: {
      dark: [
        '#C9C9C9', '#b8b8b8', '#828282', '#696969', '#424242', '#3b3b3b', '#2e2e2e',
        '#020817', '#1f1f1f', '#141414'
      ],
    },
  });

  return (
    <MantineProvider theme={myTheme}  forceColorScheme={theme}>
      <SnackbarProvider>
        <BrowserRouter>
          <Header />
          <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/manage-blogs" element={<ManageBlogs />} />
            <Route path="/create-blog" element={<CreateBlog />} />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </MantineProvider>
  );
}

export default App;
