
# 📺 Streaming Platform

A full-stack, scalable video streaming platform enabling users to upload, transcode, and stream videos via adaptive bitrate streaming (HLS). The platform is modularized into microservices and supports secure upload (OAuth 2.0), Kafka-based communication, and OpenSearch for metadata indexing and retrieval.

---

## 🧹 Microservices Overview


| Service                | Tech Stack                                 | Description                                                             |
| ---------------------- | ------------------------------------------ | ----------------------------------------------------------------------- |
| **Client (Next.js)**   | Next.js, React, Next-Auth, React-Player    | UI for video playback, authentication, uploads                          |
| **Upload Service**     | Node.js, Express, AWS SDK, KafkaJS, Prisma | Handles video uploads, chunked upload, DB integration, Kafka publishing |
| **Transcoder Service** | Node.js, KafkaJS, fluent-ffmpeg            | Converts uploaded videos to adaptive HLS stream                         |
| **Watch Service**      | Node.js, Express, AWS SDK, Prisma          | Generates signed URLs for secure streaming                              |
| **Search Service**     | Node.js, Express, OpenSearch               | Indexes and queries video metadata                                      |
| **Auth**               | OAuth 2.0 (Google), NextAuth               | Secure login via Google OAuth2                                          |

---

## 💠 Architecture

![Architecture Diagram](https://res.cloudinary.com/draptrzrc/image/upload/v1749487420/stlnpp9r4ybidl6noq8p.png)

---

## 📦 Services Breakdown

### 1. Upload Service

* Receives video uploads via multipart or chunked approach
* Streams to S3 using AWS SDK
* Stores metadata (title, author, description, URL) in PostgreSQL (via Prisma)
* Publishes Kafka message (`filename`) to `transcode` topic

### 2. Transcoder Service

* Listens to Kafka `transcode` topic
* Downloads video from S3
* Transcodes into multiple HLS formats using `ffmpeg`
* Uploads `.m3u8` playlist and `.ts` segments to S3

### 3. Watch Service

* Serves signed URLs for secure video playback
* Lists all uploaded videos (fetched from Postgres via Prisma)
* Supports HLS streaming via S3 pre-signed links

### 4. Client (Next.js)

* Login with Google (NextAuth OAuth 2.0)
* Upload form with title, author, description
* Lists all uploaded videos in a grid with ReactPlayer
* Streams YouTube and HLS URLs
* Authenticated access only for upload

### 5. Search Service

* Pushes video metadata to OpenSearch after upload
* Allows full-text search using OpenSearch queries
* Integrates fuzzy match, phrase match, and boolean search

---

## 🔐 Authentication

* Google OAuth2 integration using `next-auth`
* Upload page is protected (only visible after login)
* Session context maintained across frontend

---

## 📤 Upload Mechanisms

* ✅ Direct upload to backend → S3
* ✅ Chunked upload (sequential & parallel)
* ✅ Multipart upload via AWS S3 SDK
* ✅ Metadata stored in DB & indexed in OpenSearch

---

## 📺 Streaming Protocols

* 🎥 YouTube URL streaming (via `react-player`)
* 🎞 S3 video URL streaming with signed URLs
* 🛁 HLS streaming (m3u8 & ts files) with adaptive bitrate support
* 💡 DASH support (experimental, code included)

---

## 🔍 Search Capabilities

* OpenSearch used for indexing:

  * title, author, description, videoUrl
* Supports:

  * Match queries
  * Fuzzy matching
  * Simple query strings
  * Bool queries

---

## 📁 Tech Stack

| Category      | Tools Used                                    |
| ------------- | --------------------------------------------- |
| Frontend      | Next.js, React, Tailwind, ReactPlayer, HLS.js |
| Backend       | Node.js, Express                              |
| Upload        | AWS SDK, Multer, Prisma                       |
| Stream Encode | fluent-ffmpeg, ffmpeg-static                  |
| Auth          | Google OAuth2, NextAuth                       |
| Messaging     | Apache Kafka (KafkaJS)                        |
| DB            | PostgreSQL (via Aiven)                        |
| Search        | OpenSearch                                    |
| Storage       | AWS S3                                        |
| Transcode     | ffmpeg (HLS encoding), DASH (optional)        |

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* PostgreSQL & Prisma setup
* AWS S3 Bucket (with appropriate CORS & IAM roles)
* Aiven Kafka & OpenSearch accounts

### Environment Variables

```env
# Upload & Watch Services
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET=bucket_name
AWS_REGION=ap-south-1

# Auth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Kafka
KAFKA_BROKER=
KAFKA_USERNAME=
KAFKA_PASSWORD=

# OpenSearch
OPENSEARCH_NODE=
```

---

## 🧪 Testing APIs

* Upload endpoint: `POST /upload`
* Watch endpoint: `GET /watch?key=video.mp4`
* Search endpoint: `GET /search?q=title`
* Kafka test route: `POST /publish` (send `filename`)

Use Postman to test file uploads and signed URL retrieval.

---

## 🎥 Sample Flow

1. Login with Google → Upload Video
2. Upload Service saves metadata, pushes Kafka message
3. Transcoder downloads from S3, encodes HLS, re-uploads to S3
4. Watch Service provides signed `.m3u8` URL
5. Client fetches signed URL and streams via `HLS.js`

---

## 📊 Future Scope

* ElasticSearch Dashboard with Kibana (via OpenSearch)
* Real-time notifications via WebSockets
* Video analytics (views, watch time)
* Transcoding status monitor
* Lambda functions for async workflows

---

## 📄 License

This project is open-source and available under the MIT License.


