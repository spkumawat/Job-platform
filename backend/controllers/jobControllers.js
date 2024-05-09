const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Ensure the path to your User model is correct
const Job = require('../models/Job'); 

const postJob = async (req, res) => {
    const userId = req.user.id;  // Corrected from req.user.userId to req.user.id

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Check for recruiter role
        if (user.role !== 'Recruiter') {
            return res.status(403).send({ message: 'Unauthorized: Only recruiters can post jobs' });
        }

        // Attempt to post a new job
        const newJob = await user.postNewJob(req.body);
        res.status(201).send({ message: 'Job posted successfully', job: newJob });
    } catch (error) {
        res.status(500).send({ message: 'Error posting job', error: error.message });
    }
};

const updateApplicantStatus = async (req, res) => {
    const { jobId, applicantId } = req.params;
    const userId = req.user.id;  // This assumes your JWT auth middleware attaches user info to req.user
    const { newStatus } = req.body;  // The new status to be set for the applicant

    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).send({ message: 'Job not found' });
        }

        // Call the method to update applicant status
        await job.updateApplicantStatus(userId, applicantId, newStatus);
        res.status(200).send({ message: 'Applicant status updated successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to update applicant status', error: error.message });
    }
};

const applyForJob = async (req, res) => {
    const { jobId } = req.params;
    const userId = req.user.id;  // Assuming your authentication middleware adds this

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        const job = await user.applyForJob(jobId);
        res.status(200).send({ message: 'Application successful', job });
    } catch (error) {
        res.status(500).send({ message: 'Failed to apply for job', error: error.message });
    }
};

const getJobs = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;  // Default page number is 1 and limit is 10

    try {
        const totalJobs = await Job.countDocuments(); // Get the total number of jobs
        const jobs = await Job.find()
            .skip((page - 1) * limit)  // Skip the previous pages' items
            .limit(limit)  // Limit the number of items
            .exec();

        res.status(200).json({
            totalPages: Math.ceil(totalJobs / limit),
            currentPage: page,
            jobs
        });
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch jobs', error: error.message });
    }
};

const getApplicantsForJob = async (req, res) => {
    const { jobId } = req.params;
    try {
        const job = await Job.findById(jobId).populate('applicants').exec();
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Optionally, ensure that the requester is authorized to view the applicants
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        res.json({ applicants: job.applicants });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getJobs,
    postJob,
    applyForJob,
    updateApplicantStatus,
    getApplicantsForJob
};
