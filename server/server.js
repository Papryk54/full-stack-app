// Core imports
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Session store
const MongoStore = require("connect-mongo");

// Express app initialization
const app = express();
const port = process.env.PORT || 8000;

// Database connection
mongoose.connect(
	process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/full-stack-app"
);

// Middleware
app.use(
	cors({
		origin: process.env.CLIENT_URL || "http://localhost:5173",
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use(
	session({
		secret: process.env.SESSION_SECRET || "xyz567",
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
	console.log(`App listening on port ${port}`);
});
