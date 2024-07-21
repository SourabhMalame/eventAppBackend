const Organiser = require("../models/organiserModel");

exports.createOrganiser = async (req, res, next) => {
  try {
    const account = await Organiser.create(req.body);

    if (!account) {
      return res.status(400).json({
        status: "error",
        message: "Something went wrong.",
      });
    }
    res.status(200).json({
      status: "success",
      data: account,
      message: "Organiser created successfully",
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.updateData = async (req, res, next) => {
  try {
    const account = await Organiser.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!account) {
      return res.status(400).json({
        status: "error",
        message: "Something went wrong",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Data updated sucessfully",
      data: account,
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err.messgae,
    });
  }
};
