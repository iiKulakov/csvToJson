const checkEmail = (email) => {
	const regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	const check = email && !!email.match(regex);

	return check;
};

exports.checkEmail = checkEmail;
