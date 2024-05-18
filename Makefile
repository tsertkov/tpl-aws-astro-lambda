.PHONY: *

include .makefiles/Makefile.base.mk
ENV ?= stg

define HELP_SCREEN
  deploy - build & deploy all
  fe-% - fe targets
  infra-% - infra targets
endef

define run_target
	@$(MAKE) -C $(1) $(2) ENV=$(ENV)
endef

fe: fe-list
fe-%:
	$(call run_target,fe,$*)

infra: infra-list
infra-%:
	$(call run_target,infra,$*)

deploy: \
	infra-deploy \
	fe-build \
	fe-deploy
