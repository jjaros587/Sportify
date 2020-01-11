import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = (apiVersion) => {
	const apis = `./src/modules/**/*_${apiVersion}.js`;
	return {
		openapi: '3.0.0',
		swaggerDefinition: {
			components: {},
			info: {
				title: 'Test API',
				version: apiVersion,
				description: 'Test Express API with autogenerated swagger doc',
			},
			basePath: `/api/${apiVersion}`
		},
		// List of files to be processes. You can also set globs './routes/*.js'
		apis: [apis],
	}
};

const options_ui = {
	explorer: true
};
const swagger = (router, apiVersion) => {
	router.use(`/docs/${apiVersion}`,
		swaggerUi.serve,
		swaggerUi.setup(
			swaggerJsdoc(options(apiVersion)),
			options_ui
		)
	);
	console.log(`[initialized] Swagger                           /docs/${apiVersion}`);
};

export default swagger;