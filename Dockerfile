FROM node:boron
# Create app directory
RUN mkdir -p /usr/src/name_db
WORKDIR /usr/src/name_db

# Install app dependencies
COPY package.json /usr/src/name_db/
RUN npm install

# Bundle app source
COPY . /usr/src/name_db

EXPOSE 4949

CMD [ "npm", "start" ]

