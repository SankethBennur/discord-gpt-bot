module.exports = {
	name: "ping",
	description: "pong!",
	// devOnly: boolean,
	//testOnly: boolean,
	// options: Object[],
	// deleted: Boolean,

	callback: (client, interaction) =>
	{
		interaction.reply(`Pong! ${client.ws.ping}ms`);
	},
};
