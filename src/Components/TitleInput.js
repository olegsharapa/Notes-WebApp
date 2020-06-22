import React, { useRef } from "react";
import { Form } from "react-bootstrap";
import ClickOutside from "./ClickOutside";

export default function TitleInput({
  defaultValue,
  value = "",
  onChange,
  onSubmit,
  as,
  maxLength = 512,
}) {
  const showFormButtonEl = useRef();
  const formEl = useRef();
  const inputEl = useRef();

  const openForm = () => {
    showFormButtonEl.current.style.display = "none";
    formEl.current.style.display = "block";
    inputEl.current.select();
  };

  const closeForm = () => {
    formEl.current.style.display = "none";
    showFormButtonEl.current.style.display = "block";
  };

  const onChangeInput = (e) => {
    onChange(e.target.value);
    if (as === "textarea") {
      inputEl.current.rows = 1;
      inputEl.current.rows = Math.floor(e.target.scrollHeight / 20);
      inputEl.current.maxLength = maxLength;
    } else {
      inputEl.current.style.width = "1px";
      inputEl.current.style.width = `${e.target.scrollWidth}px`;
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    onChange(value.trim());
    if (!value.trim()) onChange(defaultValue);
    else if (value.trim() !== defaultValue) onSubmit();
    closeForm();
  };

  const onEnterOrEscPress = (e) => {
    if (e.keyCode === 13 || e.keyCode === 27) submitForm(e);
  };

  return (
    <>
      <ClickOutside onClick={closeForm}>
        <div className="title-form-wrapper">
          <span
            ref={showFormButtonEl}
            className="title-form-placeholder"
            style={{ display: "block" }}
            onClick={openForm}
          >
            {value}
          </span>
          <Form
            ref={formEl}
            className="title-form"
            style={{ display: "none" }}
            onBlur={submitForm}
            onFocus={onChangeInput}
          >
            <Form.Control
              as={as}
              ref={inputEl}
              className="title-input"
              aria-label={value}
              value={value}
              onChange={onChangeInput}
              onKeyDown={onEnterOrEscPress}
              plaintext
            />
          </Form>
        </div>
      </ClickOutside>
    </>
  );
}
