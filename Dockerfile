FROM node:16.0.0

RUN mkdir -p /myPortfolio/backend
WORKDIR /myPortfolio/backend

COPY package*.json  /myPortfolio/backend/
RUN npm install
COPY . /myPortfolio/backend/

EXPOSE 8080
CMD npm run start