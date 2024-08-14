import axios from "axios";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { useEffect, useState } from "react";
import { Button } from "@mantine/core";
import EditBlog from "../components/EditBlog";
import { IconEditCircle } from "@tabler/icons-react";

interface BlogData {
  content: string;
  title: string;
  authorId: string;
  id: number
}
const Blog = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [editBlog, setEditBlog] = useState<boolean>(false)

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

  const isUserAuthor = localStorage.getItem('user_id') === blog?.authorId

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {editBlog ? (
        <EditBlog title={blog?.title || ""} content={blog?.content || ""} id={blog?.id || 0}/>
      ) : (
        <>
         {/* Title */}
          <h1 className="text-3xl font-semibold">{blog?.title}</h1>
         {/* Content */}
          <div
            id="content-block"
            className="flex justify-center flex-col  px-8 md:px-16"
          ></div>
        </>
      )}
      {isUserAuthor && !editBlog && (
        <Button variant="default" onClick={() => setEditBlog(!editBlog)}>
       Edit &nbsp; <IconEditCircle size={20}/> 
        </Button>
      )}
    </div>
  );
};

export default Blog;
