import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

interface BlogCardProps {
  date: string;
  title: string;
  content: string;
  blogId: string;
}
const BlogCard = ({ date, title, content, blogId }: BlogCardProps) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/blog/${blogId}`);
  };

  return (
   
   

      <>
        <div  onClick={handleReadMore} className="rounded-xl border border-gray-400 bg-card text-card-foreground max-w-screen-md w-full cursor-pointer  transition-all hover:border-gray-500 shadow-lg dark:shadow-black/60">
          <div className="flex flex-col space-y-1.5 p-4">
            <div className="flex flex-col justify-center items-center sm:flex-row">
              <img
                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                className="min-h-[130px] sm:h-[130px] min-w-[130px] sm:w-[130px] rounded-xl"
              />
              <div>{date}</div>
              <div className="pt-4 sm:pt-0 sm:pl-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold tracking-tight text-2xl">
                  {title ? title : "Your title goes here"}
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    <div>
                    {content ? (
            <div
              dangerouslySetInnerHTML={{
                __html: content.substring(0, 150) + "...",
              }}
            />
          ) : (
            "The position property specifies the type of positioning method used for an element (static , relative , abasolute, fixed or sticky)"
          )}
                    </div>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
            <div className="flex justify-between">
              {/* <h3 className="flex flex-col justify-center">7 Lessons</h3> */}
              <div className="flex justify-end items-end h-full w-full">
          <Button
            variant="filled"
            onClick={handleReadMore}
            className="text-medium  font-semibold"
          >
            Read More {">"}
          </Button>
        </div>
            </div>
          </div>
        </div>
      </>
  
  );
};

export default BlogCard;
