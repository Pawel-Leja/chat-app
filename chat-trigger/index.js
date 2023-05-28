import { parseFile } from '@fast-csv/parse';
import pg_pkg from 'pg';
const { Pool } = pg_pkg;

import getResponse from './message-response.js';

export const handler = async (event) => {
  const data = [];
  const pool = new Pool({ connectionString: process.env.DB_URL });
  const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const csvPath = './chat-sender/' + srcKey;

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

  const processRow = async (row) => {
    const { sender_username, reciever_username, message, channel } = row;
    let convoId = null;
    const response = getResponse(sender_username, reciever_username, message, channel);
    const {
      rows: [r1],
    } = await pool.query(`
      SELECT id
      FROM conversations
      WHERE participants @> '{${sender_username},${reciever_username}}'
    `);
    if (!r1) {
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
