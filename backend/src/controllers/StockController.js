const db = require("../database");
const subject = () => db("batches");

module.exports = {
	async indexSalesAndConsumptions(req, res, next) {
		try {
			const { id = false } = req.params;
			const productId = id;

			const [consumptions] = await db("consumptionItems")
				.join(
					"batchItems",
					"batchItems.id",
					"=",
					"consumptionItems.batchItemsId"
				)
				.join("batches", "batches.id", "=", "batchItems.batchId")
				.join("products", "products.id", "=", "batchItems.productId")
				.where("products.id", productId)
				.sum("consumptionItems.amount");

			const [sales] = await db("saleItems")
				.join(
					"batchItems",
					"batchItems.id",
					"=",
					"saleItems.batchItemsId"
				)
				.join("batches", "batches.id", "=", "batchItems.batchId")
				.join("products", "products.id", "=", "batchItems.productId")
				.where("products.id", productId)
				.sum("saleItems.amount");

			const [available] = await db("batchItems")
				.where("productId", productId)
				.sum("amount");

			availableSum = available.sum === null ? 0 : parseInt(available.sum);
			consumptionsSum =
				consumptions.sum === null ? 0 : parseInt(consumptions.sum);
			salesSum = sales.sum === null ? 0 : parseInt(sales.sum);

			return res.json({
				available: availableSum - (consumptionsSum + salesSum),
			});
		} catch (error) {
			next(error);
		}
	},
	async index(req, res, next) {
		try {
			const {
				supplierId = false,
				buyDate = false,
				productId = false,
			} = req.query;

			const { id = false } = req.params;
			let result = "";

			if (id) {
				const batch = await subject()
					.where("batches.id", id)
					.join(
						"suppliers",
						"suppliers.id",
						"=",
						"batches.supplierId"
					)
					.join("batchItems", "batchItems.batchId", "=", "batches.id")
					.join(
						"products",
						"products.id",
						"=",
						"batchItems.productId"
					)
					.select(
						"batches.id",
						"batches.buyDate",
						{ supplierId: "suppliers.id" },
						{ supplierName: "suppliers.name" },
						{ supplierCnpj: "suppliers.cnpj" }
					)
					.first();

				const batchItems = await subject()
					.where("batches.id", id)
					.join(
						"suppliers",
						"suppliers.id",
						"=",
						"batches.supplierId"
					)
					.join("batchItems", "batchItems.batchId", "=", "batches.id")
					.join(
						"products",
						"products.id",
						"=",
						"batchItems.productId"
					)
					.select(
						{ productId: "products.id" },
						{ productName: "products.name" },
						{ batchItemAmount: "batchItems.amount" },
						{ batchItemCostPrice: "batchItems.costPrice" }
					);
				result = [batch, batchItems];
			} else {
				const batches = subject()
					.limit(5)
					.join(
						"suppliers",
						"suppliers.id",
						"=",
						"batches.supplierId"
					)
					.join("batchItems", "batchItems.batchId", "=", "batches.id")
					.join(
						"products",
						"products.id",
						"=",
						"batchItems.productId"
					)
					.orderBy("batches.buyDate", "asc");
				if (supplierId) {
					batches.andWhere("suppliers.id", supplierId);
				}
				if (buyDate) {
					batches.andWhere("batches.buyDate", buyDate);
				}
				if (productId) {
					batches.andWhere("products.id", productId);
				}
				batches
					.select("batches.id", "batches.buyDate", {
						supplierName: "suppliers.name",
					})
					.distinct();

				const batchesReady = await batches;

				const batchesItems = await Promise.all(
					batchesReady.map(async ({ id }) => {
						const items = subject()
							.where("batches.id", id)
							.join(
								"suppliers",
								"suppliers.id",
								"=",
								"batches.supplierId"
							)
							.join(
								"batchItems",
								"batchItems.batchId",
								"=",
								"batches.id"
							)
							.join(
								"products",
								"products.id",
								"=",
								"batchItems.productId"
							)
							.orderBy("batches.buyDate", "asc");
						if (supplierId) {
							items.andWhere("suppliers.id", supplierId);
						}
						if (buyDate) {
							items.andWhere("batches.buyDate", buyDate);
						}
						if (productId) {
							items.andWhere("products.id", productId);
						}
						items.select(
							{ batchItemBatchId: "batchItems.batchId" },
							{ productName: "products.name" },
							{ batchItemAmount: "batchItems.amount" },
							{ batchItemCostPrice: "batchItems.costPrice" }
						);
						return await items;
					})
				);

				result = [batchesReady, batchesItems];
			}

			return res.json(result);
		} catch (error) {
			next(error);
		}
	},
	async create(req, res, next) {
		try {
			const { supplierId, buyDate, productDetails } = req.body;

			const [batchId] = await subject()
				.insert({
					supplierId,
					buyDate,
				})
				.returning("id");

			productDetails.map(async ({ id, amount, costPrice }) => {
				await db("batchItems").insert({
					amount: amount,
					costPrice: costPrice,
					productId: id,
					batchId: batchId,
				});
			});

			return res.status(201).send();
		} catch (error) {
			next(error);
		}
	},
	async update(req, res, next) {
		try {
			const { supplierId, buyDate, productDetails } = req.body;
			const { id } = req.params;
			const batchId = id;

			const [consumptions] = await db("consumptions")
				.join(
					"consumptionItems",
					"consumptionItems.consumptionId",
					"=",
					"consumptions.id"
				)
				.join(
					"batchItems",
					"batchItems.id",
					"=",
					"consumptionItems.batchItemsId"
				)
				.join("batches", "batches.id", "=", "batchItems.batchId")
				.where("batches.id", batchId)
				.count();

			const [sales] = await db("sales")
				.join("saleItems", "saleItems.saleId", "=", "sales.id")
				.join(
					"batchItems",
					"batchItems.id",
					"=",
					"saleItems.batchItemsId"
				)
				.join("batches", "batches.id", "=", "batchItems.batchId")
				.where("batches.id", batchId)
				.count();

			if (
				parseInt(consumptions.count) === 0 &&
				parseInt(sales.count) === 0
			) {
				await subject()
					.update({
						supplierId,
						buyDate,
					})
					.where("id", batchId);

				await db("batchItems")
					.where("batchItems.batchId", batchId)
					.del();

				productDetails.map(async ({ id, amount, costPrice }) => {
					await db("batchItems").insert({
						amount: amount,
						costPrice: costPrice,
						productId: id,
						batchId: batchId,
					});
				});

				return res.status(201).send();
			} else {
				return res.status(500).send();
			}
		} catch (error) {
			next(error);
		}
	},
	async delete(req, res, next) {
		try {
			const { id } = req.params;
			const batchId = id;

			const [consumptions] = await db("consumptions")
				.join(
					"consumptionItems",
					"consumptionItems.consumptionId",
					"=",
					"consumptions.id"
				)
				.join(
					"batchItems",
					"batchItems.id",
					"=",
					"consumptionItems.batchItemsId"
				)
				.join("batches", "batches.id", "=", "batchItems.batchId")
				.where("batches.id", batchId)
				.count();

			const [sales] = await db("sales")
				.join("saleItems", "saleItems.saleId", "=", "sales.id")
				.join(
					"batchItems",
					"batchItems.id",
					"=",
					"saleItems.batchItemsId"
				)
				.join("batches", "batches.id", "=", "batchItems.batchId")
				.where("batches.id", batchId)
				.count();

			console.log(consumptions, sales);

			if (
				parseInt(consumptions.count) === 0 &&
				parseInt(sales.count) === 0
			) {
				await db("batchItems")
					.where("batchItems.batchId", batchId)
					.del();
				await subject().where("id", batchId).del();

				return res.status(201).send();
			} else {
				return res.status(500).send();
			}
		} catch (error) {
			next(error);
		}
	},
};
