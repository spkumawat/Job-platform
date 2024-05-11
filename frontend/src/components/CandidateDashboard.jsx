import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import JobDetailModal from './JobDetailModal';
import AppliedJobsModal from './AppliedJobsModal';
import '../Design/CandidateDashboard.css';

function CandidateDashboard() {
    const [availableJobs, setAvailableJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
    const [showAppliedJobsModal, setShowAppliedJobsModal] = useState(false);
    const [appliedSuccess, setAppliedSuccess] = useState(false); // Track successful application

    const { user } = useAuth();

    useEffect(() => {
        fetchAvailableJobs();
        fetchAppliedJobs();
    }, []);

    const fetchAvailableJobs = async () => {
        try {
            const response = await axios.get('https://job-platform-tcd5.vercel.app/jobs/', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setAvailableJobs(response.data.jobs);
            setErrorMessage('');  // Clear any previous error messages if the fetch is successful
        } catch (error) {
            const message = error.response && error.response.data.error ? error.response.data.error : 'Failed to fetch available jobs';
            setErrorMessage(message);
        }
    };
    
    const fetchAppliedJobs = async () => {
        if (user == null) return;
        try {
            const response = await axios.get(`https://job-platform-tcd5.vercel.app/jobs/${user.id}/applied-jobs`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setAppliedJobs(response.data);
            setErrorMessage('');  // Clear any previous error messages
        } catch (error) {
            const message = error.response && error.response.data.error ? error.response.data.error : 'Failed to fetch applied jobs';
            setErrorMessage(message);
        }
    };
    
    const handleApply = async (jobId) => {
        try {
            await axios.post(`https://job-platform-tcd5.vercel.app/jobs/${jobId}/apply`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchAppliedJobs(); // Refresh the list of applications after applying
            setAppliedSuccess(true); // Set applied success state
            setTimeout(() => setAppliedSuccess(false), 3000); // Clear success message after 3 seconds
            setErrorMessage('');  // Clear any previous error messages
        } catch (error) {
            const message = error.response && error.response.data.error ? error.response.data.error : 'Failed to apply to job';
            setErrorMessage(message);
        }
    };
    
    const viewJobDetails = (job) => {
        setSelectedJob(job);
        setShowJobDetailsModal(true);
    };

    return (
        <div>
            <h1>Candidate Dashboard</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {appliedSuccess && <p className="success-message">You have applied successfully...</p>}
            <button onClick={() => {
                setShowAppliedJobsModal(true);
                fetchAppliedJobs();  // Ensure the latest applied jobs are fetched each time the modal is opened
            }}>View Applied Jobs</button>
            <h2>Available Jobs</h2>

            <ul className="job-list">
                {availableJobs.length > 0 && availableJobs.map(job => (
                    <li key={job._id}>
                        {job.title} - {job.salary} $/yrs.
                        <div>
                            <button className="apply-button" onClick={() => handleApply(job._id)}>Apply</button>
                            <button className="view-details-button" onClick={() => viewJobDetails(job)}>View Details</button>
                        </div>
                    </li>
                ))}
            </ul>

            {showJobDetailsModal && selectedJob && (
                <JobDetailModal
                    job={selectedJob}
                    onClose={() => setShowJobDetailsModal(false)}
                />
            )}
            {showAppliedJobsModal && (
                <AppliedJobsModal
                    appliedJobs={appliedJobs}
                    onClose={() => setShowAppliedJobsModal(false)}
                />
            )}
        </div>
    );
}

export default CandidateDashboard;
