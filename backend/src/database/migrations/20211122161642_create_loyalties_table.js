exports.up = (knex) =>
	knex.schema.createTable("loyalties", (table) => {
		table.increments("id");
		table.bool("recover").defaultTo(false).notNullable();
		table.string("name").unique().notNullable();
		table.date("startDate").notNullable();
		table.date("endDate").notNullable();
		table.integer("discount").notNullable();
		table.integer("repetitions").notNullable();
	});

exports.down = (knex) => knex.schema.dropTable("loyalties");
