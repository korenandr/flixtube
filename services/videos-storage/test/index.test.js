describe("videos-storage microservice", () => {

    const mockListenFn = jest.fn((port, callback) => callback());
    const mockGetFn = jest.fn();
    const mockPostFn = jest.fn();

    jest.doMock("express", () => {
        const express = () => {
            return {
                listen: mockListenFn,
                get: mockGetFn,
                post: mockPostFn,
                use: () => {},
                json: () => {},
            };
        };
        return express;
    });

    const mockUpdateConfigFn = jest.fn();
    const mockGetObjectFn = jest.fn(() => ({
        createReadStream: jest.fn(() => ({
            pipe: jest.fn(),
        })),
    }));

    jest.doMock('aws-sdk', () => {
        return {
            config: {
                update: mockUpdateConfigFn,
            },
            S3: jest.fn(() => ({
                getObject: mockGetObjectFn,
            })),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    //
    // Import the module we are testing.
    //

    const { startMicroservice } = require("../src/index"); 

    //
    // Tests go here.
    //
    
    test("microservice starts web server on startup", async () => {
        
        startMicroservice("STORAGE_BUCKET_NAME", "STORAGE_ACCESS_KEY_ID", "STORAGE_SECRET_ACCESS_KEY", "STORAGE_REGION_NAME", 3000);

        expect(mockListenFn).toHaveBeenCalledTimes(1);
        expect(mockListenFn.mock.calls[0][0]).toEqual(3000);

        expect(mockGetFn).toHaveBeenCalledTimes(2);
        expect(mockGetFn.mock.calls[0][0]).toEqual('/api/live');
        expect(mockGetFn.mock.calls[1][0]).toEqual('/api/video');

        expect(mockPostFn).toHaveBeenCalledTimes(1);
        expect(mockPostFn.mock.calls[0][0]).toEqual("/api/upload");
    });

    test("microservice`s handler /api/live returns 200", async () => {
        
        startMicroservice("STORAGE_BUCKET_NAME", "STORAGE_ACCESS_KEY_ID", "STORAGE_SECRET_ACCESS_KEY", "STORAGE_REGION_NAME", 3000);

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

    test('It should correctly update AWS config', async () => {

        const accessKeyId = 'STORAGE_ACCESS_KEY_ID';
        const secretAccessKey = 'STORAGE_SECRET_ACCESS_KEY';
        const regionName = 'STORAGE_REGION_NAME';

        startMicroservice("STORAGE_BUCKET_NAME", accessKeyId, secretAccessKey, regionName, 3000);

        expect(mockUpdateConfigFn).toHaveBeenCalledTimes(1);
        expect(mockUpdateConfigFn).toHaveBeenCalledWith({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            region: regionName,
        });
    });

    test('It should respond with a stream for a valid video path', async () => {

        const videoPath = 'test.mp4';
        const storageBucketName = 'STORAGE_BUCKET_NAME';

        startMicroservice(storageBucketName, "STORAGE_ACCESS_KEY_ID", "STORAGE_SECRET_ACCESS_KEY", "STORAGE_REGION_NAME", 3000);

        const mockRequest = {
            query: {
                path: videoPath,
            },
        };
        const mockResponse = {
            setHeader: jest.fn(),
        };

        expect(mockGetFn.mock.calls[1][0]).toEqual('/api/video');
        const apiVideoRouteHandler = mockGetFn.mock.calls[1][1];
        apiVideoRouteHandler(mockRequest, mockResponse);

        expect(mockGetObjectFn).toHaveBeenCalledTimes(1);
        expect(mockGetObjectFn).toHaveBeenCalledWith({
            Bucket: storageBucketName,
            Key: videoPath,
        });

        expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'video/mp4');
    });

    // ... more tests go here ...

});