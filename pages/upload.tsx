import React from "react";

export default function Upload() {
  const handleUploadClick = async () => {
    try {
      const response = await fetch("/api/uploader", {
        method: "POST",
      });

      if (response.ok) {
        console.log("Images uploaded successfully.");
      } else {
        console.error("Error uploading images:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <div className="text-white">
      <h1>Upload Images</h1>
      <button
        onClick={handleUploadClick}
        className="p-2 bg-samurai-red"
      >
        Upload Images
      </button>
    </div>
  );
}
