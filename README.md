# Microcuke

[![Join the chat at https://gitter.im/cucumber/gherkin3](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/cucumber/microcuke?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/cucumber/microcuke.png)](https://travis-ci.org/cucumber/microcuke)

Microcuke is a tiny Cucumber implementation in 500 SLOC, based on
[Gherkin3](https://github.com/cucumber/gherkin3). It's got 100% unit test coverage.

The sole purpose of microcuke is to provide a very simple reference implementation that
can be ported to a new programming language in a few days. Think of it as an aid to
developers who wish to implement Cucumber for a new programming language.

Microcuke is written in classic JavaScript (ES5), because that's a language most
programmers can at least read. The source code is not heavily documented -
we aim to write self-explanatory, simple code instead. If you find something
hard to understand, that's a bug! Feel free to open a bug report.

Most of Microcuke is written in synchronous JavaScript (for readability), but there are
some parts that are asynchronous (using promises and callbacks). These constructs are
fairly JavaScript-specific, so if you are using microcuke as a guid to write a Cucumber
implementation for a new language, you should probably translate that code to simple synchronous code.

Here is a high level class diagram to give you an idea:

![](https://github.com/cucumber/microcuke/blob/master/docs/classes.png)

## Try it out

First, you need to install [Node.js](https://nodejs.org).
Once you've done that you must install the libraries that microcuke depends on.

    npm install

Now let's take it for a spin:

    ./bin/cucumber

This will run the features under the `features` directory.
