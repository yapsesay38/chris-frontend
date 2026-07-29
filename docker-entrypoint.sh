#!/bin/sh

if [ -d "/app/dist/client" ]; then
  find /app/dist/client -type f \( -name "*.html" -o -name "*.js" \) -exec sed -i \
    -e "s|{{ .Env.SUPABASE_URL }}|${SUPABASE_URL}|g" \
    -e "s|{{ .Env.SUPABASE_ANON_KEY }}|${SUPABASE_ANON_KEY}|g" \
    {} \;
fi

exec "$@"
