// Here’s a simple transform stream which echoes back anything you type into it after transforming it to upper case format:
const { Transform } = require('stream');

const upperCaseTr = new Transform({
    transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
    }
});

process.stdin.pipe(upperCaseTr).pipe(process.stdout);