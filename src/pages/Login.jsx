import { useState } from "react";
import "./Auth.css";
import Navbar from "../components/Navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      email: email,
      password: password
    };

    try {
      const response = await fetch(
        "https://campusloop-backend.onrender.com/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(loginData)
        }
      );

      if (response.ok) {
        const user = await response.json();

        localStorage.setItem(
          "campusloopUser",
          JSON.stringify(user)
        );

        alert("Login successful!");

        window.location.href = "/";
      } else {
        alert("Invalid email or password.");
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
          <h1>Welcome Back</h1>

          <p className="auth-subtitle">
            Login to CampusLoop
          </p>

          <form onSubmit={handleLogin}>
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
              Login
            </button>
          </form>

          <p className="auth-link">
            Don't have an account?{" "}
            <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;