
import { useEffect, useState } from "react";
import "./Requests.css";
import Navbar from "../components/Navbar";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://campusloop-backend.onrender.com/api/admin/requests")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load reports.");
        }

        return response.json();
      })
      .then((data) => {
        const approvedRequests = data.filter(
          (request) =>
            request.status === "APPROVED" &&
            request.item &&
            request.item.itemName &&
            request.item.itemName.trim() !== ""
        );

        setRequests(approvedRequests);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading reports:", error);
        setError("Unable to load items. Please try again.");
        setLoading(false);
      });
  }, []);

  const locations = [
    ...new Set(
      requests
        .map((request) => request.item?.location)
        .filter(Boolean)
    )
  ];

  const filteredRequests = requests.filter((request) => {
    const item = request.item;

    const matchesSearch =
      item.itemName.toLowerCase().includes(search.toLowerCase()) ||
      (item.description || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesLocation =
      !locationFilter || item.location === locationFilter;

    const matchesStatus =
      !statusFilter || request.status === statusFilter;

    return matchesSearch && matchesLocation && matchesStatus;
  });

  const contactReporter = (item) => {
    const email = item.user?.email;

    if (!email) {
      alert("The reporter's email is not available.");
      return;
    }

    const subject = encodeURIComponent(
      `Regarding your reported item: ${item.itemName}`
    );

    const body = encodeURIComponent(
      `Hello ${item.user?.name || "there"},\n\n` +
      `I saw your report for "${item.itemName}" on CampusLoop.\n` +
      `Location: ${item.location || "Not provided"}\n\n` +
      `I would like to contact you about this item.\n\nThank you.`
    );

    window.location.href =
      `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <Navbar />

      <div className="requests-page">
        <h1>Lost & Found Items</h1>

        <p className="requests-subtitle">
          Search and find recently reported items on campus
        </p>

        <div className="filters">
          <input
            type="text"
            placeholder="Search item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>

            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="APPROVED">Approved</option>
          </select>
        </div>

        {loading ? (
          <p>Loading items...</p>
        ) : error ? (
          <div className="no-results">
            <h2>Unable to load items</h2>
            <p>{error}</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="no-results">
            <h2>No approved items yet</h2>
            <p>
              Approved lost and found reports will appear here.
            </p>
          </div>
        ) : (
          <div className="requests-container">
            {filteredRequests.map((request) => {
              const item = request.item;

              return (
                <div className="request-card" key={request.id}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.itemName}
                      className="item-image"
                    />
                  )}

                  <h2>{item.itemName}</h2>

                  <p>
                    <strong>Description:</strong>{" "}
                    {item.description || "Not provided"}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {item.location || "Not provided"}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {item.date || "Not provided"}
                  </p>

                  <span className="status approved">
                    APPROVED
                  </span>

                  {item.user?.email && (
                    <button
                      type="button"
                      className="contact-reporter-button"
                      onClick={() => contactReporter(item)}
                    >
                      Contact Reporter
                    </button>
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

export default Requests;