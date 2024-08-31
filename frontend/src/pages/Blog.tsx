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
  id: number;
  published: boolean;
}

type BlogProps = {
  blogId?: string
}



const Blog = (blogId: BlogProps) => {
  const { id } = useParams<{ id: string }>();
  const currentBlogId = blogId.blogId ? blogId.blogId : id
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [editBlog, setEditBlog] = useState<boolean>(false);

  console.log(blogId)

  const fetchBlog = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios(BACKEND_URL + `/api/v1/blog/${currentBlogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setBlog(response.data);
    } catch (error) {
      console.log("Error occurred while fetching the blog:", error);
    }
  };

  useEffect(() => {
    fetchBlog();
    setEditBlog(false)
  }, [currentBlogId]);

  const isUserAuthor = localStorage.getItem("user_id") === blog?.authorId;

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-8">
      {editBlog ? (
        <EditBlog
          title={blog?.title || ""}
          content={blog?.content || ""}
          id={blog?.id || 0}
          published={blog?.published || true}
        />
      ) : (
        <>
          {/* Title */}
          <h1 className="text-3xl font-semibold max-w-[800px] text-center">{blog?.title}</h1>
          {/* Content */}
          <div
            className=" flex justify-center max-w-[1080px] flex-col px-8 md:px-16 content-block"
            dangerouslySetInnerHTML={{ __html: blog?.content || "" }}
          />
        </>
      )}
      {isUserAuthor && !editBlog && (
        <Button variant="default" onClick={() => setEditBlog(!editBlog)}>
          Edit &nbsp; <IconEditCircle size={20} />
        </Button>
      )}
    </div>
  );
};

export default Blog;
