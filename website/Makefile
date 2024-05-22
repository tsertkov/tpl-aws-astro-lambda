.PHONY: *

ROOT_DIR = ..

include $(ROOT_DIR)/.makefiles/Makefile.base.mk
include $(ROOT_DIR)/.makefiles/Makefile.aws.mk

# config vars
ENV ?= stg

define HELP_SCREEN
  fe-% - Frontend targets
  infra-% - Infrastructure targets
endef

define run_target
	@$(MAKE) -C $(1) $(2) ENV=$(ENV)
endef

infra: infra-list
infra-%:
	$(call run_target,infra,$*)

fe: fe-list
fe-%:
	$(call run_target,fe,$*)
