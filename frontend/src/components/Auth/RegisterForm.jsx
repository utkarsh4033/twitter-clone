import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../services/userApi";

function RegisterForm() {
  const navigate = useNavigate();
  const [focusedField, setFocusedField] = useState(null);

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Registration successful!");
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Registration failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      users_name: e.target.name.value,
      users_email: e.target.email.value,
      users_password: e.target.password.value,
      users_role: "user",
    };
    mutation.mutate(data);
  };

  const inputVariants = {
    focused: {
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(29, 161, 242, 0.1)",
      borderColor: "#1DA1F2",
      transition: { duration: 0.2 }
    },
    unfocused: {
      scale: 1,
      boxShadow: "0 0 0 0px rgba(29, 161, 242, 0)",
      borderColor: "#e1e8ed",
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    idle: { scale: 1, backgroundColor: "#1DA1F2" },
    hover: { 
      scale: 1.02, 
      backgroundColor: "#1991DA",
      boxShadow: "0 4px 12px rgba(29, 161, 242, 0.3)"
    },
    tap: { scale: 0.98 },
    loading: {
      backgroundColor: "#AAB8C2",
      cursor: "not-allowed"
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="absolute inset-0">
        
        <motion.div
          className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-20"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-6 h-6 bg-blue-300 rounded-full opacity-15"
          animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-8 h-8 bg-blue-200 rounded-full opacity-10"
          animate={{ y: [0, -25, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-500 rounded-full opacity-25"
          animate={{ scale: [1, 1.5, 1], opacity: [0.25, 0.1, 0.25] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full opacity-10 blur-xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-r from-blue-200 to-blue-400 rounded-full opacity-8 blur-2xl"
          animate={{ scale: [1, 1.1, 1], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

  
      <div className="relative z-10 flex justify-center items-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-8"
          >
            <motion.div whileHover={{ rotate: 5 }} className="inline-block mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Twitter</h1>
            <p className="text-gray-600">Create your account today</p>
          </motion.div>

  
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
        
              <motion.input
                name="name"
                type="text"
                placeholder="Full Name"
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                variants={inputVariants}
                animate={focusedField === 'name' ? 'focused' : 'unfocused'}
                className="w-full px-4 py-3 rounded-xl border-2 bg-gray-50/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white transition-colors duration-200"
                required
              />

              <motion.input
                name="email"
                type="email"
                placeholder="Email Address"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                variants={inputVariants}
                animate={focusedField === 'email' ? 'focused' : 'unfocused'}
                className="w-full px-4 py-3 rounded-xl border-2 bg-gray-50/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white transition-colors duration-200"
                required
              />

              <motion.input
                name="password"
                type="password"
                placeholder="Password"
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                variants={inputVariants}
                animate={focusedField === 'password' ? 'focused' : 'unfocused'}
                className="w-full px-4 py-3 rounded-xl border-2 bg-gray-50/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white transition-colors duration-200"
                required
              />

      
              <motion.button
                type="submit"
                disabled={mutation.isLoading}
                variants={buttonVariants}
                initial="idle"
                whileHover={!mutation.isLoading ? "hover" : "loading"}
                whileTap={!mutation.isLoading ? "tap" : "loading"}
                animate={mutation.isLoading ? "loading" : "idle"}
                className="w-full py-3 px-6 text-white font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                {mutation.isLoading ? (
                  <motion.div
                    className="flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Creating account...
                  </motion.div>
                ) : (
                  "Sign up"
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <motion.a
                  href="/login"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Sign in
                </motion.a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
export default RegisterForm