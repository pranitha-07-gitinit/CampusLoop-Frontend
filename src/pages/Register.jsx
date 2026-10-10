import { useState } from "react";
import "./Auth.css";
import Navbar from "../components/Navbar";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const userData = {
      name: name,
      email: email,
      password: password,
      role: "STUDENT"
    };

    try {
      const response = await fetch(
        "http://https://campusloop-backend.onrender.com/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userData)
        }
      );

      if (response.ok) {
        alert("Registration successful!");
        window.location.href = "/login";
      } else {
        alert("Registration failed. Email may already be registered.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Unable to connect to backend.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-page">
        <div className="auth-box">
          <h1>Create Account</h1>

          <p className="auth-subtitle">
            Register for CampusLoop
          </p>

          <form onSubmit={handleRegister}>
            <label>Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">
              Register
            </button>
          </form>

          <p className="auth-link">
            Already have an account?{" "}
            <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;