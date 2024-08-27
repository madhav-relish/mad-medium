import { useState } from "react";
import { CustomTextEditor } from "../components/RichTextEditor";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { Button } from "@mantine/core";
import {
  IconCircleCheck,
  IconCircleMinus,
  IconTrash,
} from "@tabler/icons-react";

interface EditBlogProps {
  title: string;
  content: string;
  id: number;
  published: boolean
}

const EditBlog = ({ title, content, id,published }: EditBlogProps) => {
  const [formData, setFormData] = useState({
    title: title,
    content: content,
    id: id,
    published: published
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const handleSubmit = async (unpublish?:  boolean) => {
    try {
      formData.published = unpublish ? false : true
      await axios.put(BACKEND_URL + `/api/v1/blog`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      enqueueSnackbar("Blog published successfully", { variant: "success" });
      navigate(0);
    } catch (error) {
      console.error("An error occured while submitting the blog", error);
    }
  };

  const handleDelete = async ( ) => {
    try {
      const response = await axios.delete(
        BACKEND_URL + `/api/v1/blog?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      enqueueSnackbar(response.data.msg, { variant: "success" });
      navigate("/blogs");
    } catch (error) {
      console.error("An error occured while submitting the blog", error);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  //   TODO: Reduce the re-renders of this component when we type something in the inside the text editor
  //         We can either create a popup and move the submit button inside CustomTextEditor and on submit
  //             we can set the state to the main state and clicking yes on the modal will hit the api
  //                                                      OR
  //         We can simply move the button to CustomTextEditor and onsubmit pass the values here and update them

  //   TODO: Add Loaders for buttons
  // TODO: Add a back/cancel button on the left

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
      <div className="flex gap-4 mt-4 justify-end items-end w-full">
        <Button
          variant="light"
          color="green"
          className="border rounded-lg p-2"
          onClick={()=>handleSubmit(false)}
        >
          Update &nbsp; <IconCircleCheck size={20} />
        </Button>
        <Button
          variant="light"
          color="blue"
          onClick={() => handleSubmit(true)}
          className="border rounded-lg p-2"
        >
          Unpublish &nbsp; <IconCircleMinus size={20} />
        </Button>
        <Button
          variant="light"
          color="red"
          onClick={handleDelete}
          className="border rounded-lg p-2"
        >
          Delete &nbsp; <IconTrash size={20} />
        </Button>
      </div>
    </div>
  );
};

export default EditBlog;
