// JobDetailsModal.jsx
import React from 'react';
// import '../Design/JobDetailModal.css'

function JobDetailsModal({ job, onClose }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{job.title}</h2>
                <p><strong>Role:</strong> {job.jobRole}</p>
                <p><strong>Description:</strong> {job.description}</p>
                <p><strong>Salary:</strong> ${job.salary}</p>
            </div>
        </div>
    );
}

export default JobDetailsModal;
