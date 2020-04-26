#! /usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')

program
  .version(pkg.version)
  .command('configure', 'configure Twitter-Related credentials')
  .parse(process.argv)
