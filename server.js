const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();

// app
const app = express();

// middlewares
var corsOptions = {
    origin: "http://localhost:8081"
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// database
const db = require("./app/models");
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

// routes
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Argo List" });
})
require("./app/routes/list.routes")(app);
authRoutes = require("./app/routes/user.routes");
app.use('/api/users', authRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})