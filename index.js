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
readline.question(`Insert a Coub ID or a Coub link: `, (CoubID) => {
    let CoubLink = CoubID.includes(`https://coub.com/view/`)
    if (CoubLink) {
        CoubID = CoubID.replace(`https://coub.com/view/`, ``)
    }
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

                        ffprobeclient('./temp/videofile.mp4').then(vf => {
                            ffprobeclient('./temp/audiofile.mp3').then(af => {
                                console.log(`Video duration: ${vf.format.duration} and audio duration: ${af.format.duration}`);
                                let ffmpegla = (Math.floor(af.format.duration/vf.format.duration));
                                const afd = Number.parseFloat(af.format.duration).toFixed (0);
                                ffmpegla = ffmpegla.toString().replace(/\,.+/g,"$'");
                                let frameRateAvg= (vf.streams.find(e => e.codec_type === "video") || {}).avg_frame_rate
                                frameRateAvg = Number.parseInt(frameRateAvg.split(`/`)[0])
                                const vff = Math.floor(vf.format.duration*frameRateAvg).toFixed (0);
                                console.log(`Average framerate is: ${frameRateAvg}`)
                                console.log(`Will loop around ${ffmpegla} times`);
                                console.log(`There is around ${vff} frames`)
                                const { exec } = require("child_process");
                                exec(`ffmpeg -i ./temp/videofile.mp4 -i ./temp/audiofile.mp3 -filter_complex loop=loop=${ffmpegla}:size=${vff}:start=0 -t ${afd} "./output/${CoubName}.mp4"`, (error, stdout, stderr) => {
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
                            .catch(err => console.error(err))
                        })
                        .catch(err => console.error(err))

                    })
                });
            })
            videoresponse.pipe(videofile);
        });
    readline.close()
    })
});
