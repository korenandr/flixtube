describe("videos-storage microservice", () => {

    //
    // Setup mocks.
    //

    const mockListenFn = jest.fn((port, callback) => callback());
    const mockGetFn = jest.fn();
    const mockPostFn = jest.fn();

    jest.doMock("express", () => { // Mock the Express module.
        const express = () => { // The Express module is a factory function that creates an Express app object.
            return { // Mock Express app object.
                listen: mockListenFn, // Mock listen function.
                get: mockGetFn, // Mock get function.
                post: mockPostFn, // Mock post function.
                use: () => {}, // Mock use function.
                
            };
        };
        express.json = () => {}; // Mock json function. 
        return express;
    });


    //
    // Import the module we are testing.
    //

    const { startMicroservice } = require("../src/index"); 

    //
    // Tests go here.
    //
    
    test("microservice starts web server on startup", async () => {
        
        await startMicroservice("STORAGE_BUCKET_NAME", "STORAGE_ACCESS_KEY_ID", "STORAGE_SECRET_ACCESS_KEY", "STORAGE_REGION_NAME", 3000);

        expect(mockListenFn.mock.calls.length).toEqual(1);
        expect(mockListenFn.mock.calls[0][0]).toEqual(3000);

        expect(mockGetFn.mock.calls.length).toEqual(2);
        expect(mockGetFn.mock.calls[0][0]).toEqual('/api/live');
        expect(mockGetFn.mock.calls[1][0]).toEqual('/api/video');

        expect(mockPostFn.mock.calls.length).toEqual(1);
        expect(mockPostFn.mock.calls[0][0]).toEqual("/api/upload");
    });

    // ... more tests go here ...

});