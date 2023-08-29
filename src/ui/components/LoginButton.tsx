import React, { FC } from "react";

import Avatar from "ui/components/Avatar";
import MaterialIcon from "ui/components/shared/MaterialIcon";
import useAuth0 from "ui/utils/useAuth0";

interface LoginButtonProps {
  variant?: string;
  iconPosition?: "left" | "right";
}

const LoginButton: FC<LoginButtonProps> = ({ variant, iconPosition = "left" }) => {
  const { loginAndReturn, isAuthenticated, logout, user } = useAuth0();

  if (isAuthenticated) {
    return (
      <button
        className={`row logout ${iconPosition === "right" ? "flex-row-reverse" : ""}`}
        onClick={() => logout({ returnTo: window.location.origin + "/login" })}
      >
        <Avatar player={user} isFirstPlayer={true} />
        <span className="w-full text-left">Sign Out</span>
      </button>
    );
  }

  return (
    <button
      className={`row logout ${iconPosition === "right" ? "flex-row-reverse" : ""}`}
      onClick={() => loginAndReturn()}
    >
      <span className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-primaryAccent px-3 py-1.5 text-sm font-medium leading-4 text-buttontextColor hover:bg-primaryAccentHover focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Sign In
      </span>
    </button>
  );
};

export default LoginButton;
