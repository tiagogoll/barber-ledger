export const NormalizeCellphone = (x) =>
	x.replace(/(\d{2})(\d{5})(\d{4})/g, "($1) $2-$3");

export const NormalizeCnpj = (x) =>
	x.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");

export const DateDbToHtml = (x) => {
	return new Date(x).toISOString().split("T")[0];
};
