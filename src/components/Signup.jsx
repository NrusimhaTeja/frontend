import React, { useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = ({ onClose, onSignupSuccess }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    designation: "",
    gender: "",
    id: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const resetForm = () => {
    setProfilePhoto(null);
    setPhotoPreview(null);
    setSignupSuccess(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      department: "",
      designation: "",
      gender: "",
      id: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseModal = (e) => {
    if (e.target.id === "signupModal") {
      onClose();
    }
  };

  const handleSignup = async () => {
    // Basic validation
    if (
      !formData.firstName ||
      !formData.email ||
      !formData.password ||
      !formData.department ||
      !formData.designation ||
      !formData.gender ||
      !formData.id
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // Create FormData object to handle file upload
      const signupData = new FormData();
      signupData.append("firstName", formData.firstName);
      signupData.append("lastName", formData.lastName);
      signupData.append("email", formData.email);
      signupData.append("password", formData.password);
      signupData.append("department", formData.department);
      signupData.append("designation", formData.designation);
      signupData.append("gender", formData.gender);
      signupData.append("id", formData.id);

      // Only append photo if one was selected
      if (profilePhoto) {
        signupData.append("profilePhoto", profilePhoto);
      }

      const response = await axios.post(import.meta.env.VITE_REACT_APP_BACKEND_BASEURL + "api/auth/register", signupData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Check for success based on status code
      if (response.status === 201 || response.status === 200) {
        // Show success message
        setSignupSuccess(true);
        toast.success("Account created successfully!");

        // After 2 seconds, close modal and pass email back to login
        setTimeout(() => {
          onSignupSuccess(formData.email);
        }, 2000);
      } else {
        // Handle unexpected success responses that aren't actually successful
        toast.error(response.data?.message || "An unexpected error occurred");
        resetForm(); // Reset the form on error
      }
    } catch (err) {
      // Clear any previous success state
      setSignupSuccess(false);

      // Show error message as toast
      if (err.response) {
        toast.error(err.response.data?.message || "Server error occurred");
        console.log("Error response:", err.response.data);
      } else {
        toast.error(err.message || "Network error occurred");
        console.log("Error:", err.message);
      }

      // Reset the form on error
      resetForm();
    }
  };
  return (
    <div
      id="signupModal"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleCloseModal}
    >
      {/* Add ToastContainer at the top level */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="bg-white rounded-xl max-w-md w-full max-h-90vh overflow-y-auto p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-blue-950">Create an Account</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {signupSuccess ? (
          <div className="p-4 mb-4 bg-green-100 text-green-700 rounded-lg text-center">
            Account created successfully! Redirecting to login...
          </div>
        ) : (
          <>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {/* Profile Photo Upload */}
              <div className="flex flex-col items-center mb-2">
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-blue-300 hover:border-blue-500 transition-colors duration-200"
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="hidden"
                />
                <label
                  className="mt-2 text-sm text-blue-600 cursor-pointer hover:text-blue-800"
                  onClick={() => fileInputRef.current.click()}
                >
                  {photoPreview ? "Change Photo" : "Add Profile Photo"}
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name*
                  </label>
                  <div className="mt-1">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="First name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Last name"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address*
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ID/Roll Number*
                  </label>
                  <div className="mt-1">
                    <input
                      id="id"
                      name="id"
                      type="text"
                      value={formData.id}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Your ID"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Gender*
                  </label>
                  <div className="mt-1">
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Department*
                  </label>
                  <div className="mt-1">
                    <input
                      id="department"
                      name="department"
                      type="text"
                      value={formData.department}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Your department"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="designation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Designation*
                  </label>
                  <div className="mt-1">
                    <input
                      id="designation"
                      name="designation"
                      type="text"
                      value={formData.designation}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Student/Faculty/Staff"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password*
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Create a password"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password*
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              <div>
                <button
                  onClick={handleSignup}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-950 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Create Account
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
