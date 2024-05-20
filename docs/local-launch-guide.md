# Use Docker Compose to deploy FlixTube locally

This page walks you through the steps required to deploy the [FlixTube](https://github.com/korenandr/flixtube) sample application locally using Docker Compose.

## Prerequisites

You need to install docker and docker compose on your development computer. Also you need to have IAM AWS account with created s3 bucket.

## Deploy the sample application

1. Clone the Github repository.

    ```bash
    git clone https://github.com/korenandr/flixtube.git
    ```

2. Specify environment variables:

    ```bash
    EXPORT STORAGE_BUCKET_NAME=<your aws s3 bucket name>
    EXPORT STORAGE_REGION_NAME=<your aws s3 region>
    EXPORT STORAGE_ACCESS_KEY_ID=<your aws access key id>
    EXPORT STORAGE_SECRET_ACCESS_KEY=<your aws secret access key>
    ```

3. Launch this app (inside root directory).

    ```bash
    docker compose -f docker-compose-prod.yml up --build
    ```

4. Point your browser at http://localhost:4000

## Clean up

1. Stop this app.

    ```bash
    docker compose -f docker-compose-prod.yml down
    ```