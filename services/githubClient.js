const { Octokit } = require("@octokit/core");

const {
    GETHUBTOKEN,
    REPOSITORY,
    OWNER
} = require('../config');

const octokit = new Octokit({
    auth: GETHUBTOKEN
});

module.exports = class GithubClient {
    static GetOpenPulls = async () => {
        const result = await octokit.request('GET /repos/{owner}/{repo}/pulls?per_page=100', { owner: OWNER, repo: REPOSITORY });
        return result.data.map(pull => {
            return { number: pull.number, labels: pull.labels.map(label => label.name) }
        });
    };

    static GetPull = async (pullNumber) => {
        try {
            const result = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
                owner: OWNER,
                repo: REPOSITORY,
                pull_number: pullNumber
            });
            return { number: result.data.number, labels: result.data.labels.map(label => label.name) };
        } catch (err) {
            return { status: err.status };
        }
    };
}
