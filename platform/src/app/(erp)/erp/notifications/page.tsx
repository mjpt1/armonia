"use client";

import { ErpHeader } from "@/components/erp/ErpHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { todayJalali, toJalaliDateTime } from "@/lib/utils/jalali";
import { useCallback, useEffect, useState } from "react";

type Notif = {
  id: string;
  channel: string;
  toAddress?: string | null;
  title: string;
  body?: string | null;
  status: string;
  createdAt: string;
};

export default function NotificationsPage() {
  const [rows, setRows] = useState<Notif[]>([]);
  const [form, setForm] = useState({
    channel: "sms",
    toAddress: "",
    title: "",
    body: "",
  });

  const reload = useCallback(async () => {
    const res = await fetch("/api/notifications");
    const json = await res.json();
    setRows(json.data ?? []);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return (
    <>
      <ErpHeader
        title="اعلان‌ها"
        meta={<>صف SMS / WhatsApp / Email / In-app · stub · {todayJalali()}</>}
      />
      <main className="page-enter space-y-8 px-5 pb-12 pt-8 sm:px-10">
        <Panel labelledBy="queue">
          <PanelHead
            titleId="queue"
            title="ارسال آزمایشی"
            description="در صف ثبت می‌شود؛ دکمه «ارسال» وضعیت را به sent تغییر می‌دهد"
          />
          <form
            className="grid gap-3 sm:grid-cols-2"
            onSubmit={async (e) => {
              e.preventDefault();
              await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
              });
              setForm({ channel: "sms", toAddress: "", title: "", body: "" });
              await reload();
            }}
          >
            <select
              className="rounded-md border border-stone-100 bg-ivory px-3 py-2 text-sm"
              value={form.channel}
              onChange={(e) => setForm((s) => ({ ...s, channel: e.target.value }))}
            >
              <option value="sms">پیامک</option>
              <option value="whatsapp">واتساپ</option>
              <option value="email">ایمیل</option>
              <option value="inapp">درون‌برنامه‌ای</option>
            </select>
            <input
              className="rounded-md border border-stone-100 bg-ivory px-3 py-2 text-sm"
              placeholder="مقصد"
              value={form.toAddress}
              onChange={(e) => setForm((s) => ({ ...s, toAddress: e.target.value }))}
            />
            <input
              className="rounded-md border border-stone-100 bg-ivory px-3 py-2 text-sm sm:col-span-2"
              placeholder="عنوان"
              required
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            />
            <textarea
              className="rounded-md border border-stone-100 bg-ivory px-3 py-2 text-sm sm:col-span-2"
              placeholder="متن پیام"
              rows={3}
              value={form.body}
              onChange={(e) => setForm((s) => ({ ...s, body: e.target.value }))}
            />
            <Button type="submit" size="sm">
              افزودن به صف
            </Button>
          </form>
        </Panel>

        <Panel labelledBy="list">
          <PanelHead titleId="list" title="صف و لاگ ارسال" />
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["کانال", "عنوان", "مقصد", "وضعیت", "زمان", ""].map((h) => (
                  <th
                    key={h || "a"}
                    className="border-b border-stone-100 px-2 py-2 text-start text-xs text-ink-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((n) => (
                <tr key={n.id}>
                  <td className="border-b border-stone-100 px-2 py-2">{n.channel}</td>
                  <td className="border-b border-stone-100 px-2 py-2">{n.title}</td>
                  <td className="border-b border-stone-100 px-2 py-2" dir="ltr">
                    {n.toAddress ?? "—"}
                  </td>
                  <td className="border-b border-stone-100 px-2 py-2">
                    <Badge tone={n.status === "sent" ? "success" : "warning"}>{n.status}</Badge>
                  </td>
                  <td className="border-b border-stone-100 px-2 py-2">
                    {toJalaliDateTime(n.createdAt)}
                  </td>
                  <td className="border-b border-stone-100 px-2 py-2">
                    {n.status !== "sent" && (
                      <button
                        type="button"
                        className="text-olive-800 underline"
                        onClick={async () => {
                          await fetch("/api/notifications", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: n.id, status: "sent" }),
                          });
                          console.info(`[notify:${n.channel}] → ${n.toAddress} | ${n.title}`);
                          await reload();
                        }}
                      >
                        ارسال mock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </main>
    </>
  );
}
