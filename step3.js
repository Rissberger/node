const fs = require('fs');
const axios = require('axios');

function cat(path, out) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading ${path}:\n  ${err}`);
            process.exit(1);
        }
        output(data, out);
    });
}

async function webCat(url, out) {
    try {
        const res = await axios.get(url);
        output(res.data, out);
    } catch (err) {
        console.error(`Error fetching ${url}:\n  ${err}`);
        process.exit(1);
    }
}

function output(text, out) {
    if (out) {
        fs.writeFile(out, text, 'utf8', err => {
            if (err) {
                console.error(`Couldn't write ${out}:\n  ${err}`);
                process.exit(1);
            }
        });
    } else {
        console.log(text);
    }
}

let path, out;
if (process.argv[2] === '--out') {
    out = process.argv[3];
    path = process.argv[4];
} else {
    path = process.argv[2];
}

if (path.startsWith('http://') || path.startsWith('https://')) {
    webCat(path, out);
} else {
    cat(path, out);
}
