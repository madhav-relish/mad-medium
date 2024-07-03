

const BlogCard = () => {
  return (
    <div className="p-10 max-w-72 rounded-lg bg-white dark:text-white dark:bg-blue-900 shadow flex flex-col gap-3">
        <div className="text-sm">
            Date: 12th jan 2024
        </div>
        <div className="text-lg font-semibold">
            Heading
        </div>
        <div className=" font-medium">
            The position property specifies the type of positioning method used for an element (static , relative , abasolute, fixed or sticky)
        </div>
        <div className="flex justify-end">

    <button className="rounded border p-2">
        Read More 
    </button>
        </div>
    </div>
  )
}

export default BlogCard