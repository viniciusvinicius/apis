# use a imagem oficial Node.js
FROM node:18-alpine

WORKDIR /usr/src/app

# instala rclone se precisar mover arquivos grandes (opcional)
RUN apk add --no-cache rclone

COPY package.json package-lock.json* ./
RUN npm install --production

COPY index.js ./
COPY .env ./

# expõe a porta
EXPOSE 3000

CMD ["node", "index.js"]
