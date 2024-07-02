import { ChangeEvent, useState } from "react";
import AuthBackground from "../components/auth/AuthBackground";
import CustomLabelInput from "../components/CustomLabelInput";
import { SignupInput } from "@madhavsingh203/mad-medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";
import AuthCardBody from "../components/auth/AuthCardBody";
import { BottomGradient } from "../components/ui/BottomGradient";


const Signup = () => {
  const [signupData, setSignupData] = useState<SignupInput>({
    email: "",
    password: "",
    name: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (
    name: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setSignupData({
      ...signupData,
      [name.toLocaleLowerCase()]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/signup`,
        signupData
      );
      console.log(response.data);
      navigate("/signin");
    } catch (error) {
      console.error("Error while signinup::", error);
    }
  };

  return (
    <AuthBackground>
     <div className="absolute inset-0 flex items-center justify-center z-50">

      <AuthCardBody>
        <h4 className="text-black text-4xl dark:text-white text-center">Signup</h4>
        <div className="flex flex-col gap-4">
          <CustomLabelInput
            onChange={handleInputChange}
            label="Name"
            placeholder="John Doe"
            type="text"
            />
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
            onClick={handleSubmit}
            >
          Sign Up
          <BottomGradient/>
        </button>
        <div className="text-white h-fit text-sm font-light mt-2">
          <p>Already a member? <Link to={'/signin'} className="underline">Signin Here</Link></p>
        </div>
      </AuthCardBody>
          </div>
    </AuthBackground>
  );
};

export default Signup;
