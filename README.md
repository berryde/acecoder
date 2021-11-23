# Individual project

An interactive platform for learning modern web development using javascript frameworks.

## Running the project

To run the project locally, install the dependencies with `yarn` and then start with `yarn run dev`.

## Storybook

Storybook is used for component development independent of the application itself. To start Storybook, run `yarn run storybook`. This will start a local Storybook server.

## Development tools

This project uses a variety of development tools for improved productivity and better software:

- Storybook
- TypeScript
- Tailwind CSS
- Svelte

> Created by deb1g19@soton.ac.uk

## GitLab Runner

A GitLab Runner instance is used on a docker container to run the CI/CD pipeline. Create the instance with the following command

```bash
docker run -d --name gitlab-runner --restart always \
     -v /srv/gitlab-runner/config:/etc/gitlab-runner \
     -v /var/run/docker.sock:/var/run/docker.sock \
     gitlab/gitlab-runner:latest
```

To interact with a running container, run `sudo docker exec -it gitlab-runner /bin/bash`.
