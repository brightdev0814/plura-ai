const mongoose = require("mongoose");

const LeadLogSchema = new mongoose.Schema({
    ad_id: String,
    age: String,
    campaign_id: String,
    created_at: Date,
    credit_score: String,
    email: String,
    first_name: String,
    last_name: String,  
    phone: String,
    homeowner: String,
    insured: String,
    lead_id: String,    
    tcpa_consent: Boolean,
    vehicles: [mongoose.Schema.Types.Mixed],
    zip_code: String
}, {
    timestamps: true    
});

module.exports = mongoose.model('Lead', LeadLogSchema);