FROM node:latest
WORKDIR /src
COPY . /src/
RUN npm install -g nodemon
RUN npm install
ADD . /src/
CMD ["node", "/src/index.js"]   