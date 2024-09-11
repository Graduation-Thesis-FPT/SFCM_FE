FROM node:20-slim
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start", "--", "--host=0.0.0.0"]

