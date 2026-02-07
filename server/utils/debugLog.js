import { DEV_ENV } from "../constants/nodeEnv.js"

/*
  - USED FOR DEBUGGING 
  - IF CURRENT ENVIRONMENT IS DEVELOPMENT
  - SHOW THE CONSOLE LOGS ELSE DO NOTHING
*/
const debugLog = ( message, data={}) => {
  if( process.env.NODE_ENV === DEV_ENV){
    console.log(`[${message}: ${data}]`);
  }
};

export default debugLog;