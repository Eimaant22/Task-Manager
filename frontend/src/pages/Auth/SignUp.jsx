import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout.jsx";
import Input from "../../components/inputs/Input.jsx";
import { validateEmail } from "../../utils/emailValidator.jsx";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector.jsx";
import { Link } from "react-router-dom";
import  { UserContext } from "../../context/userContext.jsx";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { API_PATHS } from "../../utils/apiPaths.jsx";
import uploadImage from "../../utils/uploadimage.jsx";
import axiosInstance from "../../utils/axiosInstance.jsx";

const SignUp = () => {
  const {updateUser}=useContext(UserContext)
  const navigate=useNavigate()
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);

  //signUp logic
  const handleSignUp =async (e) => {
       e.preventDefault();
       let profileImageUrl=''
       
       if(!fullName && !password && !email){
        setError("Please enter required fields")
         return

       }
        if(!fullName){
         setError("Please enter fullname")
         return}

       if(!validateEmail(email)){
         setError("Please enter valid email address")
          return
       }
        if(!password){
         setError("Please enter password")
         return
       }
       if(password.length<8){
          setError("Password must contain minimum 8 digits")
           return
       }
       setError("")

    try {
      //upload profileImage if present
      if(profilePic){
        const uploadImageRes=await uploadImage(profilePic)
        profileImageUrl=uploadImageRes.imageUrl || ""
      }
      const response=await axiosInstance.post(API_PATHS.AUTH.REGISTER ,{name:fullName,email,password,adminInviteToken})
      const {token,role}=response.data
      updateUser(response.data)

      if(token){
        localStorage.setItem("token",token)
      
      if(role=="admin"){
        navigate("/admin/dashboard")
      }
      else{
         navigate("/user/dashboard")
      }
    }
      console.log("Logging in with:", email, password);
    } 
    catch (error) {
      if(error.response && error.response.data.message){
        setError( error.response.data.message)
      }else{
         setError("Something went wrong while signing In .please try again");
      }
     
    }
  };
   

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <Input
              type="text"
              placeholder="John Doe"
              value={fullName}
              label="Full Name"
              onChange={setFullName}
            />

            <Input
              type="email"
              placeholder="abc@example.com"
              value={email}
              label="Email Address"
              onChange={setEmail}
            />

            <Input
              type="password"
              placeholder="Min 8 characters"
              value={password}
              label="Password"
              onChange={setPassword}
            />

            <Input
              type="text"
              placeholder="6-digit-code"
              value={adminInviteToken}
              label="Admin Invite Token (Optional)"
              onChange={setAdminInviteToken}
            />
</div>
            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button type="submit" className="btn-primary">
            SIGN UP
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary underline">
             Login
            </Link>
          </p>

          
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
