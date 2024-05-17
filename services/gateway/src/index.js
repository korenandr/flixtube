const createApp = require('./app');

//
// Throws an error if the any required environment variables are missing.
//

if (!process.env.PORT) {
    throw new Error("Please specify the port number for the HTTP server with the environment variable PORT.");
}

//
// Extracts environment variables to globals for convenience.
//

const PORT = process.env.PORT;


const app = createApp();

if (require.main === module) {
    // This file was run directly, start the server
    app.listen(PORT, () => console.info(`Microservice online.`));
} else {
    // This file was required as a module, export the app
    module.exports = app;
}