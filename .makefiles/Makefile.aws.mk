# Makefile.aws.mk
# Makefile with functions for working with AWS

# convert aws region long name to short version
aws_region_to_short_name = $(firstword \
	$(if $(filter $(1),us-east-1),use1,\
	$(if $(filter $(1),eu-central-1),euc1,\
	$(error Unsupported region: $(1))))\
)

# get single cloudformation output value
aws_cf_output = $(shell \
	aws cloudformation describe-stacks \
		--no-cli-pager \
		--stack-name $(1) \
		--region $(2) \
		--query "Stacks[0].Outputs[?OutputKey=='$(3)'].OutputValue" \
		--output text)

# get all cloudformation outputs
aws-cf-outputs:
	@aws cloudformation describe-stacks \
		--no-cli-pager \
		--region $(REGION) \
		--stack-name $(STACK_NAME) \
		--query 'Stacks[*].Outputs[*].{Key: OutputKey, Value: OutputValue, Description: Description} | []'
