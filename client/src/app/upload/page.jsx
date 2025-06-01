"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadForm = () => {
  const { data } = useSession();
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    if (!data) {
      redirect("/");
    }
  }, []);

  const handleUpload = async () => {
    if (!title || !author || !description || !selectedFile) {
      toast.error("All are required fields.");
      return;
    }

    try {
      const formData = new FormData();
      const originalFilename = selectedFile.name;
      const safeFilename = originalFilename.replace(/\s+/g, "_");
      formData.append("filename", safeFilename);

      const initializeRes = await axios.post(
        "http://13.232.49.59:8080/upload/initialize",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { uploadId } = initializeRes.data;
      const chunkSize = 5 * 1024 * 1024; // 5 MB
      const totalChunks = Math.ceil(selectedFile.size / chunkSize);
      let start = 0;
      const uploadPromises = [];

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const chunk = selectedFile.slice(start, start + chunkSize);
        start += chunkSize;

        const chunkFormData = new FormData();
        chunkFormData.append("filename", safeFilename);
        chunkFormData.append("chunk", chunk);
        chunkFormData.append("totalChunks", totalChunks);
        chunkFormData.append("chunkIndex", chunkIndex);
        chunkFormData.append("uploadId", uploadId);

        const uploadPromise = axios.post(
          "http://13.232.49.59:8080/upload",
          chunkFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        uploadPromises.push(uploadPromise);
      }

      await Promise.all(uploadPromises);

      const completeRes = await axios.post(
        "http://13.232.49.59:8080/upload/complete",
        {
          filename: safeFilename,
          totalChunks: totalChunks,
          uploadId: uploadId,
          title: title,
          description: description,
          author: author,
        }
      );

      toast.success("Upload completed successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 3000); // wait 3 seconds before redirect
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Upload failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto max-w-lg p-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <form encType="multipart/form-data">
        <div className="mb-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={handleUpload}
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
