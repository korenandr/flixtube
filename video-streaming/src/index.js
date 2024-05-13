const express = require("express");
const http = require("http");
const mongodb = require("mongodb");
const amqp = require('amqplib');

//
// Throws an error if the any required environment variables are missing.
//

if (!process.env.PORT) {
    throw new Error("Please specify the port number for the HTTP server with the environment variable PORT.");
}

if (!process.env.RABBIT) {
    throw new Error("Please specify the name of the RabbitMQ host using environment variable RABBIT");
}

if (!process.env.VIDEO_STORAGE_HOST) {
    throw new Error("Please specify the host name for the video storage microservice in variable VIDEO_STORAGE_HOST.");
}

if (!process.env.VIDEO_STORAGE_PORT) {
    throw new Error("Please specify the port number for the video storage microservice in variable VIDEO_STORAGE_PORT.");
}

if (!process.env.DBHOST) {
    throw new Error("Please specify the databse host using environment variable DBHOST.");
}

if (!process.env.DBNAME) {
    throw new Error("Please specify the name of the database using environment variable DBNAME");
}

//
// Extracts environment variables to globals for convenience.
//

const PORT = process.env.PORT;
const RABBIT = process.env.RABBIT;
const VIDEO_STORAGE_HOST = process.env.VIDEO_STORAGE_HOST;
const VIDEO_STORAGE_PORT = parseInt(process.env.VIDEO_STORAGE_PORT);
const DBHOST = process.env.DBHOST;
const DBNAME = process.env.DBNAME;

console.log(`Forwarding video requests to ${VIDEO_STORAGE_HOST}:${VIDEO_STORAGE_PORT}.`);

//
// Send the "viewed" to the history microservice.
//
function sendViewedMessage(messageChannel, videoPath) {
    console.log(`Publishing message on "viewed" queue.`);

    const msg = { videoPath: videoPath };
    const jsonMsg = JSON.stringify(msg);
    messageChannel.publish("", "viewed", Buffer.from(jsonMsg)); // Publishes message to the "viewed" queue.
}

//
// Application entry point.
//
async function main() {

    console.log(`Connecting to RabbitMQ server at ${RABBIT}.`);
    const messagingConnection = await amqp.connect(RABBIT); // Connects to the RabbitMQ server.

    console.log("Connected to RabbitMQ.");
    const messageChannel = await messagingConnection.createChannel(); // Creates a RabbitMQ messaging channel.

    const client = await mongodb.MongoClient.connect(DBHOST); // Connects to the database.
    const db = client.db(DBNAME);
    const videosCollection = db.collection("videos");
    
    const app = express();
        
    app.get("/video", async (req, res) => {
        const videoId = new mongodb.ObjectId(req.query.id);
        const videoRecord = await videosCollection.findOne({ _id: videoId });
        if (!videoRecord) {
            // The video was not found.
            console.log(`File with id ${videoId} not found.`);
            res.sendStatus(404);
            return;
        }

        console.log(`Translated id ${videoId} to path ${videoRecord.videoPath}.`);

        const forwardRequest = http.request( // Forward the request to the video storage microservice.
            {
                host: VIDEO_STORAGE_HOST,
                port: VIDEO_STORAGE_PORT,
                path:`/video?path=${videoRecord.videoPath}`,
                method: 'GET',
                headers: req.headers
            }, 
            forwardResponse => {
                res.writeHeader(forwardResponse.statusCode, forwardResponse.headers);
                forwardResponse.pipe(res);
            }
        );
        
        req.pipe(forwardRequest);

        sendViewedMessage(messageChannel, videoRecord.videoPath);
    });

    //
    // Starts the HTTP server.
    //
    app.listen(PORT, () => {
        console.log(`Microservice listening, please load the data file db-fixture/videos.json into your database before testing this microservice.`);
    });
}

main()
    .catch(err => {
        console.error("Microservice failed to start.");
        console.error(err && err.stack || err);
    });