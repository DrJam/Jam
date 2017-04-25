import Discord = require("discord.js");
import assert = require("assert")
import Config = require("./domain/Config")
import Auth = require("./domain/Auth")

const auth: Auth = require("../auth.json")
const config: Config = require("../config.json")

const MongoClient = require("mongodb").MongoClient
const client: Discord.Client = new Discord.Client({
    disableEveryone: true,
    disabledEvents: ["TYPING_START"]
})

MongoClient.connect(config.database, (error, db) => {
    assert.equal(error, null, "db: Should be no error on connecting to db")
    console.log("db: Connected to db")


})
login()

function login() {
    client.login(auth.token)
    console.log("client: Logged in")
}