FROM --platform=linux/amd64 node:latest 
WORKDIR /app 
COPY . /app 
RUN npm install 
EXPOSE 8082 
CMD node index.js