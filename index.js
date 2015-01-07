var Converter = require("csvtojson").core.Converter;
var fs = require("fs");

var csvConverter = new Converter({
    constructResult: true
});

csvConverter.on("end_parsed", function(jsonObj) {
    console.log(jsonObj);
    fs.writeFile("./GDP.json", JSON.stringify(jsonObj), function (err) {
        if (err) {
            throw err;
        }
        console.log("file was saved");
    });
});

var csvFileName = "./GDP-clean.csv";
var fileStream = fs.createReadStream(csvFileName);
fileStream.pipe(csvConverter);