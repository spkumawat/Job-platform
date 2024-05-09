const mongoose = require('mongoose');
const { Schema } = mongoose;

const Job = require('./Job');

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['Recruiter', 'Candidate'] },
    jobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }]  // Array of references to Job documents
});

// Static method to create a new user
userSchema.statics.createNewUser = async function(userData) {
    try {
        // Check if email already exists
        const existingUser = await this.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('Email already exists');
        }

        // Create a new user with the provided data
        const user = new this(userData);
        await user.save(); // Save the user to the database
        return user; // Return the saved user document
    } catch (error) {
        console.error('Error creating new user:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

// Method to apply for a job and store the job's ID in the user's document
userSchema.methods.applyForJob = async function(jobId) {
    try {
        // Validate the job ID
        const job = await Job.findById(jobId);
        if (!job) {
            throw new Error('Job not found');
        }

        // Check if the user is a candidate
        if (this.role !== 'Candidate') {
            throw new Error('Only candidates can apply for jobs');
        }

        // Check if the candidate has already applied for the job
        if (this.jobs.includes(jobId)) {
            throw new Error('You have already applied to this job');
        }

        // Apply for the job using the Job model's method
        const updatedJob = await Job.applyToJob(jobId, this._id);

        // Store the job's ID in the user's 'jobs' array
        this.jobs.push(jobId);
        await this.save();

        return { updatedJob, user: this };  // Return the updated job and user data
    } catch (error) {
        console.error('Error applying for job:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

// Method to post a new job by the recruiter
userSchema.methods.postNewJob = async function(jobData) {
    try {
        // Validate that the user is a recruiter
        if (this.role !== 'Recruiter') {
            throw new Error('Only recruiters can post jobs');
        }

        // Create the new job
        const newJob = await Job.create({
            ...jobData,
            postedBy: this._id  // Set the recruiter's ID as the poster
        });

        // Optionally save the job ID to the user's jobs array
        this.jobs.push(newJob._id);
        await this.save();

        return newJob;  // Return the newly created job
    } catch (error) {
        console.error('Error posting new job:', error);
        throw error;  // Rethrow the error to be handled by the caller
    }
};


const User = mongoose.model('User', userSchema);

module.exports = User; 