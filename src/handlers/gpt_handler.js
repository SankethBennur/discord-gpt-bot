require("dotenv").config();
const { Client } = require("discord.js");
const { OpenAI } = require("openai");

const IGNORE_PREFIX = '!';
const CHANNEL_LIST = ["822533905147363411"];

// Create OpenAI object
const open_ai = new OpenAI({
	apiKey: process.env.OPENAI_KEY,
});

// Validate message, authour, channel and more
const cannot_operate_on_message = (client, message) => (
	message.author.bot			// Don't respond to bot messages
	|| message.content.startsWith(IGNORE_PREFIX)		// Ignore messages starting with a prefix
	|| !CHANNEL_LIST.includes(message.guild.id)		// Ignore messages from other channels not contained in CHANNEL_LIST
	|| message.mentions.users.has(client.user.id)		// Don't process messages mentioning bot
);

/**
 * 
 * @param {Client} gpt_client 
 */
const gpt_listener = (gpt_client) =>
{
	gpt_client.on(
		"messageCreate",
		async (message) =>
		{
			if (cannot_operate_on_message(gpt_client, message)) return;

			let error_msg_ = "";

			const gpt_conversation_ = [];
			gpt_conversation_.push({
				role: "system",
				content: "Chat GPT is a friendly LLM for a chatbot.",
			});

			const previous_message_list_ =		// Get list of channel messages (last 10)
				await message.channel.messages.fetch({ limit: 10 });
			previous_message_list_.reverse();	// And, reverse it.

			previous_message_list_.forEach((prev_msg_) =>
			{
				if (cannot_operate_on_message(gpt_client, prev_msg_))
					return;			// Return, not break, since this is the looping method, not looping block of code

				let user_name_ = prev_msg_.author.username
					.replace(/\s+/g, '_')
					.replace(/[^\w\s]/gi, '');

				if (prev_msg_.author.id === gpt_client.user.id)
				{
					gpt_conversation_.push({
						role: "assistant",
						name: user_name_,
						content: prev_msg_.content,
					});
					return;
				}

				// Now, for the previous message from the user
				gpt_conversation_.push({
					role: "user",
					name: user_name_,
					content: prev_msg_.content,
				});

			});

			try
			{
				// Mock typing message
				await message.channel.sendTyping();
				const send_typing_interval_ = setInterval(() =>
				{
					message.channel.sendTyping();
				}, 5000);

				// Get response from OpenAI, using one of their GPT model, for user's message
				const response_ = await open_ai.chat.completions
					// Creating the prompts themselves
					.create(
						{
							model: "gpt-4o-mini",
							messages: gpt_conversation_,
						}
					)
					.catch((error) =>
					{
						console.error("--- GPT response ---", error);
						error_msg_ = error.message;
					});

				clearInterval(send_typing_interval_);

				if (!response_)
				{
					message.reply(`I am having trouble with OpenAI and their GPT model. Try again in some time:\n${error_msg_}`);
					return;
				}

				/*
					Discord limits bot messages to 2000 characters.
					So, we will be sending message chunks,
					such that each message is a sub-string of 2000 characters.
				*/
				const response_message_ = response_.choices[0]		// Cuz, sometimes, we have more than one "choice" in a response
					.message.content;			// Then, finally we can get the content of the message from 1st choice
				const chunk_size_ = 2000;

				for (let i = 0; i < response_message_.length; i += chunk_size_)
				{
					const chunk_ =
						response_message_.substring(i, i + chunk_size_);
					await message.reply(chunk_);
				}

			}
			catch (error)
			{
				console.error(" === gpt_handler ===", error);
			}

		}
	);
};

module.exports = gpt_listener;
