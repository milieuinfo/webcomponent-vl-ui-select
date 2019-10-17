import{awaitScript,awaitUntil,define,NativeVlElement}from"/node_modules/vl-ui-core/vl-core.js";Promise.all([awaitScript("util","/node_modules/@govflanders/vl-ui-util/dist/js/util.min.js"),awaitScript("core","/node_modules/@govflanders/vl-ui-core/dist/js/core.min.js"),awaitScript("select","/node_modules/vl-ui-select/dist/select.js"),awaitUntil(()=>window.vl&&window.vl.select)]).then(()=>define("vl-select",VlSelect,{extends:"select"}));export class VlSelect extends(NativeVlElement(HTMLSelectElement)){static get _observedAttributes(){return["error","success"]}static get _observedChildClassAttributes(){return["block","disabled"]}connectedCallback(){this.classList.add("vl-select"),null!=this._dataVlSelectAttribute&&this.dress()}get _classPrefix(){return"vl-select--"}get _stylePath(){return"/node_modules/vl-ui-select/style.css"}get _dressed(){return!!this.getAttribute(VlSelect._dressedAttributeName)}get _dataVlSelectAttribute(){return this.getAttribute("data-vl-select")}static get _dressedAttributeName(){return"data-vl-select-dressed"}_successChangedCallback(e,t){this.__stateChangedCallback(t,"success")}_errorChangedCallback(e,t){this.__stateChangedCallback(t,"error")}__stateChangedCallback(e,t){null!=e?(async()=>{if(null!=this._dataVlSelectAttribute){for(;!this._dressed;)await new Promise(e=>setTimeout(e,100));this.__wrap(),this._wrapperElement.parentNode.classList.add("vl-select--"+t)}else this.classList.add("vl-select--"+t)})():null!=this._dataVlSelectAttribute?this.__unwrap():this.classList.remove("vl-select--"+t)}__wrap(){const e=document.createElement("div");this._wrapperElement.parentNode.insertBefore(e,this._wrapperElement),e.appendChild(this._wrapperElement)}__unwrap(){const e=this._wrapperElement,t=e.parentNode;t.parentNode.insertBefore(e,t),t.remove()}__changeAttribute(e,t,s,l,r){const i=this.__lookupElement(e);super.__changeAttribute(i,t,s,l,r)}__lookupElement(e){return this._dressed?this._wrapperElement.parentElement:e}set choices(e){this._choices.setChoices(e,"value","label",!0)}set sortFilter(e){this._choices.config.sortFilter=e}get _choices(){let e=null;return vl.util.each(vl.select.selectInstances,t=>{t.element===this&&(e=t)}),e}get _wrapperElement(){return this._element.closest(".js-vl-select")}dress(e){this._dressed||vl.select.dress(this,e)}undress(){if(this._dressed)try{vl.select.undress(this._choices)}catch(e){console.error("er liep iets fout bij de undress functie, controleer dat het vl-select element een id bevat! Foutmelding: "+e)}}enable(){vl.select.enable(this)}disable(){vl.select.disable(this)}removeActive(){vl.select.removeActive(this)}setValueByChoice(e){vl.select.setValueByChoice(this,e)}showDropdown(){vl.select.showDropdown(this)}hideDropdown(){vl.select.hideDropdown(this)}};