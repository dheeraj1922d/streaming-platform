import KafkaConfig from "../kafka/kafka.js";

const sendMessageToKafka = async (req, res) => {
   console.log("got here in upload service...")
   try {
       const message = req.body
       console.log("body : ", message)
       const kafkaconfig = new KafkaConfig()
       const msgs = [
           {
               key: "key1",
               value: JSON.stringify(message)
           }
       ]
       const result = await kafkaconfig.produce("transcode", msgs)
       console.log("result of produce : ", result)
       res.status(200).json("message uploaded successfully")

   } catch (error) {
       console.log(error)
   }
}
export default sendMessageToKafka;

export const pushVideoForEncodingToKafka = async (filename, title, description, author) => {
    try {
        const message = {
            filename,        // mp4 file path or key in S3
            title,           // video title
            description,     // video description
            author           // video's author/uploader
        };

        console.log("Kafka message body:", message);

        const kafkaconfig = new KafkaConfig();

        const msgs = [
            {
                key: "video",
                value: JSON.stringify(message)
            }
        ];

        const result = await kafkaconfig.produce("transcode", msgs);
        console.log("Result of Kafka produce:", result);

    } catch (error) {
        console.error("Error pushing to Kafka:", error);
    }
};
