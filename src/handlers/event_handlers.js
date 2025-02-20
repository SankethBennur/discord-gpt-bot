const path = require("path");
const get_all_files = require("../utils/get_all_files");
const { Client, Events } = require("discord.js");

/**
 * 
 * @param {Client} Client  Bot client
 */
const event_handler = (client) =>
{
	const event_folder_list_ = get_all_files(
		path.join(__dirname, "..", "events"),
		true
	);
	/* 
		This is smart! No need to iterate from upper level,
		isolate that for loop outside, and then iterate inner folders
		for each event file - preventing 3 degree iterations
	*/

	for (const event_folder_ of event_folder_list_)
	{
		const event_file_list_ = get_all_files(event_folder_);
		const event_name_ = event_folder_.replace(/\\/g, '/').split('/').pop();

		event_file_list_.sort((a, b) => (a > b));

		// Adding event listeners here
		client.on(event_name_, async (arg) =>
		{
			// Callback function to execute the callback function of event!

			for (const event_file_ of event_file_list_)
			{
				const event_handler_fn_ = require(event_file_);

				await event_handler_fn_(client, arg);
			}
		});

	}

};

module.exports = event_handler;
