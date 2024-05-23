.PHONY: *

ROOT_DIR = ..

include $(ROOT_DIR)/.makefiles/Makefile.base.mk
include $(ROOT_DIR)/.makefiles/Makefile.npm.mk

# config vars
ENV ?= stg
VERSION ?= *
CONFIG_FILE = $(ROOT_DIR)/config.json

define HELP_SCREEN
  run - run api tests
$(_npm_help)
endef

# extract config vars from config file
DOMAIN = $(shell jq -rc '.$(ENV).domain.name // .default.domain.name' $(CONFIG_FILE))
API_URL = https://api.$(DOMAIN)

init: NPM_ARGS=--omit dev
run: \
	assert-ENV \
	assert-VERSION \
	assert-API_URL
	@$(MAKE) npm-start \
		ENV=$(ENV) \
		VERSION=$(VERSION) \
		API_URL=$(API_URL)
