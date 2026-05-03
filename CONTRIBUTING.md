# Contributing to fjorm

Thanks for your interest in contributing!

## Development setup

```bash
git clone https://github.com/WEeziel172/fjorm.git
cd fjorm
yarn install
```

Start the dev build in watch mode:

```bash
yarn dev
```

## Branching

Create feature branches off `main`. Use a descriptive name:

```bash
git checkout -b feat/my-feature
git checkout -b fix/my-bugfix
```

## Commit conventions

This project uses [semantic-release](https://github.com/semantic-release/semantic-release). All commits must follow [conventional commits](https://www.conventionalcommits.org/):

- `feat:` — new feature (triggers a minor release)
- `fix:` — bug fix (triggers a patch release)
- `chore:` — build, deps, CI, or tooling changes
- `docs:` — documentation only
- `refactor:` — code changes that neither fix a bug nor add a feature
- `test:` — adding or updating tests

Breaking changes: add `!` after the type (e.g. `feat!:`) or include `BREAKING CHANGE:` in the body.

## Testing

Tests use [vitest](https://vitest.dev/) with jsdom and [Testing Library](https://testing-library.com/).

```bash
yarn test              # run all tests once
yarn test:watch        # watch mode
```

Tests live in `tests/unit/` mirroring the `src/` structure.

## Linting & formatting

```bash
yarn lint             # eslint
yarn format           # prettier --write
```

CI enforces both. Run them before opening a PR.

## Pull requests

- Keep PRs focused on a single change
- Make sure `yarn test` and `yarn lint` pass
- Follow the existing code style (Prettier defaults — no semicolons, single quotes, trailing commas)
- Explain the *why* in the PR description, not just the *what*

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
