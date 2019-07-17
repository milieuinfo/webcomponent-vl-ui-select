import {NativeVlElement} from '/node_modules/vl-ui-core/vl-core.js';

(() => {
  loadScript('util.js', '/node_modules/@govflanders/vl-ui-util/dist/js/util.min.js', () => {
        loadScript('core.js', '/node_modules/@govflanders/vl-ui-core/dist/js/core.min.js', () => {
              loadScript('select.js', '../dist/select.js');
            });
      });

  function loadScript(id, src, onload) {
    if (!document.head.querySelector('#' + id)) {
      let script = document.createElement('script');
      script.setAttribute('id', id);
      script.setAttribute('src', src);
      script.onload = onload;
      document.head.appendChild(script);
    }
  }
})();

/**
 * VlSelect
 * @class
 * @classdesc Gebruik de select component om gebruikers toe te laten een selectie te maken uit een lijst met voorgedefinieerde opties. Het is aangeraden om enkel deze component te gebruiken als er 5 of meer opties zijn. Bij minder opties, kan er gebruik gemaakt worden van de radio component. <a href="demo/vl-select.html">Demo</a>.
 *
 * @extends NativeVlElement
 *
 * @property {boolean} block - Attribuut wordt gebruikt om ervoor te zorgen dat de textarea getoond wordt als een block element en bijgevolg de breedte van de parent zal aannemen.
 * @property {boolean} error - Attribuut wordt gebruikt om aan te duiden dat het select element verplicht is of ongeldige tekst bevat.
 * @property {boolean} success - Attribuut wordt gebruikt om aan te duiden dat het select element correct werd ingevuld.
 * @property {boolean} disabled - Attribuut wordt gebruikt om te voorkomen dat de gebruiker iets kan kiezen uit het select element.
 * @property {boolean} data-vl-select - Attribuut zorgt ervoor dat de zoek functionaliteit geïnitialiseerd wordt.
 * @property {boolean} data-vl-select-search-empty-text - Attribuut bepaalt de tekst die getoond wordt wanneer er geen resultaten gevonden zijn.
 * @property {boolean} data-vl-select-search - Attribuut om de zoek functionaliteit te activeren of deactiveren.
 * @property {boolean} data-vl-select-deletable - Attribuut om te activeren of deactiveren dat het geselecteerde kan verwijderd worden.
 */

export class VlSelect extends NativeVlElement(HTMLSelectElement) {

  static get _observedChildClassAttributes() {
    return ['block', 'error', 'success', 'disabled'];
  }

  static get _observedAttributes() {
    return ['data-vl-select-dressed'];
  }

  connectedCallback() {
    this.classList.add('vl-select');
    if (this._dataVlSelectAttribute != null) {
      this.dress();
    }
  }

  get _classPrefix() {
    return 'vl-select--';
  }

  get _stylePath() {
    return '../style.css';
  }

  get _dressed() {
    return !!this.getAttribute(VlSelect._dressedAttributeName);
  }

  get _dataVlSelectAttribute() {
    return this.getAttribute('data-vl-select');
  }

  static get _dressedAttributeName() {
    return 'data-vl-select-dressed';
  }

  _data_vl_select_dressedChangedCallback(oldValue, newValue) {
    if (newValue != null) {
      (async () => {
        while (!this._jsVlSelect) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.__wrap();
        this.__refreshClassAttributes();
      })();
    } else {
      (async () => {
        while (this._jsVlSelect) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.__unwrap();
        this.__refreshClassAttributes();
      })();
    }
  }

  __refreshClassAttributes() {
    this.getAttributeNames()
    .filter(attrName => this.__isClassAttribute(attrName))
    .forEach(attrName => this.__refreshClassAttribute(attrName));
  }

  __isClassAttribute(attrName) {
    return VlSelect._observedChildClassAttributes.includes(attrName);
  }

  __refreshClassAttribute(attrName) {
    this.classList.remove(this._classPrefix + attrName);
    const originalValue = this.getAttribute(attrName);
    this.removeAttribute(attrName);
    this.setAttribute(attrName, originalValue)
  }

  /**
   * Extra wrapper rond de js-vl-select div om CSS classes op te zetten. Dit
   * is om de CSS hiearchy van web universum niet te breken.
   * @private
   */
  __wrap() {
    const wrapper = document.createElement('div');
    this._jsVlSelect.parentNode.insertBefore(wrapper, this._jsVlSelect);
    wrapper.appendChild(this._jsVlSelect);
  }

  __unwrap() {
    const wrapper = this.parentNode;
    const parent = wrapper.parentNode;
    while (wrapper.firstChild) parent.insertBefore(wrapper.firstChild, wrapper);
    parent.removeChild(wrapper);
  }

  /**
   * Override van de __changeAttribute om rekening te houden dat de select
   * component geinitialiseerd kan worden met de 'dress()' functie.
   *  - wanneer de component geinitialiseerd is, moet de CSS class op de parent van de js-vl-select div komen
   *  - wanneer de component native is, moet de CSS class op de select zelf komen
   * @private
   */
  __changeAttribute(element, oldValue, newValue, attribute, classPrefix) {
    const el = this.__lookupElement(element);
    super.__changeAttribute(el, oldValue, newValue, attribute, classPrefix);
  }

  /**
   * Afhankelijk of de component dressed is, moet de CSS class op een ander
   * element toegevoegd worden.
   * @param element
   * @return {HTMLElement|*} element waar de CSS class toegevoegd moet worden.
   * @private
   */
  __lookupElement(element) {
    if (this._dressed) {
      return this._jsVlSelect.parentElement;
    }
    return element;
  }

  /**
   * Zet de mogelijkheden die gekozen kunnen worden.
   *
   * @param {Object[]} choices met value en label attribuut
   */
  set choices(choices) {
    this._choices.setChoices(choices, 'value', 'label', true);
  }

  /**
   * Geef de `Choices` instantie.
   *
   * @see https://www.npmjs.com/package/choices.js
   * @returns {Choices} de `Choices` instantie of `null` als de component nog niet geinitialiseerd is door `dress()`
   */
  get _choices() {
    let choices = null;
    vl.util.each(vl.select.selectInstances, instance => {
      if (instance.element === this) {
        choices = instance;
      }
    });
    return choices;
  }

  /**
   * Geef de 'js-vl-select' wrapper terug dat door de dress functie gegeneert
   * wordt.
   * @return {null|*|Element} geeft 'js-vl-select' div terug of 'null' als de component nog niet geinitialiseerd is door 'dress()'
   */
  get _jsVlSelect() {
    return this._element.closest('.js-vl-select');
  }

  /**
   * Initialiseer de `Choices` config.
   *
   * @see https://www.npmjs.com/package/choices.js
   * @param params object with callbackFn: function(select) with return value the items for `setChoices`
   */
  dress(params) {
    (async () => {
      while (!window.vl || !window.vl.select) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (!this._dressed) {
        vl.select.dress(this, params);
      }
    })();
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
      } catch(exception) {
        console.error("er liep iets fout bij de undress functie, controleer dat het vl-select element een id bevat! Foutmelding: " + exception);
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
   * Zet de actieve optie door een waarde.
   *
   * @param value de gekozen waarde om actief te zijn voor deze component
   */
  setValueByChoice(value) {
    vl.select.setValueByChoice(this, value);
  }
}

customElements.define('vl-select', VlSelect, {extends: 'select'});