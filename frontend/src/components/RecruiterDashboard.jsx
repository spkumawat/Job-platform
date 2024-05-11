import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import  JobPostingModal  from './JobPostingModal';
import JobDetailsModal from './JobDetailsModal';
import '../Design/RecruiterDashboard.css';

function RecruiterDashboard() {

    const [jobs, setJobs] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    
    const { user } = useAuth();
    // const { token } = useAuth();

    useEffect(() => {

        console.log(user);
        fetchJobs();
    }, []);

    // Function to fetch all jobs posted by the recruiter
    const fetchJobs = async () => {
       
        try {
            const response = await axios.get(`http://localhost:4000/jobs/${user.id}/jobwithrecruiter`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            setJobs(response.data);
            console.log(response.data);
            // console.log(user);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchApplicants = async (jobId) => {
        try {
            const response = await axios.get(`http://localhost:4000/jobs/${jobId}/applicants`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const job = jobs.find(job => job._id === jobId);
            if (job) {
                setSelectedJob({ ...job, applicants: response.data.applicants });
                setShowDetailsModal(true);
            }
        } catch (error) {
            console.error('Error fetching applicants:', error);
        }
    };

    const handleAccept = async (candidateId) => {
        const jobId = selectedJob._id; // Ensure selectedJob is available in the scope
        try {
            console.log(`http://localhost:4000/jobs/${jobId}/applicants/${candidateId}/status`);
            const response = await axios.put(`http://localhost:4000/jobs/${jobId}/applicants/${candidateId}/status`, {
                newStatus: 'Accepted'
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            console.log("Accepted", candidateId, response.data);
            fetchApplicants(jobId);  // Refresh the applicants list after updating status
        } catch (error) {
            console.error('Error accepting applicant:', error);
        }
    };
    
    const handleReject = async (candidateId) => {
        const jobId = selectedJob._id; // Ensure selectedJob is available in the scope
        try {
            const response = await axios.put(`http://localhost:4000/jobs/${jobId}/applicants/${candidateId}/status`, {
                newStatus: 'Rejected'
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            console.log("Rejected", candidateId, response.data);
            fetchApplicants(jobId);  // Refresh the applicants list after updating status
        } catch (error) {
            console.error('Error rejecting applicant:', error);
        }
    };

    const handleDelete = async (e, jobId) => {
        try {
            e.stopPropagation(); // Corrected method name
            
            await axios.delete(`http://localhost:4000/jobs/${jobId}/removejob`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // Remove the deleted job from the local state
            setJobs(jobs.filter(job => job._id !== jobId));
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };
    

    

    return (
        <div style={{marginTop:"100px"}}>
            <h1>Recruiter Dashboard</h1>
            <button onClick={() => setShowModal(true)}>Post New Job</button>
            {showModal && (
                <JobPostingModal
                    onClose={() => setShowModal(false)}
                    userToken={user.token}
                    refreshJobs={fetchJobs}
                    postedBy={user._id}  // Passing the recruiter's ID
                />
            )}

            <h2>Posted Jobs</h2>
            <ul>
                {jobs.map(job => (
                    <li key={job._id} onClick={() => fetchApplicants(job._id)}>
                        {job.title}
                        <button onClick={(e) => handleDelete(e, job._id)}>Remove</button>
                    </li>
                ))}
            </ul>

            {showDetailsModal && selectedJob && (
                <JobDetailsModal
                    job={selectedJob}
                    onClose={() => setShowDetailsModal(false)}
                    onAccept={handleAccept}
                    onReject={handleReject}
                />
            )}
        </div>
    );
}

export default RecruiterDashboard;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/authContext';

// function RecruiterDashboard() {
//     const [jobs, setJobs] = useState([]);
//     const [showModal, setShowModal] = useState(false);  // State to control modal visibility
//     const { user } = useAuth();

//     useEffect(() => {
//         fetchJobs();
//     }, []);

//     const fetchJobs = async () => {
//         try {
//             const response = await axios.get('http://localhost:4000/jobs', {
//                 headers: { Authorization: `Bearer ${user.token}` }
//             });
//             setJobs(response.data.jobs);
//         } catch (error) {
//             console.error('Error fetching jobs:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>Recruiter Dashboard</h1>
//             <button onClick={() => setShowModal(true)}>Post a New Job</button>  {/* Button to show modal */}
//             {showModal && <JobPostingModal onClose={() => setShowModal(false)} />}  {/* Modal component */}
//             <h2>Posted Jobs</h2>
//             <ul>
//                 {jobs.map(job => (
//                     <li key={job.id}>{job.title}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default RecruiterDashboard;
