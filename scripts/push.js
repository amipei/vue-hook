const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const dayjs = require('dayjs');

const baseRoot = path.resolve(__dirname, '..');
const baseGit = path.resolve(baseRoot, '.git');

const hasGit = (() => {
  try {
    return fs.statSync(baseGit).isDirectory();
  } catch (error) {
    return false;
  }
})();

const now = dayjs();
const branchName = `script/${now.format('YYYY-MM-DD_HH_mm')}`;

const commands = [
  ...(hasGit
    ? []
    : [
        'git init',
        'git remote add origin git@github.com:amipei/vue-hook.git',
        `git checkout -b ${branchName}`,
      ]),
  'git add .',
  `git commit -m "script: ${now.format('YYYY-MM-DD HH:mm:ss')}" -n`,
  'git pull origin master --allow-unrelated-histories',
  `git push origin HEAD:${branchName}`,
];

exec(
  commands.join(' && '),
  {
    cwd: baseRoot,
  },
  (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      console.log('Error:\n', stderr);
    } else {
      console.log(stdout);
      console.log('\n', stderr);
      exec(`rm -r ${baseGit}`);
    }
  },
);