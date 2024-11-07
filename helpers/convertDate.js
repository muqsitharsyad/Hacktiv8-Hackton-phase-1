function convertDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'full',
        timeStyle: 'long'
    }).format(date)
}

module.exports = convertDate