import { useState } from "react";
import { Link } from "react-router-dom";

const RenderTab = (currentTab, setTab, index, route, title) => {
	return (
		<Link to={route} className="relative" key={index}>
			{currentTab === index ? (
				<>
					<div className="absolute top-0 w-full border-t-2 border-gray-50" />
					<div className="px-5 py-3 bg-mediumGray">{title}</div>
				</>
			) : (
				<div
					className="px-5 py-3 bg-darkGray hover:bg-mediumGray"
					onClick={() => setTab(index)}
				>
					{title}
				</div>
			)}
		</Link>
	);
};

export const Header = () => {
	const [tab, setTab] = useState(null);
	const tabs = [
		[1, "/clientes", "Clientes"],
		[2, "/fornecedores", "Fornecedores"],
		[3, "/fidelizacoes", "Fidelizações"],
		[4, "/cortes", "Cortes"],
		[5, "/produtos", "Produtos"],
		[6, "/estoque", "Estoque"],
		[7, "/vendas", "Vendas"],
		[8, "/consumos", "Consumos"],
		[9, "/agendamentos", "Agendamentos"],
		[10, "/servicos", "Serviços"],
	];

	return (
		<nav className="flex bg-darkGray text-gray-50 gap-x-32">
			<Link to="/" className="p-3" onClick={() => setTab(0)}>
				Barber Ledger
			</Link>
			<div className="flex">
				{tabs.map(([index, route, title]) =>
					RenderTab(tab, setTab, index, route, title)
				)}
			</div>
		</nav>
	);
};
