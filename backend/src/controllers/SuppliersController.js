const db = require("../database");
const subject = () => db("suppliers");

module.exports = {
	async index(req, res, next) {
		try {
			const {
				recover = false,
				cnpj = false,
				name = false,
				cellphone = false,
				email = false,
				cep = false,
				addressNumber = false,
				addressComplement = false,
			} = req.query;

			const { id = false } = req.params;

			const query = subject().limit(5).where("recover", recover);

			if (id) {
				query.andWhere({ id }).select("*").first();
			} else {
				if (cnpj) {
					query.andWhere("cnpj", "like", `%${cnpj}%`);
				}
				if (name) {
					query.andWhere("name", "like", `%${name}%`);
				}
				if (cellphone) {
					query.andWhere("cellphone", "like", `%${cellphone}%`);
				}
				if (email) {
					query.andWhere("email", "like", `%${email}%`);
				}
				if (cep) {
					query.andWhere("cep", "like", `%${cep}%`);
				}
				if (addressNumber) {
					query.andWhere(
						"addressNumber",
						"like",
						`%${addressNumber}%`
					);
				}
				if (addressComplement) {
					query.andWhere(
						"addressComplement",
						"like",
						`%${addressComplement}%`
					);
				}
				query.select("id", "recover", "cnpj", "name", "cellphone");
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
			const {
				cnpj,
				name,
				cellphone,
				email,
				cep,
				addressNumber,
				addressComplement,
			} = req.body;
			await subject().insert({
				cnpj,
				name,
				cellphone,
				email,
				cep,
				addressNumber,
				addressComplement,
			});
			return res.status(201).send();
		} catch (error) {
			next(error);
		}
	},
	async update(req, res, next) {
		try {
			const {
				cnpj,
				name,
				cellphone,
				email,
				cep,
				addressNumber,
				addressComplement,
			} = req.body;
			const { id } = req.params;
			await subject()
				.update({
					cnpj,
					name,
					cellphone,
					email,
					cep,
					addressNumber,
					addressComplement,
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
