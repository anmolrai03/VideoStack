import app from "./app.js";

app.on('error' , (err) => {
  console.log("Server Error logs: " , err);
})

const port = process.env.PORT || 3000;

app.listen(port , () => {
  console.log(`Server running on http://localhost:${port}`);
})