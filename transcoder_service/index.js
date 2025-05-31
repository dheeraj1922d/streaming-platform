import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import KafkaConfig from "../upload_service/kafka/kafka.js";
import s3ToS3 from "./hls/s3ToS3.js";

dotenv.config();
const port = process.env.PORT || 8081;

const app = express();
app.use(
  cors({
    allowedHeaders: ["*"],
    origin: "*",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Transcoder service is working");
});

const kafkaconfig = new KafkaConfig();

kafkaconfig.consume("transcode", async (message) => {
  try {
    console.log("Got data from Kafka:", message);
    const value = JSON.parse(message);
    if (value && value.filename) {
      console.log("Filename is", value.filename , "Title is" , value.title, "Description is" , value.description, "Author is" , value.author);
      await s3ToS3(
        value.filename,
        value.title ,
        value.description,
        value.author
      );
    } else {
      console.log("Didn't receive filename to be picked from S3");
    }
  } catch (error) {
    console.error("Error processing Kafka message:", error);
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
