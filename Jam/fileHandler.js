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
    this.timerStarted = false;
}


fh.prototype.load = function() {
    console.log();
    if (!this.fileName) {
        console.log("FH: No file specified");
        return;
    }
    console.log("FH:Loading \"" + this.fileName + "\"");
    var contents = fs.readFileSync(this.fileName);
    this.data = JSON.parse(contents);
    console.log("FH:Loaded");
    this.dataLoaded = true;
    return;
};

fh.prototype.save = function() {
    if (this.dataLoaded) {
        console.log("FH:Saving data");
        var jsonString = JSON.stringify(this.data);
        fs.writeFileSync(this.fileName, jsonString);
        console.log("FH:Data saved");
    } else {
        console.log("FH:Data not loaded, not saving");
    }
    return;
}

fh.prototype.startSaveTimer = function() {
    this.save();
    setTimeout(this.startSaveTimer, 1000 * 60 * .5);
    return;
}

module.exports = fh;