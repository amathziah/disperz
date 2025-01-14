const express = require('express');
const Survey = require('../models/Survey');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const mongoose = require('mongoose');
router.post('/', authMiddleware('admin'), async (req, res) => {
    const { name, questions } = req.body;
    try {
        const survey = await Survey.create({ name, questions });
        res.status(201).json(survey);
    } catch (err) {
        res.status(500).json({ error: 'Error creating survey' });
    }
});

router.put('/:id/assign', authMiddleware('admin'), async (req, res) => {
    const { userIds } = req.body;
    try {
        const survey = await Survey.findById(req.params.id);
        if (survey) {
            const uniqueUserIds = [...new Set([...survey.assignedUsers, ...userIds])];
            console.log(uniqueUserIds)
            survey.assignedUsers = uniqueUserIds;

            await survey.save();
            res.json(survey);
        } else {
            res.status(404).json({ error: 'Survey not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error assigning survey' });
    }
});

router.get('/my-surveys', authMiddleware('user'), async (req, res) => {
    try {
        const surveys = await Survey.find({ assignedUsers: req.user.id });
        res.json(surveys);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching surveys' });
    }
});

router.post('/submit', authMiddleware('user'), async (req, res) => {
    const { surveyId, answers } = req.body;
    try {
        const survey = await Survey.findById(surveyId);
        
        if (!survey) {
            return res.status(404).json({ error: 'Survey not found' });
        }
        if (!survey.assignedUsers.includes(req.user.id)) {
            return res.status(403).json({ error: 'You are not authorized to submit this survey' });
        }
        const responseIndex = survey.responses.findIndex(
            (response) => response.userId.toString() === req.user.id
        );

        if (responseIndex !== -1) {
            survey.responses[responseIndex].answers = answers;
        } else {
            survey.responses.push({
                userId: req.user.id,
                answers
            });
        }

        await survey.save();
        res.json({ message: 'Survey submitted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error submitting survey answers' });
    }
});
router.get('/all', authMiddleware('admin'), async (req, res) => {
    try {
        const surveys = await Survey.find(); 
        res.json(surveys); 
    } catch (err) {
        res.status(500).json({ error: 'Error fetching surveys' });
    }
});



module.exports = router;
