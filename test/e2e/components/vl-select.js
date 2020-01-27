const { VlElement } = require('vl-ui-core');
const { By, Key, until } = require('selenium-webdriver');

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
        return this.hasClass('is-open');
    }
    
    async _openDressedDropdown() {
        if(await this._isOpen()) {
            return Promise.resolve();
        }
        return (await this._getDressedContainer()).click();
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
            return {text: text, webElement: selectItem};
        }));
    }
                            
    async isDressed() {
        return this.hasAttribute('data-vl-select-dressed');
    }
    
    async values() {
        const options = await this._getOptions();
        return Promise.all(options.map(o => o.getAttribute('value')));
    }
    
    async hasValue(value) {
        const values = await this.values();
        return values.includes(value);
    }
    
    async getAllVisibleText() {
        const options = await this._getOptions();
        return Promise.all(options.map(o => o.getAttribute('textContent')));
    }

    async hasVisibleText(visibleText) {
        const texts = (await this.getAllVisibleText()).map(t => t.trim());
        return texts.includes(visibleText);
    }

    async selectByValue(value) {
        if(await !this.hasValue(value)) {
            return Promise.reject('Value ' + value + ' niet gevonden in select!');
        }
        if((await this.isDressed())) {
            await this._openDressedDropdown();
            const selectItems = await this._getOptions();
            const map = await this._mapDressedOptions(selectItems);

            const webElementArray = map.filter(i => i.text == value);
            return webElementArray[0].webElement.click();
        } else {
            await this._openDressedDropdown();
            return (await this.findElement(By.css('option[value="' + value + '"]'))).click();
        }
    }

    async selectByVisibleText(visibleText) {
        if(await !this.hasVisibleText(visibleText)) {
            return Promise.reject('Text ' + visibleText + ' niet gevonden in select!');
        }
        if((await this.isDressed())) {
            await this._openDressedDropdown();
            const selectItems = await this._getOptions();
            const map = await this._mapDressedOptions(selectItems);

            const webElementArray = map.filter(i => i.text == visibleText);
            return webElementArray[0].webElement.click();
        } else {
            await this._openDressedDropdown();
            return (await this.findElement(By.xpath('//option[text() = "' + visibleText + '"]'))).click();
        }
    }

    async selectByIndex(index) {
        if((await this.isDressed())) {
            await this._openDressedDropdown();
            const selectItems = await this._getOptions();
            return selectItems[index].click();
        } else {
            await this._openDressedDropdown();
            const options = await this._getOptions();
            return options[index].click();
        }
    }


    async search(searchText) {
        if(this.hasValue(searchText) == false) {
            return Promise.reject('Waarde ' + searchText + ' niet gevonden in de dropdown!');
        }
        await this._openDressedDropdown();
        const input = await this._getInput();
        await input.sendKeys(searchText);
        await input.sendKeys(Key.RETURN);
    }

    async deleteValue(value) {
        if(this.hasValue(value)) {
            return (await this._getDeleteButton()).click();
        }
        return Promise.reject('Waarde ' + value + ' niet gevonden in de dropdown!')
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

}

module.exports = VlSelect;
