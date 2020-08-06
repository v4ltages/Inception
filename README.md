# Inception - a Coub downloader
A coub downloader (CLI) and dynamic encoder that uses [JavaScript](https://en.wikipedia.org/wiki/JavaScript), [Nodejs](https://nodejs.org), [Axios](https://www.npmjs.com/package/axios), [FFmpeg](https://ffmpeg.org/), [ffprobe-client](https://www.npmjs.com/package/ffprobe-client).

[![GitHub](https://img.shields.io/github/languages/top/v4ltages/Inception)](https://en.wikipedia.org/wiki/JavaScript)
![npm](https://img.shields.io/npm/v/axios?label=axios)
![npm](https://img.shields.io/npm/v/ffprobe-client?label=ffprobe-client)
![GitHub](https://img.shields.io/github/license/v4ltages/Inception)

### Table of Contents
* **[Installation](#installation)**<br>
  - [Linux](#linux)<br>
* **[Usage](#usage)**<br>

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

