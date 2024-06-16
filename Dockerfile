FROM debian:12-slim
USER root

# Required for using the correct GLIBC (v2.38)
RUN echo 'deb http://deb.debian.org/debian unstable main' >> /etc/apt/sources.list \
  && apt-get update \
  && apt-get install -y libssl-dev ca-certificates sqlite3 glibc-doc nginx

WORKDIR /app

COPY target/release/writing-trainer-backend .
COPY scripts/docker_run.sh scripts/docker_run.sh
COPY out out
COPY nginx.conf /etc/nginx/nginx.conf

CMD bash scripts/docker_run.sh
