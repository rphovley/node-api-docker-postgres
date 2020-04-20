yarn --production=true # install dependencies
gulp compilejs # compile project
docker build -t registry.gitlab.com/rphovley-templates/node-api-gckubernetes-tenancy .
docker push registry.gitlab.com/rphovley-templates/node-api-gckubernetes-tenancy