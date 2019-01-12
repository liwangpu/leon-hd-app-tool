FROM node:8.15.0-alpine
WORKDIR /app
COPY dist/. dist/.
EXPOSE 4000
CMD [ "node" ,"dist/browser/assets/app-startup.js"]