exports.up = (knex) =>
	knex.schema.createTable("consumptions", (table) => {
		table.increments("id");
		table.date("consumptionDate").notNullable();
	});

exports.down = (knex) => knex.schema.dropTable("consumptions");
