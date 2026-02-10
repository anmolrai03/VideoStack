import { DEV_ENV } from "../constants/nodeEnv.js"

/*
  - USED FOR DEBUGGING 
  - IF CURRENT ENVIRONMENT IS DEVELOPMENT
  - SHOW THE CONSOLE LOGS ELSE DO NOTHING
*/
const debugLog = (message, data = null) => {
  if (process.env.NODE_ENV === DEV_ENV) {
    if (data) {
      console.log(`[${message}]`, data ?? {});
    } else {
      console.log(`[${message}]`);
    }
  }
};

export default debugLog;