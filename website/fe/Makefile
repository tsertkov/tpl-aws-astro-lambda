.PHONY: *

ROOT_DIR = ../..

include $(ROOT_DIR)/.makefiles/Makefile.base.mk
include $(ROOT_DIR)/.makefiles/Makefile.aws.mk
include $(ROOT_DIR)/.makefiles/Makefile.npm.mk

# config vars
ENV ?= stg
VERSION ?= 0.0.0
CONFIG_FILE = $(ROOT_DIR)/config.json

define HELP_SCREEN
  build - build frontend
  deploy - deploy frontend
$(_npm_help)
endef

# extract config vars from config file
CONFIG_VALUES := $(shell jq -rc '[\
	.projectName // false \
	, .$(ENV).region // .default.region // false \
] | @tsv' $(CONFIG_FILE))

# extract vars from config file
read_config_var = $(word $(1), $(CONFIG_VALUES))
PROJECT_NAME := $(call read_config_var,1)
REGION := $(call read_config_var,2)

# convert aws region to short version
REG_NAME = $(call aws_region_to_short_name,$(REGION))
WEBSITE_STACK = $(PROJECT_NAME)-$(ENV)-$(REG_NAME)

deploy: S3_BUCKET := $(call aws_cf_output,$(WEBSITE_STACK),$(REGION),WebBucket)
deploy: CLOUDFRONT_ID := $(call aws_cf_output,$(WEBSITE_STACK),$(REGION),Distribution)
deploy: \
	assert-ENV \
	assert-S3_BUCKET \
	assert-CLOUDFRONT_ID \
	require-aws
	$(call _announce_target, $@)
	@aws s3 sync ./dist s3://$(S3_BUCKET) --delete
	@aws cloudfront create-invalidation --distribution-id $(CLOUDFRONT_ID) --paths "/*"

build: \
	assert-ENV \
	assert-VERSION
	$(call _announce_target, $@)
	@ENV="$(ENV)" VERSION="$(VERSION)" $(MAKE) npm-run-build
