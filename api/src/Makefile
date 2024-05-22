# validate required VERSION
ifndef VERSION
$(error VERSION is not set)
endif

# esbuild parameters common to all lambdas
# all code dependencies are bundled into the single index.mjs file per lambda
esbuild_params = \
	--format=esm \
	--out-extension:.js=.mjs \
	--platform=node \
	--bundle \
	--minify \
	--charset=utf8 \
	--external:@aws-sdk \
	--supported:const-and-let=true \
	--define:process.env.VERSION="'$(VERSION)'"

ifdef ARTIFACTS_DIR
esbuild_params += --outfile=$(ARTIFACTS_DIR)/index.mjs
else
$(info ARTIFACTS_DIR is not set, using /dev/null as OUTFILE)
esbuild_params += --outfile=/dev/null --analyze
endif

.PHONY: build-%
build-%:
	@npx esbuild $(esbuild_params) lambdas/$*/index.mjs
