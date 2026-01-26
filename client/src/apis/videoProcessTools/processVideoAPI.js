import api from "../../utils/api";

async function processVideoAPI(payload){
  return api.post("/api/convert", payload,{
    responseType: "blob",
    validateStatus: () => true
  });
}

export default processVideoAPI;