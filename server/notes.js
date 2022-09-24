
let notesText = "";

module.exports.addNote = (text, info, skipPersistence) => {
    if (!skipPersistence) {
        const textToNote = info && info.message ? info.message : text
        if (!notesText) {
            notesText = textToNote;
        } else {
            notesText = notesText + '\n--------------------------------------------------------\n' + textToNote;
        }
    }
    console.log(text);
    if(info){
        console.log(info)
    }
    console.log('--------------------------------------------------------')
};

module.exports.getNotes = (req, res) => {
    res.send({ data: notesText })
}

module.exports.addNoteFromClient = (req, res) => {
    const { text } = req.body;
    notesText = text;
    res.send({data: 'note added'});
}