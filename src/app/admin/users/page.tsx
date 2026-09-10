"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Users } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Pagination } from "@/components/ui/pagination";
import { AdminService } from "@/lib/admin";
import { timeAgo, getInitials } from "@/lib/utils";
import { AdminUser } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isVerified, setIsVerified] = useState("");
  const [isDisabled, setIsDisabled] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await AdminService.getUsers({
        page,
        limit: 15,
        search: search || undefined,
        role: role || undefined,
        isVerified: isVerified || undefined,
        isDisabled: isDisabled || undefined,
      });
      setUsers(data.users || []);
      setPages(data.pagination?.pages || 1);
      setTotal(data.pagination?.total || 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, search, role, isVerified, isDisabled]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => load(), search ? 400 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  return (
    <div className="space-y-6">
      {/* Header + filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Users</h2>
          <p className="text-sm text-slate-500 mt-1">{total} total users</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, email, mobile..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={role}
          onChange={(e) => { setRole(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={isVerified}
          onChange={(e) => { setIsVerified(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Verification</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
        <select
          value={isDisabled}
          onChange={(e) => { setIsDisabled(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Status</option>
          <option value="false">Active</option>
          <option value="true">Disabled</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
          </div>
        ) : users.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">User</th>
                    <th className="text-left px-6 py-3 font-medium hidden md:table-cell">Role</th>
                    <th className="text-left px-6 py-3 font-medium">Verification</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-left px-6 py-3 font-medium hidden lg:table-cell">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50 cursor-pointer">
                      <td className="px-6 py-3" onClick={() => router.push(`/admin/users/${u._id}`)}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {getInitials(u.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">{u.name}</p>
                            <p className="text-xs text-slate-500 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 hidden md:table-cell">
                        <span className={`text-xs font-semibold uppercase ${u.role === "admin" ? "text-indigo-600" : "text-slate-500"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={u.isEmailVerified ? "active" : "pending"} />
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={u.isAccountDisabled ? "disabled" : "active"} />
                      </td>
                      <td className="px-6 py-3 text-slate-500 hidden lg:table-cell">
                        {timeAgo(u.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pages={pages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}