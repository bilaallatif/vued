import React from "react";

export const List = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={"p-10 w-full grid grid-cols-4 gap-10"}>{children}</div>
  );
};
