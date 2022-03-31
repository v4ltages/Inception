# Inception - a Coub downloader
Notice: This has been archived due to Coub shutting down operations on April 1st, 2022

A coub downloader (CLI) and dynamic encoder that uses [JavaScript](https://en.wikipedia.org/wiki/JavaScript), [Nodejs](https://nodejs.org), [Axios](https://www.npmjs.com/package/axios), [FFmpeg](https://ffmpeg.org/), [ffprobe-client](https://www.npmjs.com/package/ffprobe-client).

[![GitHub](https://img.shields.io/github/languages/top/v4ltages/Inception)](https://en.wikipedia.org/wiki/JavaScript)
![npm](https://img.shields.io/npm/v/axios?label=axios)
![npm](https://img.shields.io/npm/v/ffprobe-client?label=ffprobe-client)
![GitHub](https://img.shields.io/github/license/v4ltages/Inception)

### Table of Contents
* **[Installation](#installation)**<br>
  - [Linux](#linux)<br>
* **[Usage](#usage)**<br>
  - [Example](#example)<br>
* **[License](#license)**<br>

## Installation
### Linux
> This was made for Ubuntu/Debian based distributions in mind, but any other distributions should also work if they have the FFmpeg and NodeJS packages available.

Dependencies: [Nodejs](https://github.com/nodesource/distributions/blob/master/README.md), [FFmpeg](https://ffmpeg.org/)

1. Clone the repo

```
git clone https://github.com/v4ltages/Inception.git
```
2. Switch to the directory
```
cd Inception
```
3. Check if nodejs is installed and up to date with either the LTS (Long Term Support) version or the latest version
```
node -v
v14.7.0
```
4. Installing npm dependencies
```
npm install axios ffprobe-client
```
5. Making the temp and output directory

Notes:
> Currently the program dosen't have a check if both output and temp directory exists so you will need to make the directories yourself. If you get `no such file or directory: temp` or `no such file or directory: output` then make sure both directories exist in the programs directory.
```
mkdir output temp
```

## Usage

To use the program type
```
node .
```
Output would look like this
```
Insert a Coub ID:
```
> ~~The program only takes the ID of the Coub and not the full link. 
This feature will be added in the future.~~ See commit [d1eb2f6](https://github.com/v4ltages/Inception/commit/d1eb2f637881d64782299c0af34e51b9675b69af)

```
Insert a Coub ID: 2hg87j
Video duration: 7.480000 and audio duration: 59.872653
Average framerate is: 25
Will loop around 8 times
There is around 187 frames
```
> Will output information about the video duration, audio duration, average framerate and frames.  It will use this information to calculate the amount of times the video will be looped.

### Example
![usageexample](https://github.com/v4ltages/Inception/blob/master/Example/usageexample.gif)

### License
This project uses the MIT license.

Read the [LICENSE.md](https://github.com/v4ltages/Inception/blob/master/LICENSE.md) file to learn more.
