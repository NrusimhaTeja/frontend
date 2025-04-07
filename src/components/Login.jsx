import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import Signup from "./Signup";

const Login = () => {
  const [email, setEmail] = useState("student1@gmail.com");
  const [password, setPassword] = useState("stu1@1");
  const [showSignupModal, setShowSignupModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const data = await axios.post(
        import.meta.env.VITE_REACT_APP_BACKEND_BASEURL + "api/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      if (data.data.message !== "Invalid Credentials") {
        dispatch(addUser(data.data));
        navigate("/");
      } else {
        throw new Error("Invalid Credentials");
      }
    } catch (err) {
      console.log(err.message);
      setEmail("");
      setPassword("");
    }
  };

  const handleSignupSuccess = (email) => {
    // Set email from successful signup
    setEmail(email);
    setPassword("");
    setShowSignupModal(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-950">
            Welcome to findit 🔍
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-lg rounded-xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                onClick={handleLogin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-950 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => setShowSignupModal(true)}
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      {showSignupModal && (
        <Signup
          onClose={() => setShowSignupModal(false)}
          onSignupSuccess={handleSignupSuccess}
        />
      )}
    </div>
  );
};

export default Login;
