module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "mocha": true,
    },
    "extends": [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:promise/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react", "promise"
    ],
    "rules": {
        //"indent": [ "error", 2, ],
        "linebreak-style": [ "error", "unix" ],
        "semi": [ "error", "always" ],
        "react/jsx-indent-props": [ "error", "first" ],
        "react/jsx-indent":[ "error", 2]
    }
};
