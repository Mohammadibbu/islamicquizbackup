import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import app from "../../DB/Firebase";
import { Link } from "react-router-dom";
import Toastify, { showToast } from "../../Components/notify/Toastify.jsx";

const db = getFirestore(app);

const AddParticipant = () => {
  const [name, setName] = useState("");
  const [participants, setParticipants] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  // Fetch participants from Firestore
  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const participantList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setParticipants(participantList);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  // Add a new participant
  const handleAddParticipant = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("பெயரை உள்ளிடவும்!", "error");

      return;
    }

    try {
      await addDoc(collection(db, "users"), {
        name: name.trim(),
        registeredAt: new Date().toISOString(),
      });

      showToast("பங்கேற்பாளர் சேர்க்கப்பட்டது!", "success");
      setName("");
      fetchParticipants();
    } catch (error) {
      console.error("Error adding participant:", error);
      showToast("பிழை ஏற்பட்டுள்ளது. மீண்டும் முயற்சிக்கவும்.", "error");
    }
  };

  // Delete a participant
  const handleDelete = async (id) => {
    if (window.confirm("நீக்க விரும்புகிறீர்களா?")) {
      try {
        await deleteDoc(doc(db, "users", id));
        showToast("பங்கேற்பாளர் நீக்கப்பட்டது!", "success");
        fetchParticipants();
      } catch (error) {
        console.error("Error deleting participant:", error);
      }
    }
  };

  // Enable edit mode
  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setEditName(currentName);
  };

  // Update participant name
  const handleUpdate = async () => {
    if (!editName.trim()) {
      showToast("பங்கேற்பாளர் பெயரை உள்ளிடவும்!", "warning");

      return;
    }

    try {
      const participantRef = doc(db, "users", editingId);
      await updateDoc(participantRef, { name: editName.trim() });

      showToast(" பெயர் மாற்றப்பட்டது!", "success");
      setEditingId(null);
      setEditName("");
      fetchParticipants();
    } catch (error) {
      console.error("Error updating participant:", error);
    }
  };

  return (
    <div className="container mt-4">
      <Toastify />
      <h2 className="text-center">👤 பங்கேற்பாளர் மேலாண்மை</h2>

      {/* Go Back to Dashboard */}
      <div className="text-center mt-3">
        <Link to="/admin/dashboard" className="btn btn-secondary">
          ⬅️ மேலாளர் பக்கம்
        </Link>
      </div>

      {/* Add Participant Form */}
      <form
        onSubmit={handleAddParticipant}
        className="mt-3 p-3 border rounded bg-light shadow-lg"
      >
        <div className="mb-3">
          <label className="form-label">📌 பெயர்</label>
          <input
            type="text"
            className="form-control"
            value={name}
            placeholder="பங்கேற்பாளர் பெயரை உள்ளிடவும்"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          ➕ பங்கேற்பாளர் சேர்க்க
        </button>
      </form>

      {/* Participants List Table */}
      <div className="mt-4">
        <h3>📋 பங்கேற்பாளர்கள் பட்டியல்</h3>
        <table className="table table-bordered table-striped text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>📌 பெயர்</th>
              <th>🔧 செயல்கள்</th>
            </tr>
          </thead>
          <tbody>
            {participants.length > 0 ? (
              participants.map((participant, index) => (
                <tr key={participant.id}>
                  <td>{index + 1}</td>
                  <td>
                    {editingId === participant.id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      participant.name
                    )}
                  </td>
                  <td>
                    {editingId === participant.id ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={handleUpdate}
                        >
                          ✅ சேமி
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingId(null)}
                        >
                          ❌ ரத்துசெய்
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() =>
                            handleEdit(participant.id, participant.name)
                          }
                        >
                          ✏️ திருத்து
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(participant.id)}
                        >
                          🗑️ நீக்கு
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">📌 பங்கேற்பாளர்கள் இல்லை</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Go Back to Dashboard */}
      <div className="text-center mt-3">
        <Link to="/admin/dashboard" className="btn btn-secondary">
          ⬅️ மேலாளர் பக்கம்
        </Link>
      </div>
    </div>
  );
};

export default AddParticipant;
