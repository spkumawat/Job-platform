import React from 'react';
import axios from 'axios';
import '../Design/JobPostingModal.css'

function JobPostingModal({ onClose, userToken, refreshJobs, postedBy }) {
    // Define the handlePostJob function inside the component to access props
    const handlePostJob = async (event) => {
        event.preventDefault();
        const { title, description, jobRole, salary } = event.target.elements;
        
        try {
            console.log('going in for posting');
            await axios.post('http://localhost:4000/jobs/post-job', {
                title: title.value,
                description: description.value,
                jobRole: jobRole.value,
                salary: salary.value,
                postedBy: postedBy  // Use recruiter ID passed as a prop
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            refreshJobs();  // Refresh job list
            onClose();  // Close modal
        } catch (error) {
            console.error('Error posting job:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Post a New Job</h2>
                <form onSubmit={handlePostJob}>
                    <label htmlFor="jobTitle">Job Title:</label>
                    <input id="jobTitle" name="title" required />

                    <label htmlFor="jobDescription">Description:</label>
                    <textarea id="jobDescription" name="description" required />

                    <label htmlFor="jobRole">Job Role:</label>
                    <input id="jobRole" name="jobRole" required />

                    <label htmlFor="salary">Salary:</label>
                    <input id="salary" name="salary" type="number" required />

                    <button type="submit">Post Job</button>
                </form>
            </div>
        </div>
    );
}

export default JobPostingModal;
