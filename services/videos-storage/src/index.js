const AWS = require('aws-sdk');
const express = require('express');


//
// Starts the microservice.
//
function startMicroservice(bucketName, accessKeyId, secretAccessKey, regionName, port) {

    // Configure AWS SDK with your credentials
    AWS.config.update({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: regionName
    });

    // Create an S3 instance
    const s3 = new AWS.S3();

    const app = express();

    //
    // HTTP GET route we can use to check if the service is handling requests.
    //
    app.get("/api/live", (req, res) => {
        res.sendStatus(200);
    });

    // Define a route to stream the video
    app.get('/api/video', (req, res) => {
        const videoPath = req.query.path;
        console.log(`Streaming video from path ${videoPath}.`);

        // Create a read stream from S3 object
        const stream = s3.getObject({ Bucket: bucketName, Key: videoPath }).createReadStream();

        // Set the appropriate content type for the video
        res.setHeader('Content-Type', 'video/mp4');

        // Pipe the stream to the response object
        stream.pipe(res);
    });

    //
    // HTTP POST route to upload a video to AWS storage.
    //
    app.post('/api/upload', (req, res) => {
        res.sendStatus(200);
    });

    // Other handlers go here.

    app.listen(port, () => { // Starts the HTTP server.
        console.log("Microservice online.");
    });
}

//
// Application entry point.
//
async function main() {
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

    startMicroservice(STORAGE_BUCKET_NAME, STORAGE_ACCESS_KEY_ID, STORAGE_SECRET_ACCESS_KEY, STORAGE_REGION_NAME, PORT);
}

if (require.main === module) {
    // Only start the microservice normally if this script is the "main" module.
    main()
        .catch(err => {
            console.error("Microservice failed to start.");
            console.error(err && err.stack || err);
        });
}
else {
    // Otherwise we are running under test
    module.exports = {
        startMicroservice,
    };
}