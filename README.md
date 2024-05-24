[![Continuous Integration: E2E tests](https://github.com/korenandr/flixtube/actions/workflows/playwright.yml/badge.svg)](https://github.com/korenandr/flixtube/actions/workflows/playwright.yml)

FlixTube is a cloud-native demo application. The application is a web-based app where users can watch videos, upload them to the cloud, and see history of watched videos.

If you’re using this demo, please **★Star** this repository to show your interest!

## Architecture

**FlixTube** is composed of 7 microservices written in nodejs.

[![Architecture of
microservices](/docs/img/architecture-diagram.png)](/docs/img/architecture-diagram.png)


| Service                                              | Description                                                                                         |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [db-fixture-rest-api](/services/db-fixture-rest-api) | A REST API for loading and unloading MongoDB database fixtures. (Use this in your automated test).  |
| [gateway](/services/gateway)                         | Exposes an HTTP server to serve the website. Forward requests to other microservices.               |
| [history](/services/history)                         | Stores the history information about watched videos.                                                |
| [metadata](/services/metadata)                       | Stores the metadata about uploaded videos.                                                          |
| [recommendations](/services/recommendations)         | Recommends to watch other videos based on what's been viewed before (not supported yet).            |
| [video-streaming](/services/video-streaming)         | Provides video stream from storage to user.                                                         |
| [video-uploader](/services/video-uploader)           | Uploads videos to the given storage.                                                                |
| [videos-storage](/services/videos-storage)           | Saves or retrieves videos to/from storage.                                                          |

## Deployment options

You can launch this demo app:

* [Locally](/docs/local-launch-guide.md)
* [Inside minikube cluster](/docs/minikube-launch-guide.md)
* [Inside AWS EKS cluster](/docs/aws-eks-launch-guide.md)
