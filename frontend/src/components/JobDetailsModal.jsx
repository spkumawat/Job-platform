import React from 'react';
import '../Design/JobDetailsModal.css';
function JobDetailsModal({ job, onClose, onAccept, onReject }) {
    // Filter applicants to only include those whose status is "Applied"
    const filteredApplicants = job.applicants.filter(applicant => applicant.status === "Applied");

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{job.title}</h2>
                <p><strong>Role:</strong> {job.jobRole}</p>
                <p><strong>Description:</strong> {job.description}</p>
                <h3>Applicants:</h3>
                <ul>
                    {filteredApplicants.length > 0 ? filteredApplicants.map(applicant => (
                        <li key={applicant.candidateId}>
                            {applicant.username}
                            <button className="accept" onClick={() => onAccept(applicant.candidateId)}>Accept</button>

                            <button onClick={() => onReject(applicant.candidateId)}>Reject</button>
                        </li>
                    )) : <li>No applicants currently applied.</li>}
                </ul>
            </div>
        </div>
    );
}

export default JobDetailsModal;