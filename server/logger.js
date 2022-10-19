
const separator = '--------------------------------------------------------'

module.exports.log = (text, info) => {
    console.log(text);
    if (info) {
        console.log(info)
    }
    console.log(separator)
};