const { VlElement } = require('vl-ui-core').Test;
const { By } = require('selenium-webdriver');

class VlSelect extends VlElement {
    async _getDressedContainer() {
        return this.findElement(By.xpath('../..'));
    }

    async _getSelectList() {
        return (await this._getDressedContainer()).findElement(By.css('.vl-select__list'));
    }

    async _getInput() {
        return (await this._getSelectList()).findElement(By.css('.vl-input-field'));
    }

    async _isOpen() {
        const container = await this._getDressedContainer();
        return container.hasClass('is-open');
    }

    async _getSelectParent() {
        return this.findElement(By.xpath('..'));
    }

    async _getDeleteButton() {
        const parent = await this._getSelectParent();
        return parent.findElement(By.css('button.vl-pill__close'));
    }

    async _getOptions() {
        if (await this.isDressed()) {
            const selectList = await this._getSelectList();
            return selectList.findElements(By.css('.vl-select__item'));
        } else {
            return this.findElements(By.css('option'));
        }
    }

    async _mapDressedOptions(options) {
        return Promise.all(options.map(async (selectItem) => {
            const text = await selectItem.getText();
            const webElement = await selectItem;
            return { text: text, webElement: webElement, };
        }));
    }

    async _getWebelementMap() {
        await this.open();
        const selectItems = await this._getOptions();
        return this._mapDressedOptions(selectItems);
    }

    async _getValue(element) {
        if ((await this.isDressed())) {
            return element.getAttribute('data-value');
        } else {
            return element.getAttribute('value');
        }
    }

    async _mapValues(options) {
        return Promise.all(options.map(async (option) => {
            const value = await this._getValue(option);
            return { webElement: option, value: value };
        }));
    }

    async _mapVisibleText(options) {
        return Promise.all(options.map(async (option) => {
            const textContent = await option.getAttribute('textContent');
            const visibleText = textContent.replace(/\s+/g, ' ').trim();
            return { webElement: option, visibleText: visibleText };
        }));
    }

    async _clickOption(option) {
        if ((await this.isDressed())) {
            await this.open();
        }
        return option.click();
    }

    async open() {
        const isOpen = await this._isOpen();
        if (!isOpen) {
            const container = await this._getDressedContainer();
            await container.click();
        }
    }

    async isDressed() {
        return this.hasAttribute('data-vl-select-dressed');
    }

    async values() {
        const options = await this._getOptions();
        return Promise.all(options.map(option => this._getValue(option)));
    }

    async texts() {
        const options = await this._getOptions();
        return Promise.all(options.map(option => option.getAttribute('textContent')));
    }

    async hasValue(value) {
        const values = await this.values();
        return values.includes(value);
    }

    async hasText(text) {
        const texts = await this.texts();
        return texts.includes(text);
    }

    async selectByValue(value) {
        if (await !this.hasValue(value)) {
            return Promise.reject('Value ' + value + ' niet gevonden in select!');
        }
        const options = await this._getOptions();
        const map = await this._mapValues(options);
        const option = await map.filter(m => m.value === value)[0];
        return this._clickOption(option.webElement);
    }

    async selectByText(visibleText) {
        if (await !this.hasText(visibleText)) {
            return Promise.reject('Text ' + visibleText + ' niet gevonden in select!');
        }
        const options = await this._getOptions();
        const map = await this._mapVisibleText(options);
        const option = await map.filter(m => m.visibleText === visibleText)[0];
        return this._clickOption(option.webElement);
    }

    async selectByIndex(index) {
        await this.open();
        const selectItems = await this._getOptions();
        return selectItems[index].click();
    }

    async search(searchText) {
        if (this.hasValue(searchText) === false) {
            return Promise.reject('Waarde ' + searchText + ' niet gevonden in de dropdown!');
        }
        await this.open();
        const input = await this._getInput();
        await input.sendKeys(searchText);
    }

    async deleteSelectedValue() {
        return (await this._getDeleteButton()).click();
    }

    async getSelectedValue() {
        return this.getAttribute('value');
    }

    async isError() {
        return this.hasAttribute('error');
    }

    async isSuccess() {
        return this.hasAttribute('success');
    }

    async isDisabled() {
        return this.hasAttribute('disabled');
    }

    async isSearchable() {
        try {
            await this._getInput();
            return true;
        } catch {
            return false;
        }
    }
}

module.exports = VlSelect;
