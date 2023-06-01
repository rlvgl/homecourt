export const navigateToProfile = (navigation, email, id, user) => {
	navigation.navigate('Profile', {
		name: '',
		email: email,
		id: id,
		user: user,
	});
};
