'use client';
import { useState } from 'react';

export default function AdminUploadPage() {
  const [csv, setCsv] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv })
    });
    const data = await res.json();
    setStatus(data?.message || (res.ok ? 'Uploaded' : 'Failed'));
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Admin: Upload Official CSV</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <textarea value={csv} onChange={(e) => setCsv(e.target.value)} className="w-full border rounded p-3 h-48" placeholder="Paste CSV with columns: userId,eventId,officialMark" />
        <button className="bg-blue-600 text-white rounded px-3 py-2">Upload</button>
      </form>
      {status && <p className="mt-3 text-sm">{status}</p>}
    </div>
  );
}
