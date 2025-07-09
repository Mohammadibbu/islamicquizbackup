import React from "react";

/* Modal for Full Question View */

const Fullview = ({ set, content }) => {
  return (
    <div className="modal fade show d-block bg-dark bg-opacity-50">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">📌 முழு விவரம்</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => set(null)}
            ></button>
          </div>
          <div className="modal-body">
            <p className="fw-bold">{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fullview;
