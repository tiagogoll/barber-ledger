const db = require("../database");
const subject = () => db("clients");

module.exports = {
	async index(req, res, next) {
		try {
			const {
				recover = false,
				name = false,
				cellphone = false,
				cpf = false,
				email = false,
				address = false,
			} = req.query;

			const { id = false } = req.params;

			const query = subject().limit(5).where("recover", recover);

			if (id) {
				query.andWhere({ id }).select("*").first();
			} else {
				if (name) {
					query.andWhere("name", "like", `%${name}%`);
				}
				if (cellphone) {
					query.andWhere("cellphone", "like", `%${cellphone}%`);
				}
				if (cpf) {
					query.andWhere("cpf", "like", `%${cpf}%`);
				}
				if (email) {
					query.andWhere("email", "like", `%${email}%`);
				}
				if (address) {
					query.andWhere("address", "like", `%${address}%`);
				}
				query.select("id", "recover", "name", "cellphone");
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
			const { name, cellphone, cpf, email, address } = req.body;
			await subject().insert({
				name,
				cellphone,
				cpf,
				email,
				address,
			});
			return res.status(201).send();
		} catch (error) {
			next(error);
		}
	},
	async update(req, res, next) {
		try {
			const { name, cellphone, cpf, email, address } = req.body;
			const { id } = req.params;
			await subject()
				.update({
					name,
					cellphone,
					cpf,
					email,
					address,
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
