import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaQuestionCircle,
  FaClipboardCheck,
  FaPlusCircle,
  FaHome,
  FaUsers,
  FaTachometerAlt,
} from "react-icons/fa";
import PageHeader from "../../Components/PageHeader";

const Dashboard = () => {
  return (
    <div className="container mt-4 fade-in-up">
      <PageHeader 
        title="📊 மேலாளர் குழு" 
        subtitle="அட்மின் பேனல்" 
        icon={FaTachometerAlt}
      />
      
      <div className="row justify-content-center g-4">
        {/* home page */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-custom border-0 h-100 slide-in-right">
            <div className="card-body text-center">
              <FaHome size={50} className="text-warning mb-3" />
              <h5 className="card-title fw-bold">🏠 முகப்பு பக்கம்</h5>
              <p className="card-text text-muted">முகப்பு பக்கத்திற்கு செல்லுங்கள்</p>
              <Link to="/" className="btn btn-warning btn-lg w-100">
                முகப்பு பக்கம்
              </Link>
            </div>
          </div>
        </div>
        
        {/* Questions */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-custom border-0 h-100 slide-in-right">
            <div className="card-body text-center">
              <FaQuestionCircle size={50} className="text-primary mb-3" />
              <h5 className="card-title fw-bold">கேள்விகளை பார்க்க</h5>
              <p className="card-text">உங்கள் கேள்விகளையும் பார்வையிடுங்கள்.</p>
              <Link to="/admin/questions" className="btn btn-primary btn-lg w-100">
                பார்க்க
              </Link>
            </div>
          </div>
        </div>

        {/* Evaluation */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-custom border-0 h-100 slide-in-right">
            <div className="card-body text-center">
              <FaClipboardCheck size={50} className="text-success mb-3" />
              <h5 className="card-title fw-bold">பதில் மதிப்பீடு</h5>
              <p className="card-text">பதில்களை மதிப்பீடு செய்யவும்.</p>
              <Link to="/admin/evaluation" className="btn btn-success btn-lg w-100">
                மதிப்பீடு செய்ய
              </Link>
            </div>
          </div>
        </div>

        {/* add participants */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-custom border-0 h-100 slide-in-right">
            <div className="card-body text-center">
              <FaUsers size={50} className="text-info mb-3" />
              <h5 className="card-title fw-bold">பங்கேற்பாளர்களைச் சேர்க்கவும்</h5>
              <p className="card-text">பங்கேற்பாளர்களைச் சேர்க்கவும்.</p>
              <Link
                to="/admin/addparticipants"
                className="btn btn-info btn-lg w-100"
              >
                பங்கேற்பாளர்களைச் சேர்க்க
              </Link>
            </div>
          </div>
        </div>

        {/* Add Questions */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-custom border-0 h-100 slide-in-right">
            <div className="card-body text-center">
              <FaPlusCircle size={50} className="text-danger mb-3" />
              <h5 className="card-title fw-bold">கேள்விகளை சேர்க்க</h5>
              <p className="card-text">புதிய கேள்விகளை உள்ளிடவும்.</p>
              <Link to="/admin/addquiz" className="btn btn-danger btn-lg w-100">
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
