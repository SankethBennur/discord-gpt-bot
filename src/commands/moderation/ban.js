const
	{
		ApplicationCommandOptionType,
		PermissionFlagsBits
	} = require("discord.js");

module.exports = {
	name: "ban",
	description: "Bans a user in the server!!",
	// devOnly: Boolean,
	// testOnly: Boolean,
	// deleted: Boolean,

	options: [
		{
			name: "target_user",
			description: "Target user for banning",
			required: true,
			type: ApplicationCommandOptionType.Mentionable,
		},
		{
			name: "ban_reason",
			description: "Reason for banning",
			type: ApplicationCommandOptionType.String,
		},
	],
	permissionsRequired: [PermissionFlagsBits.Administrator],
	botPermissionsRequired: [PermissionFlagsBits.Administrator],
	callback: (client, interaction) =>
	{
		interaction.reply(`Banned!`);
	},
};
