const express = require('express');


const createApp = (s3, bucket) => {
    const app = express();

    //
    // HTTP GET route we can use to check if the service is handling requests.
    //
    app.get("/live", (req, res) => {
        res.sendStatus(200);
    });

    // Define a route to stream the video
    app.get('/video', (req, res) => {
        const videoPath = req.query.path;
        console.log(`Streaming video from path ${videoPath}.`);

        // Create a read stream from S3 object
        const stream = s3.getObject({ Bucket: bucket, Key: videoPath }).createReadStream();

        // Set the appropriate content type for the video
        res.setHeader('Content-Type', 'video/mp4');

        // Pipe the stream to the response object
        stream.pipe(res);
    });

    //
    // HTTP POST route to upload a video to AWS storage.
    //
    app.post('/upload', (req, res) => {
        res.sendStatus(200);
    });

    return app;
};

module.exports = createApp;