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

if (!process.env.VIDEOS_STORAGE_HOST) {
    throw new Error("Please specify the host name for the video storage microservice in variable VIDEOS_STORAGE_HOST.");
}

if (!process.env.VIDEOS_STORAGE_PORT) {
    throw new Error("Please specify the port number for the video storage microservice in variable VIDEOS_STORAGE_PORT.");
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
const VIDEOS_STORAGE_HOST = process.env.VIDEOS_STORAGE_HOST;
const VIDEOS_STORAGE_PORT = parseInt(process.env.VIDEOS_STORAGE_PORT);
const DBHOST = process.env.DBHOST;
const DBNAME = process.env.DBNAME;

console.log(`Forwarding video requests to ${VIDEOS_STORAGE_HOST}:${VIDEOS_STORAGE_PORT}.`);

//
// Broadcasts the "viewed" message to other microservices.
//
function broadcastViewedMessage(messageChannel, videoPath) {
    console.log(`Publishing message on "viewed" exchange.`);
        
    const msg = { videoPath: videoPath };
    const jsonMsg = JSON.stringify(msg);
    messageChannel.publish("viewed", "", Buffer.from(jsonMsg)); // Publishes message to the "viewed" exchange.
}

//
// Application entry point.
//
async function main() {

    console.log(`Connecting to RabbitMQ server at ${RABBIT}.`);
    const messagingConnection = await amqp.connect(RABBIT);

    console.log("Connected to RabbitMQ.");
    const messageChannel = await messagingConnection.createChannel();
    await messageChannel.assertExchange("viewed", "fanout");

    const client = await mongodb.MongoClient.connect(DBHOST);
    const db = client.db(DBNAME);
    const videosCollection = db.collection("videos");
    
    const app = express();
        
    app.get("/video", async (req, res) => {
        const videoId = new mongodb.ObjectId(req.query.id);
        const videoRecord = await videosCollection.findOne({ _id: videoId });
        if (!videoRecord) {
            console.log(`File with id ${videoId} not found.`);
            res.sendStatus(404);
            return;
        }

        console.log(`Translated id ${videoId} to path ${videoRecord.videoPath}.`);

        const forwardRequest = http.request( // Forward the request to the video storage microservice.
            {
                host: VIDEOS_STORAGE_HOST,
                port: VIDEOS_STORAGE_PORT,
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

        broadcastViewedMessage(messageChannel, videoRecord.videoPath);
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