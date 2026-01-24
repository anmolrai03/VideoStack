import fs from 'node:fs';
import path from "node:path";
import multer from 'multer';

const tempDir = path.join(process.cwd() , "public/data/clientUploads");

if( !fs.existsSync(tempDir) ){
  fs.mkdirSync(tempDir, {recursive: true});
}

// CONFIG MULTER
const uploads = multer(
  {
    dest: "public/data/clientUploads/",
    limits:{
      fileSize: 10*1024*1024
    }
  }
)

export default uploads;