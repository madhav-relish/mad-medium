import { useNavigate } from "react-router-dom";

interface BlogCardProps {
  date: string;
  title: string;
  content: string;
  blogId: string
}
const BlogCard = ({ date, title, content, blogId }: BlogCardProps) => {

    const navigate = useNavigate()
    
    const handleReadMore = ()=>{
        navigate(`/blog/${blogId}`)
    }

    // TODO: Change the static color to tailwind class
  return (
    <div className="p-10 w-96 h-60 rounded-lg bg-white text-black dark:text-[#172683] dark:bg-white-900 shadow flex flex-col gap-3">
      <div className="text-sm text-gray-500 font-semibold">{date ? date : "Date: 12th jan 2024"}</div>
      <div className="text-xl font-bold">
        {title ? title : "Your title goes here"}
      </div>
      <div className=" font-medium">
        {content ? (
          <div
            dangerouslySetInnerHTML={{
              __html: content.substring(0, 56) + "...",
            }}
          />
        ) : (
          "The position property specifies the type of positioning method used for an element (static , relative , abasolute, fixed or sticky)"
        )}
      </div>
      <div className="flex justify-start">
        <button onClick={handleReadMore} className="text-medium text-[#54B8E9] font-semibold">Read More {">"}</button>
      </div>
    </div>
  );
};

export default BlogCard;
