
import { Sidebar } from "../components/BlogManagement/Sidebar";

const ManageBlogs = () => {
  // State for storing blogs and loading/error status
 

  return (
    <div>
      <Sidebar />
      <div>
        {/* Render your blogs here */}
        {/* {blogs.length > 0 ? (
          <ul>
            {blogs.map((blog) => (
              <li key={blog.id}>{blog.title}</li>
            ))}
          </ul>
        ) : (
          <p>No blogs available</p>
        )} */}
      </div>
    </div>
  );
};

export default ManageBlogs;
