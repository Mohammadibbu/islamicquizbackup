import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import app from "../../DB/Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faEye,
  faArrowLeft,
  faSpinner,
  faClock,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import Fullview from "../../Components/Fullview";
import Toastify, { showToast } from "../../Components/notify/Toastify.jsx";

const db = getFirestore(app);

const Evaluate = () => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [latestQuestionId, setLatestQuestionId] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [resultTime, setResultTime] = useState("");
  const [issubmit, setissubmit] = useState(true);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const q = query(
          collection(db, "quizzes"),
          orderBy("scheduleTime", "desc"),
          limit(1)
        );
        const quizSnapshot = await getDocs(q);

        if (!quizSnapshot.empty) {
          const questionId = quizSnapshot.docs[0].id;
          setLatestQuestionId(questionId);

          const quizData = quizSnapshot.docs[0].data();
          if (quizData.resultTime) {
            setResultTime(quizData.resultTime);
          }

          const answersQuery = query(
            collection(db, `quizzes/${questionId}/answers`)
          );
          const answersSnapshot = await getDocs(answersQuery);
          const answersList = answersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAnswers(answersList);
        } else {
          setAnswers([]);
        }
      } catch (error) {
        console.error("Error fetching answers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, []);

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
  const handleEvaluation = async (id, isCorrect) => {
    setEvaluating(true);
    try {
      const answerRef = doc(db, `quizzes/${latestQuestionId}/answers`, id);
      await updateDoc(answerRef, { isCorrect });

      setAnswers((prevAnswers) =>
        prevAnswers.map((ans) => (ans.id === id ? { ...ans, isCorrect } : ans))
      );
    } catch (error) {
      console.error("Error updating answer:", error);
    } finally {
      setEvaluating(false);
    }
  };

  const handleUpdateResultTime = async () => {
    setissubmit(false);
    if (!resultTime) {
      showToast(" முடிவு நேரத்தை தேர்வு செய்யவும்!", "error");
      setissubmit(true);

      return;
    }

    try {
      const quizRef = doc(db, "quizzes", latestQuestionId);
      await updateDoc(quizRef, { resultTime });

      showToast(" முடிவு நேரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!", "success");
      setissubmit(true);
    } catch (error) {
      console.error("Error updating result time:", error);
    }
  };

  return (
    <div className="container mt-4">
      <Toastify />
      <div className="text-center mb-3">
        <Link to="/admin/Dashboard" className="btn btn-secondary">
          <FontAwesomeIcon icon={faArrowLeft} /> மேலாளர் பக்கம்
        </Link>
      </div>
      <h2 className="text-center">📊 பதில்களை மதிப்பீடு செய்க</h2>

      {/* Result Time Update Section */}
      {latestQuestionId && (
        <div className="card p-3 mt-3 shadow">
          <h5 className="mb-3">⏳ முடிவு வெளியீடு நேரம் அமைக்க</h5>
          <p className="text-muted small">
            முடிவு வெளியீடு நேரம் :{formatTimestamp(resultTime, "DT")}
          </p>
          <div className="input-group">
            <input
              type="datetime-local"
              className="form-control"
              value={resultTime}
              onChange={(e) => setResultTime(e.target.value)}
            />

            {issubmit ? (
              <button
                className="btn btn-primary"
                onClick={handleUpdateResultTime}
              >
                <FontAwesomeIcon icon={faSave} /> சேமிக்க
              </button>
            ) : (
              <button className="btn btn-primary" disabled>
                <FontAwesomeIcon icon={faSave} /> சேமிக்க...
              </button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center mt-3">
          <FontAwesomeIcon icon={faSpinner} spin /> பதிவுகளை ஏற்றுகிறது...
        </p>
      ) : answers.length === 0 ? (
        <div className="alert alert-warning text-center mt-3">
          📢 இதுவரை பதில்கள் இல்லை.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered mt-3">
            <thead className="table-dark">
              <tr>
                <th>👤 பெயர்</th>
                <th>✍️ பதில்</th>
                <th>✅ சரி / ❌ தவறு</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((ans) => (
                <tr key={ans.id}>
                  <td>{ans.name}</td>
                  <td>
                    {ans.answer.length > 25 ? (
                      <span
                        className="text-primary fw-bold"
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedQuestion(ans.answer)}
                      >
                        {ans.answer.substring(0, 25)}...{" "}
                        <FontAwesomeIcon icon={faEye} />
                      </span>
                    ) : (
                      ans.answer
                    )}
                  </td>
                  <td>
                    {ans.isCorrect === true ? (
                      <span className="text-success fw-bold">
                        <FontAwesomeIcon icon={faCheck} /> சரியானது
                      </span>
                    ) : ans.isCorrect === false ? (
                      <span className="text-danger fw-bold">
                        <FontAwesomeIcon icon={faTimes} /> தவறானது
                      </span>
                    ) : (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleEvaluation(ans.id, true)}
                          disabled={evaluating}
                        >
                          <FontAwesomeIcon icon={faCheck} /> சரி
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleEvaluation(ans.id, false)}
                          disabled={evaluating}
                        >
                          <FontAwesomeIcon icon={faTimes} /> தவறு
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal for Full Question View */}
      {selectedQuestion && (
        <Fullview set={setSelectedQuestion} content={selectedQuestion} />
      )}
    </div>
  );
};

export default Evaluate;
<h1></h1>;
