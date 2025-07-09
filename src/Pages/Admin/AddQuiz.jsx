import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import app from "../../DB/Firebase.js"; // Ensure Firebase configuration is correct
import { FaArrowLeft, FaSpinner, FaCheckCircle } from "react-icons/fa";
import Toastify, { showToast } from "../../Components/notify/Toastify.jsx";
const db = getFirestore(app);

const AddQuiz = () => {
  const [questionNumber, setQuestionNumber] = useState(""); // New state for question number
  const [question, setQuestion] = useState(
    "எல்லாப் புகழும் அல்லாஹ்வுக்கே உரியது; அவனே வானங்களையும், பூமியையும் படைத்தான்; இருள்களையும், ஒளியையும் உண்டாக்கினான்; அதன் பின்னரும், நிராகரிப்பவர்கள் தம் இறைவனுக்கு(ப் பிற பொருட்களைச்) சமமாக்குகின்றனர்."
  );
  const [Aththiyayam, setAththiyayam] = useState("3:2-10,அல்லாஹ்");
  const [answer, setAnswer] = useState(
    "அவன்தான் உங்களைக் களிமண்ணிலிருந்து படைத்துப் பின்னர், (உங்களுக்கு ஒரு குறிப்பிட்ட) தவணையையும் நிர்ணயம் செய்துள்ளான்; இன்னும், (உங்களைக் கேள்வி-கணக்கிற்கு எழுப்புவதற்காக) குறிக்கப்பட்ட தவணையும் அவனிடமே உள்ளது; பின்னரும் நீங்கள் சந்தேகப்படுகிறீர்கள்."
  );
  const [scheduleTime, setScheduleTime] = useState(getDefaultScheduleTime()); // Default 6:30 PM
  const [resultTime, setResultTime] = useState(getDefaultResultTime()); // Default 9:30 PM
  const [loading, setLoading] = useState(false); // State to handle loading

  function convert24to12(time24) {
    const [Date, time12] = time24.split("T");
    const [hours, minutes] = time12.split(":");
    let hoursInt = parseInt(hours, 10); // Parse hours as an integer
    const minutesStr = minutes;

    const amPm = hoursInt < 12 || hoursInt === 24 ? "AM" : "PM";
    hoursInt = hoursInt % 12 || 12; // Handle midnight (0 or 24) and midday (12)

    return `${Date} , ${hoursInt}:${minutesStr} ${amPm}`;
  }

  function getDefaultScheduleTime() {
    const today = new Date();
    const DefaultTimeSet = "18:30"; // Set to 6:30 PM
    return today.toISOString().slice(0, 11) + DefaultTimeSet;
  }

  function getDefaultResultTime() {
    const today = new Date();
    const DefaultTimeSet = "21:30"; // Set to 9:30 PM
    return today.toISOString().slice(0, 11) + DefaultTimeSet;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    const qnum = questionNumber.padStart(3, 0);
    console.log(qnum);

    try {
      console.log(qnum);
      await addDoc(collection(db, "quizzes"), {
        questionNumber: qnum,
        question,
        Aththiyayam,
        answer,
        scheduleTime,
        resultTime,

        createdAt: new Date().toISOString(),
      });
      showToast("கேள்வி வெற்றிகரமாக சேர்க்கப்பட்டது!", "success");
      setQuestionNumber(""); // Reset question number
      setQuestion("");
      setAththiyayam("");
      setAnswer("");
      setScheduleTime(getDefaultScheduleTime()); // Reset to default 6:30 PM
      setResultTime(getDefaultResultTime()); // Reset to default 9:30 PM
    } catch (error) {
      console.error("Error adding quiz: ", error);
      showToast("⚠️ பிழை ஏற்பட்டுள்ளது. மீண்டும் முயற்சிக்கவும்.", "error");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="container mt-4">
      <Toastify />

      <div className="text-center mb-3">
        <Link to="/admin/Dashboard" className="btn btn-secondary">
          <FaArrowLeft /> மேலாளர் பக்கம்
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow rounded p-4 bg-white">
            <h2 className="text-center mb-4">
              📌 கேள்வி சேர்க்க <FaCheckCircle />
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">🔢 கேள்வி எண்</label>
                <input
                  type="number"
                  className="form-control"
                  value={questionNumber}
                  placeholder="கேள்வி எண்ணை உள்ளிடவும் "
                  onChange={(e) => setQuestionNumber(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">🔹 கேள்வி</label>
                <textarea
                  className="form-control"
                  value={question}
                  rows="3"
                  placeholder="கேள்வியை உள்ளிடவும்"
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">
                  📖 படிக்க வேண்டிய அத்தியாயம்
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={Aththiyayam}
                  placeholder="2:1-10,அத்தியாயம் பெயர்  "
                  onChange={(e) => setAththiyayam(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">✅ சரியான பதில்</label>
                <textarea
                  type="text"
                  className="form-control"
                  rows="3"
                  value={answer}
                  placeholder="சரியான பதிலை உள்ளிடவும்"
                  onChange={(e) => setAnswer(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">
                  ⏳ கேள்வி வெளியீட்டு நேரம்
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={scheduleTime}
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  required
                />
                <span className="text-muted small">
                  {convert24to12(scheduleTime)}
                </span>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">
                  📅 முடிவு வெளியீட்டு நேரம்
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  min={new Date().toISOString().slice(0, 16)}
                  value={resultTime}
                  onChange={(e) => setResultTime(e.target.value)}
                  required
                />
                <span className="text-muted small">
                  {convert24to12(resultTime)}
                </span>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? <FaSpinner className="spin" /> : "✅ கேள்வியை சேர்"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>
        {`
          .spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AddQuiz;
