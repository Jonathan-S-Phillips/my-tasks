# base image
FROM node:8.9.1

# install chrome for protractor tests
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
# RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
# RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src
RUN npm install
RUN npm install -g @angular/cli@1.7.1 --unsafe

# add app
COPY . /usr/src

# expose port 3000
EXPOSE 3000

# start app
CMD ts-node src/server.ts --host 0.0.0.0 --db sqlite