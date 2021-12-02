import { useEffect, useState } from "react";
import { FaArrowLeft, FaTimesCircle, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { handleDelete, handleRegister } from "../Infrastructure/Api";
import { Loading } from "../Infrastructure/Loading";
import { Request } from "../Infrastructure/Requests";
import { mapTime } from "../Infrastructure/Times";

export const Schedules = () => {
	const RenderRow = (id, scheduleDate, clientName) => {
		const FlippingRecover = (handleFunction) => (message) => () => {
			handleFunction(message, `/agendamentos/${id}`).then((bool) => {
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
					<div>{clientName}</div>
					{scheduleDate && (
						<div className="text-sm text-gray-300">{`${new Date(
							scheduleDate
						).toLocaleDateString("pt-BR")}`}</div>
					)}
					{payload.data[1].map((x) => {
						const filtered = x.filter((y) => y.scheduleId === id);
						if (filtered.length !== 0) {
							return (
								<div className="text-sm text-gray-300">
									{filtered.map((x) => (
										<div key={x.cutName}>{`${
											x.cutName
										} - ${Intl.NumberFormat("pt-BR", {
											style: "currency",
											currency: "BRL",
										}).format(x.cutPrice)}`}</div>
									))}
								</div>
							);
						}
					})}
					{payload.data[2].map((x) => {
						const filtered = x.filter(
							(y) => y.timeSlotScheduleId === id
						);
						if (filtered.length !== 0) {
							const sorted = filtered
								.map(
									({ timeSlotSlot }) => mapTime[timeSlotSlot]
								)
								.sort();
							return (
								<div className="text-sm text-gray-300">
									{sorted.map((x) => {
										return <div>{x}</div>;
									})}
								</div>
							);
						}
					})}
				</div>
				<div className="flex w-full gap-x-3">
					<button
						onClick={FlippingRecover(handleDelete)(
							"Você tem certeza que deseja deletar esse agendamento?"
						)}
					>
						<div className="button hover:bg-red-500">
							<FaTrash className="w-5 h-5" />
						</div>
					</button>
				</div>
			</div>
		);
	};

	const [option, setOption] = useState(0);

	const optionSwitch = () => {
		const option = document.getElementById("option").value;
		if (option === "clientId") {
			setOption(0);
		}
		if (option === "scheduleDate") {
			setOption(1);
		}
		if (option === "cutId") {
			setOption(2);
		}
	};

	const [payload, setPayload] = useState({
		loading: false,
		error: false,
		data: null,
	});

	const [clientPayload, setClientPayload] = useState({
		loading: false,
		error: false,
		data: null,
	});

	const [cutPayload, setCutPayload] = useState({
		loading: false,
		error: false,
		data: null,
	});

	const clientSearch = (e) => {
		if (e !== undefined) {
			e.preventDefault();
		}

		const search = document.getElementById("searchClient").value;

		let query = "";

		if (search !== "") {
			query = `/clientes?recover=false&name=${search}`;
		} else {
			query = `/clientes?recover=false`;
		}

		Request(setClientPayload)(query);
	};

	const cutSearch = (e) => {
		if (e !== undefined) {
			e.preventDefault();
		}

		const search = document.getElementById("searchCut").value;

		let query = "";

		if (search !== "") {
			query = `/cortes?recover=false&name=${search}`;
		} else {
			query = `/cortes?recover=false`;
		}

		Request(setCutPayload)(query);
	};

	const reload = (e) => {
		if (e !== undefined) {
			e.preventDefault();
		}

		let query = "";
		let search = "";

		if (option === 0 && clientPayload.data !== null) {
			search = document.getElementById("client").value;
		}
		if (option === 1) {
			search = document.getElementById("searchDate").value;
		}
		if (option === 2 && cutPayload.data !== null) {
			search = document.getElementById("cut").value;
		}

		if (search !== "") {
			if (option === 0) {
				query = `/agendamentos?clientId=${search}`;
			}
			if (option === 1) {
				query = `/agendamentos?scheduleDate=${search}`;
			}
			if (option === 2) {
				query = `/agendamentos?cutId=${search}`;
			}
		} else {
			query = "/agendamentos";
		}

		Request(setPayload)(query);
	};

	return (
		<div>
			<form onSubmit={reload}>
				<div className="max-w-4xl mx-auto mt-12 text-gray-50">
					<div className="flex items-baseline gap-x-3">
						<div className="">
							<div className="flex items-baseline mb-3 gap-x-3">
								<h1>Procurar: </h1>
								{option === 0 && (
									<input
										id="searchClient"
										type="text"
										size="12"
										className="px-3 py-2 rounded-md bg-darkGray focus:outline-none"
										onChange={clientSearch}
									/>
								)}
								{option === 1 && (
									<input
										id="searchDate"
										type="date"
										className="px-3 py-2 rounded-md bg-darkGray focus:outline-none"
									/>
								)}
								{option === 2 && (
									<input
										id="searchCut"
										type="text"
										size="12"
										className="px-3 py-2 rounded-md bg-darkGray focus:outline-none"
										onChange={cutSearch}
									/>
								)}
							</div>
							{clientPayload.data &&
								clientPayload.data.length !== 0 && (
									<select
										id="client"
										className="px-3 py-3 text-xs rounded-md bg-darkGray focus:outline-none"
									>
										{clientPayload.data.map(
											({ id, name }) => (
												<option key={id} value={id}>
													{name}
												</option>
											)
										)}
									</select>
								)}
							{cutPayload.data && cutPayload.data.length !== 0 && (
								<select
									id="cut"
									className="px-3 py-3 text-xs rounded-md bg-darkGray focus:outline-none"
								>
									{cutPayload.data.map(
										({ id, name, price }) => (
											<option key={id} value={id}>
												{`${name} - ${Intl.NumberFormat(
													"pt-BR",
													{
														style: "currency",
														currency: "BRL",
													}
												).format(price)}
													`}
											</option>
										)
									)}
								</select>
							)}
						</div>
						<div className="flex items-baseline gap-x-3">
							<select
								id="option"
								className="px-3 py-2.5 rounded-md bg-darkGray focus:outline-none"
								defaultValue="clientId"
								onChange={() => {
									setCutPayload({
										loading: false,
										error: false,
										data: null,
									});
									setClientPayload({
										loading: false,
										error: false,
										data: null,
									});
									optionSwitch();
								}}
							>
								<option value="clientId">Cliente</option>
								<option value="scheduleDate">
									Data do Agendamento
								</option>
								<option value="cutId">Corte</option>
							</select>
						</div>
						<div className="flex items-baseline gap-x-3">
							<button
								type="submit"
								className="px-3 py-2 bg-blue-500 rounded-md"
							>
								Filtrar
							</button>

							<Link to="/agendamentos/cadastrar">
								<div className="px-3 py-2 bg-red-500 rounded-md">
									Cadastrar Agendamento
								</div>
							</Link>
						</div>
					</div>
					<div className="mt-6 overflow-hidden bg-darkGray rounded-xl">
						<div className="flex items-center px-6 py-3 font-semibold border-b border-darkGray">
							<div className="w-3/5">Agendamentos</div>
							<div className="w-full">Ações</div>
						</div>
						{payload.data &&
							payload.data[0].map(
								({ id, scheduleDate, clientName }) =>
									RenderRow(id, scheduleDate, clientName)
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

export const Schedule = () => {
	const navigate = useNavigate();

	const [clientPayload, setClientPayload] = useState({
		loading: false,
		error: false,
		data: null,
	});

	const [cutPayload, setCutPayload] = useState({
		loading: false,
		error: false,
		data: null,
	});

	const [availableTimes, setAvailableTimes] = useState({
		loading: false,
		error: false,
		data: null,
	});

	const [addCuts, setAddCuts] = useState([]);
	const [addTimeSlots, setAddTimeSlots] = useState([]);

	useEffect(() => {
		clientSearch();
		timeSlotsSearch();
	}, []);

	const clientSearch = () => {
		const search = document.getElementById("searchClient").value;

		let query = "";

		if (search !== "") {
			query = `/clientes?recover=false&name=${search}`;
		} else {
			query = `/clientes?recover=false`;
		}

		Request(setClientPayload)(query);
	};

	const timeSlotsSearch = () => {
		const search = document.getElementById("scheduleDate").value;

		let query = "";

		if (search !== "") {
			query = `/temposDisponiveis?scheduleDate=${search}`;
		} else {
			query = `/temposDisponiveis?scheduleDate=${
				new Date().toISOString().split("T")[0]
			}`;
		}

		Request(setAvailableTimes)(query);
	};

	const cutSearch = () => {
		const search = document.getElementById("searchCut").value;

		let query = "";

		if (search !== "") {
			query = `/cortes?recover=false&name=${search}`;
		} else {
			query = `/cortes?recover=false`;
		}

		Request(setCutPayload)(query);
	};

	const addTimeSlot = () => {
		const slot = parseInt(document.getElementById("timeSlot").value);

		if (!addTimeSlots.some((x) => x === slot)) {
			console.log([...addTimeSlots, slot]);
			setAddTimeSlots([...addTimeSlots, slot]);
		}
	};

	const removeTimeSlot = (s) => {
		setAddTimeSlots(addTimeSlots.filter((x) => x !== s));
	};

	const addCut = () => {
		const id = parseInt(document.getElementById("cut").value);
		const name = cutPayload.data.filter((x) => x.id === id)[0].name;

		if (!addCuts.some((x) => x.id === id)) {
			setAddCuts([...addCuts, { id: id, name: name }]);
		}
	};

	const removeCut = (id) => {
		setAddCuts(addCuts.filter((x) => x.id !== id));
	};

	const Saving = (e) => {
		e.preventDefault();

		const payload = {
			clientId: document.getElementById("client").value,
			scheduleDate: document.getElementById("scheduleDate").value,
		};

		if (payload.clientId === "") {
			alert('O campo "Cliente" deve ser preenchido, tente novamente.');
		}
		if (payload.scheduleDate === "") {
			alert(
				'O campo "Data do Agendamento" deve ser preenchido, tente novamente.'
			);
		}
		if (addCuts.length === 0) {
			alert(
				"O agendamento necessita de pelo menos um corte, tente novamente."
			);
		}
		if (addTimeSlots.length === 0) {
			alert(
				"O agendamento necessita de pelo menos um horário registrado, tente novamente."
			);
		}
		if (
			payload.clientId !== "" &&
			payload.scheduleDate !== "" &&
			addCuts.length !== 0 &&
			addTimeSlots.length !== 0
		) {
			const addCutsPayload = addCuts.map(({ id }) => {
				return id;
			});

			const { clientId, scheduleDate } = payload;

			const finalPayload = {
				clientId,
				scheduleDate,
				cuts: addCutsPayload,
				timeSlots: addTimeSlots,
			};

			handleRegister(
				"Você tem certeza que deseja cadastrar esse agendamento?",
				"/agendamentos",
				finalPayload
			).then((bool) => {
				if (bool) {
					navigate("/agendamentos");
				}
			});
		}
	};

	return (
		<form onSubmit={Saving}>
			<div className="max-w-4xl mx-auto mt-12 text-gray-50">
				<div className="flex items-center pb-4 gap-x-3">
					<Link
						to="/agendamentos"
						className="p-3 bg-blue-500 rounded-md"
					>
						<FaArrowLeft className="text-gray-50" />
					</Link>
					<button
						className="px-3 py-2 bg-red-500 rounded-md"
						type="submit"
					>
						Salvar Cadastro
					</button>
				</div>
				<div className="bg-blue-500 roundTable">
					<div className="flex items-center border-b border-darkGray">
						<div className="w-1/3 px-6 py-5">
							<div>Cliente</div>
						</div>
						<div className="w-full px-6 py-5 bg-gray-700">
							<div className="flex gap-x-3">
								<input
									className="px-3 py-2 rounded-md bg-darkGray focus:outline-none"
									id="searchClient"
									type="text"
									title="Insira o nome do cliente"
									size="12"
								/>
								<button
									type="button"
									className="px-3 py-2 bg-blue-500 rounded-md"
									onClick={() => clientSearch()}
								>
									Filtrar
								</button>
								{clientPayload.data && (
									<select
										id="client"
										className="px-3 py-3 text-xs rounded-md bg-darkGray focus:outline-none"
										required
									>
										{clientPayload.data.map(
											({ id, name }) => (
												<option key={id} value={id}>
													{name}
												</option>
											)
										)}
									</select>
								)}
							</div>
						</div>
					</div>
					<div className="flex items-center border-b border-darkGray">
						<div className="w-1/3 px-6 py-5">
							<div>Data do Agendamento</div>
						</div>
						<div className="w-full px-6 py-5 bg-gray-700">
							<div className="flex gap-x-3">
								<input
									className="bg-gray-700 focus:outline-none"
									id="scheduleDate"
									type="date"
									title="Insira data do agendamento"
									defaultValue={
										new Date().toISOString().split("T")[0]
									}
									onChange={() => timeSlotsSearch()}
								/>
							</div>
						</div>
					</div>
					{availableTimes.data && (
						<div className="flex items-center border-b border-darkGray">
							<div className="w-1/3 px-6 py-5">
								<div>Tempos</div>
							</div>
							<div className="w-full px-6 py-5 bg-gray-700">
								<div className="flex gap-x-3">
									<select
										id="timeSlot"
										className="px-3 py-3 text-xs rounded-md bg-darkGray focus:outline-none"
										required
									>
										{availableTimes.data.map((x) => (
											<option key={x} value={x}>
												{mapTime[x]}
											</option>
										))}
									</select>
									<button
										type="button"
										className="px-3 py-2 bg-blue-500 rounded-md"
										onClick={() => addTimeSlot()}
									>
										Adicionar
									</button>
								</div>
								{addTimeSlots.length !== 0 &&
									addTimeSlots.map((x) => (
										<div
											key={x}
											className="flex items-center px-2 py-1 mt-3 gap-x-3"
										>
											<button
												type="button"
												className="p-2 rounded-md bg-darkGray"
												onClick={() =>
													removeTimeSlot(x)
												}
											>
												<FaTimesCircle className="w-4 h-4" />
											</button>
											<div className="px-2 py-1 rounded-lg bg-darkGray">
												{mapTime[x]}
											</div>
										</div>
									))}
							</div>
						</div>
					)}
					<div className="flex items-center border-b border-darkGray">
						<div className="w-1/3 px-6 py-5">
							<div>Cortes</div>
						</div>
						<div className="w-full px-6 py-5 bg-gray-700">
							<div className="flex gap-x-3">
								<input
									className="px-3 py-2 rounded-md bg-darkGray focus:outline-none"
									id="searchCut"
									type="text"
									title="Insira o nome do corte"
									size="12"
								/>
								<button
									type="button"
									className="px-3 py-2 bg-blue-500 rounded-md"
									onClick={() => cutSearch()}
								>
									Filtrar
								</button>
								{cutPayload.data && (
									<>
										<select
											id="cut"
											className="px-3 py-3 text-xs rounded-md bg-darkGray focus:outline-none"
										>
											{cutPayload.data.map(
												({ id, name }) => (
													<option key={id} value={id}>
														{name}
													</option>
												)
											)}
										</select>
										<button
											type="button"
											className="px-3 py-2 bg-blue-500 rounded-md"
											onClick={() => addCut()}
										>
											Adicionar
										</button>
									</>
								)}
							</div>
							{addCuts.length !== 0 &&
								addCuts.map((x) => (
									<div
										key={x.id}
										className="flex items-center px-2 py-1 mt-3 gap-x-3"
									>
										<button
											type="button"
											className="p-2 rounded-md bg-darkGray"
											onClick={() => removeCut(x.id)}
										>
											<FaTimesCircle className="w-4 h-4" />
										</button>
										<div className="px-2 py-1 rounded-lg bg-darkGray">
											{x.name}
										</div>
									</div>
								))}
						</div>
					</div>
				</div>
			</div>
		</form>
	);
};
