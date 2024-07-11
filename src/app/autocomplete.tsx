"use client";

import { useEffect, useState, useTransition } from "react";

let controller: AbortController | null = null;

function Loading({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export function AutoComplete() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [pending, startTransition] = useTransition();

  function search(query: string) {
    controller && controller.abort();

    controller = new AbortController();
    const signal = controller.signal;

    startTransition(async () => {
      const data = await fetch(`/search?query=${query}`, { signal }).then(
        (res) => res.json(),
      );

      setResults(data);
    });
  }

  useEffect(() => {
    search(query);
  }, [query]);

  return (
    <>
      <div className="flex items-center sticky top-0 p-4 bg-black shadow-2xl">
        <input
          autoComplete="off"
          value={query}
          placeholder="Search"
          className="flex-1 border rounded px-4 py-2 bg-black border-white text-white"
          onChange={(e) => setQuery(e.target.value)}
        />
        {pending && (
          <Loading className="absolute right-6 animate-spin h-5 w-5 text-white" />
        )}
      </div>
      <div className="px-4 flex flex-col gap-4">
        <ul>
          {results.map((result: { id: string; title: string }) => (
            <li key={result.id}>{result.title}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
