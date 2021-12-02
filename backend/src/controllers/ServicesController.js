const db = require("../database");
const subject = () => db("services");

module.exports = {
	async index(req, res, next) {
		try {
			const {
				isDone = false,
				clientId = false,
				scheduleDate = false,
				cutId = false,
			} = req.query;

			const { id = false } = req.params;

			if (id) {
				const service = await subject()
					.where("services.id", id)
					.join(
						"schedules",
						"schedules.id",
						"=",
						"services.scheduleId"
					)
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
						"services.id",
						"services.loyaltyId",
						"services.isDone",
						{ scheduleId: "schedules.id" },
						{ scheduleScheduleDate: "schedules.scheduleDate" },
						{ clientId: "clients.id" },
						{ clientName: "clients.name" }
					);

				const serviceItems = await subject()
					.where("services.id", id)
					.join(
						"schedules",
						"schedules.id",
						"=",
						"services.scheduleId"
					)
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
				result = [service, serviceItems];
			} else {
				const services = subject()
					.limit(5)
					.join(
						"schedules",
						"schedules.id",
						"=",
						"services.scheduleId"
					)
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
				if (isDone) {
					services.andWhere("services.isDone", isDone);
				}
				if (clientId) {
					services.andWhere("clients.id", clientId);
				}
				if (scheduleDate) {
					services.andWhere("schedules.scheduleDate", scheduleDate);
				}
				if (cutId) {
					services.andWhere("cuts.id", cutId);
				}
				services
					.select(
						"services.id",
						"services.loyaltyId",
						"services.isDone",
						{ scheduleScheduleDate: "schedules.scheduleDate" },
						{ clientId: "clients.id" },
						{ clientName: "clients.name" }
					)
					.distinct();

				const servicesReady = await services;

				const servicesItems = await Promise.all(
					servicesReady.map(async ({ id }) => {
						const items = subject()
							.where("services.id", id)
							.join(
								"schedules",
								"schedules.id",
								"=",
								"services.scheduleId"
							)
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
						if (isDone) {
							items.andWhere("services.isDone", isDone);
						}
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
								{ serviceId: "services.id" },
								{ cutName: "cuts.name" },
								{ cutPrice: "cuts.price" }
							)
							.distinct();
						return await items;
					})
				);

				const timeSlots = await Promise.all(
					servicesReady.map(async ({ id }) => {
						const items = subject()
							.where("services.id", id)
							.join(
								"schedules",
								"schedules.id",
								"=",
								"services.scheduleId"
							)
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
						if (isDone) {
							items.andWhere("services.isDone", isDone);
						}
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
								{ serviceId: "services.id" },
								{ timeSlotSlot: "timeSlots.slot" }
							)
							.distinct();
						return await items;
					})
				);

				const loyalties = await Promise.all(
					servicesReady
						.filter(({ loyaltyId }) => loyaltyId !== null)
						.map(({ id, loyaltyId }) => {
							return { id, loyaltyId };
						})
						.map(async ({ id, loyaltyId }) => {
							const [{ discount }] = await db("loyalties")
								.where("id", loyaltyId)
								.select("discount");
							return { servicesId: id, discount: discount };
						})
				);

				let adjustedServicesReady;
				let adjustedServicesItems;

				if (loyalties.length !== 0) {
					adjustedServicesReady = loyalties.map(
						({ servicesId, discount }) => {
							return servicesReady.map(
								({
									id,
									isDone,
									scheduleScheduleDate,
									clientId,
									clientName,
								}) => {
									if (servicesId === id) {
										return {
											id,
											discount: discount,
											isDone,
											scheduleScheduleDate,
											clientId,
											clientName,
										};
									} else {
										return {
											id,
											discount: 0,
											isDone,
											scheduleScheduleDate,
											clientId,
											clientName,
										};
									}
								}
							);
						}
					);

					adjustedServicesItems = loyalties.map(
						({ servicesId, discount }) => {
							return servicesItems.map((y) => {
								return y.map(
									({ serviceId, cutName, cutPrice }) => {
										if (servicesId === serviceId) {
											return {
												serviceId,
												cutName,
												cutPrice: (
													cutPrice *
													(discount / 100)
												).toString(),
											};
										} else {
											return {
												serviceId,
												cutName,
												cutPrice,
											};
										}
									}
								);
							});
						}
					);
				} else {
					adjustedServicesReady = servicesReady.map(
						({
							id,
							isDone,
							scheduleScheduleDate,
							clientId,
							clientName,
						}) => {
							return {
								id,
								discount: 0,
								isDone,
								scheduleScheduleDate,
								clientId,
								clientName,
							};
						}
					);

					adjustedServicesItems = servicesItems.map((x) => {
						return x.map(({ serviceId, cutName, cutPrice }) => {
							return {
								serviceId,
								cutName,
								cutPrice,
							};
						});
					});
				}

				if (loyalties.length !== 0) {
					result = [
						adjustedServicesReady.flat(),
						adjustedServicesItems.flat(),
						timeSlots,
					];
				} else {
					result = [
						adjustedServicesReady.flat(),
						adjustedServicesItems,
						timeSlots,
					];
				}
			}

			return res.json(result);
		} catch (error) {
			next(error);
		}
	},
	async update(req, res, next) {
		try {
			const { id } = req.params;

			const [{ isDone }] = await subject().where({ id }).select("isDone");

			await subject().where({ id }).update("isDone", !isDone);
			return res.status(201).send();
		} catch (error) {
			next(error);
		}
	},
};
