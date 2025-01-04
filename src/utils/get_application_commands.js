module.exports = async (client, guild_id) =>
{
	let application_commands;

	if (guild_id)
	{
		// get application commands from guild
		const guild = await client.guilds.fetch(guild_id);
		application_commands = await guild.commands;
	}
	else
		// get application commands from application
		application_commands = await client.application.commands;

	await application_commands.fetch();

	return application_commands;
};
