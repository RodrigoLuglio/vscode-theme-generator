# Contributing to VSCode Theme Generator

First off, thank you for considering contributing to VSCode Theme Generator! It's people like you that make this project such a great tool. We welcome contributions from everyone, regardless of their experience level.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [How Can I Contribute?](#how-can-i-contribute)
4. [Style Guidelines](#style-guidelines)
5. [Commit Messages](#commit-messages)
6. [Pull Requests](#pull-requests)
7. [Development Setup](#development-setup)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [project_email@example.com].

## Getting Started

- Make sure you have a [GitHub account](https://github.com/signup/free)
- Fork the repository on GitHub
- Clone your fork locally
- Set up the development environment as described in the [Development Setup](#development-setup) section

## How Can I Contribute?

### Reporting Bugs

- Ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/RodrigoLuglio/vscode-theme-generator/issues)
- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/RodrigoLuglio/vscode-theme-generator/issues/new)

### Suggesting Enhancements

- Open a new issue with a clear title and detailed description
- Provide any relevant examples or mock-ups

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code lints
5. Issue that pull request!

## Style Guidelines

### JavaScript/TypeScript Style Guide

We use [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to enforce a consistent coding style. Please make sure your code adheres to these guidelines:

- Use 2 spaces for indentation
- Use single quotes for strings
- No unused variables
- No semicolons

### CSS Style Guide

- Use CSS modules for component-specific styles
- Follow BEM naming convention for class names

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## Pull Requests

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build
2. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters
3. Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you

## Development Setup

1. Install [Node.js](https://nodejs.org/) (version 14 or later)
2. Install [Bun](https://bun.sh/) for faster package management and builds
3. Clone your fork of the repository
4. Navigate to the project directory
5. Run `bun install` to install dependencies
6. Run `bun run dev` to start the development server

### Useful Commands

- `bun run dev`: Start the development server
- `bun run build`: Build the project for production
- `bun run lint`: Run ESLint to check for code style issues
- `bun run test`: Run the test suite

Thank you for your contributions!
