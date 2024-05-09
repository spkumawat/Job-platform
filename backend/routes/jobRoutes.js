// jobRoutes.js

const express = require('express');
const { getJobs, postJob, updateApplicantStatus, applyForJob, getApplicantsForJob } = require('../controllers/jobControllers');  // Ensure the path is correct
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes
router.get('/', getJobs);
router.post('/post-job', authenticateJWT,postJob);
router.put('/:jobId/applicants/:applicantId/status', authenticateJWT, updateApplicantStatus);
router.post('/:jobId/apply', authenticateJWT, applyForJob);
router.get('/:jobId/applicants', authenticateJWT, getApplicantsForJob);

module.exports = router;
