[![Stories in Ready](https://badge.waffle.io/MakerDAO/token-auction-gui.png?label=ready&title=Ready)](https://waffle.io/MakerDAO/token-auction-gui)

"Token Auction GUI" is a simple frontend for the [Token Auction project](https://github.com/MakerDAO/token-auction).

It is a basic, read-only frontend that displays all auctions and auctionlets present on a specified AuctionManager. The list is updated in real-time. There is no bidding, claiming functionality etc.

## Overview

This dapp uses [Meteor](https://www.meteor.com/).

## Installation

Requirements:

* meteor `curl https://install.meteor.com/ | sh`
* Global meteor-build-client, `npm install -g meteor-build-client`

Clone and install:

```bash
git clone https://github.com/makerdao/token-auction-gui
cd token-auction-gui
npm install
gulp build
```

## Usage

```bash
cd frontend && npm run start
```

You can access the user interface on [http://localhost:3000/](http://localhost:3000/)

To deploy the frontend to Github Pages:

```bash
gulp deploy
```

The deployed frontend can be found at: [http://makerdao.com/token-auction-gui/](http://makerdao.com/token-auction-gui/).
There is also a test instance maintained by @reverendus deployed at [http://token-auction-gui.surge.sh/](http://token-auction-gui.surge.sh/).

## Development

This project uses the [AirBnB style guide](https://github.com/airbnb/javascript) for coding standard guidelines.
We use [ESLint](http://eslint.org/docs/user-guide/getting-started) to automatically check for common code problems or style errors.
There's an eslintConfig section in `frontend/package.json` for the configuration of ESLint.
You can run the linter with:

```bash
cd frontend
meteor npm run lint
``` 
