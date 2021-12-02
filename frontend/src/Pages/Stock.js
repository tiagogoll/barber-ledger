import { useEffect, useState } from "react";
import { FaArrowLeft, FaTimesCircle, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { handleDelete, handleRegister } from "../Infrastructure/Api";
import { Loading } from "../Infrastructure/Loading";
import { NormalizeCnpj } from "../Infrastructure/Normalizers";
import { Request } from "../Infrastructure/Requests";

export const Stock = () => {
	const RenderRow = (id, buyDate, supplierName) => {
		const FlippingRecover = (handleFunction) => (message) => () => {
			handleFunction(message, `/estoque/${id}`).then((bool) => {
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
					<div>{supplierName}</div>
					{buyDate && (
						<div className="text-sm text-gray-300">{`${new Date(
							buyDate
						).toLocaleDateString("pt-BR")}`}</div>
					)}
					{payload.data[1].map((x) => {
						const filtered = x.filter(
							(y) => y.batchItemBatchId === id
						);
						if (filtered.length !== 0) {
							return (
								<div className="text-sm text-gray-300">
									{filtered.map((x) => (
										<div key={x.productName}>{`${
											x.productName
										} - ${
											x.batchItemAmount
										} unidades - ${Intl.NumberFormat(
											"pt-BR",
											{
												style: "currency",
												currency: "BRL",
											}
										).format(x.batchItemCostPrice)}`}</div>
									))}
								</div>
							);
						}
					})}
				</div>
				<div className="flex w-full gap-x-3">
					<button
						onClick={FlippingRecover(handleDelete)(
							"Você tem certeza que deseja deletar esse lote do estoque?"
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
		if (option === "supplierId") {
			setOption(0);
		}
		if (option === "buyDate") {
			setOption(1);
		}
		if (option === "productId") {
			setOption(2);
		}
	};

	const [payload, setPayload] = useState({
		loading: false,
		error: false,
		data: null,
	});

	const [supplierPayload, setSupplierPayload] = useState({
		loading: false,
		error: false,
		data: null,
	});

	const [productPayload, setProductPayload] = useState({
		loading: false,
		error: false,
		data: null,
	});

	const supplierSearch = (e) => {
		if (e !== undefined) {
			e.preventDefault();
		}

		const search = document.getElementById("searchSupplier").value;

		let query = "";

		if (search !== "") {
			query = `/fornecedores?recover=false&name=${search}`;
		} else {
			query = `/fornecedores?recover=false`;
		}

		Request(setSupplierPayload)(query);
	};

	const productSearch = (e) => {
		if (e !== undefined) {
			e.preventDefault();
		}

		const search = document.getElementById("searchProduct").value;

		let query = "";

		if (search !== "") {
			query = `/produtos?recover=false&name=${search}`;
		} else {
			query = `/produtos?recover=false`;
		}

		Request(setProductPayload)(query);
	};

	const reload = (e) => {
		if (e !== undefined) {
			e.preventDefault();
		}

		let query = "";
		let search = "";

		if (option === 0 && supplierPayload.data !== null) {
			search = document.getElementById("supplier").value;
		}
		if (option === 1) {
			search = document.getElementById("searchDate").value;
		}
		if (option === 2 && productPayload.data !== null) {
			search = document.getElementById("product").value;
		}

		if (search !== "") {
			if (option === 0) {
				query = `/estoque?supplierId=${search}`;
			}
			if (option === 1) {
				query = `/estoque?buyDate=${search}`;
			}
			if (option === 2) {
				query = `/estoque?productId=${search}`;
			}
		} else {
			query = "/estoque";
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
										id="searchSupplier"
										type="text"
										size="12"
										className="px-3 py-2 rounded-md bg-darkGray focus:outline-none"
										onChange={supplierSearch}
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
										id="searchProduct"
										type="text"
										size="12"
										className="px-3 py-2 rounded-md bg-darkGray focus:outline-none"
										onChange={productSearch}
									/>
								)}
							</div>
							{supplierPayload.data &&
								supplierPayload.data.length !== 0 && (
									<select
										id="supplier"
										className="px-3 py-3 text-xs rounded-md bg-darkGray focus:outline-none"
									>
										{supplierPayload.data.map(
											({ id, cnpj, name }) => (
												<option
													key={id}
													value={id}
												>{`${NormalizeCnpj(
													cnpj
												)} - ${name}`}</option>
											)
										)}
									</select>
								)}
							{productPayload.data &&
								productPayload.data.length !== 0 && (
									<select
										id="product"
										className="px-3 py-3 text-xs rounded-md bg-darkGray focus:outline-none"
									>
										{productPayload.data.map(
											({ id, name }) => (
												<option key={id} value={id}>
													{name}
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
								defaultValue="supplierId"
								onChange={() => {
									setProductPayload({
										loading: false,
										error: false,
										data: null,
									});
									setSupplierPayload({
										loading: false,
										error: false,
										data: null,
									});
									optionSwitch();
								}}
							>
								<option value="supplierId">Fornecedor</option>
								<option value="buyDate">Data de Compra</option>
								<option value="productId">Produto</option>
							</select>
						</div>
						<div className="flex items-baseline gap-x-3">
							<button
								type="submit"
								className="px-3 py-2 bg-blue-500 rounded-md"
							>
								Filtrar
							</button>

							<Link to="/estoque/cadastrar">
								<div className="px-3 py-2 bg-red-500 rounded-md">
									Cadastrar Compra
								</div>
							</Link>
						</div>
					</div>
					<div className="mt-6 overflow-hidden bg-darkGray rounded-xl">
						<div className="flex items-center px-6 py-3 font-semibold border-b border-darkGray">
							<div className="w-3/5">Lotes</div>
							<div className="w-full">Ações</div>
						</div>
						{payload.data &&
							payload.data[0].map(
								({ id, buyDate, supplierName }) =>
									RenderRow(id, buyDate, supplierName)
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

export const Good = () => {
	const navigate = useNavigate();

	const [supplierPayload, setSupplierPayload] = useState({
		loading: false,
		error: false,
		data: null,
	});

	const [productPayload, setProductPayload] = useState({
		loading: false,
		error: false,
		data: null,
	});

	const [addProducts, setAddProducts] = useState([]);

	useEffect(() => {
		supplierSearch();
	}, []);

	const supplierSearch = () => {
		const search = document.getElementById("searchSupplier").value;

		let query = "";

		if (search !== "") {
			query = `/fornecedores?recover=false&name=${search}`;
		} else {
			query = `/fornecedores?recover=false`;
		}

		Request(setSupplierPayload)(query);
	};

	const productSearch = () => {
		const search = document.getElementById("searchProduct").value;

		let query = "";

		if (search !== "") {
			query = `/produtos?recover=false&name=${search}`;
		} else {
			query = `/produtos?recover=false`;
		}

		Request(setProductPayload)(query);
	};

	const addProduct = () => {
		const id = parseInt(document.getElementById("product").value);
		const name = productPayload.data.filter((x) => x.id === id)[0].name;

		if (!addProducts.some((x) => x.id === id)) {
			setAddProducts([
				...addProducts,
				{ id: id, name: name, amount: 0, costPrice: 0 },
			]);
		}
	};

	const addValues = (idN, property, value) => {
		const newState = addProducts.map(({ id, name, amount, costPrice }) => {
			if (id === idN) {
				if (property === "amount") {
					return {
						id: id,
						name: name,
						amount: value,
						costPrice: costPrice,
					};
				}
				if (property === "costPrice") {
					return {
						id: id,
						name: name,
						amount: amount,
						costPrice: value,
					};
				}
			} else {
				return {
					id: id,
					name: name,
					amount: amount,
					costPrice: costPrice,
				};
			}
		});
		setAddProducts(newState);
	};

	const removeProduct = (id) => {
		setAddProducts(addProducts.filter((x) => x.id !== id));
	};

	const Saving = (e) => {
		e.preventDefault();

		const payload = {
			supplierId: document.getElementById("supplier").value,
			buyDate: document.getElementById("buyDate").value,
		};

		if (payload.supplierId === "") {
			alert('O campo "Fornecedor" deve ser preenchido, tente novamente.');
		}
		if (payload.buyDate === "") {
			alert(
				'O campo "Data da Compra" deve ser preenchido, tente novamente.'
			);
		}
		if (addProducts.length === 0) {
			alert(
				"A compra necessita de pelo menos um produto, tente novamente."
			);
		}
		if (
			addProducts.length > 0 &&
			!addProducts.filter(
				({ amount, price }) =>
					(amount <= 0 &&
						(() => {
							alert(
								"A compra não pode ter uma quantidade de produtos igual ou menor do que 0, tente novamente"
							);
							return true;
						})()) ||
					(price <= 0 &&
						(() => {
							alert(
								"A compra não pode ter um produto com preço menor ou igual à 0, tente novamente."
							);
							return true;
						})())
			).length > 0
		) {
			const addProductsPayload = addProducts.map(
				({ id, amount, costPrice }) => {
					return { id, amount, costPrice };
				}
			);
			const { supplierId, buyDate } = payload;

			const finalPayload = {
				supplierId,
				buyDate,
				productDetails: addProductsPayload,
			};

			handleRegister(
				"Você tem certeza que deseja cadastrar esse lote?",
				"/estoque",
				finalPayload
			).then((bool) => {
				if (bool) {
					navigate("/estoque");
				}
			});
		}
	};

	return (
		<form onSubmit={Saving}>
			<div className="max-w-4xl mx-auto mt-12 text-gray-50">
				<div className="flex items-center pb-4 gap-x-3">
					<Link to="/estoque" className="p-3 bg-blue-500 rounded-md">
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
						<div className="w-1/4 px-6 py-5">
							<div>Fornecedor</div>
						</div>
						<div className="w-full px-6 py-5 bg-gray-700">
							<div className="flex gap-x-3">
								<input
									className="px-3 py-2 rounded-md bg-darkGray focus:outline-none"
									id="searchSupplier"
									type="text"
									title="Insira o nome do fornecedor"
									size="12"
								/>
								<button
									type="button"
									className="px-3 py-2 bg-blue-500 rounded-md"
									onClick={() => supplierSearch()}
								>
									Filtrar
								</button>
								{supplierPayload.data && (
									<select
										id="supplier"
										className="px-3 py-3 text-xs rounded-md bg-darkGray focus:outline-none"
										required
									>
										{supplierPayload.data.map(
											({ id, cnpj, name }) => (
												<option
													key={id}
													value={id}
												>{`${NormalizeCnpj(
													cnpj
												)} - ${name}`}</option>
											)
										)}
									</select>
								)}
							</div>
						</div>
					</div>
					<div className="flex items-center border-b border-darkGray">
						<div className="w-1/4 px-6 py-5">
							<div>Data da Compra</div>
						</div>
						<div className="w-full px-6 py-5 bg-gray-700">
							<div className="flex gap-x-3">
								<input
									className="bg-gray-700 focus:outline-none"
									id="buyDate"
									type="date"
									title="Insira data da compra"
								/>
							</div>
						</div>
					</div>
					<div className="flex items-center border-b border-darkGray">
						<div className="w-1/4 px-6 py-5">
							<div>Produtos</div>
						</div>
						<div className="w-full px-6 py-5 bg-gray-700">
							<div className="flex gap-x-3">
								<input
									className="px-3 py-2 rounded-md bg-darkGray focus:outline-none"
									id="searchProduct"
									type="text"
									title="Insira o nome do produto"
									size="12"
								/>
								<button
									type="button"
									className="px-3 py-2 bg-blue-500 rounded-md"
									onClick={() => productSearch()}
								>
									Filtrar
								</button>
								{productPayload.data && (
									<>
										<select
											id="product"
											className="px-3 py-3 text-xs rounded-md bg-darkGray focus:outline-none"
										>
											{productPayload.data.map(
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
											onClick={() => addProduct()}
										>
											Adicionar
										</button>
									</>
								)}
							</div>
							{addProducts.length !== 0 &&
								addProducts.map((x) => (
									<div
										key={x.id}
										className="flex items-center px-2 py-1 mt-3 gap-x-3"
									>
										<button
											type="button"
											className="p-2 rounded-md bg-darkGray"
											onClick={() => removeProduct(x.id)}
										>
											<FaTimesCircle className="w-4 h-4" />
										</button>
										<div className="px-2 py-1 rounded-lg bg-darkGray">
											{x.name}
										</div>
										<div className="px-2 py-1 rounded-lg bg-darkGray">
											<input
												className="bg-darkGray focus:outline-none"
												style={{ width: "4em" }}
												type="number"
												min="1"
												onChange={(e) =>
													addValues(
														x.id,
														"amount",
														parseInt(e.target.value)
													)
												}
											/>
											unidades
										</div>
										<div className="px-2 py-1 rounded-lg bg-darkGray">
											<input
												className="bg-darkGray focus:outline-none"
												style={{ width: "4em" }}
												step="0.01"
												type="number"
												min="0.01"
												onChange={(e) =>
													addValues(
														x.id,
														"costPrice",
														parseFloat(
															e.target.value
														)
													)
												}
											/>
											preço de custo
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
