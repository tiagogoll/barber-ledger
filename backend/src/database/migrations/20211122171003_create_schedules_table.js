exports.up = (knex) =>
	knex.schema.createTable("schedules", (table) => {
		table.increments("id");
		table.date("scheduleDate").notNullable();

		table.integer("clientId").references("clients.id").notNullable();
	});

exports.down = (knex) => knex.schema.dropTable("schedules");
