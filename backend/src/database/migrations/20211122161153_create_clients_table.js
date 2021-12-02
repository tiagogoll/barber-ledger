exports.up = (knex) =>
	knex.schema.createTable("clients", (table) => {
		table.increments("id");
		table.bool("recover").defaultTo(false).notNullable();
		table.string("name").unique().notNullable();
		table.string("cellphone", 11).notNullable();
		table.string("cpf", 11);
		table.string("email");
		table.string("address");
	});

exports.down = (knex) => knex.schema.dropTable("clients");
