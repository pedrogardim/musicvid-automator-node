import colors from "@colors/colors";
import { appState } from "./main.js";
import { select, input } from "@inquirer/prompts";
import { initSongProcess } from "./main.js";

export const draw = async () => {
  console.clear();
  process.stdout.write("\x1Bc");
  console.log("==MUSICVID AUTOMATOR 📹🎶==\n\n");

  if (!Object.values(appState.songs).length) {
    console.log("No videos generating".yellow);
  } else {
    Object.values(appState.songs).forEach((e, i) => {
      let stageLabel;
      let color;
      let stageIndex;
      switch (e.stage) {
        case "downloadingAudio":
          stageLabel = "Downloading audio 🔊";
          color = "cyan";
          stageIndex = 1;
          break;
        case "downloadAudioFinished":
          stageLabel = "Audio downloaded 🔊 ✅";
          color = "green";
          stageIndex = 2;
          break;
        case "renderingVideo":
          stageLabel = "Rendering video 🌌";
          color = "magenta";
          stageIndex = 3;
          break;
        case "videoFinished":
          stageLabel = "Video finished 🌌 ✅";
          color = "green";
          stageIndex = 4;
          break;
        default:
          break;
      }
      console.log(
        `${i + 1}. ${e.title.slice(
          0,
          25
        )}... | Stage ${stageIndex}: ${stageLabel} ${
          !isNaN(e.progress) ? e.progress + "%" : ""
        }`[color]
      );
    });
  }

  console.log("\n");

  appState.errorMessage && console.log(appState.errorMessage.red + "\n");

  const answer = await select(
    {
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
    },
    { clearPromptOnDone: true }
  );

  if (answer === "end") {
    console.clear();
    process.exit();
  }
  if (answer === "add") {
    const url = await input(
      { message: "Enter YouTube URL:" },
      { clearPromptOnDone: true }
    );
    initSongProcess(url);
  }
  draw();
};
