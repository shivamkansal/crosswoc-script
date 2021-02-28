const { Octokit } = require('@octokit/core');
// a2d642bcae8d47bd1cb23dc2cf954d7809c8da8f

const app = async () => {
  const octokit = new Octokit({
    auth: `a2d642bcae8d47bd1cb23dc2cf954d7809c8da8f`,
  });

  const response = await octokit.request('GET /orgs/{org}/repos', {
    org: 'octokit',
    type: 'private',
  });

  console.log(response);
};

app();
