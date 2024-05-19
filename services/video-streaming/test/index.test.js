
describe("video-streaming microservice", () => {

    //
    // Setup mocks.
    //

    const mockListenFn = jest.fn((port, callback) => callback());
    const mockGetFn = jest.fn();

    jest.doMock("express", () => { // Mock the Express module.
        const express = () => { // The Express module is a factory function that creates an Express app object.
            return { // Mock Express app object.
                listen: mockListenFn, // Mock listen function.
                get: mockGetFn, // Mock get function.
                use: () => {}, // Mock use function.
                
            };
        };
        express.json = () => {}; // Mock json function. 
        return express;
    });

    const mockVideosCollection = { // Mock Mongodb collection.
    };

    const mockDb = { // Mock Mongodb database.
        collection: () => {
            return mockVideosCollection;
        }
    };

    const mockMongoClient = { // Mock Mongodb client object.
        db: () => {
            return mockDb;
        }
    };
    
    jest.doMock("mongodb", () => { // Mock the Mongodb module.
        return { // Mock Mongodb module.
            MongoClient: { // Mock MongoClient.
                connect: async () => { // Mock connect function.
                    return mockMongoClient;
                }
            }
        };
    });

    jest.doMock("amqplib", () => { // Mock the amqplib (RabbitMQ) library.
        return { // Returns a mock version of the library.
            connect: async () => { // Mock function to connect to RabbitMQ.
                return { // Returns a mock "messaging connection".
                    createChannel: async () => { // Mock function to create a messaging channel.
                        return { // Returns a mock "messaging channel".
                            assertExchange: async () => {},
                            publish: () => {},
                        };
                    },
                };
            },
        };
    });


    //
    // Import the module we are testing.
    //

    const { startMicroservice } = require("../src/index"); 

    //
    // Tests go here.
    //
    
    test("microservice starts web server on startup", async () => {
        
        await startMicroservice("mongodb://localhost:27017", "metadata-test", "videos-storage", 4000, "rabbit", 3000);

        expect(mockListenFn.mock.calls.length).toEqual(1);     // Check only 1 call to 'listen'.
        expect(mockListenFn.mock.calls[0][0]).toEqual(3000);   // Check for port 3000.
    });

    test("/video route is handled", async () => {
        
        await startMicroservice("mongodb://localhost:27017", "metadata-test", "videos-storage", 4000, "rabbit", 3000);

        const videoRoute = mockGetFn.mock.calls[0][0];
        expect(videoRoute).toEqual("/video");
    });

    // ... more tests go here ...

});