const { server_id, devs } = require("../../../config.json");
const command = require("../../commands/economy/getlevel");
const get_local_commands = require("../../utils/get_local_commands");

module.exports = async (client, interaction) =>
{
	if (!interaction.isChatInputCommand()) return;

	const local_commands_ = get_local_commands();

	try
	{
		const command_ = local_commands_
			.find((cmd_) => (cmd_.name === interaction.commandName));

		// Validate if command is developer only
		if (command_.devOnly && !devs.includes(interaction.member.id))
		{
			interaction.reply(
				{
					content: "Only developers are allowed to run this command",
					ephemeral: true,
				}
			);
			return;
		}

		// Validate if command is test only
		if (command_.testOnly && server_id !== interaction.guild.id)
		{
			interaction.reply(
				{
					content: "This command is test only",
					ephemeral: true
				}
			);
			return;
		}

		// Validate if command permissions are required by bot
		if (command_.botPermissionsRequired?.length > 0)
		{
			for (const permission_ of command_.botPermissionsRequired)
			{
				const bot_ = interaction.guild.members.me;

				if (!bot_.permissions.has().permission_)
				{
					interaction.reply(
						{
							content: "I don't have the permission to do it.",
							ephemeral: true,
						}
					);
					break;
				}
			}
		}

		// Finally, execute callback function
		await command_.callback(client, interaction);
	}
	catch (error)
	{
		console.log(`=== handle_commands ===`);
		console.log(error);
	}
};
