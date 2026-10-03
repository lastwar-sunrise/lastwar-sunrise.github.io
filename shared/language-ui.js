"use strict";

(function(){
    const Supported=["zh-TW","en","vi"];
    const Existing=localStorage.getItem("sunriseLanguage");
    if(Supported.includes(Existing)){
        if(localStorage.getItem("sunriseLanguageChosen")===null)localStorage.setItem("sunriseLanguageChosen","1");
    }else{
        localStorage.setItem("sunriseLanguage","en");
        localStorage.setItem("sunriseLanguageChosen","0");
    }

    function AddGlobalStyle(){
        if(document.getElementById("sunrise-global-ui-style"))return;
        const style=document.createElement("style");
        style.id="sunrise-global-ui-style";
        style.textContent=`
            .language-selector>span,.language-wrap>span,.train-language-selector>span{display:none!important}
            .sunrise-back-button{display:inline-flex!important;align-items:center;justify-content:center;min-height:36px;padding:7px 13px!important;border:0!important;border-radius:11px!important;background:#1a73e8!important;color:#fff!important;text-decoration:none!important;font:700 13px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif!important;box-shadow:0 2px 7px rgba(0,0,0,.16);white-space:nowrap;transition:transform .15s ease,box-shadow .15s ease}
            .sunrise-back-button:hover{transform:translateY(-1px);box-shadow:0 4px 10px rgba(0,0,0,.2);text-decoration:none!important}
            .sunrise-extra-back{margin:8px 0 8px 8px}
            @media(max-width:600px){.sunrise-back-button{min-height:33px;padding:6px 9px!important;font-size:12px!important}.sunrise-extra-back{margin:6px 0 6px 6px}}
        `;
        document.head.appendChild(style);
    }

    function IsRootIndex(){
        const path=location.pathname.replace(/\/+$/,"");
        return path===""||path==="/index.html";
    }

    function BackText(){
        const lang=(window.i18next&&i18next.language)||localStorage.getItem("sunriseLanguage")||"en";
        const texts={"zh-TW":"‹‹ 返回管理中心",en:"‹‹ Back to Management",vi:"‹‹ Quay lại quản lý"};
        return texts[lang]||texts.en;
    }

    function FindExistingBackLinks(){
        return Array.from(document.querySelectorAll('.back-link,.home-link,[data-i18n="sunV2.back"],[data-duty-i18n="back"]'));
    }

    function EnsureBackButton(){
        const existingGlobal=document.getElementById("sunriseGlobalBack");
        if(document.body&&document.body.hasAttribute("data-no-global-back")){
            if(existingGlobal)existingGlobal.remove();
            return;
        }
        if(IsRootIndex())return;
        const existing=FindExistingBackLinks();
        let back=existingGlobal;
        if(!back&&existing.length){
            back=existing[0];
            back.id="sunriseGlobalBack";
            existing.slice(1).forEach(function(el){el.style.display="none";});
        }
        if(!back){
            back=document.createElement("a");
            back.id="sunriseGlobalBack";
            back.className="sunrise-extra-back";
            document.body.insertBefore(back,document.body.firstChild);
        }
        back.classList.add("sunrise-back-button");
        back.href="/";
        back.setAttribute("aria-label","Back to Management");
        back.textContent=BackText();
    }

    function FindSelector(){const select=document.querySelector("[data-language-select],#languageSelect");if(select&&!select.hasAttribute("data-language-select"))select.setAttribute("data-language-select","");return select;}
    function CreateSelector(){let select=FindSelector();if(select)return select;const wrap=document.createElement("div");wrap.className="sunrise-global-language";wrap.style.cssText="position:fixed;top:10px;right:10px;z-index:9000";select=document.createElement("select");select.setAttribute("data-language-select","");select.setAttribute("aria-label","Language / 語言 / Ngôn ngữ");select.style.cssText="min-height:38px;border:1px solid #c9c9c9;border-radius:10px;padding:6px 10px;background:#fff;font:inherit";select.addEventListener("change",function(){if(this.value)ChangeSunriseLanguage(this.value);});wrap.appendChild(select);document.body.appendChild(wrap);return select;}
    function EnsureOptions(select){let placeholder=select.querySelector('option[value=""]');if(!placeholder){placeholder=document.createElement("option");placeholder.value="";placeholder.textContent="Language / 語言 / Ngôn ngữ";select.insertBefore(placeholder,select.firstChild);}else{placeholder.textContent="Language / 語言 / Ngôn ngữ";}const options={"zh-TW":"繁體中文",en:"English",vi:"Tiếng Việt"};Object.keys(options).forEach(function(value){if(!select.querySelector('option[value="'+value+'"]')){const option=document.createElement("option");option.value=value;option.textContent=options[value];select.appendChild(option);}});}
    function HideLegacyLabel(select){
        if(!select||!select.parentElement)return;
        Array.from(select.parentElement.childNodes).forEach(function(node){
            if(node===select)return;
            if(node.nodeType===Node.ELEMENT_NODE&&node.tagName==="SPAN")node.style.setProperty("display","none","important");
            if(node.nodeType===Node.TEXT_NODE&&/^(language|語言|ngôn ngữ|:)$/i.test(node.textContent.trim()))node.textContent="";
        });
    }
    function SyncSelector(){const chosen=localStorage.getItem("sunriseLanguageChosen")==="1";document.querySelectorAll("[data-language-select],#languageSelect").forEach(function(select){if(!select.hasAttribute("data-language-select"))select.setAttribute("data-language-select","");EnsureOptions(select);HideLegacyLabel(select);select.value=chosen?localStorage.getItem("sunriseLanguage"):"";});}

    document.addEventListener("change",function(event){const select=event.target.closest&&event.target.closest("[data-language-select]");if(select&&Supported.includes(select.value))localStorage.setItem("sunriseLanguageChosen","1");},true);
    document.addEventListener("DOMContentLoaded",function(){AddGlobalStyle();CreateSelector();SyncSelector();EnsureBackButton();[100,300,700,1200].forEach(function(ms){setTimeout(function(){SyncSelector();EnsureBackButton();},ms);});});
    document.addEventListener("sunriseLanguageChanged",function(){SyncSelector();EnsureBackButton();});
})();