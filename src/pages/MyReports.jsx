import { useEffect, useState } from "react";
import "./MyReports.css";
import Navbar from "../components/Navbar";

function MyReports() {
  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("campusloopUser")
    );
  } catch (error) {
    user = null;
  }

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");

  const [saving, setSaving] = useState(false);

  async function loadReports() {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(
        `https://campusloop-backend.onrender.com/api/requests/user/${user.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to load reports.");
      }

      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Error loading reports:", error);
      alert("Unable to load your reports.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  function startEditing(report) {
    setEditingId(report.id);
    setItemName(report.item?.itemName || "");
    setDescription(report.item?.description || "");
    setLocation(report.item?.location || "");
    setDate(report.item?.date || "");
    setImage(report.item?.image || "");
  }

  function cancelEditing() {
    setEditingId(null);
    setItemName("");
    setDescription("");
    setLocation("");
    setDate("");
    setImage("");
  }

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  }

  async function saveChanges(event) {
    event.preventDefault();

    if (!itemName.trim() || !description.trim() ||
        !location.trim() || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `http://https://campusloop-backend.onrender.com/api/requests/${editingId}/user/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            itemName: itemName.trim(),
            description: description.trim(),
            location: location.trim(),
            date: date,
            image: image
          })
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to update report.");
      }

      alert("Report updated successfully!");
      cancelEditing();
      await loadReports();
    } catch (error) {
      console.error("Error updating report:", error);
      alert(error.message || "Failed to update report.");
    } finally {
      setSaving(false);
    }
  }

  async function cancelReport(report) {
    const confirmed = window.confirm(
      `Are you sure you want to cancel the report for "${report.item?.itemName || "this item"}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://https://campusloop-backend.onrender.com/api/requests/${report.id}/user/${user.id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to cancel report.");
      }

      alert("Report cancelled successfully!");
      await loadReports();
    } catch (error) {
      console.error("Error cancelling report:", error);
      alert(error.message || "Failed to cancel report.");
    }
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />

      <div className="my-reports-page">
        <h1>My Reports</h1>

        <p className="my-reports-subtitle">
          Items you have reported on CampusLoop
        </p>

        {loading ? (
          <p>Loading your reports...</p>
        ) : reports.length === 0 ? (
          <div className="empty-reports">
            <h2>No Reports Yet</h2>

            <p>
              You haven't reported any lost items yet.
            </p>

            <button
              onClick={() => {
                window.location.href = "/report";
              }}
            >
              Report an Item
            </button>
          </div>
        ) : (
          <div className="my-reports-container">
            {reports.map((report) => {
              const item = report.item;
              const isEditing = editingId === report.id;
              const isPending = report.status === "PENDING";

              return (
                <div
                  className="my-report-card"
                  key={report.id}
                >
                  {isEditing ? (
                    <>
                      <h2>Edit Report</h2>

                      <form
                        className="edit-report-form"
                        onSubmit={saveChanges}
                      >
                        <label>Item Name</label>

                        <input
                          type="text"
                          value={itemName}
                          onChange={(e) =>
                            setItemName(e.target.value)
                          }
                          required
                        />

                        <label>Description</label>

                        <textarea
                          value={description}
                          onChange={(e) =>
                            setDescription(e.target.value)
                          }
                          required
                        />

                        <label>Location</label>

                        <input
                          type="text"
                          value={location}
                          onChange={(e) =>
                            setLocation(e.target.value)
                          }
                          required
                        />

                        <label>Date Lost</label>

                        <input
                          type="date"
                          value={date}
                          onChange={(e) =>
                            setDate(e.target.value)
                          }
                          required
                        />

                        <label>Item Photo</label>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />

                        {image && (
                          <img
                            src={image}
                            alt="Item preview"
                            className="my-report-image"
                          />
                        )}

                        <div className="report-actions">
                          <button
                            type="submit"
                            disabled={saving}
                          >
                            {saving ? "Saving..." : "Save Changes"}
                          </button>

                          <button
                            type="button"
                            className="cancel-edit-button"
                            onClick={cancelEditing}
                            disabled={saving}
                          >
                            Go Back
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <>
                      {item?.image && (
                        <img
                          src={item.image}
                          alt={item.itemName || "Reported item"}
                          className="my-report-image"
                        />
                      )}

                      <div className="report-header">
                        <h2>
                          {item?.itemName || "Unnamed item"}
                        </h2>

                        <span
                          className={`report-status ${
                            report.status === "APPROVED"
                              ? "approved"
                              : report.status === "REJECTED"
                              ? "rejected"
                              : "pending"
                          }`}
                        >
                          {report.status || "PENDING"}
                        </span>
                      </div>

                      <p>
                        <strong>Description:</strong>{" "}
                        {item?.description || "Not provided"}
                      </p>

                      <p>
                        <strong>Location:</strong>{" "}
                        {item?.location || "Not provided"}
                      </p>

                      <p>
                        <strong>Date Lost:</strong>{" "}
                        {item?.date || "Not provided"}
                      </p>

                      {isPending && (
                        <div className="report-actions">
                          <button
                            type="button"
                            onClick={() => startEditing(report)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="cancel-report-button"
                            onClick={() => cancelReport(report)}
                          >
                            Cancel Report
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default MyReports;