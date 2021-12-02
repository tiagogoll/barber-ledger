const db = require("../database");
const subject = () => db("consumptions");

module.exports = {
	async index(req, res, next) {
		try {
			const { consumptionDate = false, productId = false } = req.query;

			const { id = false } = req.params;
			let result = "";

			if (id) {
				const consumption = await subject()
					.where("consumptions.id", id)
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
					.join(
						"products",
						"products.id",
						"=",
						"batchItems.productId"
					)
					.select("consumptions.id", "consumptions.consumptionDate")
					.first();

				const consumptionItems = await subject()
					.where("consumptions.id", id)
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
					.join(
						"products",
						"products.id",
						"=",
						"batchItems.productId"
					)
					.select(
						{ batchItemId: "consumptionItems.batchItemsId" },
						{ productName: "products.name" },
						{ consumptionItemAmount: "consumptionItems.amount" },
						{ consumptionItemPrice: "consumptionItems.price" }
					);
				result = [consumption, consumptionItems];
			} else {
				const consumptions = subject()
					.limit(5)
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
					.join(
						"products",
						"products.id",
						"=",
						"batchItems.productId"
					)
					.orderBy("consumptions.consumptionDate", "asc");
				if (consumptionDate) {
					consumptions.where(
						"consumptions.consumptionDate",
						consumptionDate
					);
				}
				if (productId) {
					consumptions.where("products.id", productId);
				}
				consumptions
					.select("consumptions.id", "consumptions.consumptionDate")
					.distinct();

				const consumptionsReady = await consumptions;

				const consumptionsItems = await Promise.all(
					consumptionsReady.map(async ({ id }) => {
						const items = subject()
							.where("consumptions.id", id)
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
							.join(
								"products",
								"products.id",
								"=",
								"batchItems.productId"
							)
							.orderBy("consumptions.consumptionDate", "asc");
						if (consumptionDate) {
							items.where(
								"consumptions.consumptionDate",
								consumptionDate
							);
						}
						if (productId) {
							items.where("products.id", productId);
						}
						items.select(
							{
								consumptionItemConsumptionId:
									"consumptionItems.consumptionId",
							},
							{ productName: "products.name" },
							{
								consumptionItemAmount:
									"consumptionItems.amount",
							}
						);
						return await items;
					})
				);

				result = [consumptionsReady, consumptionsItems];
			}

			return res.json(result);
		} catch (error) {
			next(error);
		}
	},
	async create(req, res, next) {
		try {
			const { consumptionDate, consumptionItemsDetails } = req.body;

			const [consumptionId] = await subject()
				.insert({
					consumptionDate,
				})
				.returning("id");

			consumptionItemsDetails.map(async ({ id, amount }) => {
				await db("consumptionItems").insert({
					amount: amount,
					batchItemsId: id,
					consumptionId: consumptionId,
				});
			});

			return res.status(201).send();
		} catch (error) {
			next(error);
		}
	},
	async update(req, res, next) {
		try {
			const { consumptionDate, consumptionItemsDetails } = req.body;
			const { id } = req.params;
			const consumptionId = id;

			await subject()
				.update({
					consumptionDate,
				})
				.where("id", consumptionId);

			await db("consumptionItems")
				.where("consumptionItems.consumptionId", consumptionId)
				.del();

			consumptionItemsDetails.map(async ([id, amount]) => {
				await db("consumptionItems").insert({
					amount: amount,
					batchItemsId: id,
					consumptionId: consumptionId,
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
			const consumptionId = id;

			await db("consumptionItems")
				.where("consumptionItems.consumptionId", consumptionId)
				.del();
			await subject().where("id", consumptionId).del();

			return res.status(201).send();
		} catch (error) {
			next(error);
		}
	},
};
