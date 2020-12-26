[![Node.js CI](https://github.com/brndnmtthws/rust-react-typescript-demo/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/brndnmtthws/rust-react-typescript-demo/actions?query=workflow%3A%22Node.js+CI%22) [![Rust](https://github.com/brndnmtthws/rust-react-typescript-demo/workflows/Rust/badge.svg?branch=master)](https://github.com/brndnmtthws/rust-react-typescript-demo/actions?query=workflow%3ARust) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=brndnmtthws/rust-react-typescript-demo)](https://dependabot.com)

# rust-react-typescript-demo

This repository contains demo code for my YouTube programming learning series about [Rust](https://www.rust-lang.org/), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Docker](https://docs.docker.com/install/), [Terraform](https://www.terraform.io/) and [Kubernetes](https://kubernetes.io/). For this project, we're creating **foodi**, a meal logging tool.

This project is intended to serve as an example, and can be used as boilerplate
for starting your own project. You can also watch the videos to learn more
about how it was built (mostly trial and error, like a lot of things in life
😀).

If you'd like to learn more, check out my other projects:

- [📹 Subscribe to my YouTube channel](https://www.youtube.com/c/BrendenMatthews/live), or
- [🎮 follow me on Twitch](https://www.twitch.tv/letsmakestuff)

This repo has the following features:

- [Rust](https://www.rust-lang.org/), [Rocket](https://rocket.rs/), & [Diesel](http://diesel.rs/) based backend
- [React](https://reactjs.org/), [Mobx](https://mobx.js.org/), and [TypeScript](https://www.typescriptlang.org/) based frontend
- [Parcel](https://parceljs.org/) for frontend packaging
- [Docker](https://docs.docker.com/install/) image with frontend & backend all-in-one
- [Terraform](https://www.terraform.io/) for managing a [GKE](https://cloud.google.com/kubernetes-engine/) cluster on [GCP](https://cloud.google.com/)
- [Kubernetes](https://kubernetes.io/) manifest for running on GKE

You can find the videos on YouTube below:

- [📽 Part 1](https://youtu.be/-DNF8qkJ0ws)
- [📽 Part 2](https://youtu.be/aRpUbu2wTiA)
- [📽 Part 3](https://youtu.be/GinLXQVqJM4)
- [📽 Part 4](https://youtu.be/daHmhL1UCIs)
- [📽 Part 5](https://youtu.be/xWf3VyThZJY)
- [📽 Part 6](https://youtu.be/KhuZb5mF7C0)
- [📽 Part 7](https://youtu.be/AOTswOoetjU)

In the series, we're building **foodi**, a web-based meal logger/tracking tool.

## Compiling the Rust Backend Server

To build the Rust backend, you will need to install the Rust nightly build
with rustup. First, go to [https://rustup.rs/](https://rustup.rs/) and
install rustup. Then, install Rust nightly:

```ShellSession
$ rustup default nightly
...
```

Once you have the nightly build installed, you can build the backend.

### Build the Backend

```ShellSession
$ cd foodi-backend
$ cargo build
...
```

### Run the Database Migration Scripts

To create the initial database schema, run the migration scripts using
`diesel`:

```ShellSession
$ cargo install diesel_cli --no-default-features --features sqlite
...
$ diesel migration run --database-url database.sqlite
...
```

### Building the Backend Server

Lastly, you can now run the backend server:

```ShellSession
$ cargo run
```

## Running the Frontend Server

To build and run the frontend assets and server, you will need a recent
version of [Node.js]() and [Yarn](https://yarnpkg.com/en/) installed. Using homebrew on macOS, you can
install it with homebrew:

```ShellSession
$ brew install yarn
...
```

### Install package dependencies

Install the frontend package dependencies using Yarn:

```ShellSession
$ cd foodi-frontend
$ yarn install
...
```

### Run the Frontend Server

Use `parcel` to run the frontend development server:

```ShellSession
$ parcel index.html
...
```

## Build and run the Docker image

Assuming you have Docker installed, run the build command from the top level of the repo:

```ShellSession
$ docker build . -t foodi:latest
...
```

Once the build completes, run the container, and map port 80 from inside the container to outside the container on port 8080 (on your host machine):

```ShellSession
$ docker run -p 8080:80 foodi:latest
...
```

🎉 Now you can open `http://localhost:8080/` in your browser and test the app.
