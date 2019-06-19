import{NativeVlElement}from"/node_modules/vl-ui-core/vl-core.js";(()=>{function e(e,t,s){if(!document.head.querySelector("#"+e)){let l=document.createElement("script");l.setAttribute("id",e),l.setAttribute("src",t),l.onload=s,document.head.appendChild(l)}}e("util.js","/node_modules/@govflanders/vl-ui-util/dist/js/util.min.js",()=>{e("core.js","/node_modules/@govflanders/vl-ui-core/dist/js/core.min.js",()=>{e("select.js","/node_modules/vl-ui-select/dist/select.js")})})})();export class VlSelect extends(NativeVlElement(HTMLSelectElement)){static get _observedChildClassAttributes(){return["block","error","success","disabled"]}connectedCallback(){this.classList.add("vl-select"),null!=this._dataVlSelectAttribute&&this.dress()}get _classPrefix(){return"vl-select--"}get _stylePath(){return"/node_modules/vl-ui-select/style.css"}get _dressed(){return!!this.getAttribute(VlSelect._dressedAttributeName)}get _dataVlSelectAttribute(){return this.getAttribute("data-vl-select")}static get _dressedAttributeName(){return"data-vl-select-dressed"}set choices(e){this._choices.setChoices(e,"value","label",!0)}get _choices(){let e=null;return vl.util.each(vl.select.selectInstances,t=>{t.element===this&&(e=t)}),e}dress(e){(async()=>{for(;!window.vl||!window.vl.select;)await new Promise(e=>setTimeout(e,100));this._dressed||vl.select.dress(this,e)})()}undress(){if(this._dressed)try{vl.select.undress(this._choices)}catch(e){console.error("er liep iets fout bij de undress functie, controleer dat het vl-select element een id bevat! Foutmelding: "+e)}}enable(){vl.select.enable(this)}disable(){vl.select.disable(this)}removeActive(){vl.select.removeActive(this)}setValueByChoice(e){vl.select.setValueByChoice(this,e)}};customElements.define("vl-select",VlSelect,{extends:"select"});