FROM mcr.microsoft.com/playwright:v1.56.1-noble AS verified
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY src ./src
COPY public ./public
COPY test ./test
COPY scripts ./scripts
RUN node scripts/verify-release.mjs
RUN npm prune --omit=dev

FROM node:22-alpine
WORKDIR /app
COPY --from=verified /app/package.json ./
COPY --from=verified /app/node_modules ./node_modules
COPY --from=verified /app/src ./src
COPY --from=verified /app/public ./public
ENV NODE_ENV=production
EXPOSE 3000
USER node
CMD ["node", "src/server.js"]
