import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Note: Use Service Role key for bulk updates
);

const TMDB_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

async function fetchPoster(title: string, year: number) {
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&year=${year}`;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      'Content-Type': 'application/json;charset=utf-8'
    }
  });

  const data = await response.json();
  // Return the poster_path from the first result (e.g., "/abc.jpg")
  return data.results?.[0]?.poster_path || null;
}

export async function enrichMovies() {
  // 1. Get all movies where PosterUrl is missing
  const { data: movies } = await supabase
    .from('Movies')
    .select('id, Title, ReleaseYear')
    .is('PosterUrl', null);

  if (!movies) return;

  console.log(`Found ${movies.length} movies needing posters...`);

  for (const movie of movies) {
    const path = await fetchPoster(movie.Title, movie.ReleaseYear);
    
    if (path) {
      await supabase
        .from('movies')
        .update({ PosterUrl: path })
        .eq('id', movie.id);
      console.log(`✅ Updated: ${movie.Title}`);
    }
    
    // Tiny delay to respect TMDB rate limits
    await new Promise(res => setTimeout(res, 100));
  }
}