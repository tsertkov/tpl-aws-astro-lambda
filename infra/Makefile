.PHONY: *

ROOT_DIR = ..

include $(ROOT_DIR)/.makefiles/Makefile.base.mk
include $(ROOT_DIR)/.makefiles/Makefile.aws.mk

# config vars
ENV ?= stg
CONFIG_FILE = $(ROOT_DIR)/config.json

define HELP_SCREEN
  deploy-certificate - deploy ACM certificate
  deploy-github-oidc - deploy GitHub OIDC
  test - test infrastructure
endef

# extract config vars from config file
CONFIG_VALUES := $(shell jq -rc '[\
	.projectName // false \
	, .certificateDomain // false \
	, .$(ENV).deployer.region // .default.deployer.region // false \
	, .$(ENV).domain.hostedZoneId // .default.domain.hostedZoneId \
] | @tsv' $(CONFIG_FILE))

# extract vars from config file
read_config_var = $(word $(1), $(CONFIG_VALUES))
PROJECT_NAME := $(call read_config_var,1)
CERTIFICATE_DOMAIN := $(call read_config_var,2)
REGION := $(call read_config_var,3)
HOSTED_ZONE_ID := $(call read_config_var,4)

# validate that required config vars are set
assert_set = $(if $(filter $(1),false),$(error $(1) is not set),)
$(call assert_set,$(PROJECT_NAME))
$(call assert_set,$(CERTIFICATE_DOMAIN))
$(call assert_set,$(REGION))
$(call assert_set,$(HOSTED_ZONE_ID))

deploy-certificate: STACK_NAME = $(PROJECT_NAME)-certificate
deploy-certificate: \
	assert-STACK_NAME \
	assert-CERTIFICATE_DOMAIN \
	assert-HOSTED_ZONE_ID \
	require-sam
	$(call _announce_target, $@)
	@sam deploy \
		--resolve-s3 \
		--template-file certificate.yaml \
		--confirm-changeset \
		--no-fail-on-empty-changeset \
		--region us-east-1 \
		--stack-name $(STACK_NAME) \
		--tags "project=$(CERTIFICATE_DOMAIN) domain=$(CERTIFICATE_DOMAIN)" \
		--parameter-overrides \
			"ParameterKey=DomainName,ParameterValue=$(CERTIFICATE_DOMAIN)" \
			"ParameterKey=HostedZoneId,ParameterValue=$(HOSTED_ZONE_ID)"

deploy-github-oidc: STACK_NAME = github-oidc
deploy-github-oidc: \
	assert-STACK_NAME \
	assert-REGION \
	require-sam
	$(call _announce_target, $@)
	@sam deploy \
		--resolve-s3 \
		--template-file github-oidc.yaml \
		--confirm-changeset \
		--no-fail-on-empty-changeset \
		--region $(REGION) \
		--stack-name $(STACK_NAME)

test: \
	require-sam \
	require-xargs
	$(call _announce_target, $@)
	@ls *.yaml | xargs -L 1 sam validate --lint -t
