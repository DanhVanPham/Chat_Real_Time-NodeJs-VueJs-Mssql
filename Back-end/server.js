const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./Routes/appRoutes.js');
const port = process.env.PORT || 8082;
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:8080", credentials: true, origin: true }));
app.use(cookieParser());

routes(app);

app.listen(port, () => {
    console.log(`Listen on port: ${port}`);
})