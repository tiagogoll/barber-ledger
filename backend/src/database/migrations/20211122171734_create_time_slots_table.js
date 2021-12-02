exports.up = (knex) =>
	knex.schema.createTable("timeSlots", (table) => {
		table.increments("id");
		table.integer("slot").notNullable();

		table.integer("scheduleId").references("schedules.id").notNullable();
	});

exports.down = (knex) => knex.schema.dropTable("timeSlots");
