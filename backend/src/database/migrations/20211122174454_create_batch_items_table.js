exports.up = (knex) =>
	knex.schema.createTable("batchItems", (table) => {
		table.increments("id");
		table.integer("amount").notNullable();
		table.decimal("costPrice", 15, 2).notNullable();

		table.integer("productId").references("products.id").notNullable();
		table.integer("batchId").references("batches.id").notNullable();
	});

exports.down = (knex) => knex.schema.dropTable("batchItems");
