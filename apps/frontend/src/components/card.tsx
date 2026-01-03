import React from "react";

export const Card = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      className={
        "bg-yellow-600/50 rounded-md w-full h-50 hover:scale-110 transition-transform duration-200 flex flex-col items-start gap-2 p-2"
      }
      onClick={onClick}
    >
      {children}
    </div>
  );
};
