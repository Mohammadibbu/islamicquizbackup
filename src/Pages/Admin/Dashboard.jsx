import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaQuestionCircle,
  FaClipboardCheck,
  FaPlusCircle,
} from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">📊 மேலாளர் குழு</h2>
      <div className="row justify-content-center">
        {/* home page */}
        <div className="col-12 col-md-4 mb-3">
          <div className="card shadow-lg border-0 h-100">
            <div className="card-body text-center">
              <FaClipboardCheck size={35} className="text-warning mb-2" />
              <h5 className="card-title">🏠 முகப்பு பக்கம்</h5>
              <p className="card-text"></p>
              <Link to="/" className="btn btn-warning w-100">
                முகப்பு பக்கம்
              </Link>
            </div>
          </div>
        </div>
        {/* Questions */}
        <div className="col-12 col-md-4 mb-3">
          <div className="card shadow-lg border-0 h-100">
            <div className="card-body text-center">
              <FaQuestionCircle size={35} className="text-primary mb-2" />
              <h5 className="card-title">கேள்விகளை பார்க்க</h5>
              <p className="card-text">உங்கள் கேள்விகளையும் பார்வையிடுங்கள்.</p>
              <Link to="/admin/questions" className="btn btn-primary w-100">
                பார்க்க
              </Link>
            </div>
          </div>
        </div>

        {/* Evaluation */}
        <div className="col-12 col-md-4 mb-3">
          <div className="card shadow-lg border-0 h-100">
            <div className="card-body text-center">
              <FaClipboardCheck size={35} className="text-success mb-2" />
              <h5 className="card-title">பதில் மதிப்பீடு</h5>
              <p className="card-text">பதில்களை மதிப்பீடு செய்யவும்.</p>
              <Link to="/admin/evaluation" className="btn btn-success w-100">
                மதிப்பீடு செய்ய
              </Link>
            </div>
          </div>
        </div>

        {/* add participants */}
        <div className="col-12 col-md-4 mb-3">
          <div className="card shadow-lg border-0 h-100">
            <div className="card-body text-center">
              <FaClipboardCheck size={35} className="text-success mb-2" />
              <h5 className="card-title">பங்கேற்பாளர்களைச் சேர்க்கவும்</h5>
              <p className="card-text">பங்கேற்பாளர்களைச் சேர்க்கவும்.</p>
              <Link
                to="/admin/addparticipants"
                className="btn btn-success w-100"
              >
                பங்கேற்பாளர்களைச் சேர்க்க
              </Link>
            </div>
          </div>
        </div>

        {/* Add Questions */}
        <div className="col-12 col-md-4 mb-3">
          <div className="card shadow-lg border-0 h-100">
            <div className="card-body text-center">
              <FaPlusCircle size={35} className="text-danger mb-2" />
              <h5 className="card-title">கேள்விகளை சேர்க்க</h5>
              <p className="card-text">புதிய கேள்விகளை உள்ளிடவும்.</p>
              <Link to="/admin/addquiz" className="btn btn-danger w-100">
                சேர்க்க
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
