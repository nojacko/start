all:
	@echo ''
	@echo 'The following commands are available:';
	@echo ' install       Installs requirements.';
	@echo ' build-dev     Builds App for Development';
	@echo ' build         Builds App for Production (minifed)';
	@echo ''

install:
	@echo 'NPM Install';
	@npm install;

	@echo 'Bower Install';
	@bower install;

	@echo 'Installed!'

build-dev:
	@echo 'Building App (DEV)...';
	@rm -rf docs/app/;
	@broccoli build docs/app/ development;

build:
	@echo 'Bulding App (PRODUCTION)...';
	@rm -rf docs/app/;
	@broccoli build docs/app/ production;
