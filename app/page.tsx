"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import ChatLayout from "@/components/layout";
interface UploadedSource {
  id: string;
  name: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const [source, setSource] = useState<UploadedSource | null>(null);

  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");

  const [isExpanded, setIsExpanded] = useState(false);

  async function uploadFile(event: FormEvent) {
    event.preventDefault();

    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/embed", {
        method: "POST",

        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Upload failed");
      }

      setSource({
        id: data.source.id,

        name: data.source.name,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="w-full h-full">
      {/* <ChatLayout> */}
        <div className="grid grid-rows-[1fr_auto] w-full p-4 h-full">
          <div>
            asdas
          </div>
          <div className="flex flex-col bg-[#292929] rounded-lg p-4">
            <div
              contentEditable={true}
              role="textbox"
              aria-multiline="true"
              onFocus={() => {
                document.execCommand("formatBlock", false, "p");
              }}
              className="w-full h-12 text-[#d3d3d3] max-h-[200px] overflow-y-scroll outline-0"
            ></div>
            <div>asdasd</div>
          </div>
        </div>
      {/* </ChatLayout> */}
    </section>
  );
}
