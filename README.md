# Chat App

This repository contains functions and APIs for a backend challenge.

## Repository composition

The repository divides into three main parts (folders), each representing different functionality.

### <span style="color:gold">chat-sender</span>

This is a Lambda function that takes the chat data CSV file, validates it, and sends it to the S3 bucket.

### <span style="color:gold">chat-trigger</span>

This is a Lambda function that gets triggered on the file being uploaded to the S3 bucket. Checks if it's the CSV data file, reads it, and puts entities in the database.

### <span style="color:gold">chat-api</span>

This is an Express app that offers endpoints returning conversation data. Available endpoints are `/conversation` and `/conversation/<id>/chat`

## Prerequisites

1. This repository was built with Linux systems in mind. While Node functions will run on Windows, a few bash scripts will require Linux CLI.

2. Functions were built using the latest stable `Node 18.16.0`.

3. I decided to use `PostgreSQL`. While I don't have a script to automatically set up the DB (nice TODO), the `chat-app-db.sql` file located under the root folder has the whole schema.

4. All functions were developed to deploy them on AWS Lambda in mind.

5. Local development will require `.env` file with API keys, DB URL and so on.

## Local development

In order to run and develop functions locally, first install all dependencies:

```bash
yarn
```

To run any function like <span style="color:gold">chat-sender</span> or <span style="color:gold">chat-trigger</span> use:

```bash
yarn local:sender
yarn local:trigger
```

<span style="color:gold">chat-api</span> will run serverless Express app on port `3001`. Just use:

```bash
yarn local:api
```

## Deployment

Functions should be put on AWS Lambda. I created a simple bash script that will make a function ZIP file that can be easily deployed. The builds can be later find under `_build` folder.

```bash
build:sender
build:trigger
build:api
```

In order to add all necessary dependencies you can use this script to create a Lambda layer that can be later added to the function itself.

```bash
build:layer
```

## Formatting and lint
You can check syntax or format files with *Priettier* by running:

```bash
yarn lint
yarn format
```

*Made with 💗 from Paweł Leja*