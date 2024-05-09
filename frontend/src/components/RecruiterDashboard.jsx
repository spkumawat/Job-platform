import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';

function RecruiterDashboard() {
    const [jobs, setJobs] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchJobs();
    }, []);

    // Function to fetch all jobs posted by the recruiter
    const fetchJobs = async () => {
        try {
            const response = await axios.get('http://localhost:4000/jobs', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setJobs(response.data.jobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    // Function to fetch applicants for a specific job
    const fetchApplicants = async (jobId) => {
        try {
            const response = await axios.get(`http://localhost:4000/jobs/${jobId}/applicants`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setApplicants(response.data.applicants);
            setSelectedJob(jobs.find(job => job._id === jobId));
        } catch (error) {
            console.error('Error fetching applicants:', error);
        }
    };

    return (
        <div>
            <h1>Recruiter Dashboard</h1>
            <h2>Posted Jobs</h2>
            <ul>
                {jobs.map(job => (
                    <li key={job._id} onClick={() => fetchApplicants(job._id)}>
                        {job.title}
                    </li>
                ))}
            </ul>

            {selectedJob && (
                <div>
                    <h3>Applicants for {selectedJob.title}</h3>
                    <ul>
                        {applicants.length > 0 ? (
                            applicants.map(applicant => (
                                <li key={applicant._id}>{applicant.name}</li>
                            ))
                        ) : (
                            <p>No applicants yet.</p>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default RecruiterDashboard;
