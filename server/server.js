// Core imports
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");

// Session store
const MongoStore = require("connect-mongo");

// Express app initialization
const app = express();
const port = 8000;

// Database connection
mongoose.connect("mongodb://127.0.0.1:27017/full-stack-app");

// Middleware: request body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware: session configuration
app.use(
	session({
		secret: "xyz567",
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ client: mongoose.connection.getClient() }),
		cookie: {
			secure: process.env.NODE_ENV == "production",
		},
	})
);

// Routes
app.use("/ads", require("./routes/ads.routes"));
app.use("/auth", require("./routes/auth.routes"));
app.use("/users", require("./routes/users.routes"));

// Base route
app.get("/", (req, res) => {
	res.send("Hello World!");
});

// Server start
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});