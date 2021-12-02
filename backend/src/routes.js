const routes = require("express").Router();

const ClientsController = require("./controllers/ClientsController");
const SuppliersController = require("./controllers/SuppliersController");
const ProductsController = require("./controllers/ProductsController");
const LoyaltiesController = require("./controllers/LoyaltiesController");
const SchedulesController = require("./controllers/SchedulesController");
const CutsController = require("./controllers/CutsController");
const ServicesController = require("./controllers/ServicesController");
const StockController = require("./controllers/StockController");
const SalesController = require("./controllers/SalesController");
const ConsumptionsController = require("./controllers/ConsumptionsController");

routes
	.get("/clientes", ClientsController.index)
	.get("/clientes/:id", ClientsController.index)
	.post("/clientes", ClientsController.create)
	.put("/clientes/:id", ClientsController.update)
	.delete("/clientes/:id", ClientsController.delete);

routes
	.get("/fornecedores", SuppliersController.index)
	.get("/fornecedores/:id", SuppliersController.index)
	.post("/fornecedores", SuppliersController.create)
	.put("/fornecedores/:id", SuppliersController.update)
	.delete("/fornecedores/:id", SuppliersController.delete);

routes
	.get("/produtos", ProductsController.index)
	.get("/produtos/:id", ProductsController.index)
	.post("/produtos", ProductsController.create)
	.put("/produtos/:id", ProductsController.update)
	.delete("/produtos/:id", ProductsController.delete);

routes
	.get("/cortes", CutsController.index)
	.get("/cortes/:id", CutsController.index)
	.post("/cortes", CutsController.create)
	.put("/cortes/:id", CutsController.update)
	.delete("/cortes/:id", CutsController.delete);

routes
	.get("/fidelizacoes", LoyaltiesController.index)
	.get("/fidelizacoes/:id", LoyaltiesController.index)
	.post("/fidelizacoes", LoyaltiesController.create)
	.put("/fidelizacoes/:id", LoyaltiesController.update)
	.delete("/fidelizacoes/:id", LoyaltiesController.delete);

routes
	.get("/agendamentos", SchedulesController.index)
	.get("/agendamentos/:id", SchedulesController.index)
	.post("/agendamentos", SchedulesController.create)
	.put("/agendamentos/:id", SchedulesController.update)
	.delete("/agendamentos/:id", SchedulesController.delete);

routes
	.get("/servicos", ServicesController.index)
	.get("/servicos/:id", ServicesController.index)
	.put("/servicos/:id", ServicesController.update);

routes
	.get("/estoque", StockController.index)
	.get("/estoque/:id", StockController.index)
	.post("/estoque", StockController.create)
	.put("/estoque/:id", StockController.update)
	.delete("/estoque/:id", StockController.delete);

routes
	.get("/vendas", SalesController.index)
	.get("/vendas/:id", SalesController.index)
	.post("/vendas", SalesController.create)
	.put("/vendas/:id", SalesController.update)
	.delete("/vendas/:id", SalesController.delete);

routes
	.get("/consumos", ConsumptionsController.index)
	.get("/consumos/:id", ConsumptionsController.index)
	.post("/consumos", ConsumptionsController.create)
	.put("/consumos/:id", ConsumptionsController.update)
	.delete("/consumos/:id", ConsumptionsController.delete);

routes.get("/consumosEVendas/:id", StockController.indexSalesAndConsumptions);
routes.get("/temposDisponiveis", SchedulesController.indexAvailableTimeSlots);

module.exports = routes;
