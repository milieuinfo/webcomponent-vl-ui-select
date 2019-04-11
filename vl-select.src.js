import {NativeVlElement} from '/node_modules/vl-ui-core/vl-core.js';

(() => {
  loadScript('util.js',
      '../node_modules/@govflanders/vl-ui-util/dist/js/util.min.js', () => {
        loadScript('core.js',
            '../node_modules/@govflanders/vl-ui-core/dist/js/core.min.js',
            () => {
              loadScript('select.js',
                  '../node_modules/@govflanders/vl-ui-select/dist/js/select.js');
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
 * `vl-select`
 * Gebruik de select component om gebruikers toe te laten een selectie te maken
 * uit een lijst met voorgedefinieerde opties. Het is aangeraden om enkel deze
 * component te gebruiken als er 5 of meer opties zijn. Bij minder opties, kan
 * er gebruik gemaakt worden van de radio component.
 * De component is `dressed` indien `dress()` werd aangeroepen of
 * geinitialiseerd met attribuut `data-vl-select`, waarmee de `Choices` config
 * wordt gezet.
 *
 * @see https://www.npmjs.com/package/choices.js
 * @demo demo/vl-select.html
 */
export class VlSelect extends NativeVlElement(HTMLSelectElement) {

  static get _observedChildClassAttributes() {
    return ['block', 'error', 'success', 'disabled'];
  }

  connectedCallback() {
    this.classList.add('vl-select');
  }

  get _classPrefix() {
    return 'vl-select--';
  }

  get _dressed() {
    return !!this.getAttribute(VlSelect._dressedAttributeName);
  }

  static get _dressedAttributeName() {
    return 'data-vl-select-dressed';
  }

  /**
   * Geef de `Choices` instantie
   *
   * @see https://www.npmjs.com/package/choices.js
   * @returns {Choices} de `Choices` instantie of `null` als de component nog niet geinitialiseerd is door `dress()`
   */
  get choices() {
    let choices = null;
    vl.util.each(vl.select.selectInstances, instance => {
      if (instance.element === this) {
        choices = instance;
      }
    });
    return choices;
  }

  /**
   * Initialiseer de `Choices` config.
   *
   * @see https://www.npmjs.com/package/choices.js
   * @param params object with callbackFn: function(select) with return value the items for `setChoices`
   */
  dress(params) {
    if (!this._dressed) {
      vl.select.dress(this, params);
    }
  }

  /**
   * Vernietigt de `Choices` instantie van deze component. De component moet `dressed` zijn.
   *
   * @see https://www.npmjs.com/package/choices.js
   */
  undress() {
    if (this._dressed) {
      vl.select.undress(this.choices);
    }
  }

  /**
   * Activeer de component. De component moet `dressed` zijn.
   */
  enable() {
    vl.select.enable(this);
  }

  /**
   * Deactiveer de component. De component moet `dressed` zijn.
   */
  disable() {
    vl.select.disable(this);
  }

  /**
   * Verwijder de actieve geselecteerde optie. De component moet `dressed` zijn.
   */
  removeActive() {
    vl.select.removeActive(this);
  }

  /**
   * Zet de actieve optie door een waarde. De component moet `dressed` zijn.
   *
   * @param value de gekozen waarde om actief te zijn voor deze component
   */
  setValueByChoice(value) {
    vl.select.setValueByChoice(this, value);
  }
}

customElements.define('vl-select', VlSelect, {extends: 'select'});