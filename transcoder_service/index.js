import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import KafkaConfig from "../upload_service/kafka/kafka.js";


dotenv.config();
const port = 8081

const app = express();
app.use(cors({
    allowedHeaders: ["*"],
    origin: "*"
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Transcoder service is working')
})


const kafkaconfig = new KafkaConfig()
kafkaconfig.consume("transcode", (value) => {
    console.log("Got data from kafka : ", value)
})


app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
})