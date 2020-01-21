const VlSelect = require('../components/vl-select');
const { Page } = require('vl-ui-core');
const { Config } = require('vl-ui-core');

class VlSelectPage extends Page {
    async _getSelect(selector) {
        return new VlSelect(this.driver, selector);
    }

    async load() {
        await super.load(Config.baseUrl + '/demo/vl-select.html');
    }
}

module.exports = VlSelectPage;
