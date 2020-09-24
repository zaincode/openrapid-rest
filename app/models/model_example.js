// This file represents a model file
// Model file usually dealing with database, in this case SQL Spesifically
// Or could be any of your business model
// Model should only have one business logic although it is possible to return an object containing methods

module.exports = async ({Database, Model, Arguments}) => {
	return await Model("another_example");
}
