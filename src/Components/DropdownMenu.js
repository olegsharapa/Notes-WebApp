import React from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";

export default function DropdownMenu({
  className = "",
  title = "",
  menu = [],
}) {
  const dropdownItems = menu.map((item, key) => (
    <Dropdown.Item as="button" key={key} onClick={item.onClick}>
      {item.title}
    </Dropdown.Item>
  ));
  return (
    <DropdownButton
      id="dropdown-basic-button"
      className={`unstyled-button ${className}`}
      title={title}
    >
      {dropdownItems}
    </DropdownButton>
  );
}
