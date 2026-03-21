import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Nav from "@/components/Nav/Nav";
import { User, Lock, LogIn, ArrowRight, Eye, EyeOff } from "lucide-react";
import { SignInProps, signInSchema, SignInFormData } from "@/pages/SinginPage/SignIn.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/services/userService";
import { handleError } from "@/utils/errorHandler";

const SignIn: React.FC<SignInProps> = () => {
  const navigate = useNavigate();

  // State variable declarations
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // React hook form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);

    try {
      const res = await signIn(data);
      if (res.success) {
        toast.success(res?.message);
        navigate("/users");
      }
    } catch (err) {
      const errorMessage = handleError(err);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-white flex flex-col">
      <Nav />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -z-10"></div>

            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-2xl mb-6">
                <LogIn className="text-secondary" size={32} />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-white">Welcome Back</h1>
              <p className="text-gray-400 text-sm">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                <div className="relative group">
                  <div
                    className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${errors.username ? "text-error" : "text-white/30 group-focus-within:text-secondary"}`}
                  >
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    {...register("username")}
                    className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-white placeholder-secondary/40 focus:outline-none focus:ring-1 transition-all outline-none ${
                      errors.username
                        ? "border-error/50 focus:ring-error/20"
                        : "border-white/10 focus:border-secondary focus:ring-secondary/30"
                    }`}
                    placeholder="your_username"
                  />
                </div>
                {errors.username && (
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-error/20 border border-error/40 rounded-xl animate-shake shadow-[0_0_15px_rgba(255,92,141,0.2)]">
                    <p className="text-[11px] font-black text-white drop-shadow-sm">
                      {errors.username.message}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  {/* <a href="#" className="text-xs text-secondary hover:underline transition-all">
                    Forgot password?
                  </a> */}
                </div>
                <div className="relative group">
                  <div
                    className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${errors.password ? "text-error" : "text-white/30 group-focus-within:text-secondary"}`}
                  >
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-12 text-white placeholder-secondary/40 focus:outline-none focus:ring-1 transition-all outline-none ${
                      errors.password
                        ? "border-error/50 focus:ring-error/20"
                        : "border-white/10 focus:border-secondary focus:ring-secondary/30"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-secondary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff size={18} color="var(--color-secondary)" />
                    ) : (
                      <Eye size={18} color="var(--color-secondary)" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-error/20 border border-error/40 rounded-xl animate-shake shadow-[0_0_15px_rgba(255,92,141,0.2)]">
                    <p className="text-[11px] font-black text-white drop-shadow-sm">
                      {errors.password.message}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-secondary text-primary font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-400 shadow-lg shadow-secondary/20 transform active:scale-95 transition-all duration-300 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-gray-400 text-sm">
                New user?{" "}
                <Link to="/signup" className="text-secondary font-bold hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
