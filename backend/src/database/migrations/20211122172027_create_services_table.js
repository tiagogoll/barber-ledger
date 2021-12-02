exports.up = (knex) =>
	knex.schema.createTable("services", (table) => {
		table.increments("id");
		table.bool("isDone").defaultTo(false).notNullable();

		table.integer("loyaltyId").references("loyalties.id");
		table.integer("scheduleId").references("schedules.id").notNullable();
	});

exports.down = (knex) => knex.schema.dropTable("services");
