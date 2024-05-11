const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Ensure the path to your User model is correct
const Job = require('../models/Job'); 

const postJob = async (req, res) => {
    console.log('called for post');
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
    console.log('caleld for update');
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
        console.log({ message: 'Failed to update applicant status', error: error.message })
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
        //     .skip((page - 1) * limit)  // Skip the previous pages' items
        //     .limit(limit)  // Limit the number of items
        //     .exec();

        res.status(200).json({
            totalPages: Math.ceil(totalJobs / 1),
            currentPage: page,
            jobs
        });
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch jobs', error: error.message });
    }
};

async function JobwithRecruiter(req, res) {
    const { userId } = req.params;

    try {
        const jobs = await Job.find();
        const filteredJobs = jobs.filter(job => job.postedBy.toString() === userId);
        return res.status(200).json(filteredJobs);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function removeJob(req, res) {
    const { jobId } = req.params;
    console.log("before");

    console.log(jobId);
    console.log("after");
    try {
        // Assuming Job is your Mongoose model
        console.log("first");
        await Job.findOneAndDelete({ _id: jobId });
        console.log("second");
        
        return res.status(200).json({ message: 'Job removed successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}






const getApplicantsForJob = async (req, res) => {
    const { jobId } = req.params;
    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        if (!job.postedBy.equals(req.user.id)) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        // Step 1: Gather basic applicant data
        const applicantsBasicData = job.applicants.map(app => ({
            candidateId: app.candidate,
            status: app.status
        }));

        // Step 2: Enrich the data with usernames
        const applicantsEnrichedData = await Promise.all(applicantsBasicData.map(async app => {
            const user = await User.findById(app.candidateId);
            return {
                candidateId: app.candidateId,
                username: user ? user.username : "Username not found",
                status: app.status
            };
        }));

        res.json({ applicants: applicantsEnrichedData });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Route to get all jobs a user has applied for with their status
const appliedJobs =  async (req, res) => {
    console.log("called");
    
    const { userId } = req.params;

    try {
        // Ensure the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Find all jobs where this user is listed as an applicant
        const jobsWithStatus = await Job.find({
            'applicants.candidate': userId
        }).populate('postedBy', 'username'); // Populate the poster's username if needed

        // Transform data to return the job name, role, and the user's specific application status
        const results = jobsWithStatus.map(job => {
            const application = job.applicants.find(app => app.candidate.toString() === userId);
            return {
                jobId: job._id,
                jobName: job.title,
                jobRole: job.jobRole,
                status: application.status
            };
        });

        res.json(results);
    } catch (error) {
        console.error("Failed to fetch user's applied jobs:", error);
        res.status(500).send({ error: 'Failed to fetch applied jobs' });
    }
};


module.exports = {
    getJobs,
    postJob,
    applyForJob,
    updateApplicantStatus,
    getApplicantsForJob,
    appliedJobs,
    JobwithRecruiter,
    removeJob
};
