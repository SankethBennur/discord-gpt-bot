const fs = require("fs");
const path = require("path");

const get_all_files = (directory, folders_only = false) =>
{
	const file_names_ = [];
	const files_ = fs.readdirSync(directory, { withFileTypes: true });

	for (const file_ of files_)
	{
		// get full path of file
		const file_path_ = path.join(directory, file_.name);

		// if full path is directory && folders_only === true
		// 		add folders to file_names_
		if (folders_only && file_.isDirectory())
			file_names_.push(file_path_);

		// else
		// 		add files to file_names_
		else file_names_.push(file_path_);

	}

	return file_names_;
};

module.exports = get_all_files;
