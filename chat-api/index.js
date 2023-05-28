/**
 * This is a simple Express app. It exposes two (three with the root) routes.
 * /conversation
 * /conversation/:id/chat - where :id is the conversation id
 */

import serverless from 'serverless-http';
import express from 'express';
import pg_pkg from 'pg';
const { Pool } = pg_pkg;

const app = express();
const pool = new Pool({ connectionString: process.env.DB_URL });

app.get('/', function (_, res) {
  res.send('Welcome to chat app! Feel free to use /conversation or /conversation/:id/chat routes');
});

app.get('/conversation', async function (_, res) {
  const { rows } = await pool.query(`
    SELECT
      conversations.id conversation_id,
      messages.id message_id,
      conversations.participants,
      messages.message,
      messages.response,
      messages.channel,
      messages.created_at message_time
    FROM messages
    INNER JOIN conversations
    ON messages.conversation_id = conversations.id
  `);
  res.json(rows);
});

app.get('/conversation/:id/chat', async function (req, res) {
  const { rows } = await pool.query(`
  SELECT
    conversations.id conversation_id,
    messages.id message_id,
    conversations.participants,
    messages.message,
    messages.response,
    messages.channel,
    messages.created_at message_time
  FROM messages
  INNER JOIN conversations
  ON messages.conversation_id = conversations.id
  WHERE conversations.id=${req.params.id}
`);
  res.json(rows);
});

export const handler = serverless(app);
