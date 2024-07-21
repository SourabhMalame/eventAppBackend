const Profile = require("../models/profileModel");

exports.createAddressProfile = async (req, res, next) => {
  try {
    const profile = await Profile.create(req.body);

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: "Profile not created",
      });
    }

    res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateAddressProfile = async (req, res, next) => {
  try {
    const { id, addressType } = req.params; // Extract the profile ID and address type from the URL parameters
    const addressData = req.body; // The address data to update

    // Find the profile by ID and update the specific address type
    const profile = await Profile.findByIdAndUpdate(
      id,
      { [`addresses.${addressType}`]: addressData },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
