
import { useEffect, useState } from "react";
import "./Admin.css";
import Navbar from "../components/Navbar";

function Admin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = () => {
    fetch("http://localhost:8080/api/admin/requests")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setRequests(data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(function () {
    loadRequests();
  }, []);

  const handleApprove = function (id) {
    fetch(
      "http://localhost:8080/api/admin/requests/" +
        id +
        "/approve",
      {
        method: "PUT"
      }
    )
      .then(function (response) {
        if (response.ok) {
          alert("Request approved!");
          loadRequests();
        } else {
          alert("Failed to approve request.");
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Unable to connect to backend.");
      });
  };

  const handleReject = function (id) {
    fetch(
      "http://localhost:8080/api/admin/requests/" +
        id +
        "/reject",
      {
        method: "PUT"
      }
    )
      .then(function (response) {
        if (response.ok) {
          alert("Request rejected!");
          loadRequests();
        } else {
          alert("Failed to reject request.");
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Unable to connect to backend.");
      });
  };

  const handleDelete = function (id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmDelete) {
      return;
    }

    fetch(
      "http://localhost:8080/api/admin/requests/" + id,
      {
        method: "DELETE"
      }
    )
      .then(function (response) {
        if (response.ok) {
          alert("Report deleted successfully!");
          loadRequests();
        } else {
          alert("Failed to delete report.");
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Unable to connect to backend.");
      });
  };

  return (
    <>
      <Navbar />

      <div className="admin-page">
        <h1>Admin Dashboard</h1>

        <p className="admin-subtitle">
          Manage CampusLoop lost item requests
        </p>

        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          <div className="admin-table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {requests.map(function (request) {
                  return (
                    <tr key={request.id}>
                      <td>{request.id}</td>

                      <td>
                        {request.item
                          ? request.item.itemName
                          : "N/A"}
                      </td>

                      <td>
                        {request.item
                          ? request.item.description
                          : "N/A"}
                      </td>

                      <td>
                        {request.item
                          ? request.item.location
                          : "N/A"}
                      </td>

                      <td>
                        {request.item
                          ? request.item.date
                          : "N/A"}
                      </td>

                      <td>
                        <span
                          className={
                            request.status === "APPROVED"
                              ? "admin-status approved"
                              : request.status === "REJECTED"
                              ? "admin-status rejected"
                              : "admin-status"
                          }
                        >
                          {request.status || "PENDING"}
                        </span>
                      </td>

                      <td className="action-buttons">
                        <button
                          className="approve-button"
                          onClick={function () {
                            handleApprove(request.id);
                          }}
                          disabled={
                            request.status === "APPROVED"
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="reject-button"
                          onClick={function () {
                            handleReject(request.id);
                          }}
                          disabled={
                            request.status === "REJECTED"
                          }
                        >
                          Reject
                        </button>

                        <button
                          className="delete-button"
                          onClick={function () {
                            handleDelete(request.id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default Admin;