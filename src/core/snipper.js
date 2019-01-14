const readline = require('readline');
const ffmpeg = require('fluent-ffmpeg');
const ytdl = require('ytdl-core');
const path = require('path');
const fs = require('fs')

exports.snip = async (id, time) => {
    let stream = ytdl(id, {
        filter: 'audioonly',
    });

    console.log('snipping ' + time + ' seconds')
    let start = Date.now();
    let audioPath = path.join(__dirname, '..', '..', 'audio', 'ytdl', `${id}.mp3`);
    fs.unlinkSync(audioPath)

    ffmpeg(stream)
        .audioBitrate(128)
        .save(audioPath)
        .seekInput(time)
        .setDuration(1)
        .on('progress', (p) => {
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(`${p.targetSize}kb downloaded`);
        })
        .on('end', () => {
            console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
            stream = undefined
        })
}
