FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y \
    curl python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# Install Meteor
RUN curl https://install.meteor.com/ | sh
ENV PATH="/root/.meteor:$PATH"

WORKDIR /app

# Install npm deps as a separate layer (cache-friendly)
COPY package.json package-lock.json ./
COPY .meteor/packages .meteor/release .meteor/
RUN meteor npm install

EXPOSE 3000

CMD ["meteor", "run", "--port", "3000"]
