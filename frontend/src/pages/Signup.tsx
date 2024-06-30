import { ChangeEvent, useState } from "react";
import AuthBackground from "../components/AuthBackground";
import CustomLabelInput from "../components/CustomLabelInput";
import { SignupInput } from "@madhavsingh203/mad-medium-common";
import axios from "axios";

const Signup = () => {
  const [signupData, setSignupData] = useState<SignupInput>({
    email: "",
    password: "",
    name: "",
  });

  const handleInputChange = (name: string,e: ChangeEvent<HTMLInputElement>)=>{
    setSignupData({
      ...signupData,
      [name.toLocaleLowerCase()] : e.target.value
    })
  }

  const handleSubmit = async()=>{
    try{
      const response = await axios.post("https://backend.mad-medium.workers.dev/", {
        signupData
      })
      console.log(response.data)
    }catch(error){
      console.error("Error while signinup::", error)
    }
  }

  return (
    <AuthBackground>
      <CustomLabelInput onChange={handleInputChange} label="Email" placeholder="abc123@gmail.com" type="email" />
      <CustomLabelInput onChange={handleInputChange} label="Password" placeholder="abc123@gmail.com" type="password" />
      <button onClick={handleSubmit}>Submit</button>
    </AuthBackground>
  );
};

export default Signup;
