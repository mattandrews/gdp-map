var worldCountries = require('world-countries');
var Converter = require("csvtojson").core.Converter;
var fs = require("fs");
var _ = require("underscore");

var csvConverter = new Converter({
    constructResult: true
});

var writeJSON = function (jsonObj) {
    fs.writeFile("./GDP.json", JSON.stringify(jsonObj), function (err) {
        if (err) { throw err; }
        console.log("file was written");
    });
}

csvConverter.on("end_parsed", function(jsonObj) {
    writeJSON(jsonObj);
    geocode(jsonObj);
});

var makeJson = function () {
    var csvFileName = "./GDP-clean.csv";
    var fileStream = fs.createReadStream(csvFileName);
    fileStream.pipe(csvConverter);
};

var geocode = function (GDP) {

    var data = fs.readFile("./node_modules/world-countries/dist/countries.json", function(err, data) {
        if (err) { throw err; }
        var countries = JSON.parse(data);

        var geocoded = GDP.map(function(item) {
            var row = _.find(countries, function(c) {
                return c.cca3 === item.code;
            });
            if (!row) {
                console.log("no match for " + item.name);
            } else {
                // console.log(row.cca3, item.name);
                item.latlng = row.latlng;
            }
            return item;
        });
        writeJSON(geocoded);
    })
};

makeJson();