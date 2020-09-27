const env = require("@config/env");
const fs = require('fs');
const helper = require("@libs/helper"); 

class Controller extends require("@core/core") {
	constructor(parameters) {
		super(parameters);
	}

	// Creates a new directory in storage folder
	handleCreateNewDirectory(directory){
		return fs.mkdirSync(directory);
	}

	// Storage handler
	get storage(){
		return {
			file : {
				// Save a new file into storage directory
				save : (fileName = "", destination = "", createNewDir = false) => {
					// If field input is exist
					if (this.ControllerRequest.files !== undefined) {
						// Loop through every files
						this.ControllerRequest.files.forEach((file, index) => {
							// If file fieldname matches with the one that is going to be stored
							if (file.fieldname == fileName) {
								const originalFileName = this.ControllerRequest.files[index].originalname;
								const newFileName =  typeof destination == "object" && destination.as !== undefined ? destination.as + originalFileName.substr(originalFileName.lastIndexOf(".")) : originalFileName;
								const fileDestination = typeof destination == "string" ? destination + "/" : destination.to + "/";
								const directoryPath = env.path.storage + fileDestination;
								// Creates a pointer
								var self = this;
								// Check if directory found
								if (fs.existsSync(directoryPath)) {
									// Begin writing file and store it to ./app/storage/ directory
									fs.writeFileSync(directoryPath + newFileName, this.ControllerRequest.files[index].buffer); 
								}else{
									// Directory is not found
									// Check if user wants to create a new dir
									createNewDir === true ? self.handleCreateNewDirectory(directoryPath) : null;
									// Do the file saving thing again after created a new dir
									createNewDir === true ? fs.writeFileSync(directoryPath + newFileName, this.ControllerRequest.files[index].buffer) : helper.print.log(`${directoryPath} directory can't be found`.red); 
								}
							}
						})
					}else{
						return false;
					}
				},
				// Remove a file from storage directory
				remove : (filePath, callback = () => {}) => {
					fs.unlink(env.path.storage + filePath, (err) => {
					  	if (err) {
					  		helper.print.log(`${err}`.red);
					  		return callback(false) 
					  	};
					  	return callback(true);
					});
				},
				// Render file
				render : (filePath) => {
					const directoryPath = this.global.app_storage_dir + filePath;
					if (fs.existsSync(directoryPath)) {
						try	{
							this.ControllerResponse.sendFile(directoryPath);
						}catch (e) {
							throw e;
						}
					}else{
						this.ControllerResponse.sendFile(this.global.base_dir + "/404.html");
					}
				},
				// Download file from storage directory
				download : (filePath, downloadAliasName = '') => {
					const directoryPath = this.global.app_storage_dir + filePath;
					if (fs.existsSync(directoryPath)) {
						try	{
							if (downloadAliasName != '') {
								this.ControllerResponse.download(directoryPath, downloadAliasName);
							}else{
								this.ControllerResponse.download(directoryPath);
							}
						}catch (e) {
							throw e;
						}
					}else{
						this.ControllerResponse.sendFile(this.global.base_dir + "/404.html");
					}
				}
			}
		}
	}
}

module.exports = Controller;