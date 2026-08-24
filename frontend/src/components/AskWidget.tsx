import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { askAgatuConnect } from "@/api/ask";

export default function AskWidget() {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<
    { question: string; answer: string; sources: { type: string; title: string }[] }[]
  >([]);

  const mutation = useMutation({
    mutationFn: askAgatuConnect,
    onSuccess: (data, submittedQuestion) => {
      setHistory((prev) => [
        ...prev,
        { question: submittedQuestion, answer: data.answer, sources: data.sources },
      ]);
      setQuestion("");
    },
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || mutation.isPending) return;
    mutation.mutate(trimmed);
  }

  return (
    <div className="rounded-lg border border-agatu-river-200 bg-white p-4 shadow-sm">
      <h2 className="mb-1 font-semibold text-agatu-river-700">
        Ask AgatuConnect
      </h2>
      <p className="mb-3 text-sm text-agatu-earth-600">
        Ask about Agatu&apos;s leaders, culture, wards, or recent news.
        Answers are grounded only in what&apos;s been published here.
      </p>

      {history.length > 0 && (
        <div className="mb-4 flex max-h-80 flex-col gap-3 overflow-y-auto">
          {history.map((entry, index) => (
            <div key={index} className="text-sm">
              <p className="font-medium text-agatu-earth-900">{entry.question}</p>
              <p className="mt-1 text-agatu-earth-700">{entry.answer}</p>
              {entry.sources.length > 0 && (
                <ul className="mt-1 flex flex-wrap gap-1">
                  {entry.sources.map((source, sourceIndex) => (
                    <li
                      key={sourceIndex}
                      className="rounded-full bg-agatu-farm-100 px-2 py-0.5 text-xs text-agatu-farm-700"
                    >
                      {source.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="e.g. Who is the current Council Chairman?"
          maxLength={500}
          className="flex-1 rounded border border-agatu-earth-200 px-3 py-2 text-sm"
          disabled={mutation.isPending}
        />
        <button
          type="submit"
          disabled={mutation.isPending || !question.trim()}
          className="rounded bg-agatu-river-600 px-4 py-2 text-sm font-medium text-white hover:bg-agatu-river-700 disabled:opacity-50"
        >
          {mutation.isPending ? "Asking..." : "Ask"}
        </button>
      </form>

      {mutation.isError && (
        <p className="mt-2 text-sm text-agatu-alert-critical">
          The assistant is temporarily unavailable. Please try again shortly.
        </p>
      )}
    </div>
  );
}
