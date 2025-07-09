import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";
import app from "../DB/Firebase";
import Result from "../Components/Result";
import Cookies from "js-cookie";
import Toastify, { showToast } from "../Components/notify/Toastify";

const db = getFirestore(app);

const Home = () => {
  const [latestQuestion, setLatestQuestion] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [answerTime, setAnswerTime] = useState(null);
  const [resultTime, setResultTime] = useState(null);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [showAnswerButton, setshowAnswerButton] = useState(true);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState("");
  const [submittedUsers, setSubmittedUsers] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acknowledgment, setAcknowledgment] = useState("");
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const q = query(
      collection(db, "quizzes"),
      orderBy("scheduleTime", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const latestDoc = querySnapshot.docs[0];
          const latestData = latestDoc.data();
          setLatestQuestion({ id: latestDoc.id, ...latestData });

          const scheduledTime = new Date(latestData.scheduleTime);
          const resultRelease = new Date(latestData.resultTime);
          const currentTime = new Date();

          let remaining = Math.max(0, scheduledTime - currentTime);

          let answerTimeRemaining = 0;
          let resultTimeRemaining = 0;

          if (remaining === 0) {
            const answerDeadline = new Date(
              resultRelease.getTime() - 60 * 60 * 1000
            );
            if (currentTime < answerDeadline) {
              answerTimeRemaining = Math.max(0, answerDeadline - currentTime);
            } else {
              resultTimeRemaining = Math.max(0, resultRelease - currentTime);
            }
          }

          setRemainingTime(remaining);
          setAnswerTime(answerTimeRemaining);
          setResultTime(resultTimeRemaining);
        } else {
          setLatestQuestion(null);
          setRemainingTime(0);
          setAnswerTime(0);
          setResultTime(0);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching latest question:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Clean up Firestore listener
  }, []); // Run only on mount

  // 🕒 Single Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => Math.max(0, prev - 1000));
      setAnswerTime((prev) => Math.max(0, prev - 1000));
      setResultTime((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Runs only once

  // 🎯 Fetch Users When `latestQuestion` Changes
  useEffect(() => {
    if (!latestQuestion) return; // Prevent fetching if no question is available

    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        const userList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(userList);

        const submittedSet = new Set(
          userList.filter((user) => user.isAnswered).map((user) => user.name)
        );

        setSubmittedUsers(submittedSet);

        if (
          submittedSet.has(name) ||
          Cookies.get(`answered_${latestQuestion.id}`)
        ) {
          setAcknowledgment("✅ உங்கள் பதில் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!");
          showToast("உங்கள் பதில் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!", "success");

          setshowAnswerButton(false);
          setShowAnswerForm(false);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [latestQuestion]); // Fetch users only when a new question appears

  const formatTime = (ms) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const showathiyaayam = (athiyaayam) => {
    if (
      !athiyaayam ||
      !athiyaayam.includes(":") ||
      !athiyaayam.includes("-") ||
      !athiyaayam.includes(",")
    ) {
      return "குறிப்பு :  கிடைக்கவில்லை ";
    }

    try {
      const parts = athiyaayam.split(",");
      const AthiyaayamNum = parts[0].split(":")[0];
      const AthiyaayamName = parts[1];
      const vasanamRange = parts[0].split(":")[1];
      const [vasanamstart, vasanamEnd] = vasanamRange.split("-");

      return `குறிப்பு : அத்தியாயம் ${AthiyaayamNum}, ${AthiyaayamName} ${vasanamstart}ல் இருந்து ${vasanamEnd}க்குள் படிக்கவும்`;
    } catch (error) {
      return "குறிப்பு : கிடைக்கவில்லை ";
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!name || !answer) {
      showToast("முழுமையாக உள்ளிடவும்!", "error");
      return;
    }

    // Check if the user already submitted
    if (
      submittedUsers.has(name) ||
      Cookies.get(`answered_${latestQuestion.id}`)
    ) {
      setshowAnswerButton(false);
      setShowAnswerForm(false);
      setAcknowledgment("✅ உங்கள் பதில் ஏற்கனவே சமர்ப்பிக்கப்பட்டது!");
      showToast("உங்கள் பதில் ஏற்கனவே சமர்ப்பிக்கப்பட்டது!", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, `quizzes/${latestQuestion.id}/answers`), {
        name,
        answer,
        submittedAt: new Date().toISOString(),
      });

      const selectedUser = users.find((user) => user.name === name);
      if (selectedUser) {
        const userDocRef = doc(db, "users", selectedUser.id);
        await updateDoc(userDocRef, { isAnswered: true });
      }

      setSubmittedUsers((prev) => new Set([...prev, name]));

      const resultTimeDate = new Date(latestQuestion.resultTime); // Convert to Date object
      const currentTime = new Date(); // Get current time

      const expirationMilliseconds = resultTimeDate - currentTime; // Time difference in ms
      const expirationDays = expirationMilliseconds / (1000 * 60 * 60 * 24); // Convert ms to days

      if (expirationDays > 0) {
        Cookies.set(`answered_${latestQuestion.id}`, "true", {
          expires: expirationDays, // Set in days
          secure: true, // Required for HTTPS
          sameSite: "Strict",
        });

        console.log("Cookie Set! Expires in:", expirationDays, "days");
      } else {
        console.warn("Invalid expiration time, cookie not set.");
      }

      setshowAnswerButton(false);
      setAcknowledgment("✅ உங்கள் பதில் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!");
      showToast("உங்கள் பதில் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!", "success");
      setShowAnswerForm(false);
      setName("");
      setAnswer("");
    } catch (error) {
      console.error("Error submitting answer:", error);
      showToast("பிழை ஏற்பட்டுள்ளது. மீண்டும் முயற்சிக்கவும்.", "success");
    }

    setIsSubmitting(false);
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
      <h2 className="text-center">🏠 முகப்பு பக்கம்</h2>

      {loading ? (
        // Show loading spinner while the content is loading
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : latestQuestion ? (
        remainingTime > 0 ? (
          <div className="card shadow-lg border-0 p-4 text-center">
            <h4 className="fw-bold text-primary mb-3">📖 இன்றைய தகவல்</h4>
            <div className="p-2">
              <p className="text-danger fw-bold ">
                {showathiyaayam(latestQuestion.Aththiyayam)}
              </p>
            </div>
            <div className="alert alert-info mt-3 fw-bold">
              ⏳ <span className="text-dark">கேள்வி வெளியீடு:</span>{" "}
              <i className="text-danger">
                {formatTimestamp(latestQuestion.scheduleTime, "T") || ""}
              </i>
              <p className="text-dark fw-bold">
                இன்னும்{" "}
                <i className="text-danger ">{formatTime(remainingTime)}</i>{" "}
                நேரத்தில் கேள்வி கேட்கப்படும்.
              </p>
            </div>

            <blockquote className="blockquote mt-4 p-3 bg-secondary text-white rounded">
              <p className="mb-2 fw-bolder">
                “அல்லாஹ்வுடைய வீடுகளில் ஒரு வீட்டில் மக்கள் கூடி அல்லாஹ்வுடைய
                வேதத்தை ஓதி தங்களுக்கு மத்தியில் அதை ஓதிக் காட்டி, பாடம்
                படிக்கும் போது அமைதி அவர்கள் மீது இறங்காமல் இருக்காது. அவர்களை
                அருள் அரவணைத்துக் கொள்கின்றது. மலக்குகள் அவர்களைச் சூழ்ந்து
                விடுகின்றனர். குர்ஆன் ஓதும் அவர்களை அல்லாஹ் தன்னிடம் உள்ள
                மலக்குகளிடம் நினைவு கூர்கின்றான்”என்று அல்லாஹ்வின் தூதர் (ஸல்)
                அவர்கள் கூறினார்கள்.
              </p>
              <footer className="blockquote-footer text-light">
                <i>அறி : அபூஹுரைரா (ரலி), நூல் : முஸ்லிம்</i>
              </footer>
            </blockquote>
          </div>
        ) : answerTime > 0 ? (
          <div className="card mt-3 shadow-lg border-0 rounded-3">
            <div className="card-body text-center">
              <h4 className="card-title text-primary fw-bold">
                📖 இன்றைய கேள்வி
              </h4>
              <div className="card border-0 p-3 bg-light shadow-sm">
                <p className="fw-bold fs-5 mb-0">{latestQuestion.question}</p>
              </div>
              <p className="mt-3 text-danger fw-bold fs-6">
                {showathiyaayam(latestQuestion.Aththiyayam)}
              </p>
              <div className="alert alert-warning mt-3 fw-bold">
                ⏳{" "}
                <span className="text-dark">பதில் அளிக்க வேண்டிய நேரம்:</span>{" "}
                {formatTime(answerTime)}
              </div>
              {showAnswerButton && (
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => setShowAnswerForm(true)}
                >
                  ✍️ பதிலை உள்ளிடு
                </button>
              )}

              {showAnswerForm && (
                <form
                  onSubmit={handleSubmitAnswer}
                  className="mt-3 p-3 border rounded bg-light"
                >
                  <div className="mb-3">
                    <label className="form-label fw-bold">👤 பெயர்</label>
                    <select
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    >
                      <option value="">-- பெயரை தேர்வு செய்க --</option>
                      {users.map((user) => (
                        <option
                          key={user.id}
                          value={user.name}
                          disabled={submittedUsers.has(user.name)}
                        >
                          {user.name}{" "}
                          {submittedUsers.has(user.name)
                            ? "✅ (சமர்ப்பிக்கப்பட்டது)"
                            : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">✍️ பதில்</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-success w-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "⏳ சமர்ப்பிக்கப்படுகிறது..."
                        : "✅ சமர்ப்பி"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary w-50"
                      onClick={() => setShowAnswerForm(false)}
                    >
                      ❌ ரத்துசெய்
                    </button>
                  </div>
                </form>
              )}

              {acknowledgment && (
                <div className="alert alert-success mt-3">{acknowledgment}</div>
              )}
            </div>
          </div>
        ) : resultTime > 0 ? (
          <div className="card shadow-lg border-0 p-4 text-center">
            {/* <h4 className="fw-bold text-primary mb-3">📖 இன்றைய தகவல்</h4> */}

            <div className="alert alert-info mt-3 fw-bold">
              ⏳ <span className="text-dark">முடிவு வெளியீடு நேரம்:</span>{" "}
              <i className="text-danger">
                {formatTimestamp(latestQuestion.resultTime, "T") || ""}
              </i>
              <p className="text-dark fw-bold">
                இன்னும் {"  "}
                <i className="text-danger ">{formatTime(resultTime)}</i>
                {"  "}
                நேரத்தில் முடிவு வெளியிடப்படும்..
              </p>
            </div>

            <blockquote className="blockquote mt-4 p-3 bg-secondary text-white rounded">
              <p className="mb-2 fw-bolder">
                நபி (ஸல்) அவர்கள் கூறினார்கள்: குர்ஆனை ஓதுகின்ற(நல்ல)வரின்
                நிலையானது எலுமிச்சை போன்றதாகும். அதன் சுவையும் நன்று! வாசனையும்
                நன்று! (நல்லவராக இருந்து) குர்ஆன் ஓதாமல் இருப்பவர், பேரீச்சம்
                பழத்தைப் போன்றவராவார். அதன் சுவை நன்று; அதற்கு வாசனை கிடையாது.
                தீயவனாகவும் இருந்து கொண்டு குர்ஆனை ஓதி வருகின்றவனின் நிலை
                துளசிச் செடியின் நிலையை ஒத்து இருக்கின்றது. அதன் வாசனை நன்று,
                சுவையோ கசப்பு! தீமையும் செய்து கொண்டு குர்ஆனையும் ஓதாமல்
                இருப்பவனின் நிலை குமட்டிக் காயின் நிலையை ஒத்திருக்கின்றது. அதன்
                சுவையும் கசப்பு, அதற்கு வாசனையும் கிடையாது.
              </p>
              <footer className="blockquote-footer text-light">
                <i>அறி : அபூ மூஸல் அஷ்அரீ (ரலி)</i>
              </footer>
            </blockquote>
          </div>
        ) : (
          <Result latestQuestion={latestQuestion} />
        )
      ) : (
        <div className="alert alert-danger text-center mt-3">
          <b>
            இன்ஷா அல்லாஹ் <br></br> 📢 கேள்வி விரைவில் சேர்க்கப்படும்...
          </b>
        </div>
      )}
    </div>
  );
};

export default Home;
