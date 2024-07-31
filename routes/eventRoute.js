const express = require("express");
const eventController = require("../controllers/eventController");

const router = express.Router({ mergeParams: true });

router.route("/createEvent").post(eventController.createEvent);
router.route("/allEvents").get(eventController.getAllEvent);
router.route("/getEvent/:eventId").get(eventController.getEvent);
router
    .route("/getEvent/:location/:keyword")
    .get(eventController.getEventParticular);

router
    .route("/getEventByPrice/:eventPrice")
    .get(eventController.getEventsbyPrice);

router
    .route("/getEventsByProps/:propsKeyword")
    .get(eventController.getEventsByProps);

router.route("/getAllEventTypes").get(eventController.getAllEventTypes);
router.route("/getAllEventIds").get(eventController.getAllEventIds);
router
    .route("/getEventByEventId/:evtId")
    .get(eventController.getEventbyEventId);
module.exports = router;