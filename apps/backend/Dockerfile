FROM node
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable

COPY package.json /app
RUN pnpm install --prod

COPY dist /app

CMD ["node", "src/server.js"]