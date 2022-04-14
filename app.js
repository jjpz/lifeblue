const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (app.get('env') === 'development') {
    app.use(express.static('src'));
} else {
    app.use(express.static('dist'));
}

app.get('/', (req, res) => {
    if (app.get('env') === 'development') {
        res.sendFile('src/index.html', { root: __dirname });
    } else {
        res.sendFile('dist/index.html', { root: __dirname });
    }
});

app.get('/api/data', (req, res) => {
    fs.readFile('data/data.json', 'utf8', (error, data) => {
        if (error) {
            res.send(error);
        } else {
            res.send(JSON.parse(data));
        }
    });
});

app.post('/submit', (req, res) => {
    const data = req.body;
    if (!fs.existsSync('data')) {
        fs.mkdir('data', error => {
            if (error) {
                res.status(500).send(error);
                console.log('Error:', error);
            } else {
                fs.writeFile('data/data.json', JSON.stringify(data, null, 4), error => {
                    if (error) {
                        res.status(500).send(error);
                        console.log('Error:', error);
                    } else {
                        res.status(200).send({success: true});
                        console.log('File successfully created');
                    }
                });
            }
        });
    } else {
        fs.writeFile('data/data.json', JSON.stringify(data, null, 4), error => {
            if (error) {
                res.status(500).send(error);
                console.log('Error:', error);
            } else {
                res.status(200).send({success: true});
                console.log('File successfully created');
            }
        });
    }
});

app.listen(
    port, 
    () => console.log(`Node server listening at http://localhost:${port}/`)
);