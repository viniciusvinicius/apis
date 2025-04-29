# 1) Base
FROM node:18-alpine

# 2) Ponto de trabalho dentro do container
WORKDIR /usr/src/app

# 3) Copia apenas package.json para instalar dependências
#    a partir da sub-pasta youtube-uploader
COPY youtube-uploader/package.json youtube-uploader/package-lock.json* ./

# 4) Instala deps
RUN npm install --production

# 5) Copia TODO o código da pasta youtube-uploader para /usr/src/app
COPY youtube-uploader/ ./

# 6) Expõe porta da API
EXPOSE 3000

# 7) Comando padrão
CMD ["node", "index.js"]
