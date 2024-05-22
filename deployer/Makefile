.PHONY: *

ROOT_DIR = ..

include $(ROOT_DIR)/.makefiles/Makefile.base.mk
include $(ROOT_DIR)/.makefiles/Makefile.aws.mk

# config vars
ENV ?= stg
CONFIG_FILE = $(ROOT_DIR)/config.json

# extract config vars from config file
CONFIG_VALUES := $(shell jq -rc '[\
	.projectName // false \
	, .$(ENV).domain.name // .default.domain.name // false \
	, .$(ENV).deployer.githubOrg // .default.deployer.githubOrg // false \
	, .$(ENV).deployer.githubRepo // .default.deployer.githubRepo // false \
	, .$(ENV).deployer.region // .default.deployer.region // false \
	, .$(ENV).deployer.confirm // .default.deployer.confirm // true \
] | @tsv' $(CONFIG_FILE))

# extract vars from config file
read_config_var = $(word $(1), $(CONFIG_VALUES))
PROJECT_NAME := $(call read_config_var,1)
DOMAIN := $(call read_config_var,2)
GITHUB_ORG := $(call read_config_var,3)
GITHUB_REPO := $(call read_config_var,4)
DEPLOYER_REGION := $(call read_config_var,5)
WITH_CONFIRM := $(call read_config_var,6)

# validate that required config vars are set
assert_set = $(if $(filter $(1),false),$(error $(1) is not set),)
$(call assert_set,$(PROJECT_NAME))
$(call assert_set,$(GITHUB_ORG))
$(call assert_set,$(GITHUB_REPO))
$(call assert_set,$(DOMAIN))
$(call assert_set,$(DEPLOYER_REGION))

# tags added to cloudformation stacks
TAGS = "project=$(DOMAIN) domain=$(DOMAIN) environment=$(ENV)"

# stack names
STACK_NAME = $(PROJECT_NAME)-$(ENV)

# set aws region and short region name
REGION = $(DEPLOYER_REGION)
REG_NAME = $(call aws_region_to_short_name,$(REGION))

define HELP_SCREEN
  image - build deployer image
  infra - deploy infrastructure
  infra-lint - lint infrastructure templates
endef

image: \
	require-docker
	$(call _announce_target, $@)
	@docker build -t deployer image

infra-lint: \
	require-sam \
	require-xargs
	$(call _announce_target, $@)
	@ls infra/*.yaml | xargs -L 1 sam validate --lint -t

infra: SAM_SOURCE_BUCKET_EUC1 ?= $(call aws_cf_output,aws-sam-cli-managed-default,eu-central-1,SourceBucket)
infra: \
	require-sam \
	assert-STACK_NAME \
	assert-ENV \
	assert-REGION \
	assert-WITH_CONFIRM \
	assert-SAM_SOURCE_BUCKET_EUC1
	$(call _announce_target, $@)
	@sam deploy \
		--resolve-s3 \
		--template-file infra/deployer.yaml \
		--confirm-changeset \
		--no-fail-on-empty-changeset \
		--region $(REGION) \
		--stack-name $(STACK_NAME)-$(REG_NAME)-deployer \
		--capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
		--parameter-overrides \
			"ParameterKey=ProjectName,ParameterValue=$(STACK_NAME)" \
			"ParameterKey=Environment,ParameterValue=$(ENV)" \
			"ParameterKey=GitHubOrg,ParameterValue=$(GITHUB_ORG)" \
			"ParameterKey=RepositoryName,ParameterValue=$(GITHUB_REPO)" \
			"ParameterKey=SamSourceBucketEuc1,ParameterValue=$(SAM_SOURCE_BUCKET_EUC1)" \
			"ParameterKey=WithConfirm,ParameterValue=$(WITH_CONFIRM)" \
		--tags "$(TAGS)"
