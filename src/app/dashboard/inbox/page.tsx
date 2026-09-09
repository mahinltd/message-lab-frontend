"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Loader2, Inbox, CheckCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { SmsService } from "@/lib/sms";
import { timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface IncomingItem {
  _id: string;
  senderNumber: string;
  messageBody: string;
  receivedAt: string;
  isRead: boolean;
}

export default function InboxPage() {
  const [items, setItems] = useState<IncomingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await SmsService.getInbox(page, 20);
      setItems(data.items || []);
      setPages(data.pagination?.pages || 1);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const openMessage = async (item: IncomingItem) => {
    if (item.isRead) return;
    // Optimistically mark read
    setItems((prev) =>
      prev.map((i) => (i._id === item._id ? { ...i, isRead: true } : i))
    );
    try {
      await SmsService.markInboxRead(item._id);
    } catch {
      // ignore
    }
  };

  const markAll = async () => {
    try {
      await SmsService.markAllInboxRead();
      setItems((prev) => prev.map((i) => ({ ...i, isRead: true })));
      toast.success("All messages marked as read");
    } catch {
      toast.error("Failed to mark all read");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Inbox</h2>
          <p className="text-sm text-slate-500 mt-1">
            SMS received on your connected device.
          </p>
        </div>
        <Button variant="outline" size="md" className="gap-2" onClick={markAll}>
          <CheckCheck className="w-4 h-4" /> Mark All Read
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
          </div>
        ) : items.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">No incoming messages</p>
            <p className="text-sm text-slate-500 mt-1">
              Messages received on your device will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <button
                  key={item._id}
                  onClick={() => openMessage(item)}
                  className={cn(
                    "w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors",
                    !item.isRead && "bg-indigo-50/40"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-slate-500" />
                        </div>
                        {!item.isRead && (
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-2 ring-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={cn("text-sm truncate", item.isRead ? "font-medium text-slate-700" : "font-bold text-slate-900")}>
                          {item.senderNumber}
                        </p>
                        <p className={cn("text-sm mt-0.5 line-clamp-2", item.isRead ? "text-slate-500" : "text-slate-700")}>
                          {item.messageBody}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0">
                      {timeAgo(item.receivedAt)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <Pagination page={page} pages={pages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}