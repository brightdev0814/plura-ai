const CallEvent = require("../models/CallEvent");

const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const normalizeEvent = (event) => ({
    ...event,
    created_at: event.created_at ? new Date(event.created_at) : undefined,
    ended_at: event.ended_at ? new Date(event.ended_at) : undefined,
});

const create = async (req, res) => {
    try {
        const payload = req.body;

        // ---- CASE 1: Array payload (createMany) ----
        if (Array.isArray(payload)) {
            if (!payload.length) {
                return res.status(400).json({
                    success: false,
                    message: "Payload array is empty",
                });
            }

            const events = payload.map(normalizeEvent);

            const result = await CallEvent.insertMany(events, {
                ordered: false, // continue inserting even if one fails
            });

            return res.status(201).json({
                success: true,
                insertedCount: result.length,
                ids: result.map((doc) => doc._id),
            });
        }

        // ---- CASE 2: Single object payload ----
        if (typeof payload === "object" && payload !== null) {
            const event = await CallEvent.create(normalizeEvent(payload));

            return res.status(201).json({
                success: true,
                id: event._id,
            });
        }

        // ---- INVALID PAYLOAD ----
        return res.status(400).json({
            success: false,
            message: "Invalid payload format",
        });

    } catch (err) {
        console.error("Create CallEvent error:", err);

        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

const fetch = async (req, res) => {
    try {
        const { search = "", startDate, endDate, page = 1, limit = 10 } = req.query;
        const query = {
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            },
            $or: [{
                call_id: {
                    $regex: escapeRegex(search),
                    $options: "i"
                }
            }, {
                "request_data.first_name": {
                    $regex: escapeRegex(search),
                    $options: "i"
                }
            }, {
                "request_data.last_name": {
                    $regex: escapeRegex(search),
                    $options: "i"
                }
            }, {
                answered_by: {
                    $regex: escapeRegex(search),
                    $options: "i"
                }
            }]
        };

        const events = await CallEvent.find(query).sort({ created_at: 1 }).skip((page - 1) * limit).limit(Number(limit));
        const total = await CallEvent.countDocuments(query);

        res.json({
            status: true,
            events,
            total
        })
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        })
    }
}

const fetchById = async (req, res) => {

}

module.exports = {
    create,
    fetch
};