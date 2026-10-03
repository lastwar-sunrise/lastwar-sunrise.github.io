"use strict";

(function(){
    const weekInput=document.getElementById("weekStartInput");
    const drawCountInput=document.getElementById("weekDrawCountInput");
    const memberToggle=document.getElementById("memberToggleButton");
    const memberDisclosure=document.getElementById("memberDisclosure");
    let lastAuthState=null;

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
        memberToggle.textContent=open?"－ Hide member list":"＋ Show member list";
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
            ShowMessage(WeekMessage,"請選擇週次開始日。",true);
            return;
        }

        const liveButton=document.getElementById("loadWeekButton");
        liveButton.disabled=true;
        liveButton.textContent="載入中……";

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
                ShowMessage(WeekMessage,"此週尚未建立抽選資料。R4 登入後可建立新週次。",false);
                return;
            }

            CurrentTrainWeek=weekResult.data;
            drawCountInput.value=String(CurrentTrainWeek.draw_count);
            UpdateWeekDisplay();
            await LoadEligibleMembers();

            if(CurrentTrainWeek.status==="completed"){
                await LoadDrawResults();
            }

            ShowMessage(
                WeekMessage,
                CurrentUser&&CurrentTrainWeek.status==="draft"
                    ? "週次已載入，可以編輯合格名單。"
                    : CurrentTrainWeek.status==="completed"
                        ? "此週已完成正式抽選。"
                        : "週次已載入。登入 R4 後可進行修改。",
                false
            );
        }catch(error){
            CurrentTrainWeek=null;
            ResetWeekDisplay();
            ClearAllMembers();
            ShowMessage(WeekMessage,"載入週次失敗："+GetErrorMessage(error),true);
        }finally{
            liveButton.disabled=false;
            liveButton.textContent="載入週次";
            UpdateManagementEnabled();
            liveButton.disabled=false;
        }
    }

    async function previewPoolPublic(){
        ClearPreviewMessage();
        if(!CurrentTrainWeek){
            ShowPreviewMessage("請先載入週次。",true);
            return;
        }

        const liveButton=document.getElementById("previewPoolButton");
        liveButton.disabled=true;
        liveButton.textContent="計算中……";
        PreviewLoading.classList.remove("hidden");
        PoolSummary.classList.add("hidden");
        PoolPreviewList.innerHTML="";

        try{
            const result=await SupabaseClient.rpc("get_train_pool_preview",{p_train_week_id:CurrentTrainWeek.id});
            if(result.error)throw result.error;
            RenderPoolPreview(result.data||[]);
            ShowPreviewMessage("抽獎池預覽已完成。",false);
        }catch(error){
            ShowPreviewMessage("預覽失敗："+GetPreviewErrorMessage(error),true);
        }finally{
            PreviewLoading.classList.add("hidden");
            liveButton.disabled=false;
            liveButton.textContent="預覽抽獎池";
        }
    }

    function replaceActionButton(id,handler){
        const oldButton=document.getElementById(id);
        const newButton=oldButton.cloneNode(true);
        oldButton.parentNode.replaceChild(newButton,oldButton);
        newButton.addEventListener("click",handler);
        return newButton;
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

        replaceActionButton("loadWeekButton",loadWeekPublic);
        replaceActionButton("previewPoolButton",previewPoolPublic);

        setMemberDisclosure(false);
        setTimeout(function(){
            syncDisclosureWithAuth();
            loadWeekPublic();
        },700);
        setInterval(syncDisclosureWithAuth,500);
    });
})();
