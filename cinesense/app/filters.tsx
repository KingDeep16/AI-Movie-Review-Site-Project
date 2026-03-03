'use client';

import { useRouter, useSearchParams } from 'next/navigation';

// Define the type for the props we're passing in
interface FiltersProps {
  genres: string[];
}

export default function Filters({ genres }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('p', '1'); // Reset to page 1 on filter change
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mb-10 p-4 bg-slate-800/20 backdrop-blur-md rounded-2xl border border-slate-700/50">
      
      {/* Genre Filter - Now Dynamic! */}
      <select 
        onChange={(e) => updateFilter('g', e.target.value)}
        value={searchParams.get('g') || ''}
        className="bg-slate-900 border border-slate-700 text-xs text-cyan-400 rounded-lg px-3 py-2 outline-none focus:border-cyan-500 transition-all cursor-pointer"
      >
        <option value="">All Genres</option>
        {/* We map over the genres array passed from page.tsx */}
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>

      {/* Minimum Rating Filter */}
      <select 
        onChange={(e) => updateFilter('r', e.target.value)}
        value={searchParams.get('r') || ''}
        className="bg-slate-900 border border-slate-700 text-xs text-cyan-400 rounded-lg px-3 py-2 outline-none focus:border-cyan-500 transition-all cursor-pointer"
      >
        <option value="">Min Rating</option>
        <option value="8">8+ Stars</option>
        <option value="7">7+ Stars</option>
        <option value="5">5+ Stars</option>
      </select>

      {/* Cast Search Input */}
      <input 
        type="text"
        placeholder="Search Cast..."
        onKeyDown={(e) => e.key === 'Enter' && updateFilter('c', (e.target as HTMLInputElement).value)}
        defaultValue={searchParams.get('c') || ''}
        className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 outline-none focus:border-cyan-500 placeholder:text-slate-600 min-w-[150px]"
      />
    </div>
  );
}