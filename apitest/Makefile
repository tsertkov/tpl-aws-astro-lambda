.PHONY: *

ROOT_DIR = ..

include $(ROOT_DIR)/.makefiles/Makefile.base.mk
include $(ROOT_DIR)/.makefiles/Makefile.npm.mk

define HELP_SCREEN
  run - run api tests
$(_npm_help)
endef

init: NPM_ARGS=--omit dev
run: npm-start
