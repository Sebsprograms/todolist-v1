
exports.getDate = function () {
    const options = { weekday: 'long', day: 'numeric', month: 'long', };
    const today = new Date().toLocaleString('en-us', options);
    return today;
}