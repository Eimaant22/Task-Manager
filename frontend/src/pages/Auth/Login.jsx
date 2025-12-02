import React, { useContext } from "react";
import AuthLayout from "../../components/layouts/AuthLayout.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input.jsx";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/emailValidator.jsx";
import axiosInstance from "../../utils/axiosInstance.jsx";
import { UserContext } from "../../context/userContext.jsx";
import { API_PATHS } from "../../utils/apiPaths.jsx";

const Login = () => {
  const {updateUser}=useContext(UserContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    
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
    //Login Api call
    // Add your API call here
      // Example:
      // const response = await axios.post("/api/login", { email, password });
      // navigate("/dashboard");

    try {
      const response=await axiosInstance.post(API_PATHS.AUTH.LOGIN ,{email,password})
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
         setError("Something went wrong while logging in .please try again");
      }
     
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin} noValidate className="w-full max-w-md">
          {/*values are passed to Input component Ghourrrr */}
          <Input
            type="email"
            placeholder="abcExample.com"
            value={email}
            label="Email Address"
            onChange={setEmail} 

          />
          <Input
            type="password"
            label="Password"
            placeholder="Min 8 characters"
            value={password}
            onChange={setPassword} // simpler usage

          />
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button type="submit" className="btn-primary">
            LOGIN
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary underline">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
