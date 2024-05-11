Creating a project step by step from [Bootstrapping Microservices](https://www.bootstrapping-microservices.com) book.

# How to run

You need docker installed to run this.

Before running build image (production mode):

    docker build -t video-streaming .

To start the microservice:

    docker run -d --rm -p 3000:3000 -e PORT=3000 video-streaming

Then point your browser at http://localhost:3000/video

To stop the microservice:

    docker stop <container id>