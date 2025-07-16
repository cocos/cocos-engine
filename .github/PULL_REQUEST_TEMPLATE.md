Re: #

### Changelog

*

-------

### Continuous Integration

This pull request:

* [ ] needs automatic test cases check.
  > Manual trigger with `@cocos-robot run test cases` afterward.
* [ ] does not change any runtime related code or build configuration
  > If any reviewer thinks the CI checks are needed, please uncheck this option, then close and reopen the issue.

-------

### Compatibility Check

This pull request:

* [ ] changes public API, and have ensured backward compatibility with [deprecated features](https://github.com/cocos/cocos-engine/blob/v3.5.0/docs/contribution/deprecated-features.md).
* [ ] affects platform compatibility, e.g. system version, browser version, platform sdk version, platform toolchain, language version, hardware compatibility etc.
* [ ] affects file structure of the build package or build configuration which requires user project upgrade.
* [ ] **introduces breaking changes**, please list all changes, affected features and the scope of violation.

<!-- Note: Makes sure these boxes are checked before submitting your PR - thank you!
- [ ] Your pull request title is using English, it's precise and appropriate.
- [ ] If your pull request has gone "stale", you should **rebase** your work on top of the latest version of the upstream branch.
- [ ] If your commit history is full of small, unimportant commits (such as "fix pep8" or "update tests"), **squash** your commits down to a few, or one, discreet changesets before submitting a pull request.
- [ ] Document new code with comments in source code based on API docs
- [ ] Make sure any runtime log information in `log` , `error` or `new Error('')` has been moved into `EngineErrorMap.md` with an ID, and use `logID(id)` or `new Error(getError(id))` instead.
- To official teams:
  - [ ] Check that your PR is following our [guides](https://github.com/cocos/3d-tasks/blob/master/workflows/readme.md)
-->
