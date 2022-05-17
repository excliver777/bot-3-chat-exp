const Discord = require("discord.js")
const canvacord = require("canvacord")
const knex = require("knex")({ client: "sqlite3", connection: { filename: "./data.db" }, useNullAsDefault: false }) 
const intent_list = new Discord.Intents(["GUILD_MEMBERS", "GUILD_MESSAGES", "GUILDS", "GUILD_PRESENCES"])
const client = new Discord.Client({ ws: { intents: intent_list } })
const token = "OTc1MDI2OTE3NDY2MDQ2NTU2.GzMBeE.RrIaou_jT990SybtuFneBZbjFBiLVMUAVcM-V0"
const cooltime = 3 
const requireEXP = 100 
const [minimum, maximum] = [2, 10] 
const font = "AppleSDGothic"
		disbut = require('discord-buttons');
client.on("ready", async () => {
  console.log("bot is ready")
  let _d = await knex("userinfo").select("*")
  _d.forEach(async (key) => {
    await changeAllUsers(key)
  })
})

client.on("message", async (message) => {
  if (message.author.bot || !message.guild) return

  let chatData = await knex("userinfo").select("*").where({ id: message.author.id, guild: message.guild.id })

  if (chatData.length === 0) {
    await registerUser(message)
    let data = await knex("userinfo").select("*").where({ id: message.author.id, guild: message.guild.id })
    setTimeout(async () => await removeCooldown(data, message), cooltime * 1000)
    return
  }
  if (message.content == "yoru help") {
  const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Help')
	.setAuthor('Yoru command')
	.setDescription('you can call me with `yoru`')
	.setThumbnail('https://images-ext-1.discordapp.net/external/RyofVqSAVAi0H9-1yK6M8NGy2grU5TWZkLadG-rwqk0/https/i.imgur.com/EZRAPxR.png')
	.addFields(
		{ name: '**yoru music**', value: 'help with music command',inline: true },
		{ name: '**yoru mod**', value: 'help with moderator command', inline: true },
		{ name: '**yoru command**', value: 'help with user command', inline: true },
    { name: '**yoru rank**', value: 'help with level fuck mee6', inline: true },
	)
	.setTimestamp()

message.channel.send(exampleEmbed);
}

//________________mod_______________________
if (message.content == "yoru mod") {
  const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Help')
	.setAuthor('Yoru `mod` command')
	.setDescription('you can call me with `yoru`')
	.addFields(
		{ name: '**yoru ban/unban [mention]**', value: 'help with ban and unban',inline: true },
		{ name: '**yoru kick [mention]**', value: 'kick user its not ban', inline: true },
		{ name: '**yoru mute/unmute [mention]**', value: 'mute user', inline: true },
    { name: '**yoru clean (1~100)**', value: 'clean message', inline: true },
    { name: '**yoru warn [mention]**', value: 'warn user', inline: true },
    { name: '**yoru check [mention]**', value: 'check how much user got warning', inline: true },
	)
	.setTimestamp()

message.channel.send(exampleEmbed);
}
//________________command_______________________
if (message.content == "yoru command") {
  const exampleEmbed = new Discord.MessageEmbed()
	.setColor('random')
	.setTitle('Help')
	.setAuthor('Yoru `user` command')
	.setDescription('you can call me with `yoru`')
	.addFields(
		{ name: '**yoru daily**', value: 'daily attendence whether u attend on HALAL gaming',inline: true },
		{ name: '**yoru feedback**', value: 'if this bot got fucking prblem just report', inline: true },
		{ name: '**yoru pic [anyword]**', value: 'find pic that you want to find', inline: true },
    { name: '**yoru profile**', value: 'show your profile pic', inline: true },
    { name: '**yoru ping**', value: 'show bot ping', inline: true },
    { name: '**yoru serverinfo**', value: 'check server info', inline: true },
	)
	.setTimestamp()
  
message.channel.send(exampleEmbed);
  }
  await levelup(message, chatData[0])

  if (message.content.startsWith("yoru rank")) {

    let tagUser = message.content.split("yoru rank ")
    let args
    if (tagUser[1] !== undefined) args = message.content.split("yoru rank ")[1].replace(/[^0-9]/g, "")
    let user = args === undefined ? "self" : args
    const rank = new canvacord.Rank()
    if (user === "self") {
      rank.setAvatar(message.author.avatarURL({ format: "jpg" }))
      rank.setCurrentXP(chatData[0].exp)
      rank.setRequiredXP(requireEXP)
      rank.setLevel(chatData[0].level)
      rank.setStatus(message.author.presence.status)
      rank.setProgressBar("#5661E6", "COLOR")
      rank.setUsername(message.member.displayName)
      rank.setDiscriminator(message.author.discriminator)
    } else {
      let anotherData = await knex("userinfo").select("*").where({ id: args, guild: message.guild.id })
      if (client.users.cache.get(args).bot === true) return message.reply("u retrarded? bot cannot")
      if (anotherData.length === 0) return message.reply("you dont type so no lvl")
      let profile = client.users.cache.get(args).avatarURL({ format: "jpg" })
      let status = client.users.cache.get(args).presence.status
      let member = message.guild.members.cache.get(args).displayName
      rank.setAvatar(profile)
      rank.setCurrentXP(anotherData[0].exp)
      rank.setRequiredXP(requireEXP)
      rank.setLevel(anotherData[0].level)
      rank.setStatus(status)
      rank.setProgressBar("#5661E6", "COLOR")
      rank.setUsername(member)
      rank.setDiscriminator(message.author.discriminator)
    }
    rank.build({ fontX: font, fontY: font }).then((data) => {
      const attachment = new Discord.MessageAttachment(data, "RankCard.png")
      message.reply(attachment)
    })
  }
})

function randomInt() {
  let num = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
  return num
}

async function changeAllUsers(key) {
  await knex("userinfo")
    .update({ level: key.level, exp: key.exp, cooldown: "False", id: key.id, guild: key.guild })
    .where({ id: key.id, guild: key.guild })
}

async function removeCooldown(key, message) {
  await knex("userinfo")
    .update({ level: key.level, exp: key.exp, cooldown: "False", id: key.id, guild: key.guild })
    .where({ id: message.author.id, guild: message.guild.id })
}

async function levelup(message, user) {
  if (user.exp >= requireEXP) {
    await knex("userinfo")
      .update({
        level: parseInt(user.level) + 1,
        exp: 0,
        cooldown: "False",
        id: user.id,
        guild: user.guild,
      })
      .where({ id: message.author.id, guild: message.guild.id })

    message.channel.send(`${message.author} OI you hard try ah your level increace. Now level: \`${parseInt(user.level) + 1}\`LVL`)
  } else {
    if (user.cooldown === "True") return
    await knex("userinfo")
      .update({
        id: user.id,
        guild: user.guild,
        cooldown: "True",
        exp: parseInt(user.exp) + randomInt(),
        level: user.level,
      })
      .where({ id: message.author.id, guild: message.guild.id })
    let data = await knex("userinfo").select("*").where({ id: message.author.id, guild: message.guild.id })
    setTimeout(async () => await removeCooldown(data[0], message), cooltime * 1000)
  }
}

async function registerUser(message) {
  await knex("userinfo").insert({
    id: message.author.id,
    cooldown: "False",
    level: 0,
    exp: randomInt(),
    guild: message.guild.id,
  })
}

client.login(token)
