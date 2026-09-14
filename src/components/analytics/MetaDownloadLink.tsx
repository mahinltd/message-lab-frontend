"use client";

import { trackMetaCustomEvent } from "@/lib/analytics/meta";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MetaDownloadLink() {
  return (
    <a
      href="/downloads/MessageLab.apk"
      download="MessageLab.apk"
      className="mt-8 block"
      onClick={() => trackMetaCustomEvent("apk_download", { asset_name: "MessageLab.apk" })}
    >
      <Button size="lg" className="w-full gap-2 sm:w-auto sm:min-w-72">
        <Download className="h-5 w-5" /> Download the Android app
      </Button>
    </a>
  );
}