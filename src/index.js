require("dotenv").config();
const {
	Client,
	IntentsBitField } = require("discord.js");
const mongoose = require("mongoose");

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

(
	async () =>
	{
		try
		{
			await mongoose.connect(process.env.MONGODB_URI);
			console.log(`Connected to MONGO DB database.`);

			event_handler(client);
			client.login(process.env.BOT_TOKEN);

		} catch (error)
		{
			console.log("=== ERROR - index.js ===");
			console.log(error);
		}
	}
)();
