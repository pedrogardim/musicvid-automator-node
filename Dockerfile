# Start with the official Node.js image
FROM node:16

RUN apt-get update && \
    apt-get install -y curl gnupg2 ffmpeg && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install -y yarn

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn", "start"]
