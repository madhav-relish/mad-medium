import axios from "axios";
import CustomLabelInput from "../components/CustomLabelInput";
import AuthBackground from "../components/auth/AuthBackground";
import AuthCardBody from "../components/auth/AuthCardBody";
import { BottomGradient } from "../components/ui/BottomGradient";
import { BACKEND_URL } from "../config";
import { FormEvent, useState } from "react";
import { SigninInput } from "@madhavsingh203/mad-medium-common";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";

const Signin = () => {
  const [signinData, setSigninData] = useState<SigninInput>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (
    name: string,
    e: { preventDefault: () => void; target: { value: string } }
  ) => {
    e.preventDefault();
    setSigninData({
      ...signinData,
      [name.toLowerCase()]: e.target.value,
    });
  };

  const handleSubmit = async (
    e?: FormEvent<HTMLFormElement>,
    isGuest = false
  ) => {
    e?.preventDefault();

    // Check if it's a guest login and set the data accordingly
    const dataToSubmit = isGuest
      ? { email: "guestuser@gmail.com", password: "guest@1234" }
      : signinData;

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/signin`,
        dataToSubmit
      );
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("user_id", response.data.id);
      navigate("/blogs");
    } catch (error) {
      console.error("Error while signing in:", error);
    }
  };

  return (
    <AuthBackground>
      <div className="absolute inset-0 flex items-center justify-center z-50">
        <AuthCardBody>
          <h4 className="text-black text-4xl dark:text-white text-center">
            Sign In
          </h4>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="flex flex-col gap-4">
              <CustomLabelInput
                onChange={handleInputChange}
                label="Email"
                placeholder="abc123@gmail.com"
                type="email"
              />
              <CustomLabelInput
                onChange={handleInputChange}
                label="Password"
                placeholder="Password"
                type="password"
              />
            </div>
            <button
              className="bg-gradient-to-br !text-xl mt-6 relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Sign In
              <BottomGradient />
            </button>
          </form>
          <div className="text-white h-fit text-sm font-light mt-2 flex justify-between items-center">
            <p>
              Not a member?{" "}
              <Link to={"/signup"} className="underline">
                Signup Here
              </Link>
            </p>
            <Button
              variant="transparent"
              className="p-0"
              onClick={() => handleSubmit(undefined, true)}
            >
              Login as a guest
            </Button>
          </div>
        </AuthCardBody>
      </div>
    </AuthBackground>
  );
};

export default Signin;
