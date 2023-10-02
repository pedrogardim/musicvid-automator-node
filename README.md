## Musicvid Automator 🔁

#### About
This is an CL program built with `Node.js` and `FFMPEG` to automates the workflow that Non-Copyright music YouTube channels have. From a Youtube URL, it executes this workflow:

```mermaid
graph LR;
    A(Download audio from YouTube)-->B;
    B(Generate a spectrum video with FFMPEG)-->C;
    C(Uploads the video);
```

It has some depedencies that are critical and may stop working, such as [`ytdl-core`](https://github.com/distubejs/ytdl-core). So, if this program doesn't work, please, check this dependency.

#### Run with docker ⚓️

1. `docker build -t musicvid-automator .`
2. `docker run -it --rm musicvid-automator`
