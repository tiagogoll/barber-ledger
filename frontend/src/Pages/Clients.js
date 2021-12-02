import { useEffect, useState } from "react";
import {
	FaArrowLeft,
	FaCalendarAlt,
	FaPencilAlt,
	FaRedo,
	FaTrash,
	FaWhatsapp,
} from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
	handleDelete,
	handleRecover,
	handleRegister,
	handleSave,
} from "../Infrastructure/Api";
import { Loading } from "../Infrastructure/Loading";
import { NormalizeCellphone } from "../Infrastructure/Normalizers";
import { Request } from "../Infrastructure/Requests";

export const Clients = () => {
	const RenderRow = (id, recover, name, cellphone) => {
		const FlippingRecover = (handleFunction) => (message) => () => {
			handleFunction(message, `/clientes/${id}`).then((bool) => {
				if (bool) {
					reload();
				}
			});
		};

		return (
			<div
				key={id}
				className="flex items-center px-6 py-5 font-medium bg-gray-700 border-b border-darkGray"
			>
				<div className="w-3/5">
					<div>{name}</div>
					{cellphone && (
						<div className="text-sm text-gray-300">
							{NormalizeCellphone(cellphone)}
						</div>
					)}
				</div>
				<div className="flex w-full gap-x-3">
					{!recover && (
						<>
							{cellphone && (
								<a
									href={`https://wa.me/${cellphone}`}
									target="_blank"
									rel="noreferrer"
								>
									<div className="button hover:bg-whatsappGreen hover:text-darkGray">
										<FaWhatsapp className="w-5 h-5" />
									</div>
								</a>
							)}
							<Link to={`/clientes/${id}`}>
								<div className="button hover:bg-blue-500">
									<FaPencilAlt className="w-5 h-5" />
								</div>
							</Link>
							<button
								onClick={FlippingRecover(handleDelete)(
									"Você tem certeza que deseja deletar esse cliente?"
								)}
							>
								<div className="button hover:bg-red-500">
									<FaTrash className="w-5 h-5" />
								</div>
							</button>
						</>
					)}
					{recover && (
						<button
							onClick={FlippingRecover(handleRecover)(
								"Você tem certeza que deseja restaurar esse cliente?"
							)}
						>
							<div className="button hover:bg-red-500">
								<FaRedo className="w-5 h-5" />
							</div>
						</button>
					)}
				</div>
			</div>
		);
	};

	const [payload, setPayload] = useState({
		loading: false,
		error: false,
		data: null,
	});

	const reload = (e) => {
		if (e !== undefined) {
			e.preventDefault();
		}

		const option = document.getElementById("option").value;
		const recover = document.getElementById("recover").value;
		const search = document.getElementById("search").value;

		let query = "";

		if (search !== "") {
			query = `/clientes?recover=${recover}&${option}=${search}`;
		} else {
			query = `/clientes?recover=${recover}`;
		}

		Request(setPayload)(query);
	};

	return (
		<div>
			<form onSubmit={reload}>
				<div className="max-w-4xl mx-auto mt-12 text-gray-50">
					<div className="flex items-baseline gap-x-3">
						<div className="flex items-baseline gap-x-3">
							<h1>Procurar: </h1>
							<input
								id="search"
								type="text"
								size="12"
								className="px-3 py-2 rounded-md bg-darkGray focus:outline-none"
							/>
						</div>
						<div className="flex items-baseline gap-x-3">
							<select
								id="option"
								className="px-3 py-2.5 rounded-md bg-darkGray focus:outline-none"
								defaultValue="name"
							>
								<option value="name">Nome</option>
								<option value="cellphone">WhatsApp</option>
								<option value="cpf">CPF</option>
								<option value="email">Email</option>
								<option value="address">Endereço</option>
							</select>
							<select
								id="recover"
								className="px-3 py-2.5 rounded-md bg-darkGray focus:outline-none"
								defaultValue={false}
							>
								<option value={false}>Ativos</option>
								<option value={true}>Deletados</option>
							</select>
						</div>
						<div className="flex items-baseline gap-x-3">
							<button
								type="submit"
								className="px-3 py-2 bg-blue-500 rounded-md"
							>
								Filtrar
							</button>

							<Link to="/clientes/cadastrar">
								<div className="px-3 py-2 bg-red-500 rounded-md">
									Cadastrar Cliente
								</div>
							</Link>
						</div>
					</div>
					<div className="mt-6 overflow-hidden bg-darkGray rounded-xl">
						<div className="flex items-center px-6 py-3 font-semibold border-b border-darkGray">
							<div className="w-3/5">Clientes</div>
							<div className="w-full">Ações</div>
						</div>
						{payload.data &&
							payload.data.map(
								({ id, recover, name, cellphone }) =>
									RenderRow(id, recover, name, cellphone)
							)}
					</div>
					{payload.loading && <Loading />}
					{payload.error && (
						<div className="flex justify-center p-6">
							<h1>
								Falha na conexão recarregue a página para tentar
								novamente
							</h1>
						</div>
					)}
				</div>
			</form>
		</div>
	);
};

