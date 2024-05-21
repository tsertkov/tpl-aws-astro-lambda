.PHONY: *

include ../.makefiles/Makefile.base.mk
include ../.makefiles/Makefile.npm.mk

# config vars
ENV ?= stg
CONFIG_FILE = ../config.json

define HELP_SCREEN
  run - run e2e tests
$(_npm_help)
endef

init: NPM_ARGS=--omit dev
run: DOMAIN ?= $(shell jq -r '.$(ENV).domain.name // .default.domain.name' $(CONFIG_FILE))
run: 
	@ENV=$(ENV) DOMAIN=$(DOMAIN) npm run start
