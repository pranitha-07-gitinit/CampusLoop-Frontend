import "./App.css";

import ReportItem from "./pages/ReportItem";
import Requests from "./pages/Requests";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyReports from "./pages/MyReports";
import Navbar from "./components/Navbar";

function App() {
  const path = window.location.pathname;

  const user = JSON.parse(
    localStorage.getItem("campusloopUser")
  );

  if (path === "/report") {
    return <ReportItem />;
  }

  if (path === "/requests") {
    return <Requests />;
  }

  if (path === "/login") {
    return <Login />;
  }

  if (path === "/register") {
    return <Register />;
  }

  if (path === "/my-reports") {
    return <MyReports />;
  }

  if (path === "/admin") {
    if (!user) {
      window.location.href = "/login";
      return null;
    }

    if (user.role !== "ADMIN") {
      return (
        <>
          <Navbar />

          <div className="access-denied">
            <h1>Access Denied</h1>

            <p>
              You do not have permission to access the
              Admin Dashboard.
            </p>

            <button
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Go to Home
            </button>
          </div>
        </>
      );
    }

    return <Admin />;
  }

  return (
    <div className="app">
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <h1>Lost something on campus?</h1>

          <p>
            CampusLoop helps students report, find and recover
            lost items within the college campus.
          </p>

          <div className="buttons">
            <button
              onClick={() => {
                window.location.href = "/report";
              }}
            >
              Report Lost Item
            </button>

            <button
              className="secondary"
              onClick={() => {
                window.location.href = "/requests";
              }}
            >
              View Lost Items
            </button>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="card">
          <h3>🔎 Report Lost Items</h3>

          <p>
            Easily report items you have lost around the campus.
          </p>
        </div>

        <div className="card">
          <h3>📦 Find Items</h3>

          <p>
            Check recently reported items and help reunite
            them with their owners.
          </p>
        </div>

        <div className="card">
          <h3>🏫 Campus Based</h3>

          <p>
            Designed specifically for managing lost and found
            items within your college.
          </p>
        </div>
      </section>

      <footer>
        <p>
          © 2026 CampusLoop | College Lost & Found System
        </p>
      </footer>
    </div>
  );
}

export default App;

