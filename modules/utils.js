function loadModule(path)
{
    try {
        return require(path);
    }
    catch (E) {
        console.log("Following Error was encountered while loading `" + path + "`: " + E.message);
        //process.exit();
    }
}