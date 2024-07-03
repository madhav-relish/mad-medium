import {  useState } from "react";
import { CustomTextEditor } from "../components/RichTextEditor";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { CreatePost } from "@madhavsingh203/mad-medium-common";

export const CreateBlog = () => {
  console.log("Page loaded");
  const [formData, setFormData] = useState<CreatePost>({
    title: "",
    content: "",
  });

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(BACKEND_URL + `/api/v1/blog`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("An error occured while submitting the blog", error);
    }
  };

//   TODO: Reduce the re-renders of this component when we type something in the inside the text editor
//         We can either create a popup and move the submit button inside CustomTextEditor and on submit
//             we can set the state to the main state and clicking yes on the modal will hit the api
//                                                      OR
//         We can simply move the button to CustomTextEditor and onsubmit pass the values here and update them

  return (
    <div className="p-6 flex flex-col justify-center items-center">
      <input
        className="w-full p-2"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <div className="max-w-[700px] min-h-[300px] mt-4 overflow-y-auto">
        <CustomTextEditor content={formData.content} setContent={setFormData} />
      </div>
      <button className="border rounded-lg p-2" onClick={handleSubmit}>
        Publish
      </button>
      {/* <div
        className="w-full"
        dangerouslySetInnerHTML={{ __html: formData.content }}
      ></div> */}
    </div>
  );
};
