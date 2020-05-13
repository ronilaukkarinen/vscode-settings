# How to contribute to `html-validate`

Thank you for taking your time to contribute to `html-validate`. :heart:

Before making a source-code modification, please first discuss the change you
wish to make via issue, email, or any other method with the owner of this
repository before making a change.

[issue-list]: https://gitlab.com/html-validate/html-validate/issues
[issue-new-bug]: https://gitlab.com/html-validate/html-validate/issues/new?issuable_template=Bug
[issue-new-feature]: https://gitlab.com/html-validate/html-validate/issues/new?issuable_template=Feature%20request

## Did you find a bug?

Before creating but reports be sure to check the [list of open
issues][issue-list] first to avoid adding duplicated issues.

If no similar issue exists you can [add a new bug issue][issue-new-bug].

Next try to collect as much information as possible:

- A reduced test-case showing the issue.
- The configuration used, either use `--print-config` to show the exact
  configuration or the content of `.htmlvalidate.json`.
- Version of `html-validate` and any plugins used.
- Details of expected and actual result. What did you expect and what happened
  instead?

## Do you have a feature request or enhancement suggestion?

Before creating but reports be sure to check the [list of open
issues][issue-list] first to avoid adding duplicated issues.

If no similar issue exists you can [add a new feature
request][issue-new-feature].

When adding a new feature request be verbose and specific:

- What are the use cases?
- Who will benefit from it?
- Can it be solved another way, e.g. with a plugin?

## Do you want to submit a merge request?

Great! Much appreciated! :heart:

Some guidelines:

- Make sure that an issue describing the bug/feature/suggestion exists first.
- Mention the issue in the MR and/or relevant commits, preferably using the
  "Fixes #123" syntax.
- Prefer to use one of the merge request templates.

Merge requests with a failing pipeline will **not** be merged.

As for the code itself:

- The code is autoformatted using [Prettier](https://prettier.io/)
- Make sure to add tests covering your changes
- Update `CHANGELOG.md` and if needed the documentation.
- Keep the merge history cleaned, it is ok for a WIP MR to have temporary
  commits but clean it using rebase before dropping the WIP flag.
- Branches must apply cleanly over the `master` branch.

## Do you want to contribute to the documentation?

Perfect! :tada:

You can either use the "Edit this page" buttons on the
[homepage](https://html-validate.org) or just create a new branch + merge
request manually.

## Do you have questions about the source code or the project?

Feel free to contact the owner, see [contact
info](https://html-validate.org/about).

---

_Thank you for your contribution!_
