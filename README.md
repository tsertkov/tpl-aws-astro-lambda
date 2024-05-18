[<img src="docs/use-this-template-btn.png" width="160" />](https://github.com/new?template_name=tpl-aws-astro&template_owner=tsertkov)

# tpl-aws-astro 

A monorepo template for an AWS-hosted, Astro-generated static website, complete with infrastructure code, CI/CD automations, multiple environments, and optional basic auth protection.

## Table of Contents

- [Monorepo Layout](#monorepo-layout)
- [Usage](#usage)
- [Setup](#setup)
- [Infrastructure and Flow Diagram](#infrastructure-and-flow-diagram)

## Monorepo Layout

- `fe/` - Frontend project
- `infra/` - Infrastructure project
- `config.json` - config file
- `Makefile` - task automations

## Usage

1. [Start new repository](https://github.com/new?template_name=tpl-aws-website&template_owner=tsertkov) from this template.
2. Update config.json as necessary.
3. Go through [Setup](#setup) steps.
4. Edit `fe/src` files, `git add`, `git commit`, `git push`, etc.
5. Vaildate `stg` deployment and run `deploy` workflow for `prd` env.

## Setup

### Deploy infrastructure

Start with deploying AWS shared resources and deploy infrastructure for `stg` and `prd` environments.

```sh
make infra-deploy-certificate
make infra-deploy-github-oidc
make infra-deploy ENV=stg
make infra-deploy ENV=prd
```

Update `s3bucket` and `cloudfrontId` in `config.json` with values returned in stack outputs.

### CI/CD

To enable the deployment workflow, configure the following Environments and Environment Variables in your GitHub repository settings:

- **Environments:**
  - `prd` - Production
  - `stg` - Staging
- **Environment variables:**
  - `AWS_REGION` - AWS region environment is deployed to
  - `AWS_ROLE` - AWS CI/CD Role ARN

Use `CDRoleArn` value from `infra-deploy` outputs to update `AWS_ROLE` environment variable for a corresponding environment in repository settings.

### Makefile

`make` is the default task runner in this project.

Run `make` in your terminal:

```sh
make
# Available targets:
#   deploy - Build & deploy infrastructure and frontend
#   fe-%   - Frontend (fe) targets
#   infra-% - Infrastructure (infra) targets

make fe
# Available targets:
#   build - build frontend
#   deploy - deploy frontend
#   init - init dependencies
#   init-test - init test dependencies
#   test - run tests
#   npm-run-% - run any npm script
#   npm-% - run any npm command

make infra
# Available targets:
#  deploy - deploy infrastructure
#  deploy-certificate - deploy ACM certificate
#  deploy-github-oidc - deploy GitHub OIDC
#  test - test infrastructure
```

## Infrastructure and Flow Diagram

![Infrastructure Diagram](https://raw.githubusercontent.com/tsertkov/tpl-aws-website/main/docs/infra-diagram.svg)

### 0. Shared AWS Resources

1. IAM OIDCProvider for GitHub.
2. Route53 DNS zone for creating DNS records.
3. ACM certificate for CloudFront.

### 1. Developer Flow

1. Developer pushes updates to a GitHub repository.
2. GitHub Actions triggers the `deploy` workflow when code update conditions are met.
3. GitHub workflow uploads website files to an S3 Web Bucket using the CI/CD Role.
4. GitHub workflow triggers cache invalidation in CloudFront using the CI/CD Role.

### 2. User Flow

1. User requests an IP address for a DNS name.
2. Route53 resolves the IP address from an alias record for the CloudFront distribution.
3. User sends an HTTP request to CloudFront using the resolved IP address.
4. CloudFront calls ViewerRequestFunction handling auth and basic redirects for static site urls.
5. CloudFront forwards request to upstream S3 Web Bucket if requested file is not found in the cache.
6. CloudFront logs request to S3 Logs Bucket.
