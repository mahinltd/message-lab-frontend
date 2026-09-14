"use client";

import { useEffect, useRef } from "react";
import { trackMetaEvent } from "@/lib/analytics/meta";

export function MetaViewContent({ contentName }: { contentName: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackMetaEvent("ViewContent", { content_name: contentName });
  }, [contentName]);

  return null;
}