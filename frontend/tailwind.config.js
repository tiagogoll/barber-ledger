module.exports = {
	purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				darkGray: "#20222d",
				mediumGray: "#292b36",
				whatsappGreen: "#25D366",
				whatsappDarkgreen: "#075E54",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
