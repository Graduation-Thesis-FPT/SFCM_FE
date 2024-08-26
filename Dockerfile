FROM node:16-slim
# Create app directory (with user `node`)
RUN mkdir -p /app
WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .
ENV HOST=0.0.0.0 PORT=2024
EXPOSE 2024
CMD [ "npm", "start"]

