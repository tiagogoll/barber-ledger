exports.up = (knex) =>
	knex.schema.createTable("scheduleItems", (table) => {
		table.increments("id");

		table.integer("cutId").references("cuts.id").notNullable();
		table.integer("scheduleId").references("schedules.id").notNullable();
	});

exports.down = (knex) => knex.schema.dropTable("scheduleItems");
