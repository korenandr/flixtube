# Configuration

You need to specify environment variables:

    EXPORT STORAGE_BUCKET_NAME=<your aws s3 bucket name>
    EXPORT STORAGE_REGION_NAME=<your aws s3 region>
    EXPORT STORAGE_ACCESS_KEY_ID=<your aws access key id>
    EXPORT STORAGE_SECRET_ACCESS_KEY=<your aws secret access key>

# How to run

You need Docker and Docker-Compose installed to run this.

Boot it up from the terminal using:

    docker compose -f docker-compose-prod.yml up --build

Add sample from db-fixture into your mongodb container
Then point your browser at http://localhost:4000/video?id=5d9e690ad76fe06a3d7ae416

To stop the microservices:

    docker compose -f docker-compose-prod.yml down