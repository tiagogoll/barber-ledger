exports.up = (knex) =>
	knex.schema.createTable("consumptionItems", (table) => {
		table.increments("id");
		table.integer("amount").notNullable();

		table.integer("batchItemsId").references("batchItems.id").notNullable();
		table
			.integer("consumptionId")
			.references("consumptions.id")
			.notNullable();
	});

exports.down = (knex) => knex.schema.dropTable("consumptionItems");
