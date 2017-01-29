# Hack Cambridge 2017 - Recurse

Hack Cambridge Hackathon
**Team:** [Dalimil Hajek](https://github.com/dalimil), [Willy Dinata](https://github.com/whdinata), [Alice Grout-Smith](https://github.com/agroutsmith)

## Screenshots

<img src="https://github.com/Dalimil/Hack-Cambridge-2017/blob/master/docs/screenshots/web-connected.png" width="400">
<img src="https://github.com/Dalimil/Hack-Cambridge-2017/blob/master/docs/screenshots/web-disconnected.png" width="400">
<img src="https://github.com/Dalimil/Hack-Cambridge-2017/blob/master/docs/screenshots/bot-help.png" width="700">
<img alt="Dalimil - Hack Cambridge" src="https://github.com/Dalimil/Hack-Cambridge-2017/blob/master/docs/screenshots/user-dalimil.png" width="400">
<img alt="WHDinata - Hack Cambridge" src="https://github.com/Dalimil/Hack-Cambridge-2017/blob/master/docs/screenshots/user-whdinata.png" width="400">


## Setup

```sh
npm install -g yarn  # install yarn
yarn                 # install dependencies
```

## Run
Remember that there are two servers running - one controlling the bot, and another one doing user-data processing and authentication

```sh
yarn run bot         # Run bot server
yarn run deploy-bot  # Tunnel to get URL

# and in a separate terminal window
yarn run build-and-watch      # client JS bundling
```

## How to DEMO
1) Access web client & fill in usernames & GitHub OAuth & Save
2) Go to Slack - list people looking for a team and switch your team flag on
3) Show someones profile and then show 'my-profile'
