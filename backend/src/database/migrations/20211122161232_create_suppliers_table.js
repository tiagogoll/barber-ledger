exports.up = (knex) =>
	knex.schema.createTable("suppliers", (table) => {
		table.increments("id");
		table.bool("recover").defaultTo(false).notNullable();
		table.string("cnpj", 14).unique().notNullable();
		table.string("name").unique().notNullable();
		table.string("cellphone").notNullable();
		table.string("email");
		table.string("cep", 8);
		table.string("addressNumber");
		table.string("addressComplement");
	});

exports.down = (knex) => knex.schema.dropTable("suppliers");
