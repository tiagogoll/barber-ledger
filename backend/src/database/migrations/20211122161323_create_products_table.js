exports.up = (knex) =>
	knex.schema.createTable("products", (table) => {
		table.increments("id");
		table.bool("recover").defaultTo(false).notNullable();
		table.string("name").unique().notNullable();
		table.text("description");
	});

exports.down = (knex) => knex.schema.dropTable("products");
