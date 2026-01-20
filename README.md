# attendance-appsscript

This repo contains code that can be used with Google Sheets and Google Forms to track attendance. It is written in TypeScript, uses Apps Script, and is deployed using `clasp`. 

- Source TypeScript lives in `src/`
- Compiled JavaScript is generated locally and pushed to Apps Script via `clasp`
- This repo is intended for local development + CI-based deployment, not ad-hoc pushes to prod

## Prerequisites

Before you start, make sure you have:

- Node.js (LTS recommended)
- npm
- Google account with access to Apps Script
- clasp installed globally and authenticated

Install / authenticate (macOS):
```bash
# install clasp if needed
npm install -g @google/clasp

# install project deps
npm install

# optional: install Apps Script typings for TS support
npm install --save-dev @types/google-apps-script

# login to Google for clasp (opens browser)
clasp login
```

## Apps Script Structure

Repository layout (relevant files)
- .clasp.json — clasp config: contains scriptId and rootDir (where compiled JS is pushed).
- src/ — TypeScript source (what you edit):
  - src/Menu.ts — menu / onOpen handler used by the sheet UI.
  - src/Code.ts — example script functions called from the sheet.
  - src/appsscript.json — Apps Script manifest (project settings, scopes, triggers).
- .github/workflows/ — CI that runs build/tests and deploys from main.

## Push to Apps Script (maintainers only)

You can test by pushing to your own Apps Script Project or the dev Apps Script Project. Details about how to link your Apps Script Project are in a below section. 

```bash
# push compiled JS to the Apps Script project referenced by .clasp.json
clasp push

# open the Apps Script editor to verify
open "https://script.google.com/d/$(jq -r '.scriptId' .clasp.json)/edit"
```

## Deployment notes

- Deployments are managed through Github workflows
- Merging to main will trigger a deployment to the dev Apps Script Project
- To deploy to the prod Apps Script Project, manually run the workflow. 

## Linking to your Apps Script

If you don't already have an Apps Script project for this work, create one and take note of the script ID (in Apps Script → Project settings). This repo has specific Apps Script Projects it uses in vars.

This repo expects `.clasp.json` to point to the Apps Script project you will deploy to. Example `.clasp.json`:
```json
{
  "scriptId": "ENTER_YOUR_SCRIPT_ID_HERE",
  "rootDir": "src"
}
```

Ways to set it:
- Edit `.clasp.json` and replace the `scriptId` with your project's ID.
- Or run (creates .clasp.json by cloning an existing project):
```bash
clasp clone YOUR_SCRIPT_ID
```

Verify `rootDir` matches where TypeScript emits JS (default here is `src`). 

If the clasp credentials for the Github workflow stop working, you can run `cat ~/.clasprc.json` to get them again. 

## Troubleshooting

- If `clasp push` returns unexpected files missing, ensure `npm run build` created files in the `rootDir` and that `.clasp.json` `rootDir` matches.

## Development roadmap

- add triggers through apps script
- add more validation
- refactor corrections
- add function to request email with summary of hours
