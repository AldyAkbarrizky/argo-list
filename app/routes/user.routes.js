//////////////////////////////////////////
// OLD CONFIG (MIGHT NOT BE USED AGAIN)
//////////////////////////////////////////

// module.exports = app => {
//     const users = require("../controllers/user.controller.js");
//     var router = require("express").Router();

//     // Create a new User
//     router.post("/", users.create);
//     // Retrieve all Users
//     router.get("/", users.findAll);
//     // Retrieve a single User with id
//     router.get("/:id", users.findOne);
//     // Update a User with id
//     router.put("/:id", users.update);
//     // Delete a User with id
//     router.delete("/:id", users.delete);
//     // Delete all Users
//     router.delete("/", users.deleteAll);
//     app.use('/api/users', router);
// };

////////////////////////////////////////
// NEW CONFIGURATION
////////////////////////////////////////

const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/user.controller.js");

router.post("/register", register);
router.post("/login", login);

module.exports = router;