try {
    var fs = require("fs");
} catch (E) {
    console.log(E.stack);
    console.log("fs not found");
    process.exit();
}

var fh = function (fileName) {
    this.fileName = fileName;
    this.data = {};
    this.dataLoaded = false;
}

fh.prototype.load = function() {
    if (!this.fileName) {
        console.log("FH: No file specified");
        return;
    }
    var contents = fs.readFileSync(this.fileName);
    this.data = JSON.parse(contents);
    this.dataLoaded = true;
    console.log("FH:Loaded \"" + this.fileName + "\"");
    return;
};

fh.prototype.save = function() {
    if (this.dataLoaded) {
        var jsonString = JSON.stringify(this.data);
        fs.writeFileSync(this.fileName, jsonString);
    }
    return;
}

module.exports = fh;