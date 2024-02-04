import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      //save the auth token and redirect
      localStorage.setItem("token", json.authToken);
      props.showAlert("Account logged successful", "success");
      navigate("/");
    } else {
      props.showAlert("Invalid credentials", "danger");
    }
  };
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <div className="container">
      <h2>Login to continue to iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            value={credentials.email}
            className="form-control my-2"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            name="email"
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password my-2"
            value={credentials.password}
            className="form-control"
            id="password"
            placeholder="Password"
            name="password"
            onChange={onChange}
          />
        </div>

        <button type="submit" className="btn btn-primary my-3">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
