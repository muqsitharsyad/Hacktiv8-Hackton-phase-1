function countWords(str) {
    const array = str.trim().split(/\s+/);
    return array.length;
}

module.exports = countWords