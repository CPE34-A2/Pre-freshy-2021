<h1 align="center">CPE PREFRESHY 2021</h1>
<p align="center">Activities website for CPE KMUTT FRESHY 2021</p>

### 📝 Requirements
1. [MongoDB](https://github.com/mongodb/mongo) - The NoSQL database. *(We use [mongoose](https://github.com/Automattic/mongoose) for modeling the documents)*

### 🔧 How to install?
> This website use [next.js](https://github.com/vercel/next.js/) to provide the system, if you want to see our website you can follow the instruction below.

You need `yarn` package management for run our website if you don't have just use `npm i -g yarn` command for installing yarn.

1. Create `.env.local` file to config our website e.g. database, session secret. You can see `.env.example` for configuration example.
2. Enter `yarn` command on your console or terminal to install all of required modules that this website need.
3. **Happy** by type `yarn dev` to view our website ✨

We also have [docker-compose](https://www.docker.com/)

so you can easily make [MongoDB](https://github.com/mongodb/mongo) server, just type `docker-compose --env-file=./.env.local up -d` on your console or terminal.
