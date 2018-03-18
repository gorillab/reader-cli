#!/usr/bin/env node

const chalk = require('chalk');
const yargs = require('yargs');
const fetch = require('node-fetch');
const prompts = require('prompts');
const opn = require('opn');

(async () => {
  const argv = yargs
  .usage('Usage: reader [options]')
  .alias('e', 'exit')
  .describe('e', 'Exit command')
  .help('h')
  .alias('h', 'help')
  .epilog('GitHub: https://github.com/gorillab/reader-cli')
  .argv;

  let { exit } = argv;

  const res = await fetch('https://5mins.fun/api/v1/posts', {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const posts = await res.json();

  console.log(`Today latest news:\n`);

  if (posts.length) {
    console.log(posts.map((post, index) => {
      return `${chalk.gray(index + 1)}. ${chalk.hex('#1293fe')(post.title)}${post.content ? `\n${chalk.gray(post.content)}` : ''}\n${chalk.gray.underline(post.url)}\n`;
    }).join('\n'));

    while (!exit) {
      await prompts({
        type: 'text',
        name: 'postNumber',
        message: '(Type `exit` to exit) Enter post number to read:',
      }, {
        onSubmit: (prompt, postNumber) => {
          try {
            if (postNumber === 'exit') {
              exit = true;
            }

            opn(posts[parseInt(postNumber) - 1].url);
          } catch (e) {}
        },
        onCancel: () => {
          exit = true;
        },
      });
    }

    process.exit();
  } else {
    console.log('No posts');
  }
})();
