import { app } from "./app.js";
import { config } from "./config.js";
import { pingDatabase } from "./db.js";

const bootstrap = async () => {
  await pingDatabase();
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server running on http://localhost:${config.port}`);
  });
};

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start API server", error);
  process.exit(1);
});
