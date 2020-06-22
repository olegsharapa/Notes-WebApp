import React, { useEffect, createRef } from "react";

export default function ClickOutside({ children, onClick }) {
  const refs = React.Children.map(children, () => createRef());
  const handleClick = (e) => {
    const isOutside = refs.every((ref) => {
      return !ref.current.contains(e.target);
    });
    if (isOutside) {
      onClick();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return function () {
      document.removeEventListener("mousedown", handleClick);
    };
  });

  return React.Children.map(children, (element, idx) => {
    return React.cloneElement(element, { ref: refs[idx] });
  });
}
