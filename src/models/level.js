const { Schema, model } = require("mongoose");

const level_schema = new Schema(
	{
		user_id: { type: String, required: true, },
		guild_id: { type: String, required: true, },
		xp: { type: Number, default: 0, },
		level: { type: Number, default: 0, },
	}
);

module.exports = model("level", level_schema);
