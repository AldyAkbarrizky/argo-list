module.exports = app => {
    const lists = require("../controllers/list.controller.js");
    var router = require("express").Router();

    // Create a new List
    router.post("/", lists.create);
    // Retrieve all Lists
    router.get("/", lists.findAll);
    // Retrieve all Lists with user id
    router.get("/:_user", lists.findAllUserList);
    // Retrieve a single List with id
    router.get("/:id", lists.findOne);
    // Update a List with id
    router.put("/:id", lists.update);
    // Delete a List with id
    router.delete("/:id", lists.delete);
    // Delete all Lists
    router.delete("/", lists.deleteAll);
    app.use('/api/lists', router);
};