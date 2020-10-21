import {nativeVlElement, awaitUntil, define} from '/node_modules/vl-ui-core/dist/vl-core.js';
import {vlFormValidation, vlFormValidationElement} from '/node_modules/vl-ui-form-validation/dist/vl-form-validation-all.js';
import '/node_modules/vl-ui-select/lib/select.js';

Promise.all([
  vlFormValidation.ready(),
]).then(() => define('vl-select', VlSelect, {extends: 'select'}));

/**
* VlSelect
* @class
* @classdesc Gebruik de select component om gebruikers toe te laten een selectie te maken uit een lijst met voorgedefinieerde opties. Het is aangeraden om enkel deze component te gebruiken als er 5 of meer opties zijn. Bij minder opties, kan er gebruik gemaakt worden van de radio component.
*
* @extends HTMLSelectElement
* @mixes nativeVlElement
*
* @property {boolean} data-vl-block - Attribuut wordt gebruikt om ervoor te zorgen dat de textarea getoond wordt als een block element en bijgevolg de breedte van de parent zal aannemen.
* @property {boolean} data-vl-error - Attribuut wordt gebruikt om aan te duiden dat het select element verplicht is of ongeldige tekst bevat.
* @property {boolean} data-vl-success - Attribuut wordt gebruikt om aan te duiden dat het select element correct werd ingevuld.
* @property {boolean} data-vl-disabled - Attribuut wordt gebruikt om te voorkomen dat de gebruiker iets kan kiezen uit het select element.
* @property {boolean} data-vl-select - Attribuut zorgt ervoor dat de zoek functionaliteit geïnitialiseerd wordt.
* @property {boolean} data-vl-select-search - Attribuut om de zoek functionaliteit te activeren of deactiveren.
* @property {boolean} data-vl-select-search-empty-text - Attribuut bepaalt de tekst die getoond wordt wanneer er geen resultaten gevonden zijn.
* @property {boolean} data-vl-select-search-result-limit - Attribuut om het aantal resultaten te limiteren.
* @property {boolean} data-vl-select-search-no-result-limit - Attribuut om het aantal resultaten te limiteren.
* @property {boolean} data-vl-select-deletable - Attribuut om te activeren of deactiveren dat het geselecteerde kan verwijderd worden.
*
* @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-select/releases/latest|Release notes}
* @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-select/issues|Issues}
* @see {@link https://webcomponenten.omgeving.vlaanderen.be/demo/vl-select.html|Demo}
*/
export class VlSelect extends vlFormValidationElement(nativeVlElement(HTMLSelectElement)) {
  /**
   * Geeft de ready event naam.
   *
   * @return {string}
   */
  static get readyEvent() {
    return 'VlSelectReady';
  }

  static get _observedAttributes() {
    return vlFormValidation._observedAttributes().concat(['error', 'success']);
  }

  static get _observedChildClassAttributes() {
    return ['block', 'disabled'];
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add('vl-select');
    this.setAttribute('data-vl-validate-error-parent', '');
    if (this._hasDressedAttribute) {
      this.dress();
    } else {
      this._dressFormValidation();
    }
  }

  /**
   * Geeft de ready event naam.
   *
   * @return {string}
   */
  get readyEvent() {
    return VlSelect.readyEvent;
  }

  get _classPrefix() {
    return 'vl-select--';
  }

  get _dressed() {
    return !!this.getAttribute(VlSelect._dressedAttributeName);
  }

  get _hasDressedAttribute() {
    return this._dataVlSelectAttribute != null;
  }

  get _dataVlSelectAttribute() {
    return this.getAttribute('data-vl-select');
  }

  static get _dressedAttributeName() {
    return 'data-vl-select-dressed';
  }

  _successChangedCallback(oldValue, newValue) {
    this.__stateChangedCallback(newValue, 'success');
  }

  _errorChangedCallback(oldValue, newValue) {
    this.__stateChangedCallback(newValue, 'error');
  }

  __stateChangedCallback(newValue, type) {
    if (newValue != null) {
      (async () => {
        if (this._hasDressedAttribute || this._dressed) {
          await awaitUntil(() => this._dressed);
          this.__wrap();
          this._wrapperElement.parentNode.classList.add('vl-select--' + type);
        } else {
          this.classList.add('vl-select--' + type);
        }
      })();
    } else {
      if (this._hasDressedAttribute || this._dressed) {
        this.__unwrap();
      } else {
        this.classList.remove('vl-select--' + type);
      }
    }
  }

  /**
   * Extra wrapper rond de js-vl-select div om CSS classes op te zetten. Dit
   * is om de CSS hiearchy van web universum niet te breken.
   * @private
   */
  __wrap() {
    const wrapper = document.createElement('div');
    this._wrapperElement.parentNode.insertBefore(wrapper, this._wrapperElement);
    wrapper.appendChild(this._wrapperElement);
  }

  __unwrap() {
    const wrapper = this._wrapperElement;
    const parent = wrapper.parentNode;
    parent.parentNode.insertBefore(wrapper, parent);
    parent.remove();
  }

