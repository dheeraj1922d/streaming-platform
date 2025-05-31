import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Client } from "@opensearch-project/opensearch";


dotenv.config();
const app = express();
const port = process.env.PORT || 8080;


app.use(
  cors({
    allowedHeaders: ["*"],
    origin: "*",
  })
);


app.use(express.json());

// Route for uploading a video
app.post("/upload", async (req, res) => {
  try {
    console.log("Inside upload call");
    
    // Process video upload and extract metadata
    const { title, description, author, videoUrl } = req.body;

    var host =
      "https://name:pwd@search-trial-jqtlus4ksz5xo3aqihkpv3pxny.ap-south-1.es.amazonaws.com";
    var host_aiven =
      "https://avnadmin:AVNS_UMMkaitfbQNdADAuKCP@os-34fffb3e-streaming-x.b.aivencloud.com:26849";


    var client = new Client({
      node: host_aiven,
    });


    var index_name = "video";


    var document = {
      title: title,
      author: author,
      description: description,
      videoUrl: videoUrl,
    };

    var response = await client.index({
      id: title, // id should ideally be db id
      index: index_name,
      body: document,
      refresh: true,
    });


    console.log("Adding document:");
    console.log(response.body);
    // Respond with success message
    res.status(200).json({ message: "Video uploaded successfully" });
  } catch (error) {
    // Respond with error message
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/", (req, res) => {
  res.send("HHLD OpenSearch Demo");
});


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
