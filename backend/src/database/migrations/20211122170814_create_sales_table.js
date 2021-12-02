exports.up = (knex) =>
	knex.schema.createTable("sales", (table) => {
		table.increments("id");
		table.date("sellDate").notNullable();

		table.integer("clientId").references("clients.id").notNullable();
	});

exports.down = (knex) => knex.schema.dropTable("sales");
