// lib/app.ts
import express from 'express';

// Create a new express application instance
const app: express.Application = express();

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
