"use strict";

(function(){
    const weekInput=document.getElementById("weekStartInput");
    const drawCountInput=document.getElementById("weekDrawCountInput");
    const memberToggle=document.getElementById("memberToggleButton");
    const memberDisclosure=document.getElementById("memberDisclosure");
    let lastAuthState=null;

    function lang(){
        const value=(window.i18next&&i18next.language)||localStorage.getItem("sunriseLanguage")||"en";
        return value==="zh-TW"||value==="vi"?value:"en";
    }

    function t(key){
        const texts={
            en:{show:"＋ Show member list",hide:"－ Hide member list",chooseWeek:"Please select a week start date.",loading:"Loading…",load:"Load Week",missing:"No draw data exists for this week. Sign in as R4 to create it.",editable:"Week loaded. You can edit the eligible list.",completed:"This week’s official draw is complete.",readonly:"Week loaded. Sign in as R4 to make changes.",loadFailed:"Failed to load week: ",signing:"Signing in…",signIn:"Sign In",saving:"Saving…",save:"Save Weekly Eligibility",drawing:"Drawing…",draw:"Official Draw",reloading:"Reloading…",reload:"Reload Members"},
            "zh-TW":{show:"＋ 展開成員名單",hide:"－ 收合成員名單",chooseWeek:"請選擇週次開始日。",loading:"載入中……",load:"載入週次",missing:"此週尚未建立抽選資料。R4 登入後可建立新週次。",editable:"週次已載入，可以編輯合格名單。",completed:"此週已完成正式抽選。",readonly:"週次已載入。登入 R4 後可進行修改。",loadFailed:"載入週次失敗：",signing:"登入中……",signIn:"登入",saving:"儲存中……",save:"儲存合格名單",drawing:"抽選中……",draw:"正式抽選",reloading:"重新載入中……",reload:"重新載入成員"},
            vi:{show:"＋ Hiện danh sách thành viên",hide:"－ Ẩn danh sách thành viên",chooseWeek:"Vui lòng chọn ngày bắt đầu tuần.",loading:"Đang tải…",load:"Tải tuần",missing:"Tuần này chưa có dữ liệu quay. Đăng nhập R4 để tạo tuần mới.",editable:"Đã tải tuần. Bạn có thể chỉnh sửa danh sách đủ điều kiện.",completed:"Tuần này đã hoàn tất quay chính thức.",readonly:"Đã tải tuần. Đăng nhập R4 để chỉnh sửa.",loadFailed:"Tải tuần thất bại: ",signing:"Đang đăng nhập…",signIn:"Đăng nhập",saving:"Đang lưu…",save:"Lưu danh sách đủ điều kiện",drawing:"Đang quay…",draw:"Quay chính thức",reloading:"Đang tải lại…",reload:"Tải lại thành viên"}
        };
        return texts[lang()][key];
    }

    function formatDate(date){
        const y=date.getFullYear();
        const m=String(date.getMonth()+1).padStart(2,"0");
        const d=String(date.getDate()).padStart(2,"0");
        return y+"-"+m+"-"+d;
    }

    function normalizeToMonday(value){
        if(!value)return value;
        const p=value.split("-").map(Number);
        if(p.length!==3||!p[0]||!p[1]||!p[2])return value;
        const date=new Date(p[0],p[1]-1,p[2]);
        const day=date.getDay();
        const diff=day===0?-6:1-day;
        date.setDate(date.getDate()+diff);
        return formatDate(date);
    }

    function setMemberDisclosure(open){
        memberDisclosure.classList.toggle("hidden",!open);
        memberToggle.setAttribute("aria-expanded",open?"true":"false");
        memberToggle.textContent=open?t("hide"):t("show");
    }

    function syncDisclosureWithAuth(){
        const loggedIn=typeof CurrentUser!=="undefined"&&CurrentUser!==null;
        if(lastAuthState===loggedIn)return;
        lastAuthState=loggedIn;
        setMemberDisclosure(loggedIn);
    }

    async function loadWeekPublic(){
        ClearMessage(WeekMessage);
        ClearDrawResult();

        const normalized=normalizeToMonday(weekInput.value);
        if(normalized!==weekInput.value)weekInput.value=normalized;
        const weekStart=weekInput.value;
        if(!weekStart){
            ShowMessage(WeekMessage,t("chooseWeek"),true);
            return;
        }

        const liveButton=document.getElementById("loadWeekButton");
        liveButton.disabled=true;
        liveButton.textContent=t("loading");

        try{
            const weekResult=await SupabaseClient
                .from("train_weeks")
                .select("id, week_start, draw_count, status, created_at, completed_at")
                .eq("week_start",weekStart)
                .maybeSingle();

            if(weekResult.error)throw weekResult.error;

            if(!weekResult.data){
                if(CurrentUser){
                    await LoadTrainWeek();
                    return;
                }
                CurrentTrainWeek=null;
                ResetWeekDisplay();
                ClearAllMembers();
                ShowMessage(WeekMessage,t("missing"),false);
                return;
            }

            CurrentTrainWeek=weekResult.data;
            drawCountInput.value=String(CurrentTrainWeek.draw_count);
            UpdateWeekDisplay();
            await LoadEligibleMembers();

            if(CurrentTrainWeek.status==="completed")await LoadDrawResults();

            ShowMessage(
                WeekMessage,
                CurrentUser&&CurrentTrainWeek.status==="draft"
                    ? t("editable")
                    : CurrentTrainWeek.status==="completed"
                        ? t("completed")
                        : t("readonly"),
                false
            );
        }catch(error){
            CurrentTrainWeek=null;
            ResetWeekDisplay();
            ClearAllMembers();
            ShowMessage(WeekMessage,t("loadFailed")+GetErrorMessage(error),true);
        }finally{
            liveButton.disabled=false;
            liveButton.textContent=t("load");
            UpdateManagementEnabled();
            liveButton.disabled=false;
        }
    }

    function translateDynamicButtons(){
        const mappings={
            "登入中……":"signing","登入":"signIn","儲存中……":"saving","儲存合格名單":"save",
            "抽選中……":"drawing","正式抽選":"draw","重新載入中……":"reloading","重新載入成員":"reload",
            "載入中……":"loading","載入週次":"load"
        };
        document.querySelectorAll("button").forEach(function(button){
            const key=mappings[button.textContent.trim()];
            if(key)button.textContent=t(key);
        });
    }

    document.addEventListener("DOMContentLoaded",function(){
        drawCountInput.value="6";

        weekInput.addEventListener("change",function(){
            const monday=normalizeToMonday(this.value);
            if(monday)this.value=monday;
            loadWeekPublic();
        });

        memberToggle.addEventListener("click",function(){
            setMemberDisclosure(memberDisclosure.classList.contains("hidden"));
        });

        const loadButton=document.getElementById("loadWeekButton");
        loadButton.addEventListener("click",function(event){
            event.preventDefault();
            event.stopImmediatePropagation();
            loadWeekPublic();
        },true);

        const observer=new MutationObserver(translateDynamicButtons);
        observer.observe(document.body,{subtree:true,childList:true,characterData:true});

        setMemberDisclosure(false);
        setTimeout(function(){
            syncDisclosureWithAuth();
            translateDynamicButtons();
            loadWeekPublic();
        },700);
        setInterval(syncDisclosureWithAuth,500);
    });

    document.addEventListener("sunriseLanguageChanged",function(){
        setMemberDisclosure(!memberDisclosure.classList.contains("hidden"));
        translateDynamicButtons();
    });
})();
