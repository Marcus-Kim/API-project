import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import { login } from "../../store/session";
import { Link } from "react-router-dom";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  const demoLogin = () => {
    const credientials = { credential: "DemoUser1", password: "password" }
    dispatch(login(credientials))
      .then(closeModal)
  }

  return (
    <div className="login-form-modal-container">
      <h1 className="login-modal-title">Log In</h1>
      <form className="login-form-modal-form" onSubmit={handleSubmit}>
        <ul className="login-form-modal-errors">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="login-modal-input-wrapper">
            <input
            className="login-form-input"
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
              placeholder="Username or Email"
            />
        </div>
        <div className="login-modal-input-wrapper">
            <input
              className="login-form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
        </div>
        <button className="login-modal-login-button" type="submit" disabled={credential.length < 4 || password.length < 6 ? true : false}>Log In</button>
        <Link className="login-modal-demo-login" onClick={demoLogin}>Demo User</Link>
      </form>
    </div>
  );
}

export default LoginFormModal;
