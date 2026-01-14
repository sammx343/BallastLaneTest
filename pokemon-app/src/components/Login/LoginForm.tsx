import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/api";
import { useNavigate } from "react-router-dom";
import EyeIcon from "../../assets/images/eye.svg?react";
import EyeOffIcon from "../../assets/images/eye_off.svg?react";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login(username, password);
      login(response.token);
      navigate("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error signing in";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div 
          role="alert" 
          aria-live="assertive"
          className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm"
        >
          {error}
        </div>
      )}
      <div>
        <label htmlFor="username" className="sr-only">Username</label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          aria-required="true"
          aria-invalid={error !== "" ? "true" : "false"}
          className="w-full bg-gray-background border-2 border-transparent focus:border-type-electric rounded-lg px-4 py-3 text-body-1 text-gray-dark placeholder-gray-medium focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <div className="relative">
        <label htmlFor="password" className="sr-only">Password</label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          aria-required="true"
          aria-invalid={error !== "" ? "true" : "false"}
          className="w-full bg-gray-background border-2 border-transparent focus:border-type-electric rounded-lg px-4 py-3 pr-12 text-body-1 text-gray-dark placeholder-gray-medium focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-gray-dark transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOffIcon className="w-6 h-6" aria-hidden="true"/>
          ) : (
            <EyeIcon className="w-6 h-6" aria-hidden="true"/>
          )}
        </button>
      </div>
      <div className="text-right">
        <a
          href="#"
          className="text-sm text-type-water hover:underline"
          onClick={(e) => {
            e.preventDefault();
            alert("Recovery functionality");
          }}
        >
          Having trouble signing in?
        </a>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-type-grass hover:bg-type-grass/90 text-gray-white font-bold py-3 px-6 rounded-lg transition-colors shadow-drop-2dp disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};

export default LoginForm;
