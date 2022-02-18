FROM node:latest
WORKDIR /src
COPY ./src/ /src/
RUN npm install -g nodemon
RUN npm install
ADD ./src/ /src/
CMD ["node", "/src/index.js"]