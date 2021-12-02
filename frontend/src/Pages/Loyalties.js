import { useEffect, useState } from "react";
import { FaArrowLeft, FaPencilAlt, FaRedo, FaTrash } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
	handleDelete,
	handleRecover,
	handleRegister,
	handleSave,
} from "../Infrastructure/Api";
import { Loading } from "../Infrastructure/Loading";
import { Request } from "../Infrastructure/Requests";

export const Loyalties = () => {
	const RenderRow = (
		id,
		recover,
		name,
		startDate,
		endDate,
		discount,
		repetitions
	) => {
		const FlippingRecover = (handleFunction) => (message) => () => {
			handleFunction(message, `/fidelizacoes/${id}`).then((bool) => {
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
					{startDate && endDate && (
						<div className="text-sm text-gray-300">{`${new Date(
							startDate
						).toLocaleDateString("pt-BR")} - ${new Date(
							endDate
						).toLocaleDateString("pt-BR")}`}</div>
					)}
					{discount && (
						<div className="text-sm text-gray-300">
							{`${discount}% de desconto`}
						</div>
					)}
					{repetitions && (
						<div className="text-sm text-gray-300">
							{`Após ${repetitions} repetições`}
						</div>
					)}
				</div>
				<div className="flex w-full gap-x-3">
					{!recover && (
						<>
							<Link to={`/fidelizacoes/${id}`}>
								<div className="button hover:bg-blue-500">
									<FaPencilAlt className="w-5 h-5" />
								</div>
							</Link>
							<button
								onClick={FlippingRecover(handleDelete)(
									"Você tem certeza que deseja deletar essa fidelização?"
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
								"Você tem certeza que deseja restaurar essa fidelização?"
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
			query = `/fidelizacoes?recover=${recover}&${option}=${search}`;
		} else {
			query = `/fidelizacoes?recover=${recover}`;
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
								<option value="discount">Desconto</option>
								<option value="repetitions">Repetições</option>
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

							<Link to="/fidelizacoes/cadastrar">
								<div className="px-3 py-2 bg-red-500 rounded-md">
									Cadastrar Fidelização
								</div>
							</Link>
						</div>
					</div>
					<div className="mt-6 overflow-hidden bg-darkGray rounded-xl">
						<div className="flex items-center px-6 py-3 font-semibold border-b border-darkGray">
							<div className="w-3/5">Fidelizações</div>
							<div className="w-full">Ações</div>
						</div>
						{payload.data &&
							payload.data.map(
								({
									id,
									recover,
									name,
									startDate,
									endDate,
									discount,
									repetitions,
								}) =>
									RenderRow(
										id,
										recover,
										name,
										startDate,
										endDate,
										discount,
										repetitions
									)
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

export const Loyalty = () => {
	const navigate = useNavigate();
	const [payload, setPayload] = useState({
		loading: false,
		error: false,
		data: null,
	});

	const { id = false } = useParams();

	useEffect(() => {
		if (id !== false) {
			Request(setPayload)(`/fidelizacoes/${id}`);
		}
	}, [id]);

	const Saving = (e) => {
		e.preventDefault();

		const payload = {
			name: document.getElementById("name").value,
			startDate: document.getElementById("startDate").value,
			endDate: document.getElementById("endDate").value,
			discount: document.getElementById("discount").value,
			repetitions: document.getElementById("repetitions").value,
		};

		if (payload.endDate > payload.startDate) {
			if (id === false) {
				handleRegister(
					"Você tem certeza que deseja cadastrar essa fidelização?",
					"/fidelizacoes",
					payload
				).then((bool) => {
					if (bool) {
						navigate("/fidelizacoes");
					}
				});
			} else {
				handleSave(
					"Você tem certeza que deseja alterar esse cadastro da fidelização?",
					`/fidelizacoes/${id}`,
					payload
				).then((bool) => {
					if (bool) {
						navigate("/fidelizacoes");
					}
				});
			}
		} else {
			alert(
				"A data final não pode ser superior à data inicial, tente novamente."
			);
		}
	};

	return (
		<div>
			{(id === false || (id !== false && payload.data)) && (
				<form onSubmit={Saving}>
					<div className="max-w-4xl mx-auto mt-12 text-gray-50">
						<div className="flex items-center pb-4 gap-x-3">
							<Link
								to="/fidelizacoes"
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
											title="Insira o nome da fidelização"
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
									<div>Início</div>
								</div>
								<div className="w-full px-6 py-5 bg-gray-700">
									<div className="flex gap-x-3">
										<input
											className="bg-gray-700 focus:outline-none"
											id="startDate"
											type="date"
											title="Insira a data inicial da fidelização"
											size="40"
											defaultValue={
												payload.data !== null
													? new Date(
															payload.data.startDate
													  )
															.toISOString()
															.split("T")[0]
													: ""
											}
											required
										/>
									</div>
								</div>
							</div>
							<div className="flex items-center border-b border-darkGray">
								<div className="w-1/5 px-6 py-5">
									<div>Final</div>
								</div>
								<div className="w-full px-6 py-5 bg-gray-700">
									<div className="flex gap-x-3">
										<input
											className="bg-gray-700 focus:outline-none"
											id="endDate"
											type="date"
											title="Insira a data final da fidelização"
											size="40"
											defaultValue={
												payload.data !== null
													? new Date(
															payload.data.endDate
													  )
															.toISOString()
															.split("T")[0]
													: ""
											}
											required
										/>
									</div>
								</div>
							</div>
							<div className="flex items-center border-b border-darkGray">
								<div className="w-1/5 px-6 py-5">
									<div>Desconto</div>
								</div>
								<div className="w-full px-6 py-5 bg-gray-700">
									<div className="flex gap-x-3">
										<input
											className="bg-gray-700 focus:outline-none"
											id="discount"
											type="number"
											min="1"
											max="100"
											title="Insira o desconto da fidelização"
											size="40"
											defaultValue={
												payload.data !== null
													? payload.data.discount
													: ""
											}
											required
										/>
									</div>
								</div>
							</div>
							<div className="flex items-center border-b border-darkGray">
								<div className="w-1/5 px-6 py-5">
									<div>Repetições</div>
								</div>
								<div className="w-full px-6 py-5 bg-gray-700">
									<div className="flex gap-x-3">
										<input
											className="bg-gray-700 focus:outline-none"
											id="repetitions"
											type="number"
											min="1"
											title="Insira o número de repetições da fidelização"
											size="40"
											defaultValue={
												payload.data !== null
													? payload.data.repetitions
													: ""
											}
											pattern="[0-9]+"
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
