const authConfig = {
	providers: [
		{
			domain: process.env.CLERK_ISSUER_DOMAIN,
			applicationID: "convex",
		},
	],
};

export default authConfig;
