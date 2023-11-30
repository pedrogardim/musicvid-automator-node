import readline from "readline";
import colors from "@colors/colors";
import { appState } from "./main.js";
import { select, input } from "@inquirer/prompts";
import { initSongProcess } from "./main.js";

//TEMP
import events from "events";
events.EventEmitter.defaultMaxListeners = 9999;

const choices = [
  {
    name: "Generate a video",
    value: "add",
  },
  {
    name: "End program",
    value: "end",
  },
];

let selectedOption = 0;
let isInsertingUrl = false;

export const draw = async () => {
  console.clear();
  process.stdout.write("\x1Bc");
  // inputInterface.close();
  console.log("==MUSICVID AUTOMATOR 📹🎶==\n\n");

  if (!Object.values(appState.songs).length) {
    console.log("No videos generating".yellow);
  } else {
    Object.values(appState.songs).forEach((e, i) => {
      let stageLabel;
      let color;
      let stageIndex;
      switch (e.stage) {
        case "gettingInfo":
          stageLabel = "Getting info ⬇ ℹ️";
          color = "brightCyan";
          stageIndex = 1;
          break;
        case "downloadingAudio":
          stageLabel = "Downloading audio 🔊";
          color = "cyan";
          stageIndex = 2;
          break;
        case "renderingVideo":
          stageLabel = "Rendering video 🌌";
          color = "magenta";
          stageIndex = 3;
          break;
        case "uploadingVideo":
          stageLabel = "Uploading video ⬆";
          color = "brightYellow";
          stageIndex = 4;
          break;
        case "done":
          stageLabel = "Everything done ✅";
          color = "green";
          stageIndex = 5;
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

  console.log("What should we do?");

  if (isInsertingUrl) {
    inputInterface.question("Enter YouTube URL:", (url) => {
      initSongProcess(url);
      inputInterface.close();
    });
  } else {
    choices.forEach((choice, index) => {
      const choicePrint =
        index === selectedOption ? `› ${choice.name}`.cyan : `  ${choice.name}`;
      console.log(choicePrint);
    });
  }

  process.stdin.resume();
  return;

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
    inputInterface.question("Enter YouTube URL:", (url) => {
      initSongProcess(url);
      inputInterface.close();
    });

    const url = await input(
      { message: "Enter YouTube URL:" },
      { clearPromptOnDone: true }
    );
  }
  draw();
};

readline.emitKeypressEvents(process.stdin);

export const inputInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

process.stdin.on("keypress", (ch, key) => {
  switch (key?.name) {
    case "up":
      selectedOption++;
      selectedOption %= 2;
      selectedOption = Math.abs(selectedOption);
      draw();
      break;
    case "down":
      selectedOption--;
      selectedOption %= 2;
      selectedOption = Math.abs(selectedOption);
      draw();
      break;
    case "c":
      if (key?.ctrl) {
        console.clear();
        process.exit();
      }
      break;
    case "return":
      isInsertingUrl = true;
      draw();
      break;
    default:
      break;
  }
});

process.stdin.setRawMode(true);
