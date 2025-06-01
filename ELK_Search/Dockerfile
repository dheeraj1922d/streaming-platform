FROM --platform=linux/amd64 node:latest 
WORKDIR /app 
COPY . /app 
RUN npm install 
EXPOSE 8083 
CMD node index.js