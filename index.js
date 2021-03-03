const fs = require('fs');
const scrapeIt = require('scrape-it');
// const { githubToken } = require('./config');
const jsonexport = require('jsonexport');
const CONSTANTS = require('./constants');
const {
  delay,
  getScoreFromLabels,
  getAllIssuesOfRepository,
  getAllPullRequestsOfRepository,
  getIssuesWithCrosswocLabel,
} = require('./helper');

const ultimateContributors = {};
const addInMap = (id, score) => {
  if (ultimateContributors[id]) {
    ultimateContributors[id] += score;
  } else {
    ultimateContributors[id] = score;
  }
};

// for a single repo
const app = async (repoOwner, repoName) => {
  const listOfAllIssues = await getAllIssuesOfRepository(repoOwner, repoName);
  const listOfAllPullRequests = await getAllPullRequestsOfRepository(
    repoOwner,
    repoName
  );

  const listOfCrosswocIssues = getIssuesWithCrosswocLabel(listOfAllIssues);
  const filteredPullRequestData = getFilteredPRData(listOfAllPullRequests);
  
  console.log(
    listOfAllIssues.length,
    '\n \n \n \n',
    listOfCrosswocIssues.length,
    '\n \n \n \n',
    filteredPullRequestData.length
  );

  // todo: for all PRs
  const { data, response } = await scrapeIt(
    'https://github.com/proRamLOGO/quantum-algorithms/pull/28',
    {
      linkedName: '.my-1',
    }
  );
  // console.log(`Status Code: ${response.statusCode}`);
  console.log(data.linkedName);

  if (data.linkedName) {
  }
};

const start = async () => {
  CONSTANTS.listOfReposAndOwners.forEach(async (item) => {
    await delay(1000);
    await app(item.ownerName, item.repoName);
  });

  // setTimeout(() => {
  //   console.log(
  //     '\n\n\n\n\n\n\n\n\n ultimateContributors: \n',
  //     ultimateContributors
  //   );

  //   // jsonexport(ultimateContributors, function (err, csv) {
  //   //   if (err) return console.error(err);
  //   //   console.log(csv);

  //   //   fs.writeFile('./contributors.csv', csv, (err) => console.error(err));
  //   // });
  // }, 1000 * 30 * 1);
};

start();

// filteredLabelsOfIssues.forEach(async (issue) => {
//   if (issue && issue.pull_request) {
//     const labelsss = issue.labels;
//     const score = getScoreFromLabels(issue.labels);
//     const PRnum = issue.pull_request.url.split('pulls')[1].slice(1);

//     let prResponse;
//     try {
//       prResponse = await octokit.request(
//         'GET /repos/{owner}/{repo}/pulls/{pull_number}',
//         {
//           owner: repoOwner,
//           repo: repoName,
//           pull_number: PRnum,
//         }
//       );
//     } catch (err) {
//       console.log(err);
//     }

//     console.log('\n\npr res: \n\n\n', prResponse)
//     if (
//       prResponse &&
//       prResponse.data.state === 'closed' &&
//       !prResponse.data.user.site_admin
//     ) {
//       const userGitID = prResponse.data.user.login;
//       addInMap(userGitID, score);
//       console.log(userGitID, score);
//     }
//   }
// });
