const Path = require('path-parser');
const { URL } = require('url');
const _ = require('lodash');

module.exports = app => {
  app.post('/api/survey/webhooks', (req, res) => {
    const event = _.map(req.body, ({ email, url }) => {
      const pathname = new URL(url).pathname;
      const p = new Path('/api/surveys/:surveyID/:choice');
      const match = p.test(pathname);
      if (match)
        return {
          email: email,
          surveyID: match.surveyID,
          choice: match.choice
        };
    });
  });
};
