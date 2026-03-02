'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      router.push(`/?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/');
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 10,000+ movies..."
          className="w-full bg-slate-800/50 border border-slate-700 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-500 text-lg shadow-2xl"
        />
        <button type="submit" className="absolute right-3 top-3 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl transition-colors font-bold">
          Search
        </button>
      </div>
    </form>
  );
}