FROM node:latest

WORKDIR /app
COPY . /app

RUN ls
RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]