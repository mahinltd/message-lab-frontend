"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminService } from "@/lib/admin";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/utils";

interface ContentItem {
  _id?: string;
  key: string;
  category: string;
  title?: string | null;
  body?: string | null;
  metadata?: Record<string, unknown>;
  isActive?: boolean;
}

const emptyForm: ContentItem = { key: "", category: "", title: "", body: "", isActive: true };

export default function AdminContentPage() {
  const [grouped, setGrouped] = useState<Record<string, ContentItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const data = await AdminService.getContent();
      setGrouped(data.grouped || {});
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    AdminService.getContent()
      .then((data) => {
        if (!cancelled) setGrouped(data.grouped || {});
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const openEdit = (item: ContentItem) => {
    setEditing({ ...item });
    setIsNew(false);
  };

  const openNew = () => {
    setEditing({ ...emptyForm });
    setIsNew(true);
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.key || !editing.category) {
      toast.error("Key and Category are required");
      return;
    }
    setBusy(true);
    try {
      await AdminService.upsertContent({
        key: editing.key.toLowerCase().trim(),
        category: editing.category.trim(),
        title: editing.title || null,
        body: editing.body || null,
        metadata: editing.metadata || {},
        isActive: editing.isActive ?? true,
      });
      toast.success("Content saved");
      setEditing(null);
      load();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Save failed"));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (key: string) => {
    if (!confirm(`Delete content "${key}"?`)) return;
    try {
      await AdminService.deleteContent(key);
      toast.success("Content deleted");
      load();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Delete failed"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Content Manager</h2>
          <p className="text-sm text-slate-500 mt-1">Edit website content shown on the public site.</p>
        </div>
        <Button size="md" className="gap-2" onClick={openNew}>
          <Plus className="w-4 h-4" /> New Content
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-indigo-600" /></div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{category}</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900 font-mono">{item.key}</p>
                        {!item.isActive && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs">inactive</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {item.title || item.body || "(empty)"}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0 ml-3">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => remove(item.key)} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? "New Content" : "Edit Content"} maxWidth="max-w-xl">
        {editing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input id="c-key" label="Key" value={editing.key} disabled={!isNew}
                onChange={(e) => setEditing({ ...editing, key: e.target.value })} />
              <Input id="c-cat" label="Category" value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
            </div>
            <Input id="c-title" label="Title" value={editing.title || ""}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Body</label>
              <textarea
                value={editing.body || ""}
                onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={editing.isActive ?? true}
                onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Active (visible on website)
            </label>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" size="md" className="flex-1" onClick={() => setEditing(null)}>Cancel</Button>
              <Button variant="primary" size="md" className="flex-1" onClick={save} isLoading={busy}>Save</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}