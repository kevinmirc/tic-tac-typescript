module.exports = {
    "roots": [
        "<rootDir>/src",
        "<rootDir>/examples"
    ],
    testMatch: [
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
        "^.+\\.(ts|tsx)?$": "ts-jest"
    },
};
