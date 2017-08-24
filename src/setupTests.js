import MockDate from "mockdate";

MockDate.set(1434319925275);

global.localStorage = (function() {
  let store = {};

  return {
    getItem: function(key) {
      return store[key];
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    }
  };
})();
