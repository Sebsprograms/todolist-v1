const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

const PORT = 3000;

app.get('/', (req, res) => {

    const today = new Date().toLocaleString('en-us', {  weekday: 'long' });
    res.render('index', {day: today});
})


app.listen(PORT, function() {
    console.log(`App listening on port ${PORT}`);
});