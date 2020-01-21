
const { assert, driver } = require('vl-ui-core').Test;
const VlSelectPage = require('./pages/vl-select.page');

describe('vl-select', async () => {
    const vlSelectPage = new VlSelectPage(driver);

    before(() => {
        vlButtonPage.load();
    });

});
