import createApp from "./app.js";
import connectDb from "./configs/db.js";

connectDb()
  .then(() => {

    const app = createApp();
    
    app.on("error", (err) => {
      console.log("Server Error logs: ", err);
    });

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });

  })
  .catch((err) => {
    console.log("[Mongodb connection failed!! See logs] ", err);
    process.exit(1);
  });
