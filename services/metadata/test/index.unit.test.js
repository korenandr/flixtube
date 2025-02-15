describe("metadata microservice unit tests", () => {

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
        return {
            MongoClient: {
                connect: async () => {
                    return mockMongoClient;
                }
            },
            ObjectId: function(id) {
                return {
                    toString: () => id
                };
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
                            assertQueue: async () => {
                                return {
                                    queue: "my-queue", // Fake name for anonymous queue.
                                };
                            },
                            bindQueue: async () => {},
                            consume: () => {},
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
        
        await startMicroservice("mongodb://localhost:27017", "metadata-test", "rabbit", 3000);

        expect(mockListenFn.mock.calls.length).toEqual(1);
        expect(mockListenFn.mock.calls[0][0]).toEqual(3000);

        expect(mockGetFn.mock.calls.length).toEqual(3);
        expect(mockGetFn.mock.calls[0][0]).toEqual('/api/live');
        expect(mockGetFn.mock.calls[1][0]).toEqual('/api/v1/videos');
        expect(mockGetFn.mock.calls[2][0]).toEqual('/api/v1/video');
    });

    test("microservice`s handler /api/live returns 200", async () => {

        await startMicroservice("mongodb://localhost:27017", "metadata-test", "rabbit", 3000);
        
        const mockRequest = {};
        const mockSendStatusFn = jest.fn();
        const mockResponse = {
            sendStatus: mockSendStatusFn
        };

        expect(mockGetFn.mock.calls[0][0]).toEqual('/api/live');
        const apiLiveRouteHandler = mockGetFn.mock.calls[0][1];
        apiLiveRouteHandler(mockRequest, mockResponse);

        expect(mockSendStatusFn).toHaveBeenCalledTimes(1);
        expect(mockSendStatusFn.mock.calls[0][0]).toEqual(200);
    });

    test("/api/v1/videos route retreives data via videos collection", async () => {

        await startMicroservice("mongodb://localhost:27017", "metadata-test", "rabbit", 3000);

        const mockRequest = {};
        const mockJsonFn = jest.fn();
        const mockResponse = {
            json: mockJsonFn
        };

        const mockRecord1 = {};
        const mockRecord2 = {};

        // Mock the find function to return some mock records.
        mockVideosCollection.find = () => {
            return {
                toArray: async () => { // This is set up to follow the convention of the Mongodb library.
                    return [ mockRecord1, mockRecord2 ];
                }
            };
        };

        const apiV1VideosRouteHandler = mockGetFn.mock.calls[1][1]; // Extract the /api/v1/videos route handler function.
        await apiV1VideosRouteHandler(mockRequest, mockResponse); // Invoke the request handler.

        expect(mockJsonFn.mock.calls.length).toEqual(1); // Expect that the json fn was called.
        expect(mockJsonFn.mock.calls[0][0]).toEqual({
            videos: [ mockRecord1, mockRecord2 ], // Expect that the mock records were retrieved via the mock database function.
        });
    });

    test("/api/v1/video route retrieves video by id", async () => {
        await startMicroservice("mongodb://localhost:27017", "metadata-test", "rabbit", 3000);

        const mockVideoId = "507f1f77bcf86cd799439011";
        const mockRequest = {
            query: {
                id: mockVideoId
            }
        };
        const mockJsonFn = jest.fn();
        const mockSendStatusFn = jest.fn();
        const mockResponse = {
            json: mockJsonFn,
            sendStatus: mockSendStatusFn
        };

        const mockVideo = {
            _id: mockVideoId,
            name: "Test Video"
        };

        // Mock findOne to return a video when called with the expected ID
        mockVideosCollection.findOne = jest.fn().mockImplementation(async (query) => {
            if (query._id.toString() === mockVideoId) {
                return mockVideo;
            }
            return null;
        });

        const apiV1VideoRouteHandler = mockGetFn.mock.calls[2][1]; // Extract the /api/v1/video route handler

        // Test successful video retrieval
        await apiV1VideoRouteHandler(mockRequest, mockResponse);
        expect(mockJsonFn).toHaveBeenCalledWith({ video: mockVideo });
        expect(mockSendStatusFn).not.toHaveBeenCalled();

        // Test video not found
        mockVideosCollection.findOne.mockResolvedValueOnce(null);
        await apiV1VideoRouteHandler(mockRequest, mockResponse);
        expect(mockSendStatusFn).toHaveBeenCalledWith(404);
    });

    // ... more tests go here ...

});