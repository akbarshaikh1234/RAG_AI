"use client";

import {
  FormEvent,
  useState,
} from "react";

interface UploadedSource {
  id: string;
  name: string;
}

export default function Home() {
  const [file, setFile] =
    useState<File | null>(
      null,
    );

  const [
    source,
    setSource,
  ] =
    useState<UploadedSource | null>(
      null,
    );

  const [
    uploading,
    setUploading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function uploadFile(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        file,
      );

      const response =
        await fetch(
          "/api/sources/text",
          {
            method: "POST",

            body:
              formData,
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Upload failed",
        );
      }

      setSource({
        id:
          data.source.id,

        name:
          data.source.name,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Upload failed",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-10 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold">
          RAG Knowledge Base
        </h1>

        <p className="mt-2 text-zinc-400">
          Upload a text file and ask
          questions about it.
        </p>

        <form
          onSubmit={uploadFile}
          className="mt-10 space-y-5 rounded-xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <input
            type="file"
            accept=".txt,text/plain"
            onChange={(event) =>
              setFile(
                event.target
                  .files?.[0] ??
                  null,
              )
            }
          />

          <button
            disabled={
              !file ||
              uploading
            }
            className="rounded-lg bg-white px-5 py-2.5 font-medium text-black disabled:opacity-50"
          >
            {uploading
              ? "Processing..."
              : "Upload & Process"}
          </button>

          {error && (
            <p className="text-red-400">
              {error}
            </p>
          )}
        </form>

        {source && (
          <div className="mt-8 rounded-xl border border-green-900 bg-green-950/20 p-5">
            <p>
              Indexed:
              {" "}
              {source.name}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Source:
              {" "}
              {source.id}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}