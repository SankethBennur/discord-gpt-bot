require("dotenv").config();
const {
	Client,
	IntentsBitField,
	EmbedBuilder
} = require("discord.js");

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

client.login(process.env.BOT_TOKEN);

client.on("ready", async (client_) =>
{
	console.log(`✅ ${client_.user.tag} is ONLINE.`);
});

client.on(
	"messageCreate",
	(message_) =>
	{
		if (message_.author.bot) return;

		if (message_.content === "hello")
			message_.reply("Yo!");
	}
);

const interaction_calc = (interaction_) =>
{
	if (!interaction_?.commandName) return;

	let num1_ = interaction_.options.get("first-number")?.value;
	let num2_ = interaction_.options.get("second-number")?.value;
	let opr_ = interaction_.options.get("operator")?.value;

	if (!opr_) return;

	let result_ = null;

	switch (opr_)
	{
		case "add":
			result_ = num1_ + num2_;
			break;
		case "subtract":
			result_ = num1_ - num2_;
			break;
		case "multiply":
			result_ = num1_ * num2_;
			break;
		case "divide":
			result_ = (num2_ !== 0) ? num1_ / num2_ : "Divide by zero";
			break;
		default:
			console.log("interactionCreate => Invalid operator");
			break;
	}

	interaction_.reply(`Result: ${result_}`);

};

const interaction_embed = (interaction_) =>
{
	if (!interaction_ || !interaction_?.commandName) return;

	const embed_ = new EmbedBuilder()
		.setTitle("Happy New Year!")
		.setDescription("Hope 2025 will bring abundance and joy!")
		.setColor("Random")
		.addFields(
			{
				name: "Field 1",
				value: "this is the value of the first field",
				inline: true
			},
			{
				name: "Field 2",
				value: "this is the value of the second field",
				inline: true
			},
			{
				name: "Field 3",
				value: "this is the value of the third field, not inline",
				inline: false
			},
			{
				name: "Field 4",
				value: "this is the value of the fourth field, this is inline",
				inline: true
			},
		);

	interaction_.reply({ embeds: [embed_] });
};

client.on(
	"interactionCreate",
	(interaction_) =>
	{
		if (!interaction_.isChatInputCommand()) return;

		if (!interaction_ || !interaction_?.commandName) return;

		switch (interaction_.commandName)
		{
			case "calc":
				interaction_calc(interaction_);
				break;
			case "embed":
				interaction_embed(interaction_);
				break;
			default:
				break;
		}

	}
);
