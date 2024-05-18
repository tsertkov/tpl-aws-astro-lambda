define _npm_help
  init - init dependencies
  init-test - init test dependencies
  test - run tests
  npm-run-% - run any npm script
  npm-% - run any npm command
endef

NPM_ARGS ?=

# init: Init dependencies
# init-test: Init test dependencies
# test: Run tests

.PHONY: init start init-test test

init: npm-ci
init-test: npm-ci
test: npm-test

# npm-run-%: Run any npm script
# npm-%: Run any npm command

.PHONY: npm-run-% npm-%

npm-run-%:
	$(call _announce_target, $@)
	@npm run $* $(NPM_ARGS)

npm-%:
	$(call _announce_target, $@)
	@npm $* $(NPM_ARGS)
