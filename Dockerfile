FROM rustlang/rust:nightly-slim AS backend-build

RUN apt-get update \
  && apt-get install -yqq libsqlite3-dev libmariadbclient-dev-compat libpq-dev

WORKDIR /app

COPY foodi-backend /app/foodi-backend
RUN cd foodi-backend \
  && cargo build --release \
  && cargo install diesel_cli

FROM node:current-alpine AS frontend-build

WORKDIR /app

COPY foodi-frontend /app/foodi-frontend
RUN cd foodi-frontend \
  && yarn install \
  && PARCEL_WORKERS=2 yarn build

FROM openresty/openresty:stretch

RUN apt-get update \
  && apt-get install -yqq libsqlite3-0 libmariadbclient18 libpq5 \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy from backend stage
COPY --from=backend-build /app/foodi-backend/target/release/foodi-backend /usr/bin
COPY --from=backend-build /usr/local/cargo/bin/diesel /usr/bin

# Copy from frontend stage
COPY --from=frontend-build /app/foodi-frontend/dist /app/dist

# Copy entrypoint, nginx config, and DB
COPY entrypoint.sh /usr/bin/entrypoint.sh
COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
COPY foodi-backend/sample-database.sqlite /app/database.sqlite
COPY foodi-backend/Rocket.toml /app/Rocket.toml

EXPOSE 80

CMD ["/usr/bin/entrypoint.sh"]
