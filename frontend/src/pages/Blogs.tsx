import axios from "axios"
import BlogCard from "../components/BlogCard"
import { BACKEND_URL } from "../config"
import { useEffect } from "react"


const Blogs = () => {
  const fetchAllBlogs = async () =>{
    try{
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(BACKEND_URL + `/api/v1/blog/bulk`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response.data)
    }catch(error){
      console.error("Error while fetching all blogs", error)
    }
  }

  useEffect(()=>{
    fetchAllBlogs()
  },[])
  return (
    <div className="p-4">
      <div className="flex gap-4 flex-wrap">
      <BlogCard/>
      <BlogCard/>
      <BlogCard/>
      <BlogCard/>
      <BlogCard/>
      <BlogCard/>
      <BlogCard/>
      <BlogCard/>
      </div>
    </div>
  )
}

export default Blogs