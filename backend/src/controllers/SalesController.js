const db = require("../database");
const subject = () => db("sales");

module.exports = {
	async index(req, res, next) {
		try {
			const {
				clientId = false,
				sellDate = false,
				productId = false,
			} = req.query;

			const { id = false } = req.params;
			let result = "";

			if (id) {
				const sale = await subject()
					.where("sales.id", id)
					.join("clients", "clients.id", "=", "sales.clientId")
					.join("saleItems", "saleItems.saleId", "=", "sales.id")
					.join(
						"batchItems",
						"batchItems.id",
						"=",
						"saleItems.batchItemsId"
					)
					.join(
						"products",
						"products.id",
						"=",
						"batchItems.productId"
					)
					.select(
						"sales.id",
						"sales.sellDate",
						{ clientId: "clients.id" },
						{ clientName: "clients.name" }
					)
					.first();
				const saleItems = await subject()
					.where("sales.id", id)
					.join("clients", "clients.id", "=", "sales.clientId")
					.join("saleItems", "saleItems.saleId", "=", "sales.id")
					.join(
						"batchItems",
						"batchItems.id",
						"=",
						"saleItems.batchItemsId"
					)
					.join(
						"products",
						"products.id",
						"=",
						"batchItems.productId"
					)
					.select(
						{ batchItemId: "saleItems.batchItemsId" },
						{ productName: "products.name" },
						{ saleItemAmount: "saleItems.amount" },
						{ saleItemPrice: "saleItems.price" }
					);
				result = [sale, saleItems];
			} else {
				const sales = subject()
					.limit(5)
					.join("clients", "clients.id", "=", "sales.clientId")
					.join("saleItems", "saleItems.saleId", "=", "sales.id")
					.join(
						"batchItems",
						"batchItems.id",
						"=",
						"saleItems.batchItemsId"
					)
					.join(
						"products",
						"products.id",
						"=",
						"batchItems.productId"
					)
					.orderBy("sales.sellDate", "asc");
				if (clientId) {
					sales.where("sales.clientId", clientId);
				}
				if (sellDate) {
					sales.where("sales.sellDate", sellDate);
				}
				if (productId) {
					sales.where("products.id", productId);
				}
				sales
					.select("sales.id", "sales.sellDate", {
						clientName: "clients.name",
					})
					.distinct();

				const salesReady = await sales;

				const salesItems = await Promise.all(
					salesReady.map(async ({ id }) => {
						const items = subject()
							.where("sales.id", id)
							.join(
								"clients",
								"clients.id",
								"=",
								"sales.clientId"
							)
							.join(
								"saleItems",
								"saleItems.saleId",
								"=",
								"sales.id"
							)
							.join(
								"batchItems",
								"batchItems.id",
								"=",
								"saleItems.batchItemsId"
							)
							.join(
								"products",
								"products.id",
								"=",
								"batchItems.productId"
							)
							.orderBy("sales.sellDate", "asc");
						if (clientId) {
							items.where("sales.clientId", clientId);
						}
						if (sellDate) {
							items.where("sales.sellDate", sellDate);
						}
						if (productId) {
							items.where("products.id", productId);
						}
						items.select(
							{ saleItemSaleId: "saleItems.saleId" },
							{ productName: "products.name" },
							{ saleItemAmount: "saleItems.amount" },
							{ saleItemPrice: "saleItems.price" }
						);
						return await items;
					})
				);

				result = [salesReady, salesItems];
			}

			return res.json(result);
		} catch (error) {
			next(error);
		}
	},
	async create(req, res, next) {
		try {
			const { clientId, sellDate, saleItemsDetails } = req.body;

			const [saleId] = await subject()
				.insert({
					clientId,
					sellDate,
				})
				.returning("id");

			saleItemsDetails.map(async ({ id, amount, price }) => {
				await db("saleItems").insert({
					amount: amount,
					price: price,
					batchItemsId: id,
					saleId: saleId,
				});
			});

			return res.status(201).send();
		} catch (error) {
			next(error);
		}
	},
	async update(req, res, next) {
		try {
			const { clientId, sellDate, saleItemsDetails } = req.body;
			const { id } = req.params;
			const saleId = id;

			await subject()
				.update({
					clientId,
					sellDate,
				})
				.where("id", saleId);

			await db("saleItems").where("saleItems.saleId", saleId).del();

			saleItemsDetails.map(async ({ id, amount, price }) => {
				await db("saleItems").insert({
					amount: amount,
					costPrice: price,
					batchItemsId: id,
					saleId: saleId,
				});
			});

			return res.status(201).send();
		} catch (error) {
			next(error);
		}
	},
	async delete(req, res, next) {
		try {
			const { id } = req.params;
			const saleId = id;

			await db("saleItems").where("saleItems.saleId", saleId).del();
			await subject().where("id", saleId).del();

			return res.status(201).send();
		} catch (error) {
			next(error);
		}
	},
};
