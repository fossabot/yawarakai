// Local Packages

let Log = require('../log')
let Lang = require('../lang').Lang

let messagectl = {

    //Log out the message on Message Log File
    logMsg: (ctx) => {

        let groupType = "supergroup"
        var isGroup = (groupType == ctx.message.chat.type)
    
        // Prefix
    
        var output = `${Lang.bot.message.from}: `
        var outputGroup = Lang.bot.message.group
        var chatMessage = `${Lang.bot.message.text} : ${ctx.message.text}`
        var fromChatId = ` [ ID: ${ctx.message.from.id} ]`
        var groupInfo = ` | ${outputGroup} : [ ${ctx.message.chat.title} ] ID: ${ctx.message.chat.id}`

        // Case of User had their FIRSTNAME and LAST NAME set
        if((ctx.message.from.first_name && ctx.message.from.last_name)) {
            var infoFullId = output + ctx.message.from.first_name + " " + ctx.message.from.last_name + fromChatId
            if(isGroup) {
                Log.msgLog.log(infoFullId +  groupInfo)
                Log.msgLog.log(chatMessage)
            }
            else {
                Log.msgLog.log(infoFullId)
                Log.msgLog.log(chatMessage)
            }
        }
        // Case of User had their FIRSTNAME set only
        else if(ctx.message.from.first_name) {
            var infoNameOnly = output + ctx.message.from.first_name + fromChatId
            if(isGroup) {
                Log.msgLog.log(infoNameOnly + groupInfo)
                Log.msgLog.log(chatMessage)
            }
            else {
                Log.msgLog.log(infoNameOnly)
                Log.msgLog.log(chatMessage)
            }
        }
        // Case of User had their USERNAME set only or perhaps incorrectly set FIRSTNAME in LASTNAME
        else if(ctx.message.from.username) {
            var infoUsernameOnly = output + ctx.message.from.username + fromChatId
            if(isGroup) {
                Log.msgLog.log(infoUsernameOnly + groupInfo)
                Log.msgLog.log(chatMessage)
            }
            else {
                Log.msgLog.log(infoUsernameOnly)
                Log.msgLog.log(chatMessage)
            }
        }
        // Case of User only have ID could be provided or perhaps incorrectly set FIRSTNAME in LASTNAME or forgot to set username with above
        else {
            if(isGroup) {
                Log.msgLog.log(output + fromChatId + groupInfo)
                Log.msgLog.log(chatMessage)
            }
            else {
                Log.msgLog.log(output + fromChatId)
                Log.msgLog.log(chatMessage)
            }
        }

        return
    },
    // Process Context Data
    process: (ctx) => {
        Message.hears(ctx)
    },
    // Trigger set for special trigger
    trigger: (text, ctx) => {
        text
        ctx
    },
    // Send data directly to middleware (Call as Going)
    addTo: (ctx, controller) => {
        var procTypes = (name) => {
            switch(name) {
                default:
                    // Redirect data back to processor see if pairs any Pattern
                    messagectl.process(ctx)
                    break
            }
        }
        // Check if inputed a sets of processors
        if(typeof(controller) != String) {
            for(var i = 0; i < controller.length; i++) {
                procTypes(controller[i])
            }
        }
    },
    // Send data directly to middleware (Call At Time)
    sendTo: (ctx, processor) => {
        var procTypes = (name) => {
            switch(name) {
                default:
                    // Redirect data back to processor see if pairs any Pattern
                    messagectl.process(ctx)
                    break
                case "what2eat":
                    // Send Context to what2eat
                    what2eat()
                    break
            }
        }
        // Check if inputed a sets of processors
        if(typeof(processor) != String) {
            for(var i = 0; i < processor.length; i++) {
                procTypes(processor[i])
            }
        }
        
    }
}

let Message = {
    trigCtl: () => {
        
    },
    hears: (ctx) => {
        let meowmeow = /(喵~)/gi
        Message.reply(ctx, meowmeow, "喵~")
        
    },
    reply(ctx, textPattern, textReply) {
        if(Message.count >= 1) {
            Message.count = 0;
            return;
        }
        else if(Message.count == 0) {
            if(textPattern.test(ctx.message.text)) {
                Message.count ++;
                ctx.reply(textReply);
                Log.Log.debug(`回复至: ${ctx.message.from.id} - 成功 | 匹配: ${textPattern[Symbol.match](ctx.message.text)}`);
                return;
            }
            else{
                return;
            }
        }
        
    },
    count: 0
}

exports.messagectl = messagectl
exports.Message = Message