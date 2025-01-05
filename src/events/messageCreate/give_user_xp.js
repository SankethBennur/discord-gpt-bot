const { Client, Message } = require("discord.js");
const entity_level = require("../../models/level");
const level = require("../../models/level");
const get_level_xp = require("../../utils/get_level_xp");

const user_cooldown_set = new Set();

const calculate_random_xp = (min, max) =>
(
	Math.floor(
		Math.random()
		* (max - min + 1)
	)
	+ min
);

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */
const get_user_xp = async (client, message) =>
{
	if (!message.inGuild() || message.author.bot) return;

	// Validate cooldown
	if (user_cooldown_set.has(message.author.id)) return;

	const xp_to_give_ = calculate_random_xp(5, 15);

	const query_ = { user_id: message.author.id, guild_id: message.guild.id, };

	// entity_level.findOneAndUpdate({}, {}).save().catch()
	// entity_level.updateOne({},{})

	// Find data in Level entity
	const data_level_ = await entity_level.findOne(query_);

	// Update existing data
	if (data_level_)
	{
		data_level_.xp += xp_to_give_;

		if (data_level_.xp >= get_level_xp(data_level_.level))
		{
			data_level_.xp -= get_level_xp(data_level_.level);
			++data_level_.level;

			message.channel.send(`User - ${message.author.tag} has **leveled up to ${data_level_.level}**`);
		}

		// Save the modified level data
		data_level_.save()
			.catch((err_) =>
			{
				console.log(`give_user_xp ==> Error saving ${message.author.username} level & xp: ${error}`);
			});
	}

	else	// data in level entity doesn't exist
	{
		const new_level_data_ = new entity_level(
			{
				user_id: message.author.id,
				guild_id: message.guild.id,
				xp: xp_to_give_,
				level: 1,	// Since it is a new user
			}
		);

		// Let's operate on overflowing and extra XP given
		while (new_level_data_.xp < get_level_xp(new_level_data_))
		{
			new_level_data_.xp -= get_level_xp(new_level_data_.level);
			++new_level_data_.level;

		}

		if (new_level_data_.level > 1)
		{
			message.channel.send(`User ${message.author.username} has **levelled up to ${new_level_data_.level}**`);
		}

		await new_level_data_.save()
			.catch((err_) =>
			{
				console.log(`give_user_xp => Error: Unable to create new user data for level and xp`);
				console.log(error);
			});
	}

	// Update / Insert is complete at this point

	// Handle cooldown
	user_cooldown_set.add(message.author.id);
	setTimeout(() =>
	{
		user_cooldown_set.delete(message.author.id);
	}, 60000);

};

module.exports = get_user_xp;
