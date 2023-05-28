import * as fs from 'fs';
import { parseStream } from '@fast-csv/parse';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const CHANNELS = ['instagram', 'facebook', 'whatsapp', 'email'];

export const handler = async () => {
  const isLocal = process.env?.LOCAL == 1;
  const csvPath = (isLocal ? './chat-sender/' : './') + 'test-data.csv';

  const checkForCsvError = () => {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(csvPath);
      parseStream(stream, { headers: true })
        .validate(
          (data) =>
            data.sender_username &&
            data.reciever_username &&
            data.message &&
            data.channel &&
            CHANNELS.includes(data.channel),
        )
        .on('error', reject)
        .on('data', () => {})
        .on('data-invalid', (row, rowNumber) => {
          stream.destroy();
          reject(`Invalid [rowNumber=${rowNumber}] [row=${JSON.stringify(row)}]`);
        })
        .on('end', () => resolve());
    });
  };
  try {
    await checkForCsvError();
    const blob = fs.readFileSync(csvPath);
    const key = csvPath.split(/(\\|\/)/g).pop();
    const s3Client = new S3Client({
      region: process.env.AWS_S3_BUCKET_REGION,
      ...(isLocal && {
        credentials: {
          accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
        },
      }),
    });
    const command = new PutObjectCommand({
      Key: key,
      Body: blob,
      ContentType: 'text/csv',
      Bucket: process.env.AWS_S3_BUCKET_NAME,
    });
    console.log('Sending file...');
    await s3Client.send(command);
  } catch (error) {
    return {
      statusCode: 500,
      message: error,
    };
  }
  return {
    statusCode: 200,
  };
};
