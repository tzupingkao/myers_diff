var fs = require("fs");
const readline = require('readline');

// process.argv.forEach(function (val, index, array) {
//     console.log(index + ': ' + val);
// });

const args = process.argv;
// console.log(args);


function read_file_by_line(filePath) {

    return new Promise(function(resolve,reject) {
        var data_line = [];
        var rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            console: false
        });

        rl.on('line', function (line, lineCount, byteCount) {
            data_line.push(line);
            // console.log(old_line)
        });

        rl.on('close', function () {
            resolve(data_line); // resolve(json); may be??
        });

        rl.on('error', function (e) {
            console.log("error", e);
            // something went wrong
        });
    });
};



async function callRead(filePath_old, filePath_new){
    const old_line = await read_file_by_line(filePath_old);
    const new_line = await read_file_by_line(filePath_new);
    var a = {'old_line': old_line, 'new_line': new_line};
    return a;
}

callRead(args[2], args[3])
    .then( (v) => {
        console.log(v);
    });

function myers(old_line, new_line){
    const old_max = old_line.length;
    const new_max = new_line.length;
    console.log("old_max = " + old_max + ", new_max = " + new_max);

    var V = {1: 0};
    // var frontier = {1: {0: []}};
    var Frontier = {"x": 0, "history": []};
    var frontier = {1: Frontier};
    // var history = [];
    // history.push({'Insert': 'C'});
    // frontier[0] = {1: history};
    // history = [];
    // history.push({'Remove': 'A'});
    // frontier[-1] = {5: history};
    console.log(`V = ${V}, frontier = ${frontier}`);

    for(let d = 0; d < old_max + new_max + 1; d++){
        for(let k = -d; k <= d; k += 2){
            let down = (k == -d || (k != d && V[k + 1] > V[k - 1]));
            console.log("down = " + down);

            let kPrev;
            if(down){
                kPrev = k + 1;
            }
            else {
                kPrev = k - 1;
            }

            let xStart = V[kPrev];
            let yStart = xStart - kPrev;

            // old_x, history = frontier[kPrev]
            // history = history[:]
            let old_x = Object.keys(frontier[kPrev])[0];
            console.log(old_x);
            var A = JSON.parse(JSON.stringify(frontier[kPrev]));
            let history = A["history"];
            console.log(history);


            let xMid;
            if (down) {
                xMid = xStart;
            }
            else{
                xMid = xStart + 1;
            }
            let yMid = xMid - k;



            if (1 <= yMid && yMid <= new_max && down) {
                // history.push({'Insert': new_line[yMid - 1]});
                var obj = {};
                obj['Insert'] = new_line[yMid - 1];
                history.push(obj);
            }
            else if(1 <= xMid && xMid <= old_max) {
                // history.push({'Remove': old_line[xMid - 1]});
                var obj = {};
                obj['Remove'] = old_line[xMid - 1];
                history.push(obj);
            }



            let xEnd = xMid;
            let yEnd = yMid;

            while(xEnd < old_max && yEnd < new_max && old_line[xEnd] !== undefined && new_line[yEnd] !== undefined &&  old_line[xEnd] === new_line[yEnd]) {
                xEnd += 1;
                yEnd += 1;
                // history.append(Keep(old_lines[one(xEnd)]));
                history.push({'Keep': old_line[xEnd - 1]});
            }

            V[k] = xEnd;


            if (xEnd >= old_max && yEnd >= new_max) {
                return history
            }
            else {
                // frontier[k] = {[xEnd]: history};

                Frontier = {"x": xEnd, "history": history};
                frontier[k] = Frontier;
            }




        }
    }
}

callRead(args[2], args[3])
    .then( (v) => {
        console.log(v);
        var t = myers(v["old_line"], v["new_line"]);
        console.log(t);


        for(var i = 0; i < t.length; i++){
            if(Object.keys(t[i])[0] === "Remove"){
                console.log("-" + t[i].Remove);
            }
            else if(Object.keys(t[i])[0] === "Insert"){
                console.log("+" + t[i].Insert);
            }
            else if(Object.keys(t[i])[0] === "Keep"){
                console.log(" " + t[i].Keep);
            }
        }



    });


