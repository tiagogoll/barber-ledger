const db = require("../database");
const subject = () => db("products");

module.exports = {
	async index(req, res, next) {
		try {
			const { recover = false, name = false } = req.query;

			const { id = false } = req.params;

			const query = subject().limit(5).where("recover", recover);

			if (id) {
				query.andWhere({ id }).select("*").first();
			} else {
				if (name) {
					query.andWhere("name", "like", `%${name}%`);
				}
				query.select("id", "recover", "name");
			}

			const result = await query;
			res.header("X-Filtered-Count", result.length);

			const [totalNumber] = await subject()
				.where("recover", recover)
				.count();
			res.header("X-Total-Count", totalNumber["count"]);

			return res.json(result);
		} catch (error) {
			next(error);
		}
	},
	async create(req, res, next) {
		try {
			const { name, description } = req.body;
			await subject().insert({
				name,
				description,
			});
			return res.status(201).send();
		} catch (error) {
			next(error);
		}
	},
	async update(req, res, next) {
		try {
			const { name, description } = req.body;
			const { id } = req.params;
			await subject()
				.update({
					name,
					description,
				})
				.where({ id });
			return res.status(201).send();
		} catch (error) {
			next(error);
		}
	},
	async delete(req, res, next) {
		try {
			const { id } = req.params;

			const [{ recover }] = await subject()
				.where({ id })
				.select("recover");

			await subject().where({ id }).update("recover", !recover);
			return res.status(201).send();
		} catch (error) {
			next(error);
		}
	},
};
