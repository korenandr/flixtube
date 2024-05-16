const createApp = require('./app');
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


// Configure AWS SDK with your credentials
AWS.config.update({
    accessKeyId: STORAGE_ACCESS_KEY_ID,
    secretAccessKey: STORAGE_SECRET_ACCESS_KEY,
    region: STORAGE_REGION_NAME
});

// Create an S3 instance
const s3 = new AWS.S3();

const app = createApp(s3, STORAGE_BUCKET_NAME);

if (require.main === module) {
    // This file was run directly, start the server
    app.listen(PORT, () => console.info(`Microservice online.`));
} else {
    // This file was required as a module, export the app
    module.exports = app;
}