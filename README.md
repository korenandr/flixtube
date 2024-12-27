[![Continuous Integration: E2E tests](https://github.com/korenandr/flixtube/actions/workflows/playwright.yml/badge.svg)](https://github.com/korenandr/flixtube/actions/workflows/playwright.yml)

FlixTube is a cloud-native demo application. The application is a web-based app where users can watch videos, upload them to the cloud, and see history of watched videos.

If you’re using this demo, please **★Star** this repository to show your interest!

## Architecture

**FlixTube** is composed of 7 microservices written in nodejs.

[![Architecture of microservices](/docs/img/architecture-diagram.png)](/docs/img/architecture-diagram.png)


| Service                                              | Description                                                                                         |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [db-fixture-rest-api](/services/db-fixture-rest-api) | A REST API for loading and unloading MongoDB database fixtures. (Use this in your automated test).  |
| [gateway](/services/gateway)                         | The entry point to the application that serves the frontend and provides a REST API.                |
| [history](/services/history)                         | Records the user’s viewing history.                                                                 |
| [metadata](/services/metadata)                       | Records details and metadata about each video.                                                      |
| [mock-storage](/services/mock-storage)               | Saves files locally (for testing purpose only).                                                     |
| [recommendations](/services/recommendations)         | Makes recommendations to watch other videos based on what's been viewed before (not supported yet). |
| [video-streaming](/services/video-streaming)         | Streams videos from storage to be watched by the user.                                              |
| [video-uploader](/services/video-uploader)           | Orchestrates upload of videos to storage.                                                           |
| [videos-storage](/services/videos-storage)           | Stores and retrieves videos using external cloud storage.                                           |

## Deployment options

You can launch this demo app:

* [Locally](/docs/local-launch-guide.md)
* [Inside minikube cluster](/docs/minikube-launch-guide.md)
* [Inside AWS EKS cluster](/docs/aws-eks-launch-guide.md)
