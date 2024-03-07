import React from "react";
import "./button.css";

type ButtonPropTypes = {
  backgroundColor?: string;
  size?: string;
  icon?: string;
  animate?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: any;
  children?: any;
  disabled?: boolean;
};

const Button = (props: ButtonPropTypes) => {
  const bg = props.backgroundColor ? "bg-" + props.backgroundColor : "bg-main";

  const size = props.size ? "btn-" + props.size : "";

  const animate = props.animate ? "btn-animate" : "";

  return (
    <button
      disabled={props.disabled}
      className={`btn ${bg} ${size} ${animate} ${props.className ?? ""}`}
      onClick={props.onClick ? () => props.onClick() : undefined}
      type={props.type ?? undefined}
    >
      <span className="btn__txt">{props.children}</span>
      {props.icon ? (
        <span className="btn__icon">
          <i className={`${props.icon}`}></i>
        </span>
      ) : null}
    </button>
  );
};

export default Button;
