ARG AWS_CLI_VERSION=2.15.39
FROM public.ecr.aws/aws-cli/aws-cli:${AWS_CLI_VERSION}

ARG AWS_SAM_VERSION=v1.115.0
ARG SOPS_VERSION=3.8.1

# Install tools required for the deployment process
RUN set -e; \
    # - unzip
    # - make
    # - jq
    # - ps
    # - which
    # - hostname
    yum install -y \
      unzip \
      make \
      jq \
      procps \
      which \
      hostname \
    ; yum -y clean all && rm -fr /var/cache; \
    case $(uname -m) in \
        aarch64) SAM_PLATFORM=arm64; SOPS_PLATFORM=aarch64 ;; \
        x86_64) SAM_PLATFORM=x86_64; SOPS_PLATFORM=x86_64 ;; \
        *) echo "Unsupported platform"; exit 1 ;; \
    esac; \
    # - aws-sam-cli
    SAM_FILE=aws-sam-cli-linux-${SAM_PLATFORM}.zip; \
    curl -sLO https://github.com/aws/aws-sam-cli/releases/download/${AWS_SAM_VERSION}/${SAM_FILE}; \
    unzip ${SAM_FILE} -d sam-installation >/dev/null; \
    rm ${SAM_FILE}; \
    sam-installation/install; \
    # - sops
    SOPS_FILE=sops-${SOPS_VERSION}.${SOPS_PLATFORM}.rpm; \
    curl -sLO https://github.com/getsops/sops/releases/download/v${SOPS_VERSION}/${SOPS_FILE}; \
    yum localinstall -y ${SOPS_FILE}; \
    rm ${SOPS_FILE}