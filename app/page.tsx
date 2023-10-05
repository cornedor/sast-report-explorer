"use client";

import { SastJson, Report } from "@/components/Report";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [json, setJson] = useState<string>("");
  const [repo, setRepo] = useState<string>("");
  const [data, setData] = useState<SastJson | null>(null);

  useEffect(() => {
    let stored = localStorage.getItem("repo");
    if (stored) {
      setRepo(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("repo", repo);
  }, [repo]);

  useEffect(() => {
    try {
      setData(JSON.parse(json));
    } catch {}
  }, [json]);

  return (
    <main className="w-[1200px] m-auto">
      <h1 className="text-2xl font-serif mt-10 mb-2">SAST Report Explorer</h1>
      <input
        className="w-full rounded border-2 mb-1 p-1"
        placeholder="https://gitlab.com/group/project/-/blob/main/"
        value={repo}
        onInput={(e) => setRepo(e.currentTarget.value)}
      />
      <textarea
        className="w-full rounded border-2 p-1"
        rows={data ? 1 : 20}
        onInput={(e) => setJson(e.currentTarget.value)}
        placeholder="Paste your report here"
      ></textarea>

      {data && <Report report={data} repo={repo} />}
    </main>
  );
}
