import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import app from "../DB/Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faTrophy,
  faThumbtack,
  faCheckCircle,
  faTimesCircle,
  faHourglassHalf,
  faClock,
  faUser,
  faMedal,
} from "@fortawesome/free-solid-svg-icons";
import Fullview from "../Components/Fullview";
import styles from "./resulcomponent.module.css";

const db = getFirestore(app);

const Result = ({ latestQuestion }) => {
  const [answers, setAnswers] = useState([]);
  const [correctUsers, setCorrectUsers] = useState([]);
  const [wrongUsers, setWrongUsers] = useState([]);
  const [noAnswerUsers, setNoAnswerUsers] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionAskedTime, setQuestionAskedTime] = useState(""); // New state for question asked time
  const [resultDeclaredTime, setResultDeclaredTime] = useState(""); // New state for result declared time

  const resetIsAnswered = async () => {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    snapshot.forEach(async (userDoc) => {
      const userRef = doc(db, "users", userDoc.id);
      await updateDoc(userRef, { isAnswered: false });
    });
    console.log("All users' isAnswered field set to false.");
  };

  useEffect(() => {
    resetIsAnswered();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!latestQuestion) return;

      try {
        const quizDoc = await getDoc(doc(db, "quizzes", latestQuestion.id));

        if (quizDoc.exists()) {
          setQuestionText(quizDoc.data().question || "கேள்வி கிடைக்கவில்லை");
          setCorrectAnswer(quizDoc.data().answer || "பதில் இல்லை");
          setQuestionAskedTime(
            formatTimestamp(quizDoc.data().scheduleTime, "DT") || "N/A"
          ); // Set question asked time
          setResultDeclaredTime(
            formatTimestamp(quizDoc.data().resultTime, "DT") || "N/A"
          ); // // Set result declared time
        }

        const answersRef = collection(
          db,
          `quizzes/${latestQuestion.id}/answers`
        );
        const answersSnapshot = await getDocs(answersRef);
        const fetchedAnswers = answersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAnswers(fetchedAnswers);

        const correct = [];
        const wrong = [];
        const allParticipants = fetchedAnswers.map((entry) => entry.name);

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
            return `${D}/${Month}/${Year} ${String(hours).padStart(
              2,
              "0"
            )}:${String(minutes).padStart(2, "0")} ${ampm}`;
          }

          if (datetortime === "T") {
            return ` ${String(hours).padStart(2, "0")}:${String(
              minutes
            ).padStart(2, "0")} ${ampm}`;
          }
          return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}:${String(seconds).padStart(2, "0")} ${ampm}`;
        }

        fetchedAnswers.forEach((entry) => {
          if (entry.isCorrect === true) {
            correct.push({
              name: entry.name,
              time: formatTimestamp(entry.submittedAt) || "N/A",
              userAnswer: entry.answer || "-",
            });
          } else if (entry.isCorrect === false) {
            wrong.push({
              name: entry.name,
              time: formatTimestamp(entry.submittedAt) || "N/A",
              userAnswer: entry.answer || "-",
            });
          }
        });

        correct.sort((a, b) => (a.time > b.time ? 1 : -1));

        const registeredUsersRef = collection(db, "users");
        const registeredUsersSnapshot = await getDocs(registeredUsersRef);
        const allUsers = registeredUsersSnapshot.docs.map(
          (doc) => doc.data().name
        );
        const noAnswer = allUsers.filter(
          (user) => !allParticipants.includes(user)
        );

        setCorrectUsers(correct);
        setWrongUsers(wrong);
        setNoAnswerUsers(noAnswer);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchResults();
  }, [latestQuestion]);

  return (
    <div className="card mt-4 shadow-lg border-0 rounded-3">
      <div className="card-body text-center">
        {/* Title Section */}
        <h4 className="card-title fw-bold text-dark d-flex align-items-center justify-content-center">
          <FontAwesomeIcon icon={faTrophy} className="me-2 text-warning fs-2" />
          <span className="text-uppercase"> முடிவு வெளியிடப்பட்டது</span>
          <FontAwesomeIcon icon={faTrophy} className="me-2 text-warning fs-2" />
        </h4>
        {/* Time Section - Horizontal Layout */}
        <div className="mt-3 table-responsive m-auto fw-bolder">
          <table className="table table-success table-bordered">
            <tbody>
              <tr>
                <th className="table-light">கேள்வி எண்</th>
                <td>{latestQuestion.questionNumber}</td>
              </tr>
              <tr>
                <th className="table-light">கேள்வி கேட்கபட்ட நேரம்</th>
                <td>{questionAskedTime}</td>
              </tr>
              <tr>
                <th className="table-light">முடிவு வெளியிட்ட நேரம்</th>
                <td>{resultDeclaredTime}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Question & Answer Section */}
        <div className="alert alert-light border rounded-4 shadow-sm mt-4 p-4">
          <h5 className="fw-bold text-dark d-flex align-items-center justify-content-center">
            <FontAwesomeIcon
              icon={faThumbtack}
              className="me-2 text-danger fs-4"
            />
            <span className="text-secondary">கேள்வி:</span>
            <span className="text-primary ms-2">{questionText}</span>
          </h5>

          <h6 className="fw-bold mt-3 d-flex align-items-center justify-content-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="me-2 text-success fs-4"
            />
            <span className="text-dark">சரியான பதில்:</span>
            <span className="text-success ms-2">{correctAnswer}</span>
          </h6>
        </div>
        <div className="table-responsive mt-3">
          <table className="table table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>
                  <FontAwesomeIcon icon={faUser} /> பெயர்
                </th>
                <th>
                  <FontAwesomeIcon icon={faThumbtack} /> பதில்
                </th>
                <th>
                  <FontAwesomeIcon icon={faClock} /> பதிலளித்த நேரம்
                </th>
                <th>
                  <FontAwesomeIcon icon={faThumbtack} /> நிலை
                </th>
              </tr>
            </thead>
            <tbody>
              {correctUsers.map((user, index) => (
                <tr
                  key={index}
                  className={`table-success ${
                    index < 3 ? styles.winnerAnimation : ""
                  }`}
                >
                  <td>{index + 1}</td>
                  <td>
                    {index === 0 ? (
                      <FontAwesomeIcon
                        icon={faMedal}
                        className="text-warning"
                      />
                    ) : index === 1 ? (
                      <FontAwesomeIcon
                        icon={faMedal}
                        className="text-secondary"
                      />
                    ) : index === 2 ? (
                      <FontAwesomeIcon icon={faMedal} className="text-orange" />
                    ) : (
                      ""
                    )}{" "}
                    {user.name}
                  </td>
                  <td>
                    {user.userAnswer.length > 7 ? (
                      <span
                        className="text-primary fw-bold"
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedQuestion(user.userAnswer)}
                      >
                        {user.userAnswer.substring(0, 5)}...{" "}
                        <FontAwesomeIcon icon={faEye} />
                      </span>
                    ) : (
                      user.userAnswer || (
                        <span className="text-danger fw-bold">
                          பதில் சேர்க்கப்படவில்லை
                        </span>
                      )
                    )}
                  </td>
                  <td>{user.time}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-success"
                    />{" "}
                    சரியான பதில்
                  </td>
                </tr>
              ))}

              {wrongUsers.map((user, index) => (
                <tr key={index} className="table-danger">
                  <td>{correctUsers.length + index + 1}</td>
                  <td>{user.name}</td>
                  <td>
                    {user.userAnswer.length > 7 ? (
                      <span
                        className="text-primary fw-bold"
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedQuestion(user.userAnswer)}
                      >
                        <s className="text-danger fw-bold">
                          {user.userAnswer.substring(0, 5)}...{" "}
                          <FontAwesomeIcon icon={faEye} />
                        </s>
                      </span>
                    ) : (
                      (
                        <s className="text-danger fw-bold">{user.userAnswer}</s>
                      ) || (
                        <span className="text-danger fw-bold">
                          பதில் சேர்க்கப்படவில்லை
                        </span>
                      )
                    )}
                  </td>
                  <td>{user.time}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="text-danger"
                    />{" "}
                    தவறான பதில்
                  </td>
                </tr>
              ))}

              {noAnswerUsers.map((name, index) => (
                <tr key={index} className="table-warning">
                  <td>{correctUsers.length + wrongUsers.length + index + 1}</td>
                  <td>{name}</td>
                  <td>--</td>
                  <td>--</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faHourglassHalf}
                      className="text-warning"
                    />{" "}
                    பதில் அளிக்கவில்லை
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedQuestion && (
        <Fullview set={setSelectedQuestion} content={selectedQuestion} />
      )}
    </div>
  );
};

export default Result;
