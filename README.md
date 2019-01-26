[![Build Status](https://travis-ci.org/brndnmtthws/rust-react-typescript-demo.svg?branch=master)](https://travis-ci.org/brndnmtthws/rust-react-typescript-demo) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=brndnmtthws/rust-react-typescript-demo)](https://dependabot.com)


# rust-react-typescript-demo

This repository contains demo code for my YouTube programming learning series about [Rust](https://www.rust-lang.org/), [React](https://reactjs.org/), and [TypeScript](https://www.typescriptlang.org/).

You can find the videos on YouTube below:

- [📽 Part 1](https://youtu.be/-DNF8qkJ0ws)
- [📽 Part 2](https://youtu.be/aRpUbu2wTiA)
- [📽 Part 3](https://youtu.be/GinLXQVqJM4)
- [📽 Part 4](https://youtu.be/daHmhL1UCIs)

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

### Bulding the Backend Server

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
