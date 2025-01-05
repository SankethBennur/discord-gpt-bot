const { Schema, model } = require("mongoose");

const user_daily_schema = new Schema(
	{
		user_id: { type: String, required: true },
		guild_id: { type: String, required: true },
		last_daily: { type: Date, required: true },
		balance: { type: Number },
	}
);

module.exports = model("user_daily", user_daily_schema);
