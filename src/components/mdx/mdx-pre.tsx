import { isValidElement, type ReactNode } from "react";

import { CodeBlock } from "@/components/mdx/code-block";
import { cn } from "@/lib/utils";

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return extractText(node.props.children);
  return "";
}

function extractLanguage(className?: string) {
  if (!className) return "terminal";
  const match = className.match(/language-([\w-]+)/);
  return match?.[1] ?? "terminal";
}

type MdxPreProps = {
  children?: ReactNode;
  className?: string;
};

export function MdxPre({ children, className }: MdxPreProps) {
  if (isValidElement<{ children?: ReactNode; className?: string }>(children)) {
    const code = extractText(children.props.children).replace(/\n$/, "");
    const language = extractLanguage(children.props.className);

    if (code) {
      return <CodeBlock code={code} language={language} className={className} />;
    }
  }

  return (
    <pre
      className={cn(
        "mb-8 w-full overflow-x-auto rounded-2xl border border-ink/15 bg-strong p-4 font-mono text-sm leading-relaxed text-on-strong sm:p-5",
        className,
      )}
    >
      {children}
    </pre>
  );
}

export function MdxInlineCode({
  className,
  children,
  ...props
}: React.ComponentProps<"code">) {
  if (className?.includes("language-")) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  return (
    <code
      className={cn(
        "rounded-md border border-ink/10 bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  );
}
