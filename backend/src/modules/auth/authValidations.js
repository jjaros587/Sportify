export const validateLoginData = (email, password) => {
	if(!email || !password){
		throw {status: 400, msg: 'Missing data'};
	}
};

export const validateConfirmEmailData = (id_user, hash) => {
	if(!id_user || !hash){
		throw {status: 400, msg: 'Missing data'};
	}
};