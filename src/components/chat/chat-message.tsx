"use client";

import type { UIMessage } from "ai";
import { PawPrint, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolResultRenderer } from "./tool-result-renderer";
import type { ToolResultData } from "@/types/chat";

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  const textContent = message.parts
    .filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
    .map((p) => p.text)
    .join("");

  const toolParts = message.parts.filter(
    (p): p is Extract<typeof p, { type: string; state: string }> =>
      p.type.startsWith("tool-") || p.type === "dynamic-tool"
  );

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <PawPrint className="h-4 w-4 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[95%] space-y-3 sm:max-w-[75%]",
          isUser ? "order-first" : ""
        )}
      >
        {textContent && (
          <div
            className={cn(
              "rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            )}
          >
            {textContent}
          </div>
        )}

        {toolParts.map((part, i) => {
          if (
            "state" in part &&
            part.state === "output-available" &&
            "output" in part
          ) {
            const result = part.output as ToolResultData;
            return (
              <div key={i} className="w-full min-w-0">
                <ToolResultRenderer result={result} />
              </div>
            );
          }
          return null;
        })}
      </div>
      {isUser && (
        <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-foreground/10">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
