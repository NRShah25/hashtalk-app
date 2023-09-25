#talk (pronounced "hashtalk") is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# 1. Initial Setup
Before you start contributing to the project, you need to setup the project on your local machine.

## 1.1. Clone the Repository

```bash
git clone https://github.com/hashtalk-app/hashtalk-app.git
cd hashtalk-app
```

## 1.2. Switch to the Development Branch
Make sure any contributions you make are pushed to an appropriate development branch. For example:

```bash
git checkout dev
```

## 1.3. Creating the .env File
In order to manage environment variables, this project utilizes a ".env" file. This file contains sensitive information, therefore it is not available in the repository. You will have to setup your own .env file:

In the root directory of the repository, create a file named ".env".
Request the proper environment keys from a project administrator. You will place these keys in the .env file.

# 2. Installing Packages
Install the following necessary packages:

## 2.1 clerk-js

```bash
npm install @clerk/nextjs
```

## 2.2 next-themes

```bash
npm i next-themes
```

## 2.3 prisma

```bash
npm i -D prisma
npm i @prisma/client
```

# Getting Started
Now, you can run the development server using the following command:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to open the application locally.
