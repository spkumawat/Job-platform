// src/components/JobList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Design/JobList.css'

function JobList() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4000/jobs')
            .then(response => setJobs(response.data.jobs))
            .catch(error => console.error('Error fetching jobs:', error));
    }, []);

    return (
        <div>
            <h1>Job Listings</h1>
            <ul>
                {jobs.map(job => (
                    <li key={job._id}>{job.title} - {job.description}</li>
                ))}
            </ul>
        </div>
    );
}

export default JobList;
