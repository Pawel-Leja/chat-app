/**
 * This function should run as a trigger when a new file was uploaded to AWS S3 Bucket.
 * It reads the file and pushes data to the database.
 */

import { parseFile } from '@fast-csv/parse';
import pg_pkg from 'pg';
const { Pool } = pg_pkg;

import getResponse from './message-response.js';

export const handler = async (event) => {
  const data = [];
  const pool = new Pool({ connectionString: process.env.DB_URL });
  // TODO: finish the functionality to load the file from the URL rather than locally.
  const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const csvPath = './chat-sender/' + srcKey;

  // Working with streams is hard. Working with async functions within streams is even harder.
  // That's why the workaround loads the data from the stream to an array.
  // TODO: improve to work asynchronously on rows instead of loading the data to the cache.
  const parseCsv = () =>
    new Promise((resolve, reject) => {
      parseFile(csvPath, { headers: true })
        .on('error', (error) => {
          console.error(error);
          reject();
        })
        .on('data', (row) => {
          data.push(row);
        })
        .on('end', (rowCount) => {
          console.log(`Parsed ${rowCount} rows`);
          resolve();
        });
    });
  await parseCsv();

  // This processes a single row.
  const processRow = async (row) => {
    const { sender_username, reciever_username, message, channel } = row;
    let convoId = null;
    // Get the response based on input.
    const response = getResponse(sender_username, reciever_username, message, channel);
    // Check if the conversation between these two users already exists. If so, get the conversation id.
    const {
      rows: [r1],
    } = await pool.query(`
      SELECT id
      FROM conversations
      WHERE participants @> '{${sender_username},${reciever_username}}'
    `);
    if (!r1) {
      // If there is no conversation id, create a new conversation.
      const {
        rows: [r2],
      } = await pool.query(`
        INSERT INTO conversations(participants)
        VALUES ('{${sender_username},${reciever_username}}')
        RETURNING id
      `);
      convoId = r2.id;
    } else {
      convoId = r1.id;
    }
    // Insert the new message.
    await pool.query(
      `
        INSERT INTO messages(message, response, channel, conversation_id)
        VALUES ($1, $2, $3, $4)
      `,
      [message, response, channel, convoId],
    );
  };

  for (const row of data) {
    await processRow(row);
  }

  return {
    statusCode: 200,
  };
};
