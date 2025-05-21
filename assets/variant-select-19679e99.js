function l(n){return n?n.options_with_values.map(s=>{const c=s.values.length===1;return`
      <variant-select class="variant-select ${c?"hide":""}" data-option="option${s.position}">
        <button class="variant-select__trigger btn-none" data-trigger>
          <span class="variant-select__option h6" data-trigger-label>
            ${c?s.values[0]:s.name}
          </span>
          <svg aria-label="Chevron down icon" class="icon icon--chevron-down" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 9L12 15L6 9" stroke="currentColor" stroke-width="1.2" stroke-linecap="square"/>
          </svg>
        </button>

        <div class="variant-select__content" data-content>
          <ul class="variant-select__list list-none">
            ${s.values.map(e=>{const t=n.variants.find(i=>i.option1===e),a=t&&t.available||s.values.length===1,r=()=>{let i="";return a||(i=window.theme.strings.soldOut),(t==null?void 0:t.inventory_quantity)===1&&(i=window.theme.strings.oneRemaining),i===""?"":`<span class="variant-select__option-note">${i}</span>`};return`
                  <li class="variant-select__option">
                  <input
                    type="radio"
                    id="${n.id}-${s.name}-${e}"
                    value="${e}"
                    name="options[${n.id}-${s.name}]"
                    data-option-name="${s.name}"
                    ${c?"checked":""}
                  >
                    <label for="${n.id}-${s.name}-${e}" class="h6">
                      <span class="variant-select__option-value ${a?"":"variant-select__option-value--unavailable"}">
                        ${e}
                      </span>
                      ${r()}
                    </label>
                  </li>
                `}).join("")}
          </ul>
        </div>
      </variant-select>
    `}).join(""):""}function d(){class n extends HTMLElement{constructor(){super(),this.selectors={trigger:"[data-trigger]",triggerLabel:"[data-trigger-label]",content:"[data-content]",errorMessage:"[data-error-message]",form:"[data-product-form]",stickyBar:"[data-sticky-atc-bar]"},this.productStickyATC=document.querySelector(".product--sticky-atc"),this.mobileQuery=window.matchMedia(`(max-width: ${window.theme.breakpoints.lg}px)`),this.isHidden=this.classList.contains("hide"),this.trigger=this.querySelector(this.selectors.trigger),this.trigger.addEventListener("click",this.handleToggleClick.bind(this)),this.radioButtons=this.querySelectorAll('input[type="radio"]'),this.radioButtons.forEach(e=>{e.addEventListener("change",this.handleRadioChange.bind(this))}),this.setMaxHeight(),window.addEventListener("resize",this.setMaxHeight.bind(this)),this.handleStickyBar()}setMaxHeight(){const t=this.querySelector(this.selectors.content).scrollHeight;this.style.setProperty("--max-height",`${t}px`)}handleRadioChange(){this.updateTriggerLabel(),this.close()}handleToggleClick(e){var r,i;e.preventDefault(),this.clearError();const t=this.getAttribute("aria-expanded")==="true";this.setAttribute("aria-expanded",!t),(i=(r=this.productStickyATC)==null?void 0:r.classList)==null||i.toggle("sticky-atc-select--open"),document.querySelectorAll("variant-select").forEach(o=>{o!==this&&o.close()})}close(){this.setAttribute("aria-expanded","false")}updateTriggerLabel(){const e=this.querySelector('input[type="radio"]:checked');if(!e)return;const t=e.getAttribute("id"),a=this.querySelector(`label[for="${t}"]`);if(!a)return;const r=this.querySelector(this.selectors.triggerLabel);r.innerHTML=a.innerHTML}clearError(){this.classList.remove("variant-select--error");const e=this.querySelector(this.selectors.errorMessage);e&&e.remove()}throwError(e){if(this.isHidden)return;const t=`<span class="visually-hidden" data-error-message>${e}</span>`;this.insertAdjacentHTML("beforeend",t),this.classList.add("variant-select--error")}handleStickyBar(){if(!this.productStickyATC)return;const e=this.closest(this.selectors.form);if(!e)return;const t=this.closest(this.selectors.stickyBar),a=(t==null?void 0:t.offsetHeight)||0,r=new IntersectionObserver(i=>{i.forEach(o=>{o.isIntersecting?(this.productStickyATC.classList.add("product--sticky-atc-enabled"),document.body.classList.add("sticky-atc-enabled")):o.boundingClientRect.y>0&&(this.productStickyATC.classList.remove("product--sticky-atc-enabled"),document.body.classList.remove("sticky-atc-enabled"))})},{rootMargin:`0px 0px -${e.offsetHeight}px`});this.mobileQuery.matches&&(r.observe(e),document.documentElement.style.setProperty("--sticky-atc-height",`${a}px`)),this.mobileQuery.addEventListener("change",i=>{i.matches?(r.observe(e),document.documentElement.style.setProperty("--sticky-atc-height",`${a}px`)):(r.disconnect(),document.documentElement.style.removeProperty("--sticky-atc-height"))})}}customElements.define("variant-select",n);const s=document.querySelectorAll("variant-select");s.length&&document.addEventListener("click",c=>{c.target.closest("variant-select")||s.forEach(t=>t.close())})}export{d as i,l as v};
