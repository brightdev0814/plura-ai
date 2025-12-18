const mongoose = require("mongoose");

const CallEventSchema = new mongoose.Schema({
    call_id: {
        type: String,
        index: true
    },
    call_length: Number,
    batch_id: String,

    to: String,
    from: String,

    request_data: {
        first_name: String,
        last_name: String,
        appointment_date: String,
        appointment_time: String,
        appointment_location: String,
        location_information: String,
        source_name: String,
        timezone: String
    },
    
    completed: Boolean,

    created_at: Date,
    ended_at: Date,

    start_epoch: Number,
    end_epoch: Number,

    inbound: Boolean,
    queue_status: String,
    endpoint_url: String,
    max_duration: Number,

    error_message: String,

    variables: mongoose.Schema.Types.Mixed,

    answered_by: String,
    record: Boolean,
    recording_url: String,

    c_id: String,
    call_result: String,

    concatenated_transcript: String,
    transcripts: [String],

    analytics: mongoose.Schema.Types.Mixed,
    lead_details: mongoose.Schema.Types.Mixed,
    collected_data: mongoose.Schema.Types.Mixed,
    ai_call_summary: String
}, {
    timestamps: true
});

module.exports = mongoose.model('CallEvent', CallEventSchema);