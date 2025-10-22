const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://demo.baasic.com/angular/starterkit-photo-gallery',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
