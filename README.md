<p align="center">
  <img src="https://github.com/CPE34-A2/pre-freshy-2021/blob/main/public/logo-with-text-alt.png" alt="pre-freshy 2021" width="200" />
</p>

<p align="center">Activities website for CPE KMUTT FRESHY 2021</p>

---

### 📝 Requirements

1. [MongoDB](https://github.com/mongodb/mongo) - The NoSQL database. *(We use [mongoose](https://github.com/Automattic/mongoose) for modeling the documents)*

### 🔧 How to install?
> This website use [next.js](https://github.com/vercel/next.js/) to provide the system, if you want to see our website you can follow the instruction below.

You need `yarn` package management to run our website if you don't have it, just use the `npm i -g yarn` command for installing yarn.

1. Create `.env.local` file to config our website e.g. database, session secret. You can see the `.env.example` for the configuration example.
2. Enter the `yarn` command on your console or terminal to install all of the required modules that this website needs.
3. **Happy** by type `yarn dev` to view our website ✨

---

### ⚙ Docker Container

We also have [docker-compose](https://www.docker.com/) for you...

so you can easily make [MongoDB](https://github.com/mongodb/mongo) server, just type the command below on your console or terminal.
```bash
docker-compose --env-file=./.env.local up -d db
```
> This command only build the MongoDB  service

If you want to run **web service** (NextJS production build) and **database service** in one container, just type
```bash
docker-compose --env-file=./.env.local up -d
```
> This command builds the web/database service with the production build

---

### 💻 Developer Cheatsheet

Simply run the commands below in sequence to view or develop our website.

```bash
docker-compose --env-file=./.env.local up -d db
yarn install
yarn dev
```

**We are grateful to the community for contributing bug fixes and improvements on our website**

---

### ⚙ Contributors

**Fullstack Developer**
- [@riflowth](https://github.com/riflowth)
- [@eltfshr](https://github.com/eltfshr)
- [@XiaoXuxxxx](https://github.com/XiaoXuxxxx)
- [@Porping](https://github.com/Porping)

**Graphic Artist**
- [@tmrwithu](https://github.com/tmrwithu)
- [@jate-koh](https://github.com/jate-koh)

**DevOps**
- [@waranatcpe](https://github.com/waranatcpe)

---

### 📷 Preview

The part of some website features

<img src="https://i.imgur.com/NpTiNmJ.jpeg" alt="CPE PRE-FRESHY 2021" width="">
