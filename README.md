# Chat App

This repository contains functions and APIs for a backend challenge.

## Repository composition

The repository divides into three main parts (folders), each representing different functionality.

### chat-sender

This is a Lambda function that takes the chat data CSV file, validates it, and sends it to the S3 bucket.

### chat-trigger

This is a Lambda function that gets triggered on the file being uploaded to the S3 bucket. Checks if it's the CSV data file, reads it, and puts entities in the database.

### chat-api

This is an Express app that offers endpoints returning conversation data.
