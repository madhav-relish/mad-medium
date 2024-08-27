import { useState } from "react";
import { CustomTextEditor } from "../components/RichTextEditor";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mantine/core";

export const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    published: false,
  });

  const navigate = useNavigate();

  const handleSubmit = async (is_save: boolean) => {
    try {
      if (formData.title === "" || formData.content === "") {
        return enqueueSnackbar("Title and/or description can't be empty", {
          variant: "error",
        });
      }
      const token = localStorage.getItem("accessToken");
      formData.published = is_save ? false : true;
      const response = await axios.post(
        BACKEND_URL + `/api/v1/blog`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      enqueueSnackbar("Blog published successfully", { variant: "success" });
      navigate(`/blog/${response.data.id}`);
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
    <div className="p-6 flex flex-col  items-center justify-center">
      <div className="flex flex-col  items-center justify-center">
        <input
          className="w-full max-w-[700px] p-2 border rounded-md dark:!border-black"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <div className="max-w-[700px]  mt-4 overflow-y-auto">
          <CustomTextEditor 
            content={formData.content}
            setContent={setFormData}
          />
        </div>
        <div className="flex gap-2 justify-end w-full">
          <button
            className="border rounded-lg p-2 mt-4 hover:bg-white hover:text-black self-end"
            onClick={() => handleSubmit(false)}
          >
            Publish
          </button>
          <Tooltip
            label={
              "Saving you blog to draft will not publish it to other users.e"
            }
          >
            <button
              className="border rounded-lg p-2 mt-4 hover:bg-white hover:text-black self-end"
              onClick={() => handleSubmit(true)}
            >
              Save To Draft
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
