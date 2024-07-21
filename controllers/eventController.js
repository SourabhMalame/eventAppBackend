const Event = require("../models/eventModel");
const NodeCache = require('node-cache');
const nodeCache = new NodeCache();

exports.createEvent = async (req, res, next) => {
  const event = await Event.create(req.body);

  if (!event) {
    res.status(404).json({
      status: "Error",
      message: "Not able to create event",
    });
  }

  res.status(200).json({
    status: "success",
    data: event,
  });
};

exports.getAllEvent = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 21;
    const keyword = req.query.keyword || '';
    const category = req.query.category || 'all';
    const skip = (page - 1) * limit;

   // console.log(`Page: ${page}, Limit: ${limit}, Keyword: ${keyword}, Category: ${category}`);

    let filter = {};
    switch (category.toLowerCase()) {
      case "location":
        filter = { location: { $regex: keyword, $options: "i" } };
        break;
      case "699":
        filter = { ticketprice: { $lte: parseInt(keyword) } }; // Use keyword instead of category for price
        break;
      case "adventure":
      case "events":
      case "plays":
      case "sports":
      case "activities":
        filter = { eventType: category }; // Use category for eventType
        break;
      case "all":
      default:
        break;
    }

    // Create a unique cache key based on query parameters
    const cacheKey = `events_${page}_${limit}_${keyword}_${category}`;
    const cachedData = nodeCache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({
        status: "success From NodeCache",
        length: JSON.parse(cachedData).length,
        page,
        totalPages: Math.ceil(JSON.parse(cachedData).length / limit),
        data: JSON.parse(cachedData)
      });
    }

    const [events, totalCount] = await Promise.all([
      Event.find(filter).skip(skip).limit(limit),
      Event.countDocuments(filter)
    ]);

    if (!events || events.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No events found",
      });
    }

    const totalPages = Math.ceil(totalCount / limit);

    // Cache the result
    nodeCache.set(cacheKey, JSON.stringify(events), 600);

    res.status(200).json({
      status: "success",
      length: events.length,
      page,
      totalPages,
      data: events
    });

  } catch (err) {
    console.error('Error retrieving events:', err);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve events",
      reason: err.message,
    });
  }
};

exports.getEvent = async (req, res, next) => {
  const { eventId } = req.params;
  const id = eventId.split("=")[1];

  const cacheKey = `event_${id}`;
  const cachedData = nodeCache.get(cacheKey);

  if (cachedData) {
    return res.status(200).json({
      status: "success From NodeCache",
      message: "Data Fetched Successfully",
      data: JSON.parse(cachedData),
    });
  }

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        status: "Error",
        message: "Error while fetching info",
      });
    }

    nodeCache.set(cacheKey, JSON.stringify(event), 600); // TTL in seconds

    res.status(200).json({
      status: "success",
      message: "Data Fetched Successfully",
      data: event,
    });
  } catch (err) {
    console.error('Error retrieving event:', err);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve event",
      reason: err.message,
    });
  }
};

exports.getEventParticular = async function (req, res, next) {
  const { location, keyword } = req.params;
  const cacheKey = `eventParticular_${location}_${keyword}`;
  const cachedData = nodeCache.get(cacheKey);

  if (cachedData) {
    return res.status(200).json({
      status: "success From NodeCache",
      message: "Data Fetched Successfully",
      data: JSON.parse(cachedData),
    });
  }

  try {
    const event = await Event.find({
      $and: [
        { location: { $regex: location, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });

    if (!event) {
      return res.status(404).json({
        status: "Error",
        message: "Error while fetching info",
      });
    }

    nodeCache.set(cacheKey, JSON.stringify(event), 600); // TTL in seconds

    res.status(200).json({
      status: "success",
      message: "Data Fetched Successfully",
      data: event,
    });
  } catch (err) {
    console.error('Error retrieving event:', err);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve event",
      reason: err.message,
    });
  }
};

exports.getEventsbyLocation = async function (req, res, next) {
  const { eventlocation } = req.params;
  const cacheKey = `eventsByLocation_${eventlocation}`;
  const cachedData = nodeCache.get(cacheKey);

  if (cachedData) {
    return res.status(200).json({
      status: "success From NodeCache",
      message: "Data Fetched Successfully",
      data: JSON.parse(cachedData),
    });
  }

  try {
    const event = await Event.find({
      Categories: { $regex: eventlocation, $options: "i" },
    });

    if (!event) {
      return res.status(404).json({
        status: "Error",
        message: "Error while fetching info",
      });
    }

    nodeCache.set(cacheKey, JSON.stringify(event), 600); // TTL in seconds

    res.status(200).json({
      status: "success",
      message: "Data Fetched Successfully",
      data: event,
    });
  } catch (err) {
    console.error('Error retrieving events by location:', err);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve events",
      reason: err.message,
    });
  }
};

