FROM node:alpine as builder
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run builder

FROM nginx
EXPOSE 3000
# 작성한 nginx conf 파일 -> nginx 컨테이너에 copy
COPY ./nignx/default.conf ./etc/nignx/conf.d/default.conf   
# 위에서 생성한 빌더 파일을 nignx가 제공하도록 copy
COPY --from=builder /app/build /usr/share/nginx/html