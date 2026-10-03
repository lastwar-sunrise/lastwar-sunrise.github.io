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

    function FindSelector(){
        const select=document.querySelector("[data-language-select],#languageSelect");
        if(select&&!select.hasAttribute("data-language-select"))select.setAttribute("data-language-select","");
        return select;
    }

    function CreateSelector(){
        let select=FindSelector();
        if(select)return select;
        const wrap=document.createElement("div");
        wrap.className="sunrise-global-language";
        wrap.style.cssText="position:fixed;top:10px;right:10px;z-index:9000";
        select=document.createElement("select");
        select.setAttribute("data-language-select","");
        select.setAttribute("aria-label","Language");
        select.style.cssText="min-height:38px;border:1px solid #c9c9c9;border-radius:10px;padding:6px 10px;background:#fff;font:inherit";
        select.addEventListener("change",function(){if(this.value)ChangeSunriseLanguage(this.value);});
        wrap.appendChild(select);
        document.body.appendChild(wrap);
        return select;
    }

    function EnsureOptions(select){
        let placeholder=select.querySelector('option[value=""]');
        if(!placeholder){placeholder=document.createElement("option");placeholder.value="";placeholder.textContent="Language";select.insertBefore(placeholder,select.firstChild);}
        const options={"zh-TW":"繁體中文",en:"English",vi:"Tiếng Việt"};
        Object.keys(options).forEach(function(value){if(!select.querySelector('option[value="'+value+'"]')){const option=document.createElement("option");option.value=value;option.textContent=options[value];select.appendChild(option);}});
    }

    function HideLegacyLabel(select){
        if(!select||!select.parentElement)return;
        Array.from(select.parentElement.children).forEach(function(el){if(el!==select&&el.tagName==="SPAN")el.style.display="none";});
    }

    function SyncSelector(){
        const chosen=localStorage.getItem("sunriseLanguageChosen")==="1";
        document.querySelectorAll("[data-language-select],#languageSelect").forEach(function(select){if(!select.hasAttribute("data-language-select"))select.setAttribute("data-language-select","");EnsureOptions(select);HideLegacyLabel(select);select.value=chosen?localStorage.getItem("sunriseLanguage"):"";});
    }

    document.addEventListener("change",function(event){const select=event.target.closest&&event.target.closest("[data-language-select]");if(select&&Supported.includes(select.value))localStorage.setItem("sunriseLanguageChosen","1");},true);
    document.addEventListener("DOMContentLoaded",function(){CreateSelector();SyncSelector();setTimeout(SyncSelector,150);});
    document.addEventListener("sunriseLanguageChanged",function(){SyncSelector();});
})();