# You can use this data as an example. For this reason you have to mannually add this to db.

Connect to conatiner with mongodb:

    docker exec -it <db containter id> bash

Update db:

    mongosh
    use <DBNAME>
    db.videos.insertOne({ "_id" : ObjectId("5d9e690ad76fe06a3d7ae416"),  "videoPath" : "SampleVideo_1280x720_1mb.mp4" })

After thath you can check this video from your browser: http://localhost:4000/video?id=5d9e690ad76fe06a3d7ae416