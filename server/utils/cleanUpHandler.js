import fs from 'node:fs/promises';

function cleanUpFiles(...paths){
  for(const path of paths){
    if( !path) continue;
    fs.unlink(path).catch( (err) =>{
      throw new Error("File Unlinking failed");
    })
  }
}

export default cleanUpFiles;