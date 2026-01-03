import React from "react";

export const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={
        "bg-yellow-600/50 rounded-md w-full h-50 hover:scale-110 transition-transform duration-200 flex flex-col gap-2 p-2"
      }
    >
      {children}
    </div>
  );
};
