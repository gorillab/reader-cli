#!/usr/bin/env node

const yargs = require('yargs');
const fetch = require('node-fetch');
const prompts = require('prompts');
const opn = require('opn');

(async () => {
  const argv = yargs
  .usage('Usage: $0 <command> [options]')
  .example('$0')
  .alias('e', 'end')
  .string('e')
  .describe('e', 'End command')
  .help('h')
  .alias('h', 'help')
  .epilog('GitHub https://github.com/gorillab/reader-cli')
  .argv;

  const top = argv._[0] || 10;
  const { end } = argv;

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
      return `${index + 1}. ${post.title}\n${post.content ? `${post.content}\n` : ''}`
    }).join('\n'));

    let exit = false;
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
