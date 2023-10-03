import fs from "fs";
import { authorize } from "./src/upload/auth.js";
import { draw } from "./src/draw.js";

fs.readFile("client_secret.json", (err, content) => {
  if (err) {
    console.log("Error loading client secret file: " + err);
    return;
  }
  authorize(JSON.parse(content), () => draw());
});
