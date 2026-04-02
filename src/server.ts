import { validateEnv } from './config/env';
import { connectDB } from './config/db';
import { seedAdmin } from './utils/seeder';
import app from './app';
import { env } from './config/env';

validateEnv();

(async () => {
  try {
    await connectDB();
    await seedAdmin();
    app.listen(env.port, () => {
      console.log(`[server] Running on port ${env.port} in ${env.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('[server] Failed to start:', error);
    process.exit(1);
  }
})();
