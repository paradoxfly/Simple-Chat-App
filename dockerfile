# base operating system that is small enough
FROM node:16
#selects a working directory
WORKDIR /app
#copy presents directory to app directory
COPY package*.json /app
#install dependencies
RUN npm install
COPY . .


#exposes port 3000
EXPOSE 3000
#commands to pass
CMD ["node", "index.js"]
