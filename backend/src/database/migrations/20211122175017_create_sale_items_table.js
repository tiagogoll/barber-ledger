exports.up = (knex) =>
	knex.schema.createTable("saleItems", (table) => {
		table.increments("id");
		table.integer("amount").notNullable();
		table.decimal("price", 15, 2).notNullable();

		table.integer("batchItemsId").references("batchItems.id").notNullable();
		table.integer("saleId").references("sales.id").notNullable();
	});

exports.down = (knex) => knex.schema.dropTable("saleItems");
