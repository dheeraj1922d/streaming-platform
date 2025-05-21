import express from "express"
import cors from "cors"
import dotenv from "dotenv"


dotenv.config();
const port = process.env.PORT || 8080

const app = express();
app.use(cors({
    allowedHeaders: ["*"],
    origin: "*"
 }));
 
app.use(express.json());


app.get('/', (req, res) => {
    res.send('HHLD YouTube')
 })
 
 
 app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
 })
 