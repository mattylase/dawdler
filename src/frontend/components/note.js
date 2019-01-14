Vue.component('note', {
    props: {
        noteindex: Number,
        rowindex: Number,
        noteinfo: {
            type: Object,
            required: true
        }
    },
    template: `
        <button class="noteButton" @keyup.space.prevent :style="[ {backgroundColor: noteinfo.active ? this.noteinfo.activecolor : '#e2e5ff'}, { borderColor: noteinfo.playing ? '#2E3337' : 'transparent' } ]" v-on:click="noteClicked()"></button>
    `,
    methods: {
        noteClicked() {
            this.$emit('note-toggled', this.rowindex, this.noteindex, this.noteinfo)
        }
    }
})