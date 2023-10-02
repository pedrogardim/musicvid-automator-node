import { appState } from "./main.js";
import { select, input } from "@inquirer/prompts";

export const draw = async () => {
  console.clear();
  console.log("==MUSICVID AUTOMATOR 📹🎶==\n\n");

  if (!Object.values(appState.songs).length) {
    console.log("No videos generating");
  } else {
  }

  console.log("\n");

  const answer = await select({
    message: "What should we do?",
    choices: [
      {
        name: "Generate a video",
        value: "add",
      },
      {
        name: "End program",
        value: "end",
      },
    ],
  });

  if (answer === "end") {
    console.clear();
    process.exit();
  }
  if (answer === "add") {
    const url = await input({ message: "Enter SoundCloud url:" });
    console.log(url);
    return;
  }
  draw();
};
