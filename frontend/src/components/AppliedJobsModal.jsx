// AppliedJobsModal.jsx
import React from 'react';

function AppliedJobsModal({ appliedJobs, onClose }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Applied Jobs</h2>
                <ul>
                    {appliedJobs && appliedJobs.length > 0 && appliedJobs.map(job => (
                        <li key={job.jobId}>
                            {job.jobName} : {job.jobRole} : {job.status}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AppliedJobsModal;
