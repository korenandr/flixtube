// @ts-check
const { test, expect } = require('@playwright/test');
const { describe } = test;
const { loadFixture } = require('./lib/db-fixture');

//
// An example of running ab end-to-end test against our microservices application using Playwright.
//
describe("flixtube front end", () => {

    test("can list videos", async ({ page }) => {

        // Load the fixture named "two-videos" into the database "metadata".
        await loadFixture("metadata", "two-videos");

        // Visit the Flixtube web page (NOTE: The base URL is set in the Playwright configuration file).
        await page.goto(`/`);

        // Check that we have two items in the video list.
        const videos = page.locator("#video-list>div");
        await expect(videos).toHaveCount(2);

        const firstVideo = videos.nth(0).locator("a"); // Check the first item in the video list.
        await expect(firstVideo).toHaveText("SampleVideo_1280x720_1mb.mp4"); // Make sure file name is correct.
        await expect(firstVideo).toHaveAttribute("href", "/video?id=5ea234a1c34230004592eb32"); // Make sure link is correct.

        const secondVideo = videos.nth(1).locator("a"); // Check the second item in the video list.
        await expect(secondVideo).toHaveText("Another video.mp4"); // Make sure file name is correct.
        await expect(secondVideo).toHaveAttribute("href", "/video?id=5ea234a5c34230004592eb33"); // Make sure link is correct.
    });

    test("can play a video", async ({ page }) => {
        // Load fixture with video metadata
        await loadFixture("metadata", "two-videos");

        // Navigate to first video
        await page.goto(`/video?id=5ea234a1c34230004592eb32`);

        // Check that video player is present
        const videoPlayer = page.locator("video");
        await expect(videoPlayer).toBeVisible();

        // Check video source is correct
        const videoSource = page.locator("video > source");
        await expect(videoSource).toHaveAttribute("src", "/api/v1/videos/stream?id=5ea234a1c34230004592eb32");
    });

    test("can view video history", async ({ page }) => {
        // Load fixtures
        await loadFixture("history", "two-videos");

        // Visit history page
        await page.goto(`/history`);

        // Get all rows (excluding header)
        const rows = await page.locator('#history-list table tr:not(:first-child)');

        // Assert number of history entries
        await expect(rows).toHaveCount(2);

        // Check content of first row
        const firstVideoId = await rows.nth(0).locator('td').first();
        await expect(firstVideoId).toHaveText("5ea234a1c34230004592eb32");

        const watchedDate = await rows.nth(0).locator('td').last();
        await expect(watchedDate).toHaveText("2024-12-26T12:00:00Z");

        // Check content of second row
        const secondVideoId = await rows.nth(1).locator('td').first();
        await expect(secondVideoId).toHaveText("5ea234a5c34230004592eb33");

        const secondWatchedDate = await rows.nth(1).locator('td').last();
        await expect(secondWatchedDate).toHaveText("2024-12-27T12:00:00Z");
    });
});