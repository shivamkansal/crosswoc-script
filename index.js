const { Octokit } = require('@octokit/core');
const fs = require('fs');
const scrapeIt = require('scrape-it');
// const { githubToken } = require('./config');
const jsonexport = require('jsonexport');
const ultimateContributors = {};

const validLabels = [
  'crosswoc',
  'cwoc',
  'cross woc',
  'cross_woc',
  'cross-woc',
  'c-woc',
  'c woc',
  'c_woc',
];

const octokit = new Octokit({
  auth: 'b3b4ece495c418c21e18f3fbdf475be40be0e986',
});

const addInMap = (id, score) => {
  if (ultimateContributors[id]) {
    ultimateContributors[id] += score;
  } else {
    ultimateContributors[id] = score;
  }
};

// for a single repo
const app = async (repoOwner, repoName) => {
  // get all issues
  let listOfAllIssues = [];
  let fetch = true;
  let i = 1;
  while (fetch) {
    let response;
    try {
      response = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
        owner: repoOwner,
        repo: repoName,
        state: 'all',
        per_page: 50,
        // labels: 'CrossWoC,crosswoc,cwoc,cross woc',
        page: i,
      });
    } catch (err) {
      console.log('Error: ', err);
    }

    // prevent faltu api call on error
    if (response && response.status !== 200) {
      fetch = false;
    }

    if (
      response &&
      response.status === 200 &&
      response.data &&
      response.data.length === 0
    ) {
      fetch = false;
    }

    if (response) {
      listOfAllIssues.push(...response.data);
    }

    i++;
  }

  // check label crosswoc in all issues
  const filteredLabelsOfIssues = [];
  listOfAllIssues.forEach((issue) => {
    if (issue && issue.labels) {
      issue.labels.forEach((label) => {
        if (validLabels.includes(label.name.toLowerCase())) {
          filteredLabelsOfIssues.push(issue);
        }
      });
    }
  });

  const pullRequestData = filteredLabelsOfIssues.map((i) => ({
    name: i.title,
    status: i.state,
    labels: i.labels,
    htmlUrl: filteredLabelsOfIssues[0]._links.html.href,
  }));
  // if PR exists
  console.log(
    // filteredLabelsOfIssues,
    '\n\n\n\n',
    pullRequestData.length
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
};

const getScoreFromLabels = (labels) => {
  let score = 0;
  for (let i = 0; i < labels.length; i++) {
    const labelName = labels[i].name.toLowerCase();
    if (
      labelName.includes(
        '50',
        'good first issue',
        'good',
        'first',
        'good_first_issue',
        'good-first-issue'
      )
    ) {
      score += 50;
      break;
    } else if (labelName.includes('easy') || labelName.includes('100')) {
      score += 100;
      break;
    } else if (labelName.includes('medium') || labelName.includes('200')) {
      score += 200;
      break;
    } else if (labelName.includes('hard') || labelName.includes('500')) {
      score += 500;
      break;
    } else {
      score += 0;
    }
  }

  return score;
};

const list = [
  // { repoName: 'Face-X', ownerName: 'akshitagupta15june' },
  // { repoName: 'kanban', ownerName: 'kunalkashyap855' },
  // { repoName: 'awesome-portfolio-websites', ownerName: 'smaranjitghose' },
  // { repoName: 'DocLense', ownerName: 'smaranjitghose' },
  // { repoName: 'doc2pen', ownerName: 'smaranjitghose' },
  // { repoName: 'img_ai_app_boilerplate', ownerName: 'smaranjitghose' },
  // { repoName: 'ArtCV', ownerName: 'smaranjitghose' },
  // { repoName: 'GitKundli', ownerName: 'smaranjitghose' },
  // { repoName: 'Rotten-Scripts', ownerName: 'HarshCasper' },
  // { repoName: 'GirlMeetup', ownerName: 'chehak123' },
  // { repoName: 'College-Library-Website', ownerName: 'urvashi-code1255' },
  // { repoName: 'Red-Hat-Mobil-App', ownerName: 'vilsi12' },
  // { repoName: 'Flutter-Tutorial-App', ownerName: 'infiniteoverflow' },
  // { repoName: 'CollegeAada', ownerName: 'Tejas1510' },
  // { repoName: 'Data-Structure-and-Algorithms', ownerName: 'Nivedita967' },
  // { repoName: 'Rudra', ownerName: 'Harshal0902' },
  // { repoName: 'Care4ther-', ownerName: 'unnati914' },
  // { repoName: 'IntrepidKey', ownerName: 'syedmazharaliraza' },
  // { repoName: 'MobiMart', ownerName: 'kavania2002' },
  // { repoName: 'KnowYourDonor', ownerName: 'arteevraina' },
  // { repoName: 'AshTech-AI_Personal_Voice_Assistant', ownerName: 'Ash515' },
  // { repoName: 'TextAnalyzer', ownerName: 'rockingrohit9639' },
  // { repoName: 'link-manager', ownerName: 'GP-Kulam' },
  // { repoName: 'GRAMtsy', ownerName: 'LOGOInd' },
  { repoName: 'quantum-algorithms', ownerName: 'proRamLOGO' },
  // { repoName: 'PICTOR', ownerName: 'NandeeshG' },
  // { repoName: 'UniVendor', ownerName: 'JINDAL-JJ' },
  // { repoName: 'DSA-guide', ownerName: 'ankitapuri' },
  // { repoName: 'easy-education', ownerName: 'luckykumarirai' },
  // { repoName: 'easy-job-intern', ownerName: 'pankajkumarbij' },
  // { repoName: 'SheHeroes', ownerName: 'shagun25' },
  // { repoName: 'chatte-R', ownerName: 'ridsuteri' },
  // { repoName: 'Awesome-JavaScript-Projects', ownerName: 'Vishal-raj-1' },
  // { repoName: 'DConsole', ownerName: 'RAJAGOPALAN-GANGADHARAN' },
  // { repoName: 'JS-OS', ownerName: 'RAJAGOPALAN-GANGADHARAN' },
  // { repoName: 'Terrorism-Analysis-with-Insights', ownerName: 'sahilrahman12' },
  // { repoName: 'drowsiness-detection', ownerName: 'dhrubajyoti89' },
  // { repoName: 'online-food-ordering-system', ownerName: 'prakharshreyash15' },
  // { repoName: 'College-Community', ownerName: 'ritwikranjan' },
  // { repoName: 'AutomateInstaPyBot', ownerName: 'harikanani' },
  // { repoName: 'Walmart-Sales-Prediction', ownerName: 'Starkultra' },
  // { repoName: 'OpenSourceEvents-Frontend', ownerName: 'Catalyst-IN' },
];

const delay = () => new Promise((resolve) => setTimeout(resolve, 1000));

const start = async () => {
  list.forEach(async (item) => {
    await delay();
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
// list of all repo with owner

// get all issues DONE
// check label crosswoc DONE
// status close DONE
// pr exists DONE
// pr closed DONE
//  get label
//  calc score
//  push in final obj
