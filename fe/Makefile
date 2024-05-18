.PHONY: *

include ../.makefiles/Makefile.base.mk
include ../.makefiles/Makefile.aws.mk
include ../.makefiles/Makefile.npm.mk

# config vars
ENV ?= stg
CONFIG_FILE = ../config.json

define HELP_SCREEN
  build - build frontend
  deploy - deploy frontend
$(_npm_help)
endef

# extract config vars from config file
CONFIG_VALUES := $(shell jq -rc '[\
	.$(ENV).s3bucket // false \
	, .$(ENV).cloudfrontId // false \
] | @tsv' $(CONFIG_FILE))

# extract vars from config file
read_config_var = $(word $(1), $(CONFIG_VALUES))
S3_BUCKET := $(call read_config_var,1)
CLOUDFRONT_ID := $(call read_config_var,2)

deploy: \
	assert-ENV \
	assert-S3_BUCKET \
	assert-CLOUDFRONT_ID \
	require-aws
	$(call _announce_target, $@)
	@aws s3 sync ./dist s3://$(S3_BUCKET) --delete
	@aws cloudfront create-invalidation --distribution-id $(CLOUDFRONT_ID) --paths "/*"

build: \
	assert-ENV
	$(call _announce_target, $@)
	@ENV="$(ENV)" $(MAKE) npm-run-build
