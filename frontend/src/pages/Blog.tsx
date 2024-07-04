import axios from "axios";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { useEffect, useState } from "react";

interface BlogData {
  content: string;
  title: string;
}
const Blog = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogData | null>(null);

  const fetchBlog = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios(BACKEND_URL + `/api/v1/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setBlog(response.data);
    } catch (error) {
      console.log("Error occured while fetching the blog::", error);
    }
  };

  const ele = document?.getElementById("content-block") || null;
  if (ele) {
    ele.innerHTML = blog?.content || "";
  }

  useEffect(() => {
    fetchBlog();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Title */}
      <h1 className="text-3xl font-semibold">{blog?.title}</h1>
      {/* Content */}
      <div id="content-block"></div>
    </div>
  );
};

export default Blog;
