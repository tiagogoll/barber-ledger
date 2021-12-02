import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./Header";
import { Client, Clients } from "./Pages/Clients";
import { Consumption, Consumptions } from "./Pages/Consumptions";
import { Cut, Cuts } from "./Pages/Cuts";
import { Loyalties, Loyalty } from "./Pages/Loyalties";
import { Product, Products } from "./Pages/Products";
import { Sale, Sales } from "./Pages/Sales";
import { Schedule, Schedules } from "./Pages/Schedules";
import { Services } from "./Pages/Services";
import { Good, Stock } from "./Pages/Stock";
import { Supplier, Suppliers } from "./Pages/Suppliers";

export const Routing = () => {
	return (
		<div className="min-h-screen bg-mediumGray">
			<BrowserRouter>
				<Header />
				<Routes>
					<Route path="/" />
					<Route path="/clientes" element={<Clients />} />
					<Route path="/clientes/:id" element={<Client />} />
					<Route path="/clientes/cadastrar" element={<Client />} />
					<Route path="/fornecedores" element={<Suppliers />} />
					<Route path="/fornecedores/:id" element={<Supplier />} />
					<Route
						path="/fornecedores/cadastrar"
						element={<Supplier />}
					/>
					<Route path="/fidelizacoes" element={<Loyalties />} />
					<Route path="/fidelizacoes/:id" element={<Loyalty />} />
					<Route
						path="/fidelizacoes/cadastrar"
						element={<Loyalty />}
					/>
					<Route path="/cortes" element={<Cuts />} />
					<Route path="/cortes/:id" element={<Cut />} />
					<Route path="/cortes/cadastrar" element={<Cut />} />
					<Route path="/produtos" element={<Products />} />
					<Route path="/produtos/:id" element={<Product />} />
					<Route path="/produtos/cadastrar" element={<Product />} />
					<Route path="/estoque" element={<Stock />} />
					<Route path="/estoque/cadastrar" element={<Good />} />
					<Route path="/vendas" element={<Sales />} />
					<Route path="/vendas/cadastrar" element={<Sale />} />
					<Route path="/consumos" element={<Consumptions />} />
					<Route
						path="/consumos/cadastrar"
						element={<Consumption />}
					/>
					<Route path="/agendamentos" element={<Schedules />} />
					<Route
						path="/agendamentos/cadastrar"
						element={<Schedule />}
					/>
					<Route path="/servicos" element={<Services />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
};
