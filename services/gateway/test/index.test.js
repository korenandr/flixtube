describe("gateway microservice", () => {

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
                set: () => {}, // Mock set function.
                use: () => {}, // Mock use function.
            };
        };
        express.json = () => {}; // Mock json function. 
        express.static = () => {}; // Mock static function. 
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
        
        await startMicroservice(3000);

        expect(mockListenFn.mock.calls.length).toEqual(1);     // Check only 1 call to 'listen'.
        expect(mockListenFn.mock.calls[0][0]).toEqual(3000);   // Check for port 3000.
    });

    // ... more tests go here ...

});