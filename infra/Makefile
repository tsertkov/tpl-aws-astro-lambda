.PHONY: *

include ../.makefiles/Makefile.base.mk
include ../.makefiles/Makefile.aws.mk

# config vars
ENV ?= stg
CONFIG_FILE = ../config.json

define HELP_SCREEN
  deploy - deploy infrastructure
  deploy-certificate - deploy ACM certificate
  deploy-github-oidc - deploy GitHub OIDC
  test - test infrastructure
endef

# extract config vars from config file
CONFIG_VALUES := $(shell jq -rc '[\
	.projectName // false \
	, .certificateDomain // false \
	, .$(ENV).region // .default.region // false \
	, .$(ENV).domain.name // .default.domain.name // false \
	, .$(ENV).domain.hostedZoneId // .default.domain.hostedZoneId \
	, .$(ENV).errorResponseFileKey // .default.errorResponseFileKey // "404.html" \
	, .$(ENV).debug // .default.debug // false \
	, .$(ENV).logsRetentionInDays // .default.logsRetentionInDays // false \
	, .$(ENV).basicAuth // .default.basicAuth // false \
	, .$(ENV).basicAuthUsername // .default.basicAuthUsername // false \
	, .$(ENV).basicAuthPassword // .default.basicAuthPassword // false \
	, .$(ENV).githubRepo // .default.githubRepo // false \
	, .$(ENV).acmCertificateId // .default.acmCertificateId // false \
] | @tsv' $(CONFIG_FILE))

# extract vars from config file
read_config_var = $(word $(1), $(CONFIG_VALUES))
PROJECT_NAME := $(call read_config_var,1)
CERTIFICATE_DOMAIN := $(call read_config_var,2)
REGION := $(call read_config_var,3)
DOMAIN := $(call read_config_var,4)
HOSTED_ZONE_ID := $(call read_config_var,5)
ERROR_RESPONSE_FILE := $(call read_config_var,6)
WITH_DEBUG := $(call read_config_var,7)
LOGS_RETENTION_IN_DAYS := $(call read_config_var,8)
WITH_BASIC_AUTH := $(call read_config_var,9)
BASIC_AUTH_USERNAME := $(call read_config_var,10)
BASIC_AUTH_PASSWORD := $(call read_config_var,11)
GITHUB_REPO := $(call read_config_var,12)
ACM_CERTIFICATE := $(call read_config_var,13)

# validate that required config vars are set
assert_set = $(if $(filter $(1),false),$(error $(1) is not set),)
$(call assert_set,$(PROJECT_NAME))
$(call assert_set,$(CERTIFICATE_DOMAIN))
$(call assert_set,$(REGION))
$(call assert_set,$(DOMAIN))
$(call assert_set,$(HOSTED_ZONE_ID))
$(call assert_set,$(ERROR_RESPONSE_FILE))
$(call assert_set,$(LOGS_RETENTION_IN_DAYS))
$(call assert_set,$(GITHUB_REPO))

# convert false to empty string for optional parameters
false_to_empty_string = $(if $(filter $(1),false),,$(1))
BASIC_AUTH_USERNAME := $(call false_to_empty_string,$(BASIC_AUTH_USERNAME))
BASIC_AUTH_PASSWORD := $(call false_to_empty_string,$(BASIC_AUTH_PASSWORD))

# convert aws region to short version
REG_NAME = $(call aws_region_to_short_name,$(REGION))

# tags added to cloudformation stacks
TAGS = "project=$(DOMAIN) domain=$(DOMAIN) environment=$(ENV)"
STACK_NAME = $(PROJECT_NAME)-$(ENV)-$(REG_NAME)

deploy: \
	assert-STACK_NAME \
	assert-REGION \
	assert-DOMAIN \
	assert-HOSTED_ZONE_ID \
	assert-ERROR_RESPONSE_FILE \
	assert-WITH_DEBUG \
	assert-LOGS_RETENTION_IN_DAYS \
	assert-WITH_BASIC_AUTH \
	assert-ERROR_RESPONSE_FILE \
	assert-GITHUB_REPO \
	assert-ACM_CERTIFICATE \
	require-sam
	$(call _announce_target, $@)
	@sam deploy \
		--resolve-s3 \
		--template-file infra.yaml \
		--confirm-changeset \
		--no-fail-on-empty-changeset \
		--region $(REGION) \
		--stack-name $(STACK_NAME) \
		--capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
		--tags "$(TAGS)" \
		--parameter-overrides \
			"ParameterKey=ProjectName,ParameterValue=$(STACK_NAME)" \
			"ParameterKey=DomainName,ParameterValue=$(DOMAIN)" \
			"ParameterKey=HostedZoneId,ParameterValue=$(HOSTED_ZONE_ID)" \
			"ParameterKey=WithDebug,ParameterValue=$(WITH_DEBUG)" \
			"ParameterKey=LogsRetentionInDays,ParameterValue='$(LOGS_RETENTION_IN_DAYS)'" \
			"ParameterKey=WithBasicAuth,ParameterValue=$(WITH_BASIC_AUTH)" \
			"ParameterKey=BasicAuthUsername,ParameterValue='$(BASIC_AUTH_USERNAME)'" \
			"ParameterKey=BasicAuthPassword,ParameterValue='$(BASIC_AUTH_PASSWORD)'" \
			"ParameterKey=ErrorResponseFileKey,ParameterValue='$(ERROR_RESPONSE_FILE)'" \
			"ParameterKey=GithubTokenSub,ParameterValue='repo:$(GITHUB_REPO):environment:$(ENV)'" \
			"ParameterKey=AcmCertificate,ParameterValue='$(ACM_CERTIFICATE)'"

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
