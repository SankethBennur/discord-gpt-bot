const { Client, IntentsBitField } = require("discord.js");
require("dotenv").config();

const client = new Client(
	{
		intents: [
			IntentsBitField.Flags.Guilds,
			IntentsBitField.Flags.GuildMembers,
			IntentsBitField.Flags.GuildMessages,
			IntentsBitField.Flags.MessageContent,
		],
	}
);

client.login(process.env.DISCORD_BOT_TOKEN);

client.on("ready", (client_) =>
{
	console.log(`✅ ${client.user.tag} is ONLINE.`);
});

client.on(
	"messageCreate",
	(message_) =>
	{
		console.log(`${message_.author.username}: ${message_.content}`);
	}
);
