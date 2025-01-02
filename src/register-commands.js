require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

const commands = [
	{
		name: "embed",
		description: "Sends an embedded message"
	},
	{
		name: "calc",
		description: "Calculates operation between 2 numbers",
		options: [
			{
				name: "first-number",
				description: "First number of addition operation",
				type: ApplicationCommandOptionType.Number,
				required: true,
			},
			{
				name: "operator",
				description: "Operation",
				type: ApplicationCommandOptionType.String,
				required: true,
				choices: [
					{ name: "add", value: "add" },
					{ name: "subtract", value: "subtract" },
					{ name: "multiply", value: "multiply" },
					{ name: "divide", value: "divide" },
				],
			},
			{
				name: "second-number",
				description: "Second number of addition operation",
				type: ApplicationCommandOptionType.Number,
				required: true,
			},
		],
	}
];


const register_commands = async () =>
{
	try
	{
		await rest.put(
			Routes.applicationGuildCommands(
				process.env.BOT_ID,
				process.env.GUILD_ID
			),
			{
				body: commands,
			}
		);

		console.log(`Successfully registered ${commands.length} commands.`);
	}
	catch (error)
	{
		console.log("Error - register-commands:");
		console.log(error.message);
	}
};

register_commands();
