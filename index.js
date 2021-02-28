import { Octokit } from '@octokit/core';
import { githubToken } from './config';

const app = async () => {
  const octokit = new Octokit({
    auth: githubToken,
  });

  const response = await octokit.request('GET /orgs/{org}/repos', {
    org: 'octokit',
    type: 'private',
  });

  console.log(response);
};

app();
