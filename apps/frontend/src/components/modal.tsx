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
        "fixed inset-50 flex items-center justify-center bg-neutral-800 rounded-md animate-fade-quick"
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
  );
};
