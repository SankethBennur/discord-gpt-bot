const path = require("path");
const get_all_files = require("./get_all_files");

/**
 * Returns list of local command objects
 * 
 * @param exceptions Command files to be excluded
 * @returns List of local commands
 */
const get_local_commands = (exceptions = []) =>
{
	const local_commands_ = [];

	const command_categories_ = get_all_files(
		path.join(__dirname, "..", "commands"),
		true
	);

	for (const command_category_ of command_categories_)
	{
		const commands_in_catg_ = get_all_files(command_category_);

		for (const command_file_ of commands_in_catg_)
		{
			if (exceptions.includes(command_file_)) continue;

			local_commands_.push(require(command_file_));
		}
	}

	return local_commands_;
};

module.exports = get_local_commands;
