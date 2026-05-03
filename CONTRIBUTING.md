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

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) with the default Angular preset. All commits must follow [conventional commits](https://www.conventionalcommits.org/).

### Types that trigger npm releases

| Type | Version bump | When to use |
|------|-------------|-------------|
| `feat:` | Minor | New feature in the **library package** (new API, new component, new hook) |
| `fix:` | Patch | Bug fix in the **library package** |
| `perf:` | Patch | Performance improvement in the **library package** |

Breaking changes: add `!` after the type (e.g. `feat!:`) or include `BREAKING CHANGE:` in the body.

### Types that do NOT trigger releases

Use these for changes that don't affect the npm package:

| Type | When to use |
|------|-------------|
| `ci:` | CI/CD workflows, GitHub Actions, deployment scripts |
| `chore:` | Build tooling, dependency updates, repo config |
| `docs:` | Documentation, website, README, CLAUDE.md |
| `style:` | Formatting, whitespace (no logic changes) |
| `refactor:` | Code restructuring that doesn't change behavior or API |
| `test:` | Adding or updating tests |

**Key rule:** If your change doesn't affect the code someone installs from npm, it should NOT trigger a release. Use `ci:`, `chore:`, or `docs:` instead of `feat:` or `fix:`.

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
