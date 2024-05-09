const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    postedOn: { type: Date, default: Date.now },
    jobRole: { type: String, required: true },
    salary: {
        type: String,  
        required: false
    },
    applicants: [{
        candidate: { type: Schema.Types.ObjectId, ref: 'User' },
        appliedAt: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ['Applied', 'Reviewed', 'Interviewing', 'Offered', 'Rejected'],
            default: 'Applied'
        }
    }] 
});

// Static method to apply to a job
jobSchema.statics.applyToJob = async(jobId, candidateId) => {
    try {
        // Find the job by ID
        const job = await mongoose.model('Job').findById(jobId);
        if (!job) {
            throw new Error('Job not found');
        }

        // Check if candidate already applied
        const alreadyApplied = job.applicants.some(applicant => applicant.candidate.equals(candidateId));
        if (alreadyApplied) {
            throw new Error('Candidate has already applied to this job');
        }

        // Add candidate to applicants array
        job.applicants.push({ candidate: candidateId });
        await job.save();
        return job;
    } catch (error) {
        console.error('Error applying to job:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

// Method to update the status of an applicant
jobSchema.methods.updateApplicantStatus = async function(userId, applicantId, newStatus) {
    // Check if the user is the job poster and a recruiter
    const user = await mongoose.model('User').findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    if (user.role !== 'Recruiter' || !user._id.equals(this.postedBy)) {
        throw new Error('Only the recruiter who posted the job can update the status');
    }

    // Find the applicant in the applicants array
    const applicant = this.applicants.find(app => app.candidate.equals(applicantId));
    if (!applicant) {
        throw new Error('Applicant not found');
    }

    // Update the status
    applicant.status = newStatus;
    await this.save();
    return this;
};

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;