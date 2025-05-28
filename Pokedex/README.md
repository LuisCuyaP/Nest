<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```
yarn instal
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```

4. Levantar la bd mongo
```
docker-compose up-d
```

5. Reconstruir la bd con la semilla
```
localhost:3000/api/v2/seed
```

Build
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build

Run
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up

Nota
Por defecto, docker-compose usa el archivo .env, por lo que si tienen el archivo .env y lo configuran con sus variables de entorno de producción, bastaría con

docker-compose -f docker-compose.prod.yaml up --build

## Stack usado
* MongoDB
* Nest