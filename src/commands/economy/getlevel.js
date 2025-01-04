const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	AttachmentBuilder } = require("discord.js");
const entity_user_level_ = require("../../models/level");
const { RankCardBuilder, Font } = require("canvacord");
const get_level_xp = require("../../utils/get_level_xp");

const command = {
	name: "get-level",
	description: "Gets the level of the target user",
	options: [
		{
			name: "target-user",
			description: "User whose level you want to get. If blank, will get level of invoking user.",
			type: ApplicationCommandOptionType.Mentionable,
		},
	],

	/**
	 * 
	 * @param {Client} client 
	 * @param {Interaction} interaction 
	 * @returns 
	 */
	callback: async (client, interaction) => 
	{
		await interaction.deferReply();

		if (!interaction.inGuild())
		{
			interaction.editReply(`This command can only be executed from a guild.`);
			return;
		}

		try
		{
			const target_user_id_ = interaction.options.get("target-user")?.value
				|| interaction.member.id;

			const target_user_obj_ = await interaction.guild.members.fetch(
				target_user_id_);

			// Attempt to get user level record from MongoDB
			const record_user_level_ = await entity_user_level_.findOne({
				user_id: target_user_id_,
				guild_id: interaction.guild.id,
			});

			if (!record_user_level_)
			// The Guild Member exists, but has no level record (too few interactions)
			{
				interaction.editReply(
					(interaction.options.get("target-user"))
						? `User ${target_user_obj_.user.tag} has no level yet! Awaiting their first interaction/message!`
						: `You do not have any XP & level. Go ahead and send your first message to gain XP!`
				);
				return;
			}

			// Here, the level of the user has been fetched

			// It is now time to sort the user by rank, based on level & XP.

			const all_level_records_ =
				await entity_user_level_.find({ guild_id: interaction.guild.id })
					.select("-_id user_id guild_id xp level");

			/*
			Sorting records of all levels,
			if levels are the same,
				sort by their XP
			
			*/
			all_level_records_.sort(
				(a, b) => (
					(a.level === b.level)
						? b.xp - a.xp
						: b.level - a.level
				)
			);

			const user_rank_ = all_level_records_.findIndex((rec_) => (
				rec_.user_id === target_user_id_
			)) + 1;

			Font.loadDefault();

			// Time to add Rank Card, using canvacord
			const rank_card_build_ = (new RankCardBuilder())
				.setAvatar(target_user_obj_.displayAvatarURL({ size: 256 }))
				.setDisplayName(target_user_obj_.displayName)
				.setRank(user_rank_)
				.setLevel(record_user_level_.level)
				.setCurrentXP(record_user_level_.xp)
				.setRequiredXP(
					get_level_xp(record_user_level_.level + 1)
					- record_user_level_.xp
				)
				.setStatus(target_user_obj_.presence.status)
				.setTextStyles({
					level: "LEVEL:",
					xp: "EXP:",
					rank: "RANK:",
				});

			const rank_card_build_data_ = await rank_card_build_.build({ format: "png" });
			const rank_card_attachment_ = new AttachmentBuilder(rank_card_build_data_);

			interaction.editReply({ files: [rank_card_attachment_] });

		}
		catch (error)
		{
			console.log("=== getlevel ===");
			console.log(error);
		}
	}
};

module.exports = command;
