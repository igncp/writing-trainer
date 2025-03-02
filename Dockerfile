FROM rust:1-alpine3.20 AS chef
RUN apk update && apk upgrade
RUN apk add --no-cache libressl-dev ca-certificates musl-dev alpine-sdk libffi-dev bash sqlite sqlite-dev
RUN cargo install cargo-chef
WORKDIR /app

FROM chef AS planner
COPY . .
RUN cargo chef prepare  --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN rustup target add $(uname -m)-unknown-linux-musl
RUN cargo chef cook --release \
  --recipe-path recipe.json \
  --target $(uname -m)-unknown-linux-musl \
  -p writing-trainer-backend
# Copy all rust directories
COPY scripts scripts
COPY rust_packages rust_packages
COPY .cargo .cargo
COPY Cargo.toml Cargo.lock ./
RUN bash scripts/build_docker.sh

FROM alpine:3.20.2
WORKDIR /app
RUN apk add --no-cache openssl-dev ca-certificates sqlite nginx bash
COPY --from=builder /app/scripts scripts
COPY --from=builder /app/writing-trainer .
COPY out static
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["bash", "scripts/docker_run.sh"]
