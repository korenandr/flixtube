# GitHub Actions Workflows

This page describes the CI/CD workflows for the FlixTube app, which run in [Github Actions](https://github.com/korenandr/flixtube/actions).

## Workflows

### Code Tests

Every service has its own CI workflow, which runs tests for the specific service (depending on whether you've made any changes).


### Push images to container registry - [push.yaml](push.yml)

This is the Continuous Deployment workflow, and it runs on demand ([Push image](https://github.com/korenandr/flixtube/actions/workflows/push.yaml)). This workflow:

1. Builds the container image for choosen service, tagging with hash of last commit.
2. Push that image to DockerHub.

**Note - Currently supported services:**
* gateway
* history
* metadata
* videos-streaming
* video-uploader
* videos-storage
