const express = require('express');
const app = express();
const csvtojson = require('csvtojson')
const spawn = require("child_process").spawn;

const recordPath = 'Job 1_processed.csv'
const geometryPath = 'hddjob1_geometry.csv'

Promise.all([
    csvtojson()
    .fromFile(recordPath)
    .then((recordJsonObj) => {
        return recordJsonObj
    }),
    csvtojson()
    .fromFile(geometryPath)
    .then((geometryJsonObj) => {
        return geometryJsonObj
    })
]).then(([recordJsonObj, geometryJsonObj]) => {
    let jsonStringToSend = JSON.stringify(recordJsonObj) + "\n" + JSON.stringify(geometryJsonObj);
    console.log("Reading Data...")
    // console.log(jsonStringToSend)
    console.log()
    console.log("Initializing Python...")
    const pythonProcess = spawn('python3',["test.py"]);
    console.log()
    console.log("Writing to Python through stdin...")
    pythonProcess.stdin.write(jsonStringToSend)
    pythonProcess.stdin.end();
    console.log()
    console.log("Finished writing to Python...")
    
    /** data comes in several different pieces.
     *  jsonData=""
     */ 
    jsonData=""
    console.log("Reading from Python...")
    pythonProcess.stdout.on('data', (data) => {
        // Pieces of data that comes in.
        // Do: jsonData + data.toString()
        jsonData += data.toString()
        console.log("Data from Python:" + data.toString())
        console.log()
    });
    pythonProcess.stdout.on('end', (data) => {
        // When the data is done coming,
        // completed data should be stored in the variable 'jsonData'
        console.log("End")
    });
    console.log("Finished!")

})





app.use('/', (req, res, next) =>{
    res.redirect('/Home');
});

app.listen(8001);