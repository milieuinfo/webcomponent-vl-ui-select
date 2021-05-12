const {VlElement} = require('vl-ui-core').Test;
const {By} = require('vl-ui-core').Test.Setup;
const VlSelectOptionGroup = require('./vl-select-option-group');

class VlSelect extends VlElement {
  async open() {
    const isOpen = await this.isOpen();
    if (!isOpen) {
      const container = await this._getDressedContainer();
      await container.click();
    }
  }

  async close() {
    const isOpen = await this.isOpen();
    if (isOpen) {
      const container = await this._getDressedContainer();
      await container.click();
    }
  }

  async isDressed() {
    return this.hasAttribute('data-vl-select-dressed');
  }

  async isOpen() {
    const container = await this._getDressedContainer();
    return container.hasClass('is-open');
  }

  async groups() {
    if (await this.isDressed()) {
      const selectList = await this._getSelectList();
      const selectListItems = await selectList.findElements(By.css('.vl-select__group, .vl-select__item'));
      const groupsMetItems = await selectListItems.reduce(async (result, item) => {
        const groups = await result;
        const isGroup = (await item.getAttribute('class')).indexOf('vl-select__group') !== -1;
        if (isGroup) {
          groups.push({groupItem: item, options: []});
        } else {
          groups[groups.length - 1].options.push(item);
        }
        return groups;
      }, []);
      return groupsMetItems.map((groupMetItem) => new VlSelectOptionGroup(groupMetItem.groupItem, true, groupMetItem.options));
    } else {
      const optGroupElements = await this.findElements(By.css('optgroup'));
      const optGroupElementPromises = optGroupElements.map(async (optGroupElement) => {
        const options = await optGroupElement.findElements(By.css('option'));
        return new VlSelectOptionGroup(optGroupElement, false, options);
      });
      return Promise.all(optGroupElementPromises);
    }
  }

  async _getOptions() {
    if (await this.isDressed()) {
      const selectList = await this._getSelectList();
      const selectItems = await selectList.findElements(By.css('.vl-select__item'));
      return selectItems.map((item) => new Option(item, true));
    } else {
      const selectItems = await this.findElements(By.css('option'));
      return selectItems.map((item) => new Option(item, false));
    }
  }

  async values() {
    const options = await this._getOptions();
    return Promise.all(options.map((option) => option.getValue()));
  }

  async texts() {
    const options = await this._getOptions();
    return Promise.all(options.map((option) => option.getLabel()));
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
      return Promise.reject(new Error('Value ' + value + ' niet gevonden in select!'));
    }
    const options = await this._getOptions();
    const values = await this.values();
    return this._clickOption(options[values.findIndex((v) => v === value)]);
  }

  async selectByText(text) {
    if (await !this.hasText(text)) {
      return Promise.reject(new Error('Text ' + text + ' niet gevonden in select!'));
    }
    const options = await this._getOptions();
    const labels = await this.texts();
    return this._clickOption(options[labels.findIndex((label) => label === text)]);
  }

  async selectByIndex(index) {
    const values = await this.values();
    if (values.length < index - 1) {
      return Promise.reject(new Error('Er zijn maar ' + values.length + ' values in de dropdown'));
    }
    const options = await this._getOptions();
    return this._clickOption(options[index]);
  }

  async search(text) {
    if (this.hasValue(text) === false) {
      return Promise.reject(new Error('Waarde ' + text + ' niet gevonden in de dropdown!'));
    }
    await this.open();
    const input = await this._getInput();
    await input.sendKeys(text);
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

  async _getDressedContainer() {
    return this.findElement(By.xpath('../..'));
  }

  async _getSelectList() {
    return (await this._getDressedContainer()).findElement(By.css('.vl-select__list'));
  }

  async _getInput() {
    return (await this._getSelectList()).findElement(By.css('.vl-input-field'));
  }

  async _getSelectParent() {
    return this.findElement(By.xpath('..'));
  }

  async _getDeleteButton() {
    const parent = await this._getSelectParent();
    return parent.findElement(By.css('button.vl-pill__close'));
  }

  async _clickOption(option) {
    if ((await this.isDressed())) {
      await this.open();
    }
    return option.click();
  }
}

class Option {
  constructor(optionItem, dressed) {
    this.optionItem = optionItem;
    this.dressed = dressed;
  }

  click() {
    return this.optionItem.click();
  }

  async getValue() {
    if (this.dressed) {
      return this.optionItem.getAttribute('data-value');
    } else {
      return this.optionItem.getAttribute('value');
    }
  }

  async getLabel() {
    const textContent = await this.optionItem.getAttribute('textContent');
    return textContent.trim();
  }
}


module.exports = VlSelect;
