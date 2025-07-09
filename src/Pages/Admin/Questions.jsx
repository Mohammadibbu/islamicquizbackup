import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import app from "../../DB/Firebase";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEye,
  faEdit,
  faArrowLeft,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Fullview from "../../Components/Fullview";
import Toastify, { showToast } from "../../Components/notify/Toastify.jsx";
const db = getFirestore(app);

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [editAnswer, setEditAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "quizzes"));
        const questionsArray = querySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          number: index + 1,
          ...doc.data(),
        }));
        setQuestions(questionsArray);
      } catch (error) {
        console.error("Error fetching questions: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("இந்த கேள்வியை நீக்க விரும்புகிறீர்களா?")) {
      try {
        await deleteDoc(doc(db, "quizzes", id));
        setQuestions(questions.filter((q) => q.id !== id));
        showToast("வெற்றிகரமாக நீக்கப்பட்டது ", "success");
      } catch (error) {
        console.error("Error deleting question: ", error);
      }
    }
  };

  const handleEdit = (id, currentAnswer) => {
    setEditingId(id);
    setEditAnswer(currentAnswer || "");
  };

  const handleUpdateAnswer = async () => {
    if (!editingId) return;
    try {
      await updateDoc(doc(db, "quizzes", editingId), {
        answer: editAnswer,
      });
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === editingId ? { ...q, answer: editAnswer } : q
        )
      );
      setEditingId(null);
      setEditAnswer("");
      showToast(" பதில் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!", "success");
    } catch (error) {
      console.error("Error updating answer: ", error);
      showToast("⚠️ பிழை! மீண்டும் முயற்சிக்கவும்.", "error");
    }
  };
  function formatTimestamp(timestamp, datetortime) {
    const date = new Date(timestamp);
    const D = date.getDate();
    const Month = date.getMonth() + 1;
    const Year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    if (datetortime === "DT") {
      return `${D}/${Month}/${Year} ${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")} ${ampm}`;
    }

    if (datetortime === "T") {
      return ` ${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )} ${ampm}`;
    }
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")} ${ampm}`;
  }
  return (
    <div className="container mt-4">
      <Toastify />

      <div className="text-center mb-3">
        <Link to="/admin/Dashboard" className="btn btn-secondary">
          <FontAwesomeIcon icon={faArrowLeft} /> மேலாளர் பக்கம்
        </Link>
      </div>
      <h2 className="text-center mb-3">📜 கேள்விகள் பட்டியல்</h2>

      <p className="text-end fw-bold">
        📌 மொத்த கேள்விகள்:{" "}
        <span style={{ color: "green" }}>{questions.length}</span>
      </p>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>கேள்வி எண்</th>
              <th>கேள்வி</th>
              <th>அத்தியாயம்</th>
              <th>வெளியீட்டு நேரம்</th>
              <th>கேள்வி தேதி</th>
              <th>பதில்</th>
              <th>நீக்கு</th>
              <th>பதிலைப் புதுப்பிக்க</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center">
                  <FontAwesomeIcon icon={faSpinner} spin /> பதிவுகளை
                  ஏற்றுகிறது...
                </td>
              </tr>
            ) : questions.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center text-danger fw-bold">
                  ❌ எதுவும் கிடைக்கவில்லை!
                </td>
              </tr>
            ) : (
              questions.map((q) => (
                <tr key={q.id}>
                  <td className="fw-bold">{q.number}</td>
                  <td className="fw-bold">{q.questionNumber}</td>
                  <td>
                    {q.question.length > 10 ? (
                      <span
                        className="text-primary fw-bold"
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedQuestion(q.question)}
                      >
                        {q.question.substring(0, 10)}...{" "}
                        <FontAwesomeIcon icon={faEye} />
                      </span>
                    ) : (
                      q.question
                    )}
                  </td>
                  <td>{q.Aththiyayam || "-"}</td>
                  <td>
                    {q.scheduleTime
                      ? formatTimestamp(q.scheduleTime, "T")
                      : "-"}
                  </td>
                  <td>
                    {q.createdAt
                      ? new Date(q.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {q.answer.length > 10 ? (
                      <span
                        className="text-primary fw-bold"
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedQuestion(q.answer)}
                      >
                        {q.answer.substring(0, 10)}...{" "}
                        <FontAwesomeIcon icon={faEye} />
                      </span>
                    ) : (
                      q.answer || (
                        <span className="text-danger fw-bold">
                          பதில் இன்னும் சேர்க்கப்படவில்லை
                        </span>
                      )
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(q.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(q.id, q.answer)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Full Question View */}

      {selectedQuestion && (
        <Fullview set={setSelectedQuestion} content={selectedQuestion} />
      )}

      {/* Modal for Editing Answer */}
      {editingId && (
        <div className="modal fade show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">✍️ பதிலைத் திருத்த</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingId(null)}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="3"
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  placeholder="புதிய பதிலை உள்ளிடவும்"
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={handleUpdateAnswer}
                >
                  ✅ புதுப்பிக்க
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingId(null)}
                >
                  ரத்து செய்
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;
