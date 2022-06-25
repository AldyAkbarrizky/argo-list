const db = require("../models");
const List = db.lists

// Create and Save a new List
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({ message: "Title can not be empty!" });
        return;
    }

    // Create a List
    const list = new List({
        title: req.body.title,
        description: req.body.description,
        lastRead: req.body.lastRead,
        lastChap: req.body.lastChap,
        readLink: req.body.readLink,
        _user: req.body.user_id
    });

    // Save List in the database
    list
        .save(list)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating new List."
            });
        });

};

// Retrieve all Lists from the database
exports.findAll = (req, res) => {
    List.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving lists."
            })
        })
};

// Find a single List with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    List.findById(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Not found List with id " + id });
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error retrieving List with id = " + id
            });
        });
};

// Update a List by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id;
    List.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update List with id = ${id}. Maybe List was not found!` 
                });
            } else {
                res.send({ message: "List was updated successfully!" });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error updating List with id = " + id
            });
        });
};

// Delete a List with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    List.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete List with id = ${id}. Maybe List was not found!` 
                });
            } else {
                res.send({ message: "List was deleted successfully!" });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Could not delete List with id = " + id
            });
        });
};

// Delete all Lists from the database
exports.deleteAll = (req, res) => {
    List.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Lists were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all lists"
            });
        });
};

// Find all lists from existing User
exports.findAllUserList = (req, res) => {
    const _user = req.query._user;
    var condition = _user ? { _user: { $regex: new RegExp(_user), $options: "i" } } : {};
    List.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving lists."
            })
        })
};