[![Stories in Ready](https://badge.waffle.io/MakerDAO/weekly-mkr-auction.png?label=ready&title=Ready)](https://waffle.io/MakerDAO/weekly-mkr-auction)
This is a simple frontend for the [Token Auction project](https://github.com/MakerDAO/token-auction). The project is aimed at weekly auctions to sell MKR. 

## Overview

This dapp uses Meteor as a frontend and the contract can be deployed/tested with dapple.

## Installation

Requirements:

* geth `brew install ethereum` (or [`apt-get` for ubuntu](https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Ubuntu))
* solidity https://solidity.readthedocs.org/en/latest/installing-solidity.html
* meteor `curl https://install.meteor.com/ | sh`
* Global dapple, `npm install -g dapple meteor-build-client`

Clone and install:

```bash
git clone https://github.com/makerdao/weekly-mkr-auction
cd weekly-mkr-auction
git submodule update --init --recursive
npm install
gulp build
```

## Usage

```bash
cd frontend && npm run start
```

Meteor has to be started with npm run start in order to include the settings.json file

You can access the user interface on [http://localhost:3000/](http://localhost:3000/)

To deploy the frontend to Github Pages:

```bash
gulp deploy
```

The deployed frontend can be found at: [http://makerdao.github.io/weekly-mkr-auction/](http://makerdao.github.io/weekly-mkr-auction/)