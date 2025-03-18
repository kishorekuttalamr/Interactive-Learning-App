import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PersonalDetails.css";

const BASE_URL = "http://localhost:5000"; // Change this to match your backend URL

const SUBJECT_OPTIONS = [
  "Math", "Science", "English", "History", "Geography",
  "Computer Science", "Art", "Music", "Physics", "Biology"
];

export default function PersonalDetails() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const [originalDetails, setOriginalDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const username = document.cookie
          .split("; ")
          .find((row) => row.startsWith("username="))
          ?.split("=")[1];

        const usertype = document.cookie
          .split("; ")
          .find((row) => row.startsWith("usertype="))
          ?.split("=")[1];

        if (!username) {
          console.error("Username not found in cookies");
          return;
        }

        const response = await fetch(
          `${BASE_URL}/fetch-details?username=${username}&usertype=${usertype}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        setStudentDetails(data);
        setOriginalDetails(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubjectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setStudentDetails((prevDetails) => ({
      ...prevDetails,
      selectedSubjects: selectedOptions,
    }));
  };

  const handleSave = () => {
    setShowConfirmation(true);
  };

  const confirmSave = async () => {
    try {
      const response = await fetch(`${BASE_URL}/update-user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(studentDetails),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      setOriginalDetails({ ...studentDetails });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
    setShowConfirmation(false);
  };

  const cancelSave = () => {
    setStudentDetails({ ...originalDetails });
    setIsEditing(false);
    setShowConfirmation(false);
  };

  if (!studentDetails) return <p>Loading...</p>;

  return (
    <div className="personal-details-container">
      <h2>Personal Details</h2>
      <div className="details-card">
        {Object.keys(studentDetails).map((key) => (
          key !== "_id" && key !== "selectedSubjects" ? (
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
          ) : key === "selectedSubjects" ? (
            <div className="detail-item" key={key}>
              <span className="label">Selected Subjects:</span>
              {isEditing ? (
                <select
                  multiple
                  name="selectedSubjects"
                  value={studentDetails.selectedSubjects || []}
                  onChange={handleSubjectChange}
                  className="edit-input"
                >
                  {SUBJECT_OPTIONS.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="value">
                  {studentDetails.selectedSubjects?.join(", ") || "None"}
                </span>
              )}
            </div>
          ) : null
        ))}
      </div>
      {isEditing ? (
        <button className="save-btn" onClick={handleSave}>Save Changes</button>
      ) : (
        <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Details</button>
      )}
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>

      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Changes</h3>
            <p>Are you sure you want to save these changes?</p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmSave}>Yes, Save</button>
              <button className="cancel-btn" onClick={cancelSave}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
