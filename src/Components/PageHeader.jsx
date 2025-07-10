import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const PageHeader = ({ title, subtitle, backLink, backText = "மேலாளர் பக்கம்", icon }) => {
  return (
    <div className="fade-in-up">
      {backLink && (
        <div className="text-center mb-4">
          <Link to={backLink} className="btn btn-secondary">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            {backText}
          </Link>
        </div>
      )}
      
      <div className="text-center mb-4">
        {icon && (
          <div className="mb-3">
            <FontAwesomeIcon icon={icon} className="text-primary" size="3x" />
          </div>
        )}
        <h1 className="text-gradient display-4 mb-2">{title}</h1>
        {subtitle && (
          <p className="text-muted fs-5">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;