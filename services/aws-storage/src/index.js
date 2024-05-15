const express = require('express');
const AWS = require('aws-sdk');

//
// Throws an error if the any required environment variables are missing.
//

if (!process.env.PORT) {
    throw new Error("Please specify the port number for the HTTP server with the environment variable PORT.");
}

if (!process.env.STORAGE_BUCKET_NAME) {
    throw new Error("Please specify the name of an AWS storage s3 bucket in environment variable STORAGE_BUCKET_NAME.");
}

if (!process.env.STORAGE_ACCESS_KEY_ID) {
    throw new Error("Please specify the access key id to an AWS storage account in environment variable STORAGE_ACCESS_KEY_ID.");
}

if (!process.env.STORAGE_SECRET_ACCESS_KEY) {
    throw new Error("Please specify the secret access key to an AWS storage account in environment variable STORAGE_SECRET_ACCESS_KEY.");
}

if (!process.env.STORAGE_REGION_NAME) {
    throw new Error("Please specify the name of an AWS storage s3 bucket region in environment variable STORAGE_REGION_NAME.");
}

//
// Extracts environment variables to globals for convenience.
//

const PORT = process.env.PORT;
const STORAGE_BUCKET_NAME = process.env.STORAGE_BUCKET_NAME;
const STORAGE_ACCESS_KEY_ID = process.env.STORAGE_ACCESS_KEY_ID;
const STORAGE_SECRET_ACCESS_KEY = process.env.STORAGE_SECRET_ACCESS_KEY;
const STORAGE_REGION_NAME = process.env.STORAGE_REGION_NAME;

const app = express();

//
// HTTP GET route we can use to check if the service is handling requests.
//
app.get("/live", (req, res) => {
    res.sendStatus(200);
});

// Configure AWS SDK with your credentials
AWS.config.update({
    accessKeyId: STORAGE_ACCESS_KEY_ID,
    secretAccessKey: STORAGE_SECRET_ACCESS_KEY,
    region: STORAGE_REGION_NAME
});

// Create an S3 instance
const s3 = new AWS.S3();

// Define a route to stream the video
app.get('/video', (req, res) => {
    const videoPath = req.query.path;
    console.log(`Streaming video from path ${videoPath}.`);

    // Create a read stream from S3 object
    const stream = s3.getObject({ Bucket: STORAGE_BUCKET_NAME, Key: videoPath }).createReadStream();

    // Set the appropriate content type for the video
    res.setHeader('Content-Type', 'video/mp4');

    // Pipe the stream to the response object
    stream.pipe(res);
});

if (require.main === module) {
    //
    // When this script is run as the entry point, starts the HTTP server.
    //
    app.listen(PORT, () => {
        console.log(`Microservice online.`);
    });
}
else {
    //
    // Otherwise, exports the express app object for use in tests.
    //
    module.exports = {
        app,
    };
}