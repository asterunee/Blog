"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return <button className="copy-button" onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); }} aria-label="코드 복사">{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "복사됨" : "복사"}</button>;
}
