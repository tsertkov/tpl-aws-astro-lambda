.PHONY: *

include .makefiles/Makefile.base.mk
ENV ?= stg

define HELP_SCREEN
  api-% - API targets
  infra-% - Infra targets
  website-% - Website targets
  e2etest-% - E2Etest targets
  apitest-% - APItest targets
  deployer-% - Deployer targets
endef

define run_target
	@$(MAKE) -C $(1) $(2) ENV=$(ENV)
endef

api: api-list
api-%:
	$(call run_target,api,$*)

infra: infra-list
infra-%:
	$(call run_target,infra,$*)

website: website-list
website-%:
	$(call run_target,website,$*)

e2etest: e2etest-list
e2etest-%:
	$(call run_target,e2etest,$*)

apitest: apitest-list
apitest-%:
	$(call run_target,apitest,$*)

deployer: deployer-list
deployer-%:
	$(call run_target,deployer,$*)
