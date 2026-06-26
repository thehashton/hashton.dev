"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

type CodeBlockProps = {
  code: string;
  language?: string;
  className?: string;
};

const COMMAND_RE = /^(pnpm|npm|npx|yarn|bun|node|git|cd|curl|wget)\b/;
const URL_RE = /https?:\/\/[^\s]+/;

function highlightTokens(text: string, keyPrefix: string) {
  const tokens = text.split(/(\s+)/);

  return tokens.map((token, index) => {
    const key = `${keyPrefix}-t-${index}`;

    if (/^\s+$/.test(token)) {
      return <span key={key}>{token}</span>;
    }

    if (URL_RE.test(token)) {
      return (
        <span key={key} className="text-sky-300">
          {token}
        </span>
      );
    }

    if (/^--?[\w-]+$/.test(token)) {
      return (
        <span key={key} className="text-violet-300">
          {token}
        </span>
      );
    }

    if (COMMAND_RE.test(token)) {
      return (
        <span key={key} className="text-emerald-300">
          {token}
        </span>
      );
    }

    return <span key={key}>{token}</span>;
  });
}

function highlightLine(line: string, lineIndex: number, showPrompt: boolean) {
  const trimmed = line.trimStart();

  if (trimmed.startsWith("#")) {
    return <span className="text-on-strong/45">{line}</span>;
  }

  const content = trimmed.startsWith("$") ? trimmed.slice(1).trimStart() : line;

  return (
    <>
      {showPrompt ? (
        <>
          <span className="select-none text-accent-100/80">$</span>{" "}
        </>
      ) : null}
      {highlightTokens(content, `l${lineIndex}`)}
    </>
  );
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Copied to clipboard");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-on-strong/80 transition-colors hover:bg-white/10 hover:text-on-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function CodeBlock({ code, language = "terminal", className }: CodeBlockProps) {
  const lines = code.replace(/\n$/, "").split("\n");
  const label = language === "bash" || language === "sh" || language === "shell" ? "Terminal" : language;
  const showPrompt =
    language === "bash" || language === "sh" || language === "shell" || language === "terminal";

  return (
    <div
      className={cn(
        "not-prose mb-8 w-full overflow-hidden rounded-2xl border border-ink/15 bg-strong shadow-[0_20px_50px_-28px_rgba(0,0,0,0.65)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-full bg-[#ff5f57]" aria-hidden />
          <span className="size-2.5 shrink-0 rounded-full bg-[#febc2e]" aria-hidden />
          <span className="size-2.5 shrink-0 rounded-full bg-[#28c840]" aria-hidden />
          <span className="ml-1 truncate font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-on-strong/55">
            {label}
          </span>
        </div>
        <CopyButton code={code} />
      </div>

      <div className="overflow-x-auto p-4 sm:p-5">
        <pre className="font-mono text-[0.8125rem] leading-[1.75] text-on-strong sm:text-sm">
          <code>
            {lines.map((line, index) => (
              <div key={index} className="flex min-w-max gap-4">
                <span
                  aria-hidden
                  className="w-5 shrink-0 select-none text-right text-[10px] tabular-nums text-on-strong/25 sm:text-xs"
                >
                  {index + 1}
                </span>
                <span className="min-w-0 whitespace-pre">{highlightLine(line, index, showPrompt)}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
