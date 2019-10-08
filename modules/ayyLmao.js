var ayyLmao = {};

ayyLmao.ayy =  function(mod, client, message){
    if (message.content.toLowerCase() === "ayy") {
        message.channel.send("lmao");
        return true;
    }
    return false;
}

ayyLmao.events = {
    "message": ayyLmao.ayy
};

module.exports = ayyLmao;