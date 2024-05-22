const express = require("express");
const mongodb = require("mongodb");
const amqp = require("amqplib");


//
// Starts the microservice.
//
async function startMicroservice(dbHost, dbName, rabbitHost, port) {

    const app = express();

    //
    // Enables JSON body parsing for HTTP requests.
    //
    app.use(express.json()); 

    //
    // Connects to the database server.
    //
    const client = await mongodb.MongoClient.connect(dbHost);

    //
    // Gets the database for this microservice.
    //
    const db  = client.db(dbName);

    //
    // Gets the collection for storing video metadata.
    //
    const videosCollection = db.collection("videos");
    
    //
    // Connect to the RabbitMQ server.
    //
    const messagingConnection = await amqp.connect(rabbitHost); 

    //
    // Creates a RabbitMQ messaging channel.
    //
    const messageChannel = await messagingConnection.createChannel(); 

    // 
    // Handler for incoming messages.
    //
    async function consumeViewedMessage(msg) {

        const parsedMsg = JSON.parse(msg.content.toString()); // Parse the JSON message.
        
        console.log("Received a 'viewed' message:");
        console.log(JSON.stringify(parsedMsg, null, 4)); // JUST PRINTING THE RECEIVED MESSAGE.

        // ... ADD YOUR CODE HERE TO PROCESS THE MESSAGE ...

        console.log("Acknowledging message was handled.");
                
        messageChannel.ack(msg); // If there is no error, acknowledge the message.
    };

    //
    // Asserts that we have a "viewed" exchange.
    //
    await messageChannel.assertExchange("viewed", "fanout"); 

	//
	// Creates an anonyous queue.
	//
	const { queue } = await messageChannel.assertQueue("", { exclusive: true }); 

    console.log(`Created queue ${queue}, binding it to "viewed" exchange.`);
    
    //
    // Binds the queue to the exchange.
    //
    await messageChannel.bindQueue(queue, "viewed", ""); 

    //
    // Start receiving messages from the anonymous queue.
    //
    await messageChannel.consume(queue, consumeViewedMessage);

    //
    // HTTP GET route we can use to check if the service is handling requests.
    //
    app.get("/api/live", (req, res) => {
        res.sendStatus(200);
    });

    //
    // Starts the HTTP server.
    //
    app.listen(port, () => {
        console.log("Microservice online.");
    });
}

//
// Application entry point.
//
async function main() {
    if (!process.env.PORT) {
        throw new Error("Please specify the port number for the HTTP server with the environment variable PORT.");
    }
    
    if (!process.env.DBHOST) {
        throw new Error("Please specify the databse host using environment variable DBHOST.");
    }
    
    if (!process.env.DBNAME) {
        throw new Error("Please specify the name of the database using environment variable DBNAME");
    }
    
    if (!process.env.RABBIT) {
        throw new Error("Please specify the name of the RabbitMQ host using environment variable RABBIT");
    }
    
    const PORT = process.env.PORT;
    const DBHOST = process.env.DBHOST;
    const DBNAME = process.env.DBNAME;
    const RABBIT = process.env.RABBIT;

    await startMicroservice(DBHOST, DBNAME, RABBIT, PORT);
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