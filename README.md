# Jam<img align="right" src="avatar.jpg"/>

A bot for Discord

## Commands
**All commands are prefixed with `.`**

Command|Parameters|Description
---|---|---
ping||replies to the user with "Pong!"
servers||lists all the servers that Jam is connected to
channels||lists all the channels that Jam is watching
myid||responds with the discord unique id of the user
idle||sets the bots status to idle
online||sets the bots status to online
playing|\<message\>|sets the playing status of the bot to a string
permissions|me<br />set \<command\> \<target\> \<value\>|define permissions for a given command<br />see below for more detailed information

##Permissions
###How do they work?
For any command, there are three different types of permission that can apply, user, role, and server-wide, organised as such in JSON
```
{
	"serverid": {
		"commandname": {
			"all": false,
			"role": {
				"roleid1": false,
				"roleid2": false,
				"roleid3": true
			},
			"user": {
				"userid": false
			}
		}
	}
}
```
There is a hierarchy that is applied when determining if a user has permission to use a command:
```
user > role with highest priority on server > ... > role with lowest priority on server > all
```
If any of these objects is not defined for a command, it is ignored in the hierarchy, if there is no permission that allows a user to perform a command that is not out-weighed by a negative value, the user is disallowed.

###Setting up Permissions
`.permissions me`

lists all permissions definitions for a user

`.permissions set <command> <target> <value>`

sets a permission for a given command, where target should be one of the following formats

target|short|long
---|---|---
user|u:@user|user:@user
role|r:rolename|role:rolename
all|a|all

and value is one of the following

value|logic|short logic|symbol|yes/no|y/n
---|---|---|---|---|---
specifically allowed|true|t|+|yes|y
not defined|undefined|u|?|none|
specifically disallowed|false|f|-|no|n
