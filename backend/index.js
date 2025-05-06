const express = require("express");
const app = express();
const connectToDB = require("./src/config/connectToDB");
const cookieParser = require("cookie-parser");
const router = require("./src/routes");

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
	res.send("Hello World!");
});
app.use('/api/v1', router);
connectToDB();

app.listen(8081, () => {
	console.log("Server is running on port 8081");
});
