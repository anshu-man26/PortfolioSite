// AWS Lambda entrypoint. Wraps the Express app with serverless-http and
// caches the Mongo connection across invocations so warm invocations
// skip the connection handshake.

const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const app = require('./app');

// Cloudinary config is sync (no network), safe at module load.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Lambda re-uses the Node runtime across warm invocations, so we keep a
// singleton promise for the connection. `bufferCommands: false` makes
// queries fail fast instead of queueing if Mongo is unreachable, which
// avoids requests hanging until the 29s API Gateway timeout.
let connectionPromise = null;
const connectToMongo = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_DB_URI, {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false,
      })
      .catch((err) => {
        connectionPromise = null;
        throw err;
      });
  }
  await connectionPromise;
};

const wrapped = serverless(app, {
  binary: ['multipart/form-data', 'application/octet-stream', 'image/*'],
});

exports.main = async (event, context) => {
  // Keep the Lambda container alive after we return so Mongo's
  // connection pool survives between invocations.
  context.callbackWaitsForEmptyEventLoop = false;
  await connectToMongo();
  return wrapped(event, context);
};
