import { useState } from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { handleDelete, handleSave } from "../Infrastructure/Api";
import { Loading } from "../Infrastructure/Loading";
import { Request } from "../Infrastructure/Requests";
import { mapTime } from "../Infrastructure/Times";

export const Services = () => {
	const RenderRow = (id, scheduleDate, clientName, isDone, discount) => {
		const FlippingRecover =
			(handleFunction) => (message) => (address) => () => {
				handleFunction(message, address).then((bool) => {
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
						const filtered = x.filter((y) => y.serviceId === id);
						if (filtered.length !== 0) {
							return (
								<div className="text-sm text-gray-300">
									{filtered.map((x) => (
										<div key={x.cutName}>{`${
											x.cutName
										} - ${Intl.NumberFormat("pt-BR", {
											style: "currency",
											currency: "BRL",
										}).format(x.cutPrice)}${
											discount !== 0
												? ` - ${discount}%`
												: ""
										}`}</div>
									))}
								</div>
							);
						}
					})}
					{payload.data[2].map((x) => {
						const filtered = x.filter((y) => y.serviceId === id);
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
					{!isDone && (
						<>
							<button
								onClick={FlippingRecover(handleSave)(
									"Você tem certeza que esse serviço foi concluído?"
								)(`/servicos/${id}`)}
							>
								<div className="button hover:bg-green-500">
									<FaCheck className="w-5 h-5" />
								</div>
							</button>
							<button
								onClick={FlippingRecover(handleDelete)(
									"Você tem certeza que deseja deletar esse agendamento?"
								)(`/agendamentos/${id}`)}
							>
								<div className="button hover:bg-red-500">
									<FaTrash className="w-5 h-5" />
								</div>
							</button>
						</>
					)}
					{isDone && (
						<button
							onClick={FlippingRecover(handleSave)(
								"Você tem certeza que esse serviço não foi concluído?"
							)(`/servicos/${id}`)}
						>
							<div className="button hover:bg-red-500">
								<FaTimes className="w-5 h-5" />
							</div>
						</button>
					)}
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

		const isDone = document.getElementById("isDone").value;

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
				query = `/servicos?isDone=${isDone}&clientId=${search}`;
			}
			if (option === 1) {
				query = `/servicos?isDone=${isDone}&scheduleDate=${search}`;
			}
			if (option === 2) {
				query = `/servicos?isDone=${isDone}&cutId=${search}`;
			}
		} else {
			query = `/servicos?isDone=${isDone}`;
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
									Data do Serviço
								</option>
								<option value="cutId">Corte</option>
							</select>
							<select
								id="isDone"
								className="px-3 py-2.5 rounded-md bg-darkGray focus:outline-none"
								defaultValue={false}
							>
								<option value={false}>Agendados</option>
								<option value={true}>Concluídos</option>
							</select>
						</div>
						<div className="flex items-baseline gap-x-3">
							<button
								type="submit"
								className="px-3 py-2 bg-blue-500 rounded-md"
							>
								Filtrar
							</button>
						</div>
					</div>
					<div className="mt-6 overflow-hidden bg-darkGray rounded-xl">
						<div className="flex items-center px-6 py-3 font-semibold border-b border-darkGray">
							<div className="w-3/5">Serviços</div>
							<div className="w-full">Ações</div>
						</div>
						{payload.data &&
							payload.data[0].map(
								({
									id,
									scheduleScheduleDate,
									clientName,
									isDone,
									discount,
								}) =>
									RenderRow(
										id,
										scheduleScheduleDate,
										clientName,
										isDone,
										discount
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
