#talk (pronounced "hashtalk") is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Initial Setup
Before you start contributing to the project, you need to setup the project on your local machine.

1. Clone the Repository:
```bash
git clone https://github.com/hashtalk-app/hashtalk-app.git
cd hashtalk-app
```

2. Switch to the Development Branch:
Make sure any contributions you make are on an appropriate development branch. For example:
```bash
git checkout dev
```
3. Creating the .env File
In order to manage environment variables, this project utilizes a ".env" file. This file contains sensitive information, therefore it is not available in the repository. You will have to setup your own .env file:

In the root directory of the repository, create a file named ".env".
Request the proper environment keys from a project administrator. You will place these keys in the .env file.

## Installing Packages
Install the following necessary packages while in the root directory of your cloned hashtalk-app repository:

```bash
npm install @clerk/nextjs
```

## Getting Started

Now, you can run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to open the application locally.
