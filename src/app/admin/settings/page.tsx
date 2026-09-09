"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Settings as SettingsIcon, Pencil } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminService } from "@/lib/admin";
import { toast } from "sonner";

interface SettingItem {
  _id?: string;
  key: string;
  value: any;
  valueType: string;
  description?: string | null;
  category: string;
}

export default function AdminSettingsPage() {
  const [grouped, setGrouped] = useState<Record<string, SettingItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SettingItem | null>(null);
  const [valueText, setValueText] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getSettings();
      const groupedMap: Record<string, SettingItem[]> = {};
      for (const s of data.settings || []) {
        if (!groupedMap[s.category]) groupedMap[s.category] = [];
        groupedMap[s.category].push(s);
      }
      setGrouped(groupedMap);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (s: SettingItem) => {
    setEditing(s);
    setValueText(typeof s.value === "string" ? s.value : JSON.stringify(s.value, null, 2));
  };

  const save = async () => {
    if (!editing) return;
    setBusy(true);

    let parsed: any = valueText;
    let valueType = "string";
    try {
      parsed = JSON.parse(valueText);
      valueType = typeof parsed === "boolean" ? "boolean" : typeof parsed === "number" ? "number" : "json";
    } catch {
      valueType = "string";
      parsed = valueText;
    }

    try {
      await AdminService.upsertSetting({
        key: editing.key,
        value: parsed,
        valueType,
        description: editing.description || null,
        category: editing.category,
      });
      toast.success("Setting saved");
      setEditing(null);
      load();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const preview = (v: any) => {
    if (typeof v === "boolean") return v ? "true" : "false";
    if (typeof v === "number") return String(v);
    if (typeof v === "string") return v.length > 40 ? v.slice(0, 40) + "..." : v;
    return JSON.stringify(v);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Platform Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Global configuration for the entire platform.</p>
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
                {items.map((s) => (
                  <div key={s.key} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 font-mono">{s.key}</p>
                      {s.description && <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">{preview(s.value)}</span>
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={`Edit: ${editing?.key || ""}`}>
        {editing && (
          <div className="space-y-4">
            {editing.description && (
              <p className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">{editing.description}</p>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Value <span className="text-slate-400">({editing.valueType})</span>
              </label>
              <textarea
                value={valueText}
                onChange={(e) => setValueText(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              />
              <p className="text-xs text-slate-400 mt-1.5">
                Booleans: true/false · Numbers: 3000 · Strings: plain text · Objects: JSON
              </p>
            </div>
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