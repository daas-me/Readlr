import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port;

// Start server
app.listen(PORT, () => {
  console.log(`Readlr backend running on http://localhost:${PORT}`);
});

export default app;
