exports.up = (knex) =>
	knex.schema.createTable("cuts", (table) => {
		table.increments("id");
		table.bool("recover").defaultTo(false).notNullable();
		table.string("name").unique().notNullable();
		table.decimal("price", 15, 2).notNullable();
		table.text("description");
	});

exports.down = (knex) => knex.schema.dropTable("cuts");
