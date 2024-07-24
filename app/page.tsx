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
    <main className="w-[1200px] m-auto max-w-full p-2">
      <h1 className="text-4xl font-serif mt-10 mb-2 text-slate-800 dark:text-slate-400">
        SAST Report Explorer
      </h1>
      <label htmlFor="repo" className="text-sm text-slate-500">
        URL to GitLab repo:
      </label>
      <input
        id="repo"
        className="w-full rounded border-2 mb-1 p-1 dark:bg-slate-700"
        placeholder="https://gitlab.com/group/project/-/blob/main/"
        value={repo}
        onInput={(e) => setRepo(e.currentTarget.value)}
      />
      <label htmlFor="json" className="text-sm text-slate-500">
        SAST Report:
      </label>
      <textarea
        id="json"
        className="w-full rounded border-2 p-1 dark:bg-slate-700"
        rows={data ? 1 : 20}
        hidden={json.length > 200000}
        onInput={(e) => setJson(e.currentTarget.value)}
        placeholder="Paste your report here"
      ></textarea>

      {data && <Report report={data} repo={repo} />}
    </main>
  );
}
