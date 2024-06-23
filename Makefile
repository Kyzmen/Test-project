install:
	npm install
template:
	node src/static/create-component $(name)
lint:
	npx eslint ./src/assets/scripts/**/*.js ./src/assets/scripts/*.js ./src/pug/components/**/*.js
lint-w:
	npx eslint ./src/assets/scripts/**/*.js ./src/assets/scripts/*.js ./src/pug/components/**/*.js --fix
prettier:
	npx prettier --write ./src/assets/scripts/**/*.js ./src/assets/scripts/*.js ./src/pug/components/**/*.js