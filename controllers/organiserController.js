const Organiser = require('../models/organiserModel');
const Account = require('../models/accountModel');

// Middleware to check if the user is authenticated
// exports.protect = async (req, res, next) => {
//     try {
//         // Assume req.user is populated by an authentication middleware
//         if (!req.user) {
//             return res.status(401).json({
//                 status: 'fail',
//                 message: 'You are not logged in!',
//             });
//         }
//         // Attach user to the request object
//         req.user = await Account.findById(req.user.id);
//         if (!req.user) {
//             return res.status(401).json({
//                 status: 'fail',
//                 message: 'User not found!',
//             });
//         }
//         next();
//     } catch (error) {
//         res.status(500).json({
//             status: 'fail',
//             message: error.message,
//         });
//     }
// };

// Controller to create a new organiser
exports.createOrganiser = async (req, res) => {
    try {
        // Ensure req.user is available and authenticated
        if (!req.user) {
            return res.status(401).json({
                status: 'fail',
                message: 'You must be logged in to create an organiser',
            });
        }

        // Create a new organiser
        const newOrganiser = await Organiser.create({
            ...req.body,
            accountId: req.user.id, // Link the organiser to the current user
        });

        res.status(201).json({
            status: 'success',
            data: {
                organiser: newOrganiser,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
};

// Controller to update organiser data
exports.updateData = async (req, res) => {
    try {
        // Ensure req.user is available and authenticated
        if (!req.user) {
            return res.status(401).json({
                status: 'fail',
                message: 'You must be logged in to update an organiser',
            });
        }

        const { id } = req.params;
        const updatedOrganiser = await Organiser.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedOrganiser) {
            return res.status(404).json({
                status: 'fail',
                message: 'Organiser not found',
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                organiser: updatedOrganiser,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
};
