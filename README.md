[![Stories in Ready](https://badge.waffle.io/MakerDAO/weekly-mkr-auction.png?label=ready&title=Ready)](https://waffle.io/MakerDAO/weekly-mkr-auction)

"Weekly MKR Auction" is a simple frontend for the [Token Auction project](https://github.com/MakerDAO/token-auction). The project is aimed at weekly auctions to sell MKR.

This has a few benefits:

* Contained project. Just implement the forward auction at first.
* Low system risk. Only smallish amount of MKR goes in each week (we are guessing 50-100MKR).
* Field test the auction contract. Despite low system risk there is still an incentive to try and break the contract.
* Easy to upgrade. Can switch the contract on weekly auction expiry (we expect there to be backend changes as we integrate with Maker).
* Work out ui snags before working on the 'real' Maker liquidation auctions.
* Presents a target for a keeper task. This can be written afterward as a demo of linking the market and auctions.

The auction would have a single beneficiary: the Maker fund.

## Overview

This dapp uses [Meteor](https://www.meteor.com/) as a frontend and the contract can be deployed/tested with [dapp](https://github.com/dapphub/dapp).

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

Meteor has to be started with `npm run start` in order to include the settings.json file

You can access the user interface on [http://localhost:3000/](http://localhost:3000/)

To deploy the frontend to Github Pages:

```bash
gulp deploy
```

The deployed frontend can be found at: [http://makerdao.com/token-auction-gui/](http://makerdao.com/token-auction-gui/)

## Development

This project uses the [AirBnB style guide](https://github.com/airbnb/javascript) for coding standard guidelines.
We use [ESLint](http://eslint.org/docs/user-guide/getting-started) to automatically check for common code problems or style errors.
There's an eslintConfig section in frontend/package.json for the configuration of ESLint.
You can run the linter with:

```bash
cd frontend
meteor npm run lint
``` 
