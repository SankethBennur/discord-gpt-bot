const { Client, Interaction } = require("discord.js");
const entity_user_daily = require("../../models/user_daily");

const command_daily = {
	name: "daily",
	description: "Get daily balance",

	/**
	 * 
	 * @param {Client} client 
	 * @param {Interaction} interaction 
	 */
	callback: async (client, interaction) =>
	{
		await interaction.deferReply();

		try
		{
			if (!interaction.inGuild())
			{
				interaction.editReply({
					content: `This command can only be used from a guild.`,
					ephemeral: true,
				});
				return;
			}

			const current_date_ = new Date();
			const query_ = { user_id: interaction.member.id, guild_id: interaction.guild.id };

			// Get existing user_daily record
			let record_user_daily_ = await entity_user_daily.findOne(query_);

			if (record_user_daily_)
			{
				// Validate if user is invoking command on the same date
				if (record_user_daily_.last_daily.toDateString() === current_date_.toDateString())
				{
					interaction.editReply(`You have consumed your daily command. Try again tomorrow.`);
					return;
				}

				record_user_daily_.last_daily = current_date_;	// Could we have queried using the last_daily date itself?
				// But, how do we delete / update the existing user_daily record?
				record_user_daily_.balance += 1000;		// Adding balance to existing user_daily record, before saving it
			}
			else	// No record of daily user
			{
				// Create a daily user record.
				record_user_daily_ = new entity_user_daily(
					{
						user_id: interaction.member.id,
						guild_id: interaction.guild.id,
						last_daily: current_date_,
						balance: 1000,
					}
				);
			}

			// Save existing / newly created user_daily data
			await record_user_daily_.save()
				.catch((error_) =>
				{
					console.log("=== commands/economy/daily.js ===");
					console.log("Error in saving record for user_daily");
					console.log(error_);
				});

			interaction.editReply(`Thank you for checking in! ${interaction.member.user.displayName} now has balance of ${record_user_daily_.balance}`);

		}
		catch (error)
		{
			interaction.editReply(`Error encountered in the server`);
			console.log(`=== commands/economy/daily.js ===`);
			console.log(error);
		}

	},
};

module.exports = command_daily;
