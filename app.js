const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

const PORT = 3000;

app.get('/', (req, res) => {

    const today = new Date().getDay;
    const weekendDays = [0, 6]

    if(weekendDays.includes(today)) {
        res.write("It is the weekend.")
    } else {
        res.write("It is a weekday.")
    }
    res.send();
})


app.listen(PORT, function() {
    console.log(`App listening on port ${PORT}`);
});