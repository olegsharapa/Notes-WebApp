import React, { useContext, useState } from "react";
import { Form, FormControl, InputGroup, Button } from "react-bootstrap";
import { FirebaseContext } from "../Context/firebase/FirebaseState";

export default function Profile() {
  const { user } = useContext(FirebaseContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // console.log("user object from Profile component: ", user.data);

  return (
    <div className="user-form">
      <form
        onSubmit={e => {
          e.preventDefault();
          user.updateEmail(email);
          setEmail("");
        }}
      >
        <Form.Label>Change Email</Form.Label>
        <InputGroup className="mb-3">
          <FormControl
            type="email"
            placeholder={user.data.email}
            aria-label="Email"
            plaintext
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary" type="submit">
              Update Email
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </form>
      <form
        onSubmit={e => {
          e.preventDefault();
          user.updatePassword(password);
          setPassword("");
        }}
      >
        <Form.Label>Change Password</Form.Label>
        <InputGroup className="mb-3">
          <FormControl
            type="password"
            autoComplete="new-password"
            placeholder="New Password"
            aria-label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary" type="submit">
              Update Password
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </form>
    </div>
  );
}
