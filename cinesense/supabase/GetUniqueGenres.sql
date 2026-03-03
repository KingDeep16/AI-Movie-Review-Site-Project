CREATE OR REPLACE FUNCTION get_unique_genres()
RETURNS TABLE (genre_name text) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY 
  SELECT DISTINCT trim(genre_item)
  FROM (
    SELECT unnest(string_to_array("Genre", '|')) AS genre_item
    from "Movies"
    WHERE "Genre" IS NOT NULL AND "Genre" != ''
  ) AS subquery
  WHERE genre_item != ''
  ORDER BY 1 ASC;
END;
$$;