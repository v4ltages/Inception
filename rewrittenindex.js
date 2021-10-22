// Enables manipulation of the filesystem
const fs = require('fs');

// Module for using RESTful APIs
const axios = require('axios');

// HTTPS is the HTTP protocol over TLS/SSL. In Node.js this is implemented as a separate module.
const https = require('https');

// Analyzes video files with ffprobe
const ffprobeclient = require('ffprobe-client')

// Enables reading console input and output
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

// To reduce reusing of the same code, the video encoding process is made into a function
function video_encoding() {
    ffprobeclient('./temp/videofile.mp4').then(vfile => {
        ffprobeclient('./temp/audiofile.mp3').then(afile => {
            console.log(`Video duration: ${vfile.format.duration} and audio duration: ${afile.format.duration}`);
            let ffmpegloopamount = (Math.floor(afile.format.duration/vfile.format.duration));
            const afileduration = Number.parseFloat(afile.format.duration).toFixed (0);
            ffmpegloopamount = ffmpegloopamount.toString().replace(/\,.+/g,"$'");
            let frameRateAvg= (vfile.streams.find(e => e.codec_type === "video") || {}).avg_frame_rate
            frameRateAvg = Number.parseInt(frameRateAvg.split(`/`)[0])
            const vfileframes = Math.floor(vfile.format.duration*frameRateAvg).toFixed (0);
            console.log(`There is around ${vfileframes} frames in the video file.`)
            console.log(`Calculation's say that the clip will loop around ${ffmpegloopamount} times.`);
            rl.question(`Do you wish this video to loop this many times? [y]: `, (UserInput) => {
                if (UserInput === yes || Yes || y || Y) {
                    console.log(`\n[This will take a few minutes depending on ur hardware...]`)
                    const { exec } = require("child_process");
                    exec(`ffmpeg -i ./temp/videofile.mp4 -i ./temp/audiofile.mp3 -filter_complex loop=loop=${ffmpegloopamount}:size=${vfileframes}:start=0 -t ${afileduration} "./output/${title}.mp4"`, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                    })
                }
                else {
                    rl.question(`How many times do you wish? [Number]: `, (ffmpegloopamount) => {
                        if (isNaN(ffmpegloopamount)) {
                            console.log(`You did not insert a number, exiting...`)
                            process.exit();
                        }
                        else {
                            ffmpegloopamount = ffmpegloopamount.toString().replace(/\,.+/g,"$'")
                            console.log(`\nUsing video file duration for audio length...`)
                            const videoduration = (Math.floor(afile.format.duration*ffmpegloopamount)) 
                            console.log(`Video duration for ${ffmpegloopamount} loops will be ${videoduration}.`)
                            console.log(`\n[This will take a few minutes depending on ur hardware...]`)
                            const { exec } = require("child_process");
                            exec(`ffmpeg -i ./temp/videofile.mp4 -i ./temp/audiofile.mp3 -filter_complex loop=loop=${ffmpegloopamount}:size=${vfileframes}:start=0 -t ${videoduration} "./output/${title}.mp4"`, (error, stdout, stderr) => {
                                if (error) {
                                    console.log(`error: ${error.message}`);
                                    return;
                                }
                                if (stderr) {
                                    console.log(`stderr: ${stderr}`);
                                    return;
                                }
                                console.log(`stdout: ${stdout}`);
                            })
                        }
                    })
                };
            });
        })
        .catch(err => console.error(err))
    })
    .catch(err => console.error(err))
    return;
};

// Checks what platform the system is running
let isPlatform = (process.platform)

// Checks if system equals darwin/MacOS or linux/GNU+Linux
// If it does not equal either, it will error out.
if (isPlatform === "darwin" || "linux") {
    console.clear()
    console.log(`Detected platform '${isPlatform}'`)
    if (fs.existsSync('./.temp')) {
        console.log('Directory ./.temp exists, skipping...')
    }
    else {
        console.log(`Creating directory './.temp'`), fs.mkdirSync("./.temp");
    }
    if (fs.existsSync('./output')) {
        console.log('Directory ./output exists, skipping...')
    }
    else {
        console.log(`Creating directory './output'`), fs.mkdirSync("./output");
    }
    const audiofile = fs.createWriteStream('./.temp/audiofile.mp3');
    const videofile = fs.createWriteStream('./.temp/videofile.mp4');
    rl.question(`\nInsert a Coub ID or a Coub link: `, (CoubID) => {
        let CoubLink = CoubID.includes(`https://coub.com/view/`)
        if (CoubLink) {
            CoubID = CoubID.replace(`https://coub.com/view/`, ``)
        }
        axios.get(`https://coub.com/api/v2/coubs/`+CoubID).then(APIdata => {
            const title = (APIdata.data.title)
            rl.question(`\n[higher] (${APIdata.data.file_versions.html5.video.higher.size} bytes), [high] (${APIdata.data.file_versions.html5.video.high.size} bytes), [med] (${APIdata.data.file_versions.html5.video.med.size} bytes)\nPick a video quality: `, (VQuality) => {
                if (fs.existsSync(`./output/${title}.mp4`)) {
                    fs.unlink(`./output/${title}.mp4`, (err) => {
                        if (err) throw err;
                        console.log(`\nOverwriting ./output/${title}.mp4`);
                    });
                }
                if (VQuality == 'higher' || 'Higher' || '1') {
                    https.get(APIdata.data.file_versions.html5.video.higher.url, function(videoresponse) {
                        videoresponse.pipe(videofile);
                        videoresponse.on(() => {
                            https.get(APIdata.data.file_versions.html5.audio.high.url, function(audioresponse) {
                                audioresponse.pipe(audiofile);
                                audioresponse.on(() => {
                                    video_encoding()
                                });
                            });
                        });
                    });
                }
                else if (VQuality == 'high' || 'High' || '2') {
                    https.get(APIdata.data.file_versions.html5.video.high.url, function(videoresponse) {
                        videoresponse.pipe(videofile);
                        videoresponse.on(() => {
                            https.get(APIdata.data.file_versions.html5.audio.high.url, function(audioresponse) {
                                audioresponse.pipe(audiofile);
                                audioresponse.on(() => {
                                    video_encoding()
                                });
                            });
                        });
                    });
                }
                else if (VQuality == 'med' || 'Med' || '3') {
                    https.get(APIdata.data.file_versions.html5.video.med.url, function(videoresponse) {
                        videoresponse.pipe(videofile);
                        videoresponse.on(() => {
                            https.get(APIdata.data.file_versions.html5.audio.high.url, function(audioresponse) {
                                audioresponse.pipe(audiofile);
                                audioresponse.on(() => {
                                    video_encoding()
                                });
                            });
                        });
                    });
                }
                else {
                    console.log('\nThe selection you have written does not match. Please type a number or higher, high or mid!')
                    process.exit();
                };
            });
        });
    });
}
else {
    console.log(`Sorry, but the detected platform '${isPlatform}' from testing does not seem to function.\n Make a GitHub issue and i will see about getting this working. It will help me out and so can you help me out a bit!`)
    process.exit();
};
