FROM node:8-alpine

# create app directory in container
RUN mkdir -p /app

# set /app directory as default working directory
WORKDIR /app

# only copy package.json initially so that `RUN yarn` layer is recreated only
# if there are changes in package.json
ADD package.json package-lock.json /app/

# --pure-lockfile: Don’t generate a yarn.lock lockfile
RUN npm install --no-save

# copy all file from current dir to /app in container
COPY . /app/

# build project
RUN npm run build

# install pm2
RUN npm install pm2 -g

# expose port 8000
EXPOSE 8000

# cmd to start service
CMD [ "pm2", "--no-daemon", "start", "ecosystem.json" ]
