FROM node:22.18.0-slim

# installing ffmpeg to the server os
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# specifying a working directory
WORKDIR /server

# copy the package.json file
COPY package*.json ./

#run npm install to get all dependencies
RUN npm install --production

#copy all of the remaining code
COPY . .

#expose port
EXPOSE 3000

# cmd to start when we run the docker container
CMD [ "node", "server.js" ]