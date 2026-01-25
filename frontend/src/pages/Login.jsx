import { login } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, isAuthenticated } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, isAuthenticated, loading]);

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-zinc-50 lg:pl-[320px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-zinc-100 mx-4"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-zinc-900 mb-2">Welcome Back</h1>
          <p className="text-zinc-500">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700">Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:bg-primary/90 transition-all transform active:scale-95 shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                Logging In...
              </span>
            ) : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-zinc-500">
            Don't have an account?{" "}
            <span
              onClick={() => navigateTo("/sign-up")}
              className="text-primary font-bold cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Login;