  /**
   * Override van de __changeAttribute om rekening te houden dat de select component geinitialiseerd kan worden met de 'dress()' functie.
   *  - wanneer de component geinitialiseerd is, moet de CSS class op de parent van de js-vl-select div komen
   *  - wanneer de component native is, moet de CSS class op de select zelf komen
   * @param {HTMLElement} element
   * @param {String} oldValue
   * @param {String} newValue
   * @param {String} attribute
   * @param {String} classPrefix
   * @private
   */
  __changeAttribute(element, oldValue, newValue, attribute, classPrefix) {
    const el = this.__lookupElement(element);
    super.__changeAttribute(el, oldValue, newValue, attribute, classPrefix);
  }

  /**
   * Afhankelijk of de component dressed is, moet de CSS class op een ander element toegevoegd worden.
   * @param {HTMLElement} element
   * @return {HTMLElement|*} element waar de CSS class toegevoegd moet worden.
   * @private
   */
  __lookupElement(element) {
    if (this._dressed) {
      return this._wrapperElement.parentElement;
    }
    return element;
  }

  /**
   * Zet de mogelijkheden die gekozen kunnen worden.
   *
   * @param {Object[]} choices met value en label attribuut.
   */
  set choices(choices) {
    this._choices.setChoices(choices, 'value', 'label', true);
  }

  /**
   * Zet sorteer functie voor de mogelijke keuzes.
   *
   * @param {function(T, T)} fn bi-functie die de mogelijke keuzes sorteert.
   */
  set sortFilter(fn) {
    this._choices.config.sortFilter = fn;
  }

  /**
   * Zet het geselecteerd option element op basis van de option value.
   *
   * @param {string} value - de option value van het option element dat gekozen moet worden.
   */
  set value(value) {
    if (this._dressed) {
      vl.select.setValueByChoice(this, value);
    } else {
      super.value = value;
    }
  }

  /**
   * Geeft de waarde van het eerst geselecteerde option element indien deze er is, anders een lege string.
   *
   * @return {void}
   */
  get value() {
    return this.selectedOptions[0] ? this.selectedOptions[0].value : '';
  }

  /**
   * Geef de `Choices` instantie.
   *
   * @see https://www.npmjs.com/package/choices.js
   * @return {Choices} de `Choices` instantie of `null` als de component nog niet geïnitialiseerd is door `dress()`
   */
  get _choices() {
    return vl.select.selectInstances.find((instance) => {
      return instance.element === this;
    });
  }

  /**
   * Geef de 'js-vl-select' wrapper terug dat door de dress functie wordt gegenereerd
   * wordt.
   * @return {null|*|Element} geeft 'js-vl-select' div terug of 'null' als de component nog niet geinitialiseerd is door 'dress()'
   */
  get _wrapperElement() {
    return this._element.closest('.js-vl-select');
  }

  /**
   * Initialiseer de `Choices` config.
   *
   * @see https://www.npmjs.com/package/choices.js
   * @param {Object} params - object with callbackFn: function(select) with return value the items for `setChoices`
   * @fires VlSelect#VlSelectReady ready event wordt verstuurd wanneer veilige interactie met de webcomponent mogelijk is.
   */
  dress(params) {
    setTimeout(() => {
      if (!this._dressed) {
        vl.select.dress(this, params);

        (async () => {
          await this.ready();
          this._copySlotAttribute();
          this._dressFormValidation();
          this.dispatchEvent(new CustomEvent(this.readyEvent));
        })();
      }
    });
  }

  /**
   * Geeft een promise die 'resolved' wanneer de select initialisatie klaar is.
   *
   * @return {Promise} De promise
   */
  async ready() {
    await awaitUntil(() => this._dressed === true);
  }

  /**
   * Vernietigt de `Choices` instantie van deze component.
   *
   * @see https://www.npmjs.com/package/choices.js
   */
  undress() {
    if (this._dressed) {
      try {
        vl.select.undress(this._choices);
        vl.select.selectInstances.splice(vl.select.selectInstances.indexOf(this._choices));
      } catch (exception) {
        console.error('er liep iets fout bij de undress functie, controleer dat het vl-select element een id bevat! Foutmelding: ' + exception);
      }
    }
  }

  /**
   * Activeer de component.
   */
  enable() {
    vl.select.enable(this);
  }

  /**
   * Deactiveer de component.
   */
  disable() {
    vl.select.disable(this);
  }

  /**
   * Verwijder de actieve geselecteerde optie.
   */
  removeActive() {
    vl.select.removeActive(this);
  }

  /**
   * Toon de dropdown met de mogelijke keuzes.
   */
  showDropdown() {
    vl.select.showDropdown(this);
  }

  /**
   * Verberg de dropdown met de mogelijke keuzes.
   */
  hideDropdown() {
    vl.select.hideDropdown(this);
  }

  /**
   * Geeft focus aan het element.
   */
  focus() {
    if (this._dressed) {
      setTimeout(() => {
        this._wrapperElement.focus();
      });
    } else {
      super.focus();
    }
  }

  _copySlotAttribute() {
    const attribute = this.getAttribute('slot');
    this.removeAttribute('slot');
    if (attribute) {
      this._wrapperElement.setAttribute('slot', attribute);
    }
  }
}
