const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
    name: { type: String, required: true },
    questions: [
        {
            type: { type: String, enum: ['text', 'rating'], required: true },
            question: { type: String, required: true },
        },
    ],
    assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    responses: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            answers: [{ type: mongoose.Schema.Types.Mixed }],
        },
    ],
});

module.exports = mongoose.model('Survey', surveySchema);
