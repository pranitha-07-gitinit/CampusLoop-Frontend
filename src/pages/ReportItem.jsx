import { useState } from "react";
import "./ReportItem.css";
import Navbar from "../components/Navbar";

function ReportItem() {
  const user = JSON.parse(
    localStorage.getItem("campusloopUser")
  );

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setImage("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login before reporting an item.");
      window.location.href = "/login";
      return;
    }

    const requestData = {
      item: {
        itemName: itemName,
        description: description,
        location: location,
        date: date,
        image: image
      },
      requester: {
        id: user.id
      }
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestData)
        }
      );

      if (response.ok) {
        alert("Lost item reported successfully!");

        setItemName("");
        setDescription("");
        setLocation("");
        setDate("");
        setImage("");
      } else {
        const message = await response.text();
        console.error(message);
        alert("Failed to submit the report.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Unable to connect to the backend.");
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />

        <div className="report-page">
          <div className="report-box">
            <h1>Login Required</h1>

            <p className="subtitle">
              Please login to report a lost item.
            </p>

            <button
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="report-page">
        <div className="report-box">
          <h1>Report Lost Item</h1>

          <p className="subtitle">
            Enter the details of the item you lost.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Item Name</label>

            <input
              type="text"
              placeholder="Example: Blue Water Bottle"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />

            <label>Description</label>

            <textarea
              placeholder="Describe the item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <label>Location</label>

            <input
              type="text"
              placeholder="Example: College Canteen"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />

            <label>Date Lost</label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
                alt="Preview"
                className="image-preview"
              />
            )}

            <button type="submit">
              Submit Report
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ReportItem;