exports.up = (knex) =>
	knex.schema.createTable("batches", (table) => {
		table.increments("id");
		table.date("buyDate").notNullable();

		table.integer("supplierId").references("suppliers.id").notNullable();
	});

exports.down = (knex) => knex.schema.dropTable("batches");
