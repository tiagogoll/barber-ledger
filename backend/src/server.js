const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use((req, res, next) => {
	const error = new Error("Não Encontrado");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);

	if (error.code === "23502") {
		res.json({
			error: "Campos obrigatórios não preenchidos, tente novamente.",
		});
	}
	if (error.table === "clients") {
		if (error.code === "23505") {
			res.json({
				error: "Registro com campo duplicado, tente novamente.",
			});
		}
	}
	if (error.table === "products") {
		if (error.code === "23503") {
			res.json({
				error: "Fornecedor não cadastrado, tente novamente.",
			});
		}
	}
	if (error.table === "supppliers") {
		if (error.code === "23505") {
			res.json({
				error: "Nome do fornecedor duplicado, tente novamente.",
			});
		}
	}

	res.json({ error: error.message });
});

app.listen(3333);
