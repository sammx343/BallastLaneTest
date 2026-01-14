import React from "react";
import Pokeball from "../../assets/images/pokeball.svg?react";

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 gap-4" role="status" aria-live="polite">
      <p className="text-body-1 text-gray-dark font-bold">Loading...</p>
      <div className="animate-pokeball" aria-hidden="true">
        <Pokeball className="w-16 h-16 fill-identity" />
      </div>
    </div>
  );
};

export default Loading;
