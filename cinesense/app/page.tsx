import { supabase } from '../lib/supabase';
import SearchBar from './SearchBar';

export default async function Home({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string, p?: string }> 
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  const page = parseInt(resolvedParams.p || '1');
  
  const itemsPerPage = 20;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // 1. Fetch data using your EXACT column names from the screenshot
  let dbQuery = supabase
    .from('Movies')
    .select('*', { count: 'exact' })
    .order('TMDBRating', { ascending: false }) // Matches "TMDBRating"
    .range(from, to);

  if (query) {
    dbQuery = dbQuery.ilike('Title', `%${query}%`); // Matches "Title"
  }

  const { data: movies, count, error } = await dbQuery;

  const totalCount = count || 0;
  const hasNextPage = to < totalCount - 1; 
  const hasPreviousPage = page > 1;

  if (error) return <div className="text-red-500 p-10 text-center">Error: {error.message}</div>;

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100 p-6 md:p-12">
      <header className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-5xl font-black tracking-tighter mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          CineSense AI
        </h1>
        <SearchBar />

        {query && (
          <div className="mb-8">
            <a href="/" className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-2">
              ← Back to All Movies
            </a>
            <p className="text-slate-500 mt-2 text-sm italic">
              Showing {movies?.length} results for "{query}"
            </p>
          </div>
        )}
      </header>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {movies?.map((movie) => (
          <div key={movie.id} className="group relative bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-2xl">
            <div className="aspect-[2/3] relative overflow-hidden bg-slate-700">
              {movie.PosterUrl ? ( // Matches "PosterUrl"
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.PosterUrl}`} 
                  alt={movie.Title}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 italic text-xs p-4 text-center">No Poster</div>
              )}
            </div>
            
            <div className="p-5">
              <h2 className="font-bold text-lg truncate group-hover:text-blue-400 transition-colors">
                {movie.Title} {/* Matches "Title" */}
              </h2>
              <div className="flex justify-between items-center mt-2 text-sm text-slate-400">
                <span>{movie.ReleaseYear}</span> {/* Matches "ReleaseYear" */}
                <span className="text-blue-400 font-bold flex items-center gap-1">
                   ★ {movie.TMDBRating} {/* Matches "TMDBRating" */}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-3 line-clamp-1 italic">
                Dir. {movie.Director} {/* Matches "Director" */}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-16 flex justify-center items-center gap-6 pb-20">
        {hasPreviousPage ? (
          <a 
            href={`/?p=${page - 1}${query ? `&q=${encodeURIComponent(query)}` : ''}`} 
            className="px-6 py-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700 font-medium"
          >
            ← Previous
          </a>
        ) : (
          <span className="px-6 py-3 bg-slate-900/50 text-slate-600 rounded-xl border border-slate-800/50 cursor-not-allowed">
            ← Previous
          </span>
        )}
        
        <div className="text-center min-w-[100px]">
          <span className="text-slate-500 font-mono text-xs uppercase block">Page</span>
          <span className="text-white font-bold text-lg">{page}</span>
        </div>

        {hasNextPage ? (
          <a 
            href={`/?p=${page + 1}${query ? `&q=${encodeURIComponent(query)}` : ''}`} 
            className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition-all font-bold shadow-lg shadow-blue-900/20"
          >
            Next Page →
          </a>
        ) : (
          <span className="px-6 py-3 bg-slate-900/50 text-slate-600 rounded-xl border border-slate-800/50 cursor-not-allowed">
            End of Results
          </span>
        )}
      </div>
    </main>
  );
}