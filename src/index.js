require("dotenv").config();
const {
	Client,
	IntentsBitField } = require("discord.js");
const mongoose = require("mongoose");

const gpt_listener = require("./handlers/gpt_handler");
const event_handler = require("./handlers/event_handlers");


const client = new Client(
	{
		intents: [
			IntentsBitField.Flags.Guilds,
			IntentsBitField.Flags.GuildMembers,
			IntentsBitField.Flags.GuildMessages,
			IntentsBitField.Flags.GuildPresences,
			IntentsBitField.Flags.MessageContent,
		],
	}
);

const gpt_client = new Client(
	{
		intents: [
			IntentsBitField.Flags.Guilds,
			IntentsBitField.Flags.GuildMembers,
			IntentsBitField.Flags.GuildMessages,
			IntentsBitField.Flags.GuildPresences,
			IntentsBitField.Flags.MessageContent,
		],
	}
);

(	// Immediate function
	async () =>
	{
		try
		{
			await mongoose.connect(process.env.MONGODB_URI);
			console.log(`Connected to MONGO DB database.`);

			event_handler(client);
			await client.login(process.env.BOT_TOKEN);

			gpt_listener(gpt_client);
			gpt_client.on("ready", async () =>
			{
				console.log(`✅ ${gpt_client.user.tag} is online`);
			});
			await gpt_client.login(process.env.GPT_BOT_TOKEN);
		} catch (error)
		{
			console.log("=== ERROR - index.js ===");
			console.log(error);
		}
	}
)();
