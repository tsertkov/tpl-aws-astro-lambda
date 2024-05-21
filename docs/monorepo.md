# Monorepo

This document outlines the structure, configuration, and development practices followed within this project’s monorepo setup.

## Configuration

The configuration for the monorepo is managed by a common configuration file, `/config.json`. This file contains settings that are shared across all packages.

## Monorepo Architecture

The monorepo architecture allows for multiple packages to be managed within a single repository. This approach has several advantages, including atomic commits and easier cross-package development. Each package resides in its own directory at the root of the repository. Each package has its own development environment, dependencies file, and can be developed, and built independently.

## Per-project Makefiles

Each package in the monorepo uses a Makefile as a generic task runner. This allows for package-specific tasks such as building, testing, and publishing to be defined and run from the command line. The Makefile provides a simple and consistent interface for running these tasks across all packages.