import axios from "axios";
import BlogCard from "../components/BlogCard";
import { BACKEND_URL } from "../config";
import { useEffect, useState } from "react";
import { Loader } from "@mantine/core";

const Blogs = () => {
  const [allBlogs, setAllBlogs] = useState<[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllBlogs = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(BACKEND_URL + `/api/v1/blog/bulk`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data);
      setAllBlogs(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error while fetching all blogs", error);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);
  return (
    <div className="p-4">
      {loading ? (
        <div className="h-screen w-full flex justify-center items-center">
          {" "}
          <Loader color="blue" />{" "}
        </div>
      ) : (
        <div className="flex gap-4 flex-wrap">
          {allBlogs?.map((blog, idx) => (
            <BlogCard
              key={idx}
              title={blog["title"]}
              content={blog["content"]}
              date=""
              blogId={blog["id"]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;
