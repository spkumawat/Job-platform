// jobRoutes.js

const express = require('express');
const { getJobs, postJob, updateApplicantStatus, applyForJob, getApplicantsForJob, appliedJobs, JobwithRecruiter, removeJob} = require('../controllers/jobControllers');  // Ensure the path is correct
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes
router.get('/', getJobs);
router.post('/post-job', authenticateJWT,postJob);
router.put('/:jobId/applicants/:applicantId/status', authenticateJWT, updateApplicantStatus);
router.post('/:jobId/apply', authenticateJWT, applyForJob);
router.get('/:jobId/applicants', authenticateJWT, getApplicantsForJob);
router.get('/:userId/applied-jobs', authenticateJWT, appliedJobs);
router.get('/:userId/jobwithrecruiter',authenticateJWT ,  JobwithRecruiter) ;
router.delete('/:jobId/removejob',authenticateJWT , removeJob ) ;

module.exports = router;
