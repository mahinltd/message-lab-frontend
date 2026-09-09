"use client";

import React from "react";
import {
  LayoutDashboard, MessageSquare, Smartphone, CreditCard, Settings,
  Send, TrendingUp, CheckCircle2,
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: MessageSquare, label: "Messages", active: false },
  { icon: Smartphone, label: "Devices", active: false },
  { icon: CreditCard, label: "Billing", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const stats = [
  { label: "Messages Sent", value: "1,247", trend: "+12%", icon: Send },
  { label: "Success Rate", value: "98.5%", trend: "+2%", icon: CheckCircle2 },
  { label: "Active Devices", value: "1", trend: "Online", icon: Smartphone },
];

const campaigns = [
  { name: "Eid Greetings", recipients: 20, status: "Completed", color: "text-green-600 bg-green-50" },
  { name: "Order Confirmation", recipients: 8, status: "Processing", color: "text-amber-600 bg-amber-50" },
  { name: "Weekly Update", recipients: 15, status: "Queued", color: "text-slate-600 bg-slate-100" },
];

export function DashboardMockup() {
  return (
    <div className="relative mx-auto max-w-5xl">
      {/* Glow behind */}
      <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl" />

      {/* Browser frame */}
      <div className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 overflow-hidden">
        {/* Browser bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 max-w-md mx-auto">
            <div className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-500 text-center">
              app.messagelab.tech/dashboard
            </div>
          </div>
          <div className="w-12" />
        </div>

        {/* App body */}
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden sm:flex w-52 flex-col border-r border-slate-200 bg-slate-50/50 p-4 gap-1">
            <div className="flex items-center gap-2 px-2 pb-4 mb-2 border-b border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <MessageSquare className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-slate-900">MessagesLab</span>
            </div>
            {sidebarItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${
                  item.active
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-slate-600"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Campaigns</h3>
                <p className="text-xs text-slate-500">Manage your SMS campaigns</p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium flex items-center gap-2">
                <Send className="w-3.5 h-3.5" /> New Campaign
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">{s.label}</span>
                    <s.icon className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-slate-900">{s.value}</span>
                    <span className="text-[10px] text-green-600 font-medium flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> {s.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Campaign list */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              {campaigns.map((c, i) => (
                <div
                  key={c.name}
                  className={`flex items-center justify-between px-4 py-3 ${
                    i > 0 ? "border-t border-slate-100" : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.recipients} recipients</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}