const express = require('express');
const axios = require("axios");


const createApp = () => {
    const app = express();

    //
    // HTTP GET route we can use to check if the service is handling requests.
    //
    app.get("/live", (req, res) => {
        res.sendStatus(200);
    });

    //
    // HTTP GET route that streams video to the user's browser.
    //
    app.get("/api/video", async (req, res) => {

        const response = await axios({ // Forwards the request to the video-streaming microservice.
            method: "GET",
            url: `http://video-streaming/video?id=${req.query.id}`, 
            data: req, 
            responseType: "stream",
        });
        response.data.pipe(res);
    });

    //
    // HTTP POST route to upload video from the user's browser.
    //
    app.post("/api/upload", async (req, res) => {

        const response = await axios({ // Forwards the request to the video-uploader microservice.
            method: "POST",
            url: "http://video-uploader/upload", 
            data: req, 
            responseType: "stream",
            headers: {
                "content-type": req.headers["content-type"],
                "file-name": req.headers["file-name"],
            },
        });
        response.data.pipe(res);
    });

    return app;
};

module.exports = createApp;