const axios = require('axios')
const https = require('https');
const fs = require('fs');
const ffprobeclient = require('ffprobe-client')

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

const videofile = fs.createWriteStream(`./temp/videofile.mp4`);
const audiofile = fs.createWriteStream(`./temp/audiofile.mp3`);
readline.question(`Insert a Coub ID: `, (CoubID) => {
    axios.get(`https://coub.com/api/v2/coubs/`+CoubID).then(response => {
        var CoubName = (response.data.title)
        // CoubName = CoubName.replace(/\s+/g, ''); // Remove's all spacing in the string of CoubName
        // CoubName = CoubName.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''); // Remove's all special characters in the string of CoubName
        https.get(response.data.file_versions.html5.video.higher.url, function(videoresponse) {
            videoresponse.on(`end`, () => {
                https.get(response.data.file_versions.html5.audio.high.url, function(audioresponse) {
                    audioresponse.pipe(audiofile);
                    audioresponse.on(`end`, () => {
                        if (fs.existsSync(`./output/${CoubName}.mp4`)) {
                            fs.unlink(`./output/${CoubName}.mp4`, (err) => {
                                if (err) throw err;
                                console.log(`Overwriting ./output/${CoubName}.mp4`);
                            });
                        }
                        const { exec } = require("child_process");
                        ffprobeclient('./temp/videofile.mp4')
                            .then(vfd => console.log(`Video file duration: `+vfd.format.duration))
                            .catch(err => console.error(err));
                        ffprobeclient('./temp/audiofile.mp3')
                            .then(afd => console.log(`Audio file duration: `+afd.format.duration))
                            .catch(err => console.error(err));
                        var ffmpegloops = Math.floor(afd.format.duration/vfd.format.duration)
                        ffmpegloops = ffmpegloops.replace()
                        exec(`ffmpeg -i ./temp/videofile.mp4 -i ./temp/audiofile.mp3 "./output/${CoubName}.mp4"`, (error, stdout, stderr) => {
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
