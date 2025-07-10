import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

const CountdownTimer = ({ time, label, variant = 'primary' }) => {
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

  const getVariantClass = () => {
    switch (variant) {
      case 'warning': return 'alert-warning';
      case 'danger': return 'alert-danger';
      case 'success': return 'alert-success';
      default: return 'alert-info';
    }
  };

  return (
    <div className={`alert ${getVariantClass()} text-center fw-bold border-radius-custom`}>
      <FontAwesomeIcon icon={faClock} className="me-2" />
      <span className="text-dark">{label}:</span>
      <div className="fs-4 mt-2 pulse-animation">
        <span className="text-danger">{formatTime(time)}</span>
      </div>
    </div>
  );
};

export default CountdownTimer;