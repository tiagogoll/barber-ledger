import axios from "axios";

export const api = axios.create({
	baseURL: "http://localhost:3333",
});

export const handleRecover = async (recoverMessage, toDelete) => {
	if (window.confirm(recoverMessage)) {
		try {
			await api.delete(toDelete);
			alert("Restauração concluída com sucesso");
			return true;
		} catch (e) {
			alert("Erro ao restaurar, tente novamente.");
			return false;
		}
	} else {
		return false;
	}
};

export const handleDelete = async (deleteMessage, toDelete) => {
	if (window.confirm(deleteMessage)) {
		try {
			await api.delete(toDelete);
			alert("Deleção concluída com sucesso");
			return true;
		} catch (e) {
			alert("Erro ao deletar, tente novamente.");
			return false;
		}
	} else {
		return false;
	}
};

export const handleSave = async (alterMessage, toSave, data) => {
	if (window.confirm(alterMessage)) {
		try {
			await api.put(toSave, data);
			alert("Alteração concluída com sucesso");
			return true;
		} catch (e) {
			alert("Erro ao alterar, tente novamente.");
			return false;
		}
	} else {
		return false;
	}
};

export const handleRegister = async (registerMessage, toSave, data) => {
	if (window.confirm(registerMessage)) {
		try {
			await api.post(toSave, data);
			alert("Cadastro concluído com sucesso");
			return true;
		} catch (e) {
			alert("Erro no cadastro, tente novamente.");
			return false;
		}
	} else {
		return false;
	}
};
