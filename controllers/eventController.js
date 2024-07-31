const Event = require('../models/eventModel');
const { ObjectId } = require('mongoose').Types;

// Controller to create a new event
exports.createEvent = async (req, res) => {
    try {
        const newEvent = await Event.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                event: newEvent,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
};

// Controller to get all events
exports.getAllEvent = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json({
            status: 'success',
            data: {
                events,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
};

// Controller to get a single event by its ID
exports.getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({
                status: 'fail',
                message: 'No event found with that ID',
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                event,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
};

// Controller to get events by location and keyword
exports.getEventParticular = async (req, res) => {
    try {
        const { location, keyword } = req.params;
        const events = await Event.find({
            location: { $regex: location, $options: 'i' },
            title: { $regex: keyword, $options: 'i' },
        });
        res.status(200).json({
            status: 'success',
            data: {
                events,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
};

// Controller to get events by price
exports.getEventsbyPrice = async (req, res) => {
    try {
        const eventPrice = req.params.eventPrice;
        const events = await Event.find({ price: eventPrice });
        res.status(200).json({
            status: 'success',
            data: {
                events,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
};

// Controller to get events by properties keyword
exports.getEventsByProps = async (req, res) => {
    try {
        const propsKeyword = req.params.propsKeyword;
        const events = await Event.find({
            properties: { $regex: propsKeyword, $options: 'i' },
        });
        res.status(200).json({
            status: 'success',
            data: {
                events,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
};

// Controller to get all event types
exports.getAllEventTypes = async (req, res) => {
    try {
        const eventTypes = await Event.distinct('type');
        res.status(200).json({
            status: 'success',
            data: {
                eventTypes,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
};

// Controller to get all event IDs
exports.getAllEventIds = async (req, res) => {
    try {
        const eventIds = await Event.find().select('_id');
        res.status(200).json({
            status: 'success',
            data: {
                eventIds,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
};

// Controller to get event by eventId
exports.getEventbyEventId = async (req, res) => {
    try {
        const event = await Event.findOne({ eventId: req.params.evtId });
        if (!event) {
            return res.status(404).json({
                status: 'fail',
                message: 'No event found with that eventId',
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                event,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
};
