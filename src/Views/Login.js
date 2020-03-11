import React, { useState, useContext } from "react";
import { Button } from "react-bootstrap";
import { FirebaseContext } from "../Context/firebase/FirebaseState";
import Loading from "../Components/Loading";

export default function Login() {
  const { loading, user } = useContext(FirebaseContext);

  const RenderComponent = () => {
    const [registered, setRegistered] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
      <form
        className="user-form"
        onSubmit={e => {
          e.preventDefault();
          registered
            ? user.signIn(email, password)
            : user.signUp(email, password);
        }}
      >
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Sign {registered ? "In" : "Up"}
        </button>
        <Button variant="link" onClick={() => setRegistered(!registered)}>
          Sign {!registered ? "In" : "Up"}
        </Button>
      </form>
    );
  };

  return <>{loading ? <Loading /> : <RenderComponent />}</>;
}
