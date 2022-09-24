
let notesText = "";
const separator = '--------------------------------------------------------'
const lineBreak = `
`
const separatorWithLineBreaks = `${lineBreak}${separator}${lineBreak}`;

module.exports.addNote = (text, info, skipPersistence) => {
    if (!skipPersistence) {
        const textToNote = info && info.message ? info.message : text
        if (!notesText) {
            notesText = `${textToNote}${separatorWithLineBreaks}`;
        } else {
            if (notesText[notesText.length - 1] === '\n') {
                notesText = `${notesText}${textToNote}${separatorWithLineBreaks}`;
            } else {
                notesText = `${notesText}${separatorWithLineBreaks}${textToNote}${separatorWithLineBreaks}`;
            }
        }
    }
    console.log(text);
    if (info) {
        console.log(info)
    }
    console.log(separator)
};

module.exports.getNotes = (req, res) => {
    res.send({ data: notesText })
}

module.exports.addNoteFromClient = (req, res) => {
    const { text } = req.body;
    notesText = text;
    res.send({ data: 'note added' });
}