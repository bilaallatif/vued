import React from "react";

export const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={
        "fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-10"
      }
    >
      <div
        className={
          "fixed h-4/5 min-w-1/4 max-w-1/2 flex flex-col items-center justify-start py-10 p-20 bg-neutral-800 rounded-md animate-fade-quick"
        }
      >
        <button
          className={"absolute top-2 right-3 text-gray-500 hover:text-gray-700"}
          onClick={onClose}
        >
          &#x2715; {/* Close button */}
        </button>
        {children}
      </div>
    </div>
  );
};
