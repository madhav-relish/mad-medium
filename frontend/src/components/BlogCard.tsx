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

  return (
    <div className="p-10 max-w-72 rounded-lg bg-white dark:text-white dark:bg-blue-900 shadow flex flex-col gap-3">
      <div className="text-sm">{date ? date : "Date: 12th jan 2024"}</div>
      <div className="text-lg font-semibold">
        {title ? title : "Your title goes here"}
      </div>
      <div className=" font-medium">
        {content ? (
          <div
            dangerouslySetInnerHTML={{
              __html: content.substring(0, 30) + "...",
            }}
          />
        ) : (
          "The position property specifies the type of positioning method used for an element (static , relative , abasolute, fixed or sticky)"
        )}
      </div>
      <div className="flex justify-end">
        <button onClick={handleReadMore} className="rounded border p-2">Read More</button>
      </div>
    </div>
  );
};

export default BlogCard;
