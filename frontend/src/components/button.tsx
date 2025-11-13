"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-md"
    >
      {children}
    </button>
  );
}
