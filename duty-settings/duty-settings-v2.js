"use strict";

(function(){
    const Text={
        en:{button:"Time Converter",title:"Announcement Time Converter",time:"Time (UTC+8)",copy:"Copy Time Text",copied:"Copied",note:"Choose the UTC+8 activity time. The text below can be pasted directly into a game announcement."},
        "zh-TW":{button:"時間換算",title:"公告時間換算",time:"時間（UTC+8）",copy:"複製時間文字",copied:"已複製",note:"選擇 UTC+8 的活動時間，下方文字可直接貼進遊戲公告。"},
        vi:{button:"Đổi giờ",title:"Đổi giờ thông báo",time:"Thời gian (UTC+8)",copy:"Sao chép thời gian",copied:"Đã sao chép",note:"Chọn giờ hoạt động theo UTC+8. Phần bên dưới có thể dán trực tiếp vào thông báo trong game."}
    };

    function Lang(){
        const l=(window.i18next&&i18next.language)||localStorage.getItem("sunriseLanguage")||"en";
        return Text[l]?l:"en";
    }

    function T(key){return Text[Lang()][key]||Text.en[key]||key;}

    function ShiftTime(time,diffMinutes){
        if(!time)return"--:--";
        const p=time.split(":"),base=parseInt(p[0],10)*60+parseInt(p[1],10),raw=base+diffMinutes;
        const normalized=((raw%1440)+1440)%1440;
        const h=Math.floor(normalized/60),m=normalized%60;
        return String(h).padStart(2,"0")+":"+String(m).padStart(2,"0");
    }

    function BuildText(){
        const input=document.getElementById("timezoneTimeInput");
        const time=input&&input.value?input.value:"21:00";
        const utc8=ShiftTime(time,0);
        const utc7=ShiftTime(time,-60);
        const india=ShiftTime(time,-150);
        const pakistan=ShiftTime(time,-180);
        return [
            "Time:",
            "TW/HK/SG/PH "+utc8,
            "VN/TH/ID "+utc7,
            "IN "+india+" / PK "+pakistan
        ].join("\n");
    }

    function Render(){
        const output=document.getElementById("timezoneOutput");
        if(output)output.value=BuildText();
    }

    function ApplyLanguage(){
        const button=document.getElementById("timezoneToggleButton");
        const title=document.getElementById("timezoneToolTitle");
        const label=document.getElementById("timezoneTimeLabel");
        const copy=document.getElementById("timezoneCopyButton");
        const note=document.getElementById("timezoneToolNote");
        if(button)button.textContent=T("button");
        if(title)title.textContent=T("title");
        if(label)label.textContent=T("time");
        if(copy)copy.textContent=T("copy");
        if(note)note.textContent=T("note");
    }

    async function Copy(){
        const output=document.getElementById("timezoneOutput"),status=document.getElementById("timezoneCopyStatus");
        if(!output)return;
        try{
            await navigator.clipboard.writeText(output.value);
            if(status){status.textContent=T("copied");setTimeout(()=>{status.textContent="";},1600);}
        }catch(e){
            output.focus();output.select();
        }
    }

    document.addEventListener("DOMContentLoaded",function(){
        const toggle=document.getElementById("timezoneToggleButton"),panel=document.getElementById("timezoneTool"),input=document.getElementById("timezoneTimeInput"),copy=document.getElementById("timezoneCopyButton");
        ApplyLanguage();Render();
        if(toggle&&panel)toggle.addEventListener("click",function(){panel.classList.toggle("hidden");if(!panel.classList.contains("hidden"))Render();});
        if(input)input.addEventListener("input",Render);
        if(copy)copy.addEventListener("click",Copy);
        document.addEventListener("sunriseLanguageChanged",ApplyLanguage);
    });
})();