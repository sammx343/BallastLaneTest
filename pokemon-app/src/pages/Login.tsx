import React from "react";
import Pokeball from "../assets/images/pokeball.svg?react";
import LoginForm from "../components/Login/LoginForm";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen pokeball-pattern flex items-center justify-center p-4">
      <title>Login | Pokemon Trainer Portal</title>
      <meta
        name="description"
        content="Sign in to your Pokémon trainer portal to manage your Pokédex."
      />

      <div className="w-full max-w-md bg-gray-white rounded-lg shadow-drop-6dp p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2" aria-hidden="true">
            <Pokeball className="w-10 h-10 fill-gray-dark" />
            <div className="w-1 h-10 bg-identity"></div>
            <Pokeball className="w-10 h-10 fill-identity" />
          </div>
          <h1 className="text-[5vw] sm:text-2xl font-bold text-gray-dark uppercase leading-tight">
            POKEMON TRAINER <br /> PORTAL
          </h1>
        </div>
        <h2 className="text-xl font-bold text-gray-dark mb-6">
          Login into your account
        </h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
