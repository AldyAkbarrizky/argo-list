const db = require("../models");
const User = db.users;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
    createJWT,
} = require("../config/auth.config.js");

// Regular Expression for Email
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Register new User
exports.register = (req, res, next) => {
    let { username, email, password, password_confirmation } = req.body;

    // Validation
    let errors = [];
    if (!username) {
        errors.push({ username: "required" });
    }

    if (!email) {
        errors.push({ email: "required" });
    }

    if (!emailRegexp.test(email)) {
        errors.push({ email: "invalid" });
    }

    if (!password) {
        errors.push({ password: "required" });
    }

    if (!password_confirmation) {
        errors.push({
            password_confirmation: "required"
        });
    }

    if (password != password_confirmation) {
        errors.push({ password: "mismatch" });
    }

    if (errors.length > 0) {
        return res.status(422).json({ errors: errors });
    }

    User.findOne({email: email})
        .then(user => {
            if (user) {
                return res.status(422).json({ errors: [{ user: "email already exists"}] });
            } else {
                const user = new User({
                    username: username,
                    email: email,
                    password: password,
                });

                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(password, salt, function(err, hash) {
                        if (err) {
                            throw err;
                        }
                        user.password = hash;
                        user.save()
                            .then(response => {
                                res.status(200).json({
                                    success: true,
                                    result: response
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    errors: [{ error: err }]
                                });
                            });
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                errors: [{ error: 'Something went wrong' }]
            });
        })
}

exports.login = (req, res) => {
    let { email, password } = req.body;

    // Validation
    let errors = [];
    if (!email) {
        errors.push({ email: "required" });
    }

    if (!emailRegexp.test(email)) {
        errors.push({ email: "invalid email" });
    }

    if (!password) {
        errors.push({ password: "required" });
    }

    if (errors.length > 0) {
        return res.status(422).json({ errors: errors });
    }

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    errors: [{ user: "Not found" }],
                });
            } else {
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            return res.status(400).json({
                                errors: [{ password: "incorrect" }]
                            });
                        }

                        let access_token = createJWT(
                            user.email,
                            user._id,
                            3600
                        );
                        
                        jwt.verify(access_token, process.env.TOKEN_SECRET, (err, decoded) => {
                            if (err) {
                                res.status(500).json({
                                    errors: err,
                                    message: "Failed to verify jwt"
                                });
                            }
                            if (decoded) {
                                return res.status(200).json({
                                    success: true,
                                    token: access_token,
                                    message: user
                                });
                            }
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            errors: err,
                            message: "Failed comparing",
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({
                errors: err,
                message: "Failed find user"
            });
        });
}

//////////////////////////////////////////////
// OLD CONTROLLERS (MIGHT NOT WORKS ANYMORE)
// NOT DELETED FOR FUTURE REFERENCES
//////////////////////////////////////////////
// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body.username) {
        res.status(400).send({ message: "Username can not be empty!" });
        return;
    }

    // Create a User
    const user = new User({
        username: req.body.username
    });

    // Save User in the database
    user
        .save(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating new User."
            });
        });
};

// Retrieve all Users from the database
exports.findAll = (req, res) => {
    User.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            })
        })
};

// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Not found User with id " + id });
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error retrieving User with id = " + id
            });
        });
};

// Update a User by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id;
    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update User with id = ${id}. Maybe User was not found!` 
                });
            } else {
                res.send({ message: "User was updated successfully!" });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error updating User with id = " + id
            });
        });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    User.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete User with id = ${id}. Maybe User was not found!` 
                });
            } else {
                res.send({ message: "User was deleted successfully!" });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Could not delete User with id = " + id
            });
        });
};

// Delete all Users from the database
exports.deleteAll = (req, res) => {
    User.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Users were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all users"
            });
        });
};