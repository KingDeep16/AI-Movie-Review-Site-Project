create table public."Movies" (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  "Title" text not null,
  "Description" text null,
  "PosterUrl" text null,
  "ReleaseYear" integer null,
  "Cast" text null,
  "Genre" text null,
  "TMDBRating" real null,
  "TMDBReviewCount" integer null,
  "Runtime" integer null,
  "Director" text null,
  constraint movies_pkey primary key (id)
) TABLESPACE pg_default;