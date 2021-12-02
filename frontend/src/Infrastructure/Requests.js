import { api } from "./Api";

export const Request = (setPayload) => (url) => {
	const loadingPayload = (loading, error, data) => {
		setPayload({
			loading: loading,
			error: error,
			data: data,
		});
	};

	loadingPayload(true, false, null);
	api.get(url)
		.then((r) => {
			loadingPayload(false, false, r.data);
		})
		.catch((e) => {
			loadingPayload(false, true, null);
		});
};
