export const navigateToProfile = (navigation, email, id, user) => {
	navigation.navigate('Profile', {
		name: '',
		email: email,
		id: id,
		user: user,
	});
};

export const monthMapper = {
	'01': 'January',
	'02': 'February',
	'03': 'March',
	'04': 'April',
	'05': 'May',
	'06': 'June',
	'07': 'July',
	'08': 'August',
	'09': 'September',
	10: 'October',
	11: 'November',
	12: 'December',
};

export const getAvatarInitials = (name) => {
	if (!name) return;
	const tokens = name.split(' ');
	let initials = '';
	tokens.forEach((token) => {
		initials += token[0];
	});
	return initials;
};
