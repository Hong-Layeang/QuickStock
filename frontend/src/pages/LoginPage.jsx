import { useState } from "react";
import Logo from "../components/Logo";
import { FaSignInAlt } from "react-icons/fa";
// import useUserStore from "../store/useUserStore";
import useAuthStore from "../store/useAuthStore"; // Assuming you have a user store for authentication

const LoginPage = () => {

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const { login } = useAuthStore(); // Using the auth store for login


  const onSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = credentials;

    if (!email || !password) {
      return alert("Please fill in all fields.");
    }
    const response = await login(credentials);
    
    if (response.success) {
      alert("Login successful!");
      window.location.href = "/dashboard"; // redirect to dashboard after successful login
    } else {
      alert(response?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className=" w-125 h-128 mt-10 m-auto rounded-xl shadow-xl">
        <h4 className="text-orange-500 mb-4 text-xl">Welcome Back!</h4>
        <Logo />
        <h2 className="mt-4 text-2xl font-bold text-orange-900">Please sign in to your account</h2>
        <p className="text-orange-900 mt-0.5 text-sm font-thin">Let's get you signed in and straight to the icons.</p>
        <form className="text-orange-900 pl-10 pr-10 flex flex-col gap-4 mt-7" 
          onSubmit={onSubmit}>
            <div className="flex flex-col mb-3">
                <label htmlFor="email" className="text-left font-bold mb-2.5">Email Address</label>
                <input className="w-full h-13 rounded-xl border-3 placeholder: pl-6"
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  type="email"
                  id="email"
                  name="email"
                  value={credentials.email}
                  placeholder="📧 you@example.com"
                  required
                />
            </div>
            <div className="flex flex-col mb-5">
                <label htmlFor="password" className="text-left font-bold mb-2.5">Password</label>
                <input className="w-full h-13 rounded-xl border-3 placeholder: pl-6"
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="🔒 ************" 
                  required 
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value})}
                />
            </div>
            <button type="submit" className="text-black font-extrabold  bg-orange-500 w-35 h-13 rounded-xl outline-2 border-b-5 outline-black shadow-xl ml-auto mr-auto flex justify-center items-center gap-2">Sign In <FaSignInAlt className="text-xl"/></button>
        </form>
    </div>
  )
}

export default LoginPage;