.PHONY: *

ROOT_DIR = ..

include $(ROOT_DIR)/.makefiles/Makefile.base.mk
include $(ROOT_DIR)/.makefiles/Makefile.aws.mk

# config vars
ENV ?= dev
REGION ?= eu-central-1
CONFIG_FILE = $(ROOT_DIR)/config.json

define HELP_SCREEN
  init - init dependencies
  test - test api and infrastructure
  build - build api lambdas
  package - package api and infrastructure
  deploy - deploy packaged api and infrastructure
endef

# convert aws region to short version
REG_NAME = $(call aws_region_to_short_name,$(REGION))

# extract config vars from config file
CONFIG_VALUES := $(shell jq -rc '[\
	.projectName // false \
	, .$(ENV).defaultRegion // .default.defaultRegion // false \
	, .$(ENV).domain.name // .default.domain.name // false \
	, .$(ENV).domain.hostedZoneId // .default.domain.hostedZoneId \
	, .$(ENV).errorResponseFileKey // .default.errorResponseFileKey // "404.html" \
	, .$(ENV).debug // .default.debug // false \
	, .$(ENV).logsRetentionInDays // .default.logsRetentionInDays // false \
	, .$(ENV).deletionProtection // .default.deletionProtection // false \
] | @tsv' $(CONFIG_FILE))

# extract vars from config file
read_config_var = $(word $(1), $(CONFIG_VALUES))
PROJECT_NAME := $(call read_config_var,1)
DEFAULT_REGION := $(call read_config_var,2)
DOMAIN := $(call read_config_var,3)
HOSTED_ZONE_ID := $(call read_config_var,4)
ERROR_RESPONSE_FILE := $(call read_config_var,5)
WITH_DEBUG := $(call read_config_var,6)
LOGS_RETENTION_IN_DAYS := $(call read_config_var,7)
DELETION_PROTECTION := $(call read_config_var,8)

# validate that required config vars are set
assert_set = $(if $(filter $(1),false),$(error $(1) is not set),)
$(call assert_set,$(PROJECT_NAME))
$(call assert_set,$(DEFAULT_REGION))
$(call assert_set,$(DOMAIN))
$(call assert_set,$(HOSTED_ZONE_ID))
$(call assert_set,$(ERROR_RESPONSE_FILE))

# check if region is default
IS_DEFAULT_REGION = $(if $(filter $(REGION),$(DEFAULT_REGION)),1,0)

# tags added to cloudformation stacks
TAGS = "project=$(DOMAIN) domain=$(DOMAIN) environment=$(ENV)"

# stack names
STACK_NAME = $(PROJECT_NAME)-$(ENV)-api

deploy: \
	infra-deploy-state \
	infra-deploy-lambdas

test: \
	infra-test \
	api-test

build: \
	infra-build-lambdas

package: build
	$(MAKE) infra-package-lambdas REGION=eu-central-1
	$(MAKE) infra-package-state REGION=eu-central-1

init: \
	require-npm
	$(call _announce_target, $@)
	@cd src; npm ci

api-test: \
	require-npm
	$(call _announce_target, $@)
	@cd src; npm test

infra-test: \
	require-sam \
	require-grep \
	require-xargs
	$(call _announce_target, $@)
	@ls infra/*.yaml | grep -v packaged.yaml | xargs -L 1 sam validate --lint -t

infra-package-state: \
	require-sam
	$(call _announce_target, $@)
	@sam package \
		--resolve-s3 \
		--region $(REGION) \
		--no-progressbar \
		--template-file infra/state.yaml \
		--output-template-file infra/state-$(REG_NAME)-packaged.yaml

infra-deploy-state: \
	require-sam \
	assert-REGION \
	assert-IS_DEFAULT_REGION \
	assert-REG_NAME \
	assert-STACK_NAME \
	assert-DOMAIN \
	assert-HOSTED_ZONE_ID \
	assert-LOGS_RETENTION_IN_DAYS
	$(call _announce_target, $@)
	@sam deploy \
		--template infra/state-$(REG_NAME)-packaged.yaml \
		--resolve-s3 \
		--no-confirm-changeset \
		--no-fail-on-empty-changeset \
		--capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
		--region $(REGION) \
		--stack-name $(STACK_NAME)-state-$(REG_NAME) \
		--tags "$(TAGS)" \
		--parameter-overrides \
			"ParameterKey=ProjectName,ParameterValue=$(STACK_NAME)" \
			"ParameterKey=RegName,ParameterValue=$(REG_NAME)" \
			"ParameterKey=DomainName,ParameterValue=$(DOMAIN)" \
			"ParameterKey=IsDefaultRegion,ParameterValue=$(IS_DEFAULT_REGION)" \
			"ParameterKey=HostedZoneId,ParameterValue=$(HOSTED_ZONE_ID)" \
			"ParameterKey=LogsRetentionInDays,ParameterValue='$(LOGS_RETENTION_IN_DAYS)'"

infra-deploy-lambdas: \
	require-sam \
	assert-ENV \
	assert-REGION \
	assert-REG_NAME \
	assert-STACK_NAME \
	assert-DOMAIN
	$(call _announce_target, $@)
	@sam deploy \
		--resolve-s3 \
		--template-file infra/lambdas-$(REG_NAME)-packaged.yaml \
		--no-confirm-changeset \
		--no-fail-on-empty-changeset \
		--capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
		--region $(REGION) \
		--stack-name $(STACK_NAME)-lambdas-$(REG_NAME) \
		--tags "$(TAGS)" \
		--parameter-overrides \
			"ParameterKey=ProjectName,ParameterValue=$(STACK_NAME)" \
			"ParameterKey=DomainName,ParameterValue=$(DOMAIN)" \
			"ParameterKey=RegName,ParameterValue=$(REG_NAME)" \
			"ParameterKey=EnvName,ParameterValue=$(ENV)"

infra-package-lambdas: \
	require-sam \
	infra-build-lambdas
	$(call _announce_target, $@)
	@sam package \
		--resolve-s3 \
		--region $(REGION) \
		--no-progressbar \
		--output-template-file infra/lambdas-$(REG_NAME)-packaged.yaml

infra-build-lambdas: \
	assert-VERSION \
	require-sam
	$(call _announce_target, $@)
	@sam build --build-in-source --template infra/lambdas.yaml