export const Client = () => {
	const navigate = useNavigate();
	const [payload, setPayload] = useState({
		loading: false,
		error: false,
		data: null,
	});

	const { id = false } = useParams();

	useEffect(() => {
		if (id !== false) {
			Request(setPayload)(`/clientes/${id}`);
		}
	}, [id]);

	const Saving = (e) => {
		e.preventDefault();

		const payload = {
			name: document.getElementById("name").value,
			cellphone: document.getElementById("cellphone").value,
			cpf: document.getElementById("cpf").value,
			email: document.getElementById("email").value,
			address: document.getElementById("address").value,
		};

		if (id === false) {
			handleRegister(
				"Você tem certeza que deseja cadastrar esse cliente?",
				"/clientes",
				payload
			).then((bool) => {
				if (bool) {
					navigate("/clientes");
				}
			});
		} else {
			handleSave(
				"Você tem certeza que deseja alterar esse cadastro do cliente?",
				`/clientes/${id}`,
				payload
			).then((bool) => {
				if (bool) {
					navigate("/clientes");
				}
			});
		}
	};

	return (
		<div>
			{(id === false || (id !== false && payload.data)) && (
				<form onSubmit={Saving}>
					<div className="max-w-4xl mx-auto mt-12 text-gray-50">
						<div className="flex items-center pb-4 gap-x-3">
							<Link
								to="/clientes"
								className="p-3 bg-blue-500 rounded-md"
							>
								<FaArrowLeft className="text-gray-50" />
							</Link>
							<button
								className="px-3 py-2 bg-red-500 rounded-md"
								type="submit"
							>
								{id === false
									? "Salvar Cadastro"
									: "Salvar Alterações"}
							</button>
						</div>
						<div className="bg-blue-500 roundTable">
							<div className="flex items-center border-b border-darkGray">
								<div className="w-1/5 px-6 py-5">
									<div>Nome</div>
								</div>
								<div className="w-full px-6 py-5 bg-gray-700">
									<div className="flex gap-x-3">
										<input
											className="bg-gray-700 focus:outline-none"
											id="name"
											type="text"
											title="Insira o nome do cliente"
											size="40"
											defaultValue={
												payload.data !== null
													? payload.data.name
													: ""
											}
											pattern="[A-Za-z\s]+"
											required
										/>
									</div>
								</div>
							</div>
							<div className="flex items-center border-b border-darkGray">
								<div className="w-1/5 px-6 py-5">
									<div>Whatsapp</div>
								</div>
								<div className="w-full px-6 py-5 bg-gray-700">
									<div className="flex gap-x-3">
										<input
											className="bg-gray-700 focus:outline-none"
											id="cellphone"
											type="tel"
											title="Insira o whatsApp do cliente contendo 11 dígitos (XX) XXXXX-XXXX"
											size="40"
											defaultValue={
												payload.data !== null
													? payload.data.cellphone
													: ""
											}
											pattern="[0-9]{11}"
											minLength="11"
											maxLength="11"
											required
										/>
									</div>
								</div>
							</div>
							<div className="flex items-center border-b border-darkGray">
								<div className="w-1/5 px-6 py-5">
									<div>CPF</div>
								</div>
								<div className="w-full px-6 py-5 bg-gray-700">
									<div className="flex gap-x-3">
										<input
											className="bg-gray-700 focus:outline-none"
											id="cpf"
											type="tel"
											title="Insira o cpf do cliente contendo 11 dígitos XXX.XXX.XXX-XX"
											size="40"
											defaultValue={
												payload.data !== null
													? payload.data.cpf
													: ""
											}
											pattern="[0-9]{11}"
											minLength="11"
											maxLength="11"
										/>
									</div>
								</div>
							</div>
							<div className="flex items-center border-b border-darkGray">
								<div className="w-1/5 px-6 py-5">
									<div>Email</div>
								</div>
								<div className="w-full px-6 py-5 bg-gray-700">
									<div className="flex gap-x-3">
										<input
											className="bg-gray-700 focus:outline-none"
											id="email"
											type="email"
											title="Insira o email do cliente"
											size="40"
											defaultValue={
												payload.data !== null
													? payload.data.email
													: ""
											}
										/>
									</div>
								</div>
							</div>
							<div className="flex items-center border-b border-darkGray">
								<div className="w-1/5 px-6 py-5">
									<div>Endereço</div>
								</div>
								<div className="w-full px-6 py-5 bg-gray-700">
									<div className="flex gap-x-3">
										<input
											className="bg-gray-700 focus:outline-none"
											id="address"
											type="text"
											title="Insira o endereço do cliente"
											size="40"
											defaultValue={
												payload.data !== null
													? payload.data.address
													: ""
											}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			)}
			{payload.loading && <Loading />}
			{payload.error && (
				<div>
					<h1>
						Falha na conexão recarregue a página para tentar
						novamente
					</h1>
				</div>
			)}
		</div>
	);
};
