import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Analyzer {
  id: string;
  name: string;
  url: string;
  vendor: {
    name: string;
  };
  version: string;
}

interface Scanner {
  id: string;
  name: string;
  url: string;
  vendor: {
    name: string;
  };
  version: string;
}

interface Scan {
  analyzer: Analyzer;
  scanner: Scanner;
  type: string;
  start_time: string;
  end_time: string;
  status: string;
}

interface Scanner {
  id: string;
  name: string;
}

interface Location {
  file: string;
  start_line: number;
  end_line: number;
}

interface Identifier {
  type: string;
  name: string;
  value: string;
  url?: string;
}

interface Vulnerability {
  incrementId: number;

  id: string;
  category: string;
  name: string;
  description: string;
  cve: string;
  severity: string;
  scanner: Scanner;
  location: Location;
  identifiers: Identifier[];
}

export interface SastJson {
  version?: string;
  vulnerabilities?: Vulnerability[];
  scan: Scan;
}

interface Props {
  report: SastJson;
  repo: string;
}

function getSeverityClass(severity: string) {
  switch (severity) {
    case "Medium":
      return "bg-orange-400";
    case "Low":
      return "bg-teal-400";
    case "High":
      return "bg-red-500";
  }
}

export function Report({ report, repo }: Props) {
  const [subdir, setSubdir] = useState<string>("");
  const [severity, setSeverity] = useState<string>("");
  const vulnerabilities = report.vulnerabilities
    ?.map((item, i) => {
      item.incrementId = i;
      return item;
    })
    ?.filter((item) => item.location.file.startsWith(subdir))
    .filter((item) => item.severity.startsWith(severity));

  const [page, setPage] = useState<number>(1);
  const pageSize = 20;

  const pageStart = pageSize * (page - 1);
  const pageEnd = pageStart + pageSize;

  const vulnsCount = vulnerabilities?.length ?? 0;
  const paginationEnabled = vulnsCount > pageSize;
  const pages = Math.ceil(vulnsCount / pageSize);

  useEffect(() => {
    setPage(1);
  }, [vulnsCount]);

  console.log("Render");

  return (
    <div>
      <details className="sticky top-0 bg-slate-100 z-10 dark:bg-slate-800">
        <summary className="cursor-pointer">Filters</summary>
        <div className="flex border-2 rounded">
          <div className="flex p-2 border-r">
            <label>Severity: </label>
            <select
              onInput={(e) => setSeverity(e.currentTarget.value)}
              className="bg-transparent px-2"
            >
              <option value="">Select severity</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="flex p-2 border-r">
            <label>Subdirectory: </label>
            <input
              className="bg-transparent px-2"
              placeholder="e.g. nextapp"
              onInput={(e) => setSubdir(e.currentTarget.value)}
            />
          </div>
        </div>
      </details>
      <div className="rounded p-4  border-slate-200 border-2 mt-4 mb-10 dark:border-slate-600">
        <h2>Results</h2>
        <div className="text-slate-500">
          Versions: Report {report.version} / Analyzer{" "}
          {report.scan.analyzer.name} {report.scan.analyzer.version} / Scanner{" "}
          {report.scan.scanner.name} {report.scan.scanner.version}
        </div>
        <div className="text-slate-500">
          Status: {report.scan.status} / Vulnerabilities:{" "}
          {vulnerabilities?.length}
        </div>

        {vulnerabilities?.slice(pageStart, pageEnd)?.map((item) => (
          <details
            key={item.id + item.incrementId}
            className="border-t-2 py-4 group"
          >
            <summary className="relative pr-2 cursor-pointer flex hide-arrow after:content-['▼'] after:block after:absolute after:right-2 after:transition-transform after:origin-center group-open:after:rotate-180">
              <h3 className="text-lg font-semibold inline-block text-slate-800 dark:text-slate-100">
                <span
                  className={`p-1 rounded mr-2 px-4 ${getSeverityClass(
                    item.severity
                  )}`}
                >
                  {item.severity}
                </span>{" "}
                {item.name}
              </h3>
            </summary>
            <div className="mt-1 dark:text-slate-300">
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-blue-600 underline hover:text-blue-800 dark:hover:text-blue-500"
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul {...props} className="list-disc pl-6 my-2" />
                  ),
                  p: ({ node, ...props }) => <p {...props} className="my-2" />,
                }}
              >
                {item.description}
              </Markdown>

              <h4 className="text-md font-semibold inline-block text-slate-800 dark:text-slate-300">
                Identifiers
              </h4>

              <ul className="list-disc pl-6 my-2">
                {item.identifiers.map((item) => (
                  <li key={`${item.type}.${item.name}`}>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        className="text-blue-600 underline hover:text-blue-800 dark:hover:text-blue-500"
                      >
                        {item.name}
                      </a>
                    ) : (
                      item.name
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-1">
              Source:{" "}
              <a
                href={getUrl(repo, item.location)}
                className="text-blue-600 underline hover:text-blue-800 dark:hover:text-blue-500"
                target="_blank"
              >
                Open {item.location.file}:{item.location.start_line}
                {item.location.end_line ? `-${item.location.end_line}` : ""}
              </a>
            </p>
          </details>
        ))}

        <div className="flex justify-end">
          <button
            className="inline-block w-8 h-8 border-2 rounded-l"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            &lt;
          </button>
          <span className="inline-block h-8 border-2 border-x-0 p-1">
            {page} / {pages}
          </span>
          <button
            className="inline-block w-8 h-8 border-2 rounded-r"
            onClick={() => setPage((p) => Math.min(p + 1, pages))}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

function getUrl(repo: string, location: Location) {
  try {
    return new URL(
      `${location.file}#L${location.start_line}${
        location.end_line ? `-${location.end_line}` : ""
      }`,
      repo
    ).toString();
  } catch {
    return "";
  }
}
