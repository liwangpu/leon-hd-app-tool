FROM node:8.15.0-alpine
ENV APISERVER http://kennapi.damaozhu.com.cn
ENV PORT 4001
WORKDIR /app
COPY dist/. dist/.
EXPOSE 4000
CMD [ "node" ,"dist/browser/assets/app-startup.js"]