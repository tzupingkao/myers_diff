var fs = require("fs");
const readline = require('readline');

// process.argv.forEach(function (val, index, array) {
//     console.log(index + ': ' + val);
// });

const args = process.argv;
// console.log(args);


var old_line = [], new_line = [];

// function promise(filePath) {
//     var promise = new Promise(function(resolve,reject) {
//
//         var old_line = [], new_line = [];
//         // var rl = readline(args[2]); // provide correct file path
//         var rl = readline.createInterface({
//             input: fs.createReadStream(filePath),
//             console: false
//         });
//
//         rl.on('line', function (line, lineCount, byteCount) {
//             old_line.push(line);
//             // console.log(old_line)
//         });
//
//         rl.on('close', function() {
//                 resolve(old_line); // resolve(json); may be??
//             });
//
//         rl.on('error', function (e) {
//                 console.log("error", e);
//                 // something went wrong
//             });
//     });
//
//     promise.then((resolveResult) => {
//         console.log(resolveResult);
//         return resolveResult;
//     });
// };
//
// var t = promise(args[2]);


function Read(filePath) {

    return new Promise(function(resolve,reject) {
        var old_line = [], new_line = [];
        // var rl = readline(args[2]); // provide correct file path
        var rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            console: false
        });

        rl.on('line', function (line, lineCount, byteCount) {
            old_line.push(line);
            // console.log(old_line)
        });

        rl.on('close', function () {
            resolve(old_line); // resolve(json); may be??
        });

        rl.on('error', function (e) {
            console.log("error", e);
            // something went wrong
        });
    });

    // promise.then((resolveResult) => {
    //     // console.log(resolveResult);
    //     return resolveResult;
    // });
};

// console.log(t);
// console.log(Read(args[2]))


async function callRead(filePath_old, filePath_new){
    const t1 = await Read(filePath_old);
    const t2 = await Read(filePath_new);
    var a = {'t1': t1, 't2': t2};
    return a;
}

callRead(args[2], args[3]).then( (v) => { console.log(v);});




function resolveAfter2Seconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, 2000);
    });
}

var g = 0;
async function add1(x) {
    const a = await resolveAfter2Seconds(20);
    const b = await resolveAfter2Seconds(30);
    return x + a + b;
}

add1(10).then(v => {
    console.log(v);  // prints 60 after 4 seconds.
    g = v;
});


async function add2(x) {
    const p_a = resolveAfter2Seconds(20);
    const p_b = resolveAfter2Seconds(30);
    return x + await p_a + await p_b;
}

add2(10).then(v => {
    console.log(v);  // prints 60 after 2 seconds.
});

console.log("g = " + g)
