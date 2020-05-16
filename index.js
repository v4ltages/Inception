const axios = require('axios')
const https = require('https');
const fs = require('fs');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

const videofile = fs.createWriteStream(`./temp/videofile.mp4`);
const audiofile = fs.createWriteStream(`./temp/audiofile.mp3`);
readline.question(`Insert a Coub ID: `, (CoubID) => {
    axios.get(`https://coub.com/api/v2/coubs/`+CoubID).then(response => {
        https.get(response.data.file_versions.html5.video.higher.url, function(videoresponse) {
            console.log(response)
            videoresponse.on(`end`, () => {
                https.get(response.data.file_versions.html5.audio.high.url, function(audioresponse) {
                    audioresponse.pipe(audiofile);
                    audioresponse.on(`end`, () => {
                        const { exec } = require("child_process");
                        exec("ffmpeg -i ./temp/videofile.mp4 -i ./temp/audiofile.mp3 ./temp/out.mp4", (error, stdout, stderr) => {
                            if (error) {
                                console.log(`error: ${error.message}`);
                                return;
                            }
                            if (stderr) {
                                console.log(`stderr: ${stderr}`);
                                return;
                            }
                            console.log(`stdout: ${stdout}`);
                        });
                    })
                });
            })
            videoresponse.pipe(videofile);
        });
    readline.close()
    })
});
