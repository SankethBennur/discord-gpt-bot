const { server_id } = require("../../../config.json");
const get_local_commands = require("../../utils/get_local_commands");
const get_application_commands = require("../../utils/get_application_commands");
const areCommandsDifferent = require("../../utils/areCommandsDifferent");

const register_commands = async (client, arg) =>
{
	try
	{
		const local_commands_ = get_local_commands();
		const application_commands_ = await get_application_commands(
			client, server_id);

		for (const local_cmd_ of local_commands_)
		{
			const { name, description, options } = local_cmd_;

			const existing_cmd_ = await application_commands_.cache.find(
				(cmd_) => (cmd_.name === name)
			);

			// Performing certain operations on existing application commands
			if (existing_cmd_)
			{
				// Delete existing command, if configured to have been deleted
				if (local_cmd_.deleted)
				{
					await application_commands_.delete(existing_cmd_.id);
					console.log(`🗑️ Deleted command - ${existing_cmd_.name}`);
					continue;
				}

				// Update existing command to match with local configured command
				if (areCommandsDifferent(
					existing_cmd_,
					local_cmd_)
				)
				{
					await application_commands_
						.edit(existing_cmd_.id, { options, description });
					console.log(`📝 Editted command - ${existing_cmd_.id}`);
				}
			}
			else
			{
				// if local command is set to delete,
				if (local_cmd_.deleted)
				{
					// ignore editing an existing application command
					console.log(`⏩ Skipping command ${name} as it is locally set to delete`);
					continue;
				}

				// Create local command for application
				// Since, we handled delete & update by this point
				await application_commands_.create({ name, description, options });
				console.log(`👍 Created a new command - ${name}`);
			}
		}
	}

	catch (error)
	{
		console.log("=== ⛔️ 01_register_commands ===");
		console.log(error);
	}
};

module.exports = register_commands;
