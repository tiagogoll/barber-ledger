const db = require("../database");
const subject = () => db("schedules");

module.exports = {
	async indexAvailableTimeSlots(req, res, next) {
		try {
			const { scheduleDate = false } = req.query;

			const usedSlots = (
				await subject()
					.where("schedules.scheduleDate", scheduleDate)
					.join(
						"timeSlots",
						"timeSlots.scheduleId",
						"=",
						"schedules.id"
					)
					.select("timeSlots.slot")
			).map(({ slot }) => parseInt(slot));

			const availableTimes = [...Array(96).keys()]
				.map((x) => x + 1)
				.filter((x) => !usedSlots.includes(x));

			const result = availableTimes;

			return res.json(result);
		} catch (error) {
			next(error);
		}
	},
	async index(req, res, next) {
		try {
			const {
				clientId = false,
				scheduleDate = false,
				cutId = false,
			} = req.query;

			const { id = false } = req.params;
			let result = "";

			if (id) {
				const schedule = await subject()
					.where("schedules.id", id)
					.join("clients", "clients.id", "=", "schedules.clientId")
					.join(
						"timeSlots",
						"timeSlots.scheduleId",
						"=",
						"schedules.id"
					)
					.join(
						"scheduleItems",
						"scheduleItems.scheduleId",
						"=",
						"schedules.id"
					)
					.join("cuts", "cuts.id", "=", "scheduleItems.cutId")
					.first()
					.select(
						"schedules.id",
						"schedules.scheduleDate",
						{ clientId: "clients.id" },
						{ clientName: "clients.name" }
					);

				const scheduleItems = await subject()
					.where("schedules.id", id)
					.join("clients", "clients.id", "=", "schedules.clientId")
					.join(
						"timeSlots",
						"timeSlots.scheduleId",
						"=",
						"schedules.id"
					)
					.join(
						"scheduleItems",
						"scheduleItems.scheduleId",
						"=",
						"schedules.id"
					)
					.join("cuts", "cuts.id", "=", "scheduleItems.cutId")
					.select(
						{ scheduleItemCutId: "scheduleItems.cutId" },
						{ cutName: "cuts.name" },
						{ timeSlot: "timeSlots.slot" }
					);
				result = [schedule, scheduleItems];
			} else {
				const schedules = subject()
					.limit(5)
					.join("clients", "clients.id", "=", "schedules.clientId")
					.join(
						"timeSlots",
						"timeSlots.scheduleId",
						"=",
						"schedules.id"
					)
					.join(
						"scheduleItems",
						"scheduleItems.scheduleId",
						"=",
						"schedules.id"
					)
					.join("cuts", "cuts.id", "=", "scheduleItems.cutId");
				if (clientId) {
					schedules.andWhere("clients.id", clientId);
				}
				if (scheduleDate) {
					schedules.andWhere("schedules.scheduleDate", scheduleDate);
				}
				if (cutId) {
					schedules.andWhere("cuts.id", cutId);
				}
				schedules
					.select("schedules.id", "schedules.scheduleDate", {
						clientName: "clients.name",
					})
					.distinct();

				const schedulesReady = await schedules;

				const schedulesItems = await Promise.all(
					schedulesReady.map(async ({ id }) => {
						const items = subject()
							.where("schedules.id", id)
							.join(
								"clients",
								"clients.id",
								"=",
								"schedules.clientId"
							)
							.join(
								"timeSlots",
								"timeSlots.scheduleId",
								"=",
								"schedules.id"
							)
							.join(
								"scheduleItems",
								"scheduleItems.scheduleId",
								"=",
								"schedules.id"
							)
							.join(
								"cuts",
								"cuts.id",
								"=",
								"scheduleItems.cutId"
							);
						if (clientId) {
							items.andWhere("clients.id", clientId);
						}
						if (scheduleDate) {
							items.andWhere(
								"schedules.scheduleDate",
								scheduleDate
							);
						}
						if (cutId) {
							items.andWhere("cuts.id", cutId);
						}
						items
							.select(
								{ scheduleId: "schedules.id" },
								{ cutName: "cuts.name" },
								{ cutPrice: "cuts.price" }
							)
							.distinct();
						return await items;
					})
				);

				const timeSlots = await Promise.all(
					schedulesReady.map(async ({ id }) => {
						const items = subject()
							.where("schedules.id", id)
							.join(
								"clients",
								"clients.id",
								"=",
								"schedules.clientId"
							)
							.join(
								"timeSlots",
								"timeSlots.scheduleId",
								"=",
								"schedules.id"
							)
							.join(
								"scheduleItems",
								"scheduleItems.scheduleId",
								"=",
								"schedules.id"
							)
							.join(
								"cuts",
								"cuts.id",
								"=",
								"scheduleItems.cutId"
							);
						if (clientId) {
							items.andWhere("clients.id", clientId);
						}
						if (scheduleDate) {
							items.andWhere(
								"schedules.scheduleDate",
								scheduleDate
							);
						}
						if (cutId) {
							items.andWhere("cuts.id", cutId);
						}
						items
							.select(
								{ timeSlotScheduleId: "timeSlots.scheduleId" },
								{ timeSlotSlot: "timeSlots.slot" }
							)
							.distinct();
						return await items;
					})
				);

				result = [schedulesReady, schedulesItems, timeSlots];
			}

			return res.json(result);
		} catch (error) {
			next(error);
		}
	},
	async create(req, res, next) {
		try {
			const { scheduleDate, clientId, timeSlots, cuts } = req.body;

			const loyalty = await db("loyalties")
				.where("recover", false)
				.andWhere("startDate", "<=", scheduleDate)
				.andWhere("endDate", ">=", scheduleDate)
				.select("*")
				.first();

			const [scheduleId] = await subject()
				.insert({
					scheduleDate,
					clientId,
				})
				.returning("id");

			timeSlots.map(async (x) => {
				await db("timeSlots").insert({
					slot: x,
					scheduleId: scheduleId,
				});
			});

			cuts.map(async (x) => {
				await db("scheduleItems").insert({
					cutId: x,
					scheduleId: scheduleId,
				});
			});

			if (loyalty) {
				const repetitions = (async () => {
					const [{ count }] = await db("services")
						.where("services.isDone", true)
						.andWhere("schedules.clientId", clientId)
						.join(
							"schedules",
							"schedules.id",
							"=",
							"services.scheduleId"
						)
						.andWhere(
							"schedules.scheduleDate",
							">=",
							loyalty.startDate
						)
						.andWhere(
							"schedules.scheduleDate",
							"<=",
							loyalty.endDate
						)
						.count();
					return [loyalty.id, loyalty.repetitions, parseInt(count)];
				})();

				repetitions.then(async ([id, repetitions, count]) => {
					if (count >= repetitions && count % repetitions === 0) {
						await db("services").insert({
							loyaltyId: id,
							scheduleId: scheduleId,
						});
					} else {
						await db("services").insert({
							scheduleId: scheduleId,
						});
					}
				});
			} else {
				await db("services").insert({
					scheduleId: scheduleId,
				});
			}

			return res.status(201).send();
		} catch (error) {
			next(error);
		}
	},
	async update(req, res, next) {
		try {
			const { scheduleDate, clientId, timeSlots, cuts } = req.body;
			const { id } = req.params;
			const scheduleId = id;

			const [{ isDone }] = await db("services")
				.where("services.scheduleId", scheduleId)
				.select("services.isDone");

			if (!isDone) {
				await subject()
					.update({
						scheduleDate,
						clientId,
					})
					.where("id", scheduleId);

				await db("timeSlots").where("scheduleId", scheduleId).del();

				timeSlots.map(async (x) => {
					await db("timeSlots").insert({
						slot: x,
						scheduleId: scheduleId,
					});
				});

				await db("scheduleItems").where("scheduleId", scheduleId).del();

				cuts.map(async (x) => {
					await db("scheduleItems").insert({
						cutId: x,
						scheduleId: scheduleId,
					});
				});

				await db("services").where("scheduleId", scheduleId).del();

				const loyalty = await db("loyalties")
					.where("recover", false)
					.andWhere("startDate", "<=", scheduleDate)
					.andWhere("endDate", ">=", scheduleDate)
					.select("*")
					.first();

				if (loyalty) {
					const repetitions = (async () => {
						const [{ count }] = await db("services")
							.where("services.isDone", true)
							.andWhere("schedules.clientId", clientId)
							.join(
								"schedules",
								"schedules.id",
								"=",
								"services.scheduleId"
							)
							.andWhere(
								"schedules.scheduleDate",
								">=",
								loyalty.startDate
							)
							.andWhere(
								"schedules.scheduleDate",
								"<=",
								loyalty.endDate
							)
							.count();
						return [
							loyalty.id,
							loyalty.repetitions,
							parseInt(count),
						];
					})();

					repetitions.then(async ([id, repetitions, count]) => {
						if (count >= repetitions && count % repetitions === 0) {
							await db("services").insert({
								loyaltyId: id,
								scheduleId: scheduleId,
							});
						} else {
							await db("services").insert({
								scheduleId: scheduleId,
							});
						}
					});
				} else {
					await db("services").insert({
						scheduleId: scheduleId,
					});
				}

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
			const scheduleId = id;

			const [{ isDone }] = await db("services")
				.where("services.scheduleId", scheduleId)
				.select("services.isDone");

			if (!isDone) {
				await db("timeSlots").where("scheduleId", scheduleId).del();
				await db("scheduleItems").where("scheduleId", scheduleId).del();
				await db("services").where("scheduleId", scheduleId).del();
				await subject().where("id", scheduleId).del();

				return res.status(201).send();
			} else {
				return res.status(500).send();
			}
		} catch (error) {
			next(error);
		}
	},
};