exports.getEventsbyPrice = async function (req, res, next) {
  try {
    const { eventPrice } = req.params;
    const price = parseInt(eventPrice, 10);
    if (isNaN(price)) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid price parameter",
      });
    }

    const cacheKey = `eventsByPrice_${price}`;
    const cachedData = nodeCache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({
        status: "success From NodeCache",
        message: "Data Fetched Successfully",
        length: JSON.parse(cachedData).length,
        data: JSON.parse(cachedData),
      });
    }

    const events = await Event.find({
      ticketprice: { $lte: price },
    });

    if (events.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: "No events found within the specified price range",
      });
    }

    nodeCache.set(cacheKey, JSON.stringify(events), 600); // TTL in seconds

    res.status(200).json({
      status: "success",
      message: "Data Fetched Successfully",
      length: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Error while fetching info",
      error: error.message,
    });
  }
};

exports.getEventsByProps = async function (req, res, next) {
  const { propsKeyword } = req.params;
  const { category } = req.query;
  const cacheKey = `eventsByProps_${propsKeyword}_${category}`;
  const cachedData = nodeCache.get(cacheKey);

  if (cachedData) {
    return res.status(200).json({
      status: "success From NodeCache",
      message: "Data Fetched Successfully",
      data: JSON.parse(cachedData),
    });
  }

  try {
    let event = [];
    switch (category) {
      case "location":
        event = await Event.find({
          location: { $regex: propsKeyword, $options: "i" },
        });
        break;
      case "699":
        event = await Event.find({
          ticketprice: { $lte: parseInt(propsKeyword) },
        });
        break;
      case "all":
        event = await Event.find().skip(0).limit(15);
        break;
      case "Adventure":
        event = await Event.find({
          eventType: propsKeyword,
        });
        break;
    }

    if (!event) {
      return res.status(404).json({
        status: "Error",
        message: "Error while fetching info",
      });
    }

    nodeCache.set(cacheKey, JSON.stringify(event), 600); // TTL in seconds

    res.status(200).json({
      status: "success",
      message: "Data Fetched Successfully",
      data: event,
    });
  } catch (err) {
    console.error('Error retrieving events by props:', err);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve events",
      reason: err.message,
    });
  }
};

exports.getAllEventTypes = async function (req, res, next) {
  const EventTypes = await Event.distinct("eventType");
  if (!EventTypes) {
    return res.status(400).json({
      status: "Error",
      message: "Error While Fetching info",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Data Fetched Successfully",
    data: EventTypes,
  });
};

exports.getAllEventIds = async function (req, res, next) {
  const cacheKey = 'allEventIds';
  const cachedData = nodeCache.get(cacheKey);

  if (cachedData) {
    return res.status(200).json({
      status: "success From NodeCache",
      message: "Data Fetched Successfully",
      data: JSON.parse(cachedData),
    });
  }

  try {
    const EventIds = await Event.find({}, { _id: 1 });
    if (!EventIds || EventIds.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: "No events found",
      });
    }

    // Cache the result with a TTL of 600 seconds (10 minutes)
    nodeCache.set(cacheKey, JSON.stringify(EventIds), 600);

    res.status(200).json({
      status: "success",
      message: "Data Fetched Successfully",
      data: EventIds,
    });
  } catch (err) {
    console.error('Error retrieving event IDs:', err);
    res.status(500).json({
      status: "Error",
      message: "Error While Fetching info",
      reason: err.message,
    });
  }
};

exports.getEventbyEventId = async function (req, res, next) {
  const { evtId } = req.params;
  const cacheKey = `event_${evtId}`;

  // Check if data is cached
  const cachedData = nodeCache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({
      status: "success From NodeCache",
      data: JSON.parse(cachedData),
    });
  }

  try {
    // Fetch data from database
    const event = await Event.findById(evtId);
    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    // Cache the result with a TTL of 600 seconds (10 minutes)
    nodeCache.set(cacheKey, JSON.stringify(event), 600);

    res.status(200).json({
      status: "success",
      data: event,
    });
  } catch (err) {
    console.error('Error retrieving event by ID:', err);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve event",
      reason: err.message,
    });
  }
};




