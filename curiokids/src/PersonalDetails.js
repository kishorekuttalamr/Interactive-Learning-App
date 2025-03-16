import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PersonalDetails.css"; // Import the CSS file for styling

export default function PersonalDetails() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [studentDetails, setStudentDetails] = useState({
    name: "Kishore Kuttalam",
    email: "kishore@example.com",
    dob: "2000-01-01",
    address: "123 Main St, City, Country",
    phone: "+1234567890",
    parentName: "Parent Name",
    parentEmail: "parent@example.com",
  });
  const [originalDetails, setOriginalDetails] = useState({ ...studentDetails });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setOriginalDetails({ ...studentDetails }); // Store the current data as original
    setShowConfirmation(true); // Show the confirmation modal
  };

  const confirmSave = () => {
    setIsEditing(false);
    setShowConfirmation(false); // Hide the confirmation modal
    // Here you would typically also make an API call to save the changes
  };

  const cancelSave = () => {
    setStudentDetails({ ...originalDetails }); // Revert to the original data
    setIsEditing(false);
    setShowConfirmation(false); // Hide the confirmation modal
  };

  return (
    <div className="personal-details-container">
      <h2>Personal Details</h2>
      <div className="details-card">
        {Object.keys(studentDetails).map((key) => (
          <div className="detail-item" key={key}>
            <span className="label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
            {isEditing ? (
              <input
                type="text"
                name={key}
                value={studentDetails[key]}
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              <span className="value">{studentDetails[key]}</span>
            )}
          </div>
        ))}
      </div>
      {isEditing ? (
        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
      ) : (
        <button className="edit-btn" onClick={() => setIsEditing(true)}>
          Edit Details
        </button>
      )}
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Changes</h3>
            <p>Are you sure you want to save these changes?</p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmSave}>
                Yes, Save
              </button>
              <button className="cancel-btn" onClick={cancelSave}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
