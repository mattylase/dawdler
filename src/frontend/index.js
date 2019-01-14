const getRandomColor = require('./util')
const snipper = require('../core/snipper')

let noteRows = []
let currentBeats = 8;
let playingIndex = 0;
let isPlaying = false;
Tone.Transport.bpm.value = 80

function buildRow(sound, note, duration) {
  let row = []
  var activeColor = getRandomColor(4)
  for (let i = 0; i < currentBeats; i++) {
    row.push({
      active: false,
      sound: sound,
      note: note,
      playing: false,
      duration: duration,
      activecolor: activeColor,
      ytCode: String,
      ytMode: false,
      volume: 1,
    })
  }
  return row
}

noteRows.push(buildRow(new Tone.Synth().toMaster(), "C3", "16n"))
noteRows.push(buildRow(new Tone.Synth().toMaster(), "D2", "16n"))
noteRows.push(buildRow(new Tone.Synth().toMaster(), "A2", "16n"))

let loop = new Tone.Loop(function (time) {
  if (playingIndex === currentBeats) playingIndex = 0;
  noteRows.forEach((row) => {
    row.forEach(info => info.playing = false);
    let info = row[playingIndex]
    info.playing = true
    if (info.active === true) {
      if (!info.ytMode) {
        info.sound.triggerAttackRelease(info.note, info.duration, time)
      } else {
        console.log("aplaying audio")
        new Audio(`../../audio/ytdl/${info.note}.mp3`).play()
      }
    }
  })
  playingIndex++
}, "8n");
loop.start("1m")

new Vue({
  el: '#app',
  created: function () {
    window.addEventListener('keyup', this.keyEvents)
  },
  data: {
    noteRows: noteRows
  },
  methods: {
    handleNoteToggle(rowindex, noteIndex, noteInfo) {
      noteInfo.active = !noteInfo.active
      noteRows[rowindex][noteIndex] = noteInfo
    },
    keyEvents(event) {
      if (event.code === 'Space') {
        Tone.Transport.toggle()
        isPlaying = !isPlaying;
      }
    },
    bpmChange(event) {
      Tone.Transport.bpm.value = event.srcElement.value
    },
    addRow(event) {
      noteRows.push(buildRow(new Tone.Synth().toMaster(), "A2", "16n"))
    },
    removeRow(event) {
      noteRows.pop()
    },
    noteChanged(row) {
      const newNote = row[0].note
      if (row[0].ytMode) {
        snipper.snip(row[0].note, row[0].volume)
      }
      row.forEach(noteData => noteData.note = newNote);
    },
    volumeChanged(row) {
      //console.log(`${row} volume changed`)
    },
    toggleYT(row) {
      row.forEach(noteData => noteData.ytMode = !noteData.ytMode)
    }
  }
})