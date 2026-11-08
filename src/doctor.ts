import { assertReady, config } from './config.ts';
import { browserReady } from './browser.ts';
try {
  assertReady(config.milestone >= 5);
  if (config.milestone >= 3 && !browserReady()) throw new Error('Set KERNEL_API_KEY for milestone 3 and later.');
  console.log(`Configuration valid for milestone ${config.milestone}. This check makes no network calls.`);
  console.log('Use npm run starter:chat after completing each TODO, or solution:chat for the instructor version. Text your Linq line to verify phone delivery.');
} catch (error) { console.error((error as Error).message); process.exitCode = 1; }
