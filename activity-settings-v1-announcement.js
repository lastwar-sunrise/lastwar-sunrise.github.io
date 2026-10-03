"use strict";

BuildAnnouncement=function(){
    const lang=$("announcementLanguage").value||"en";
    const name=AnnouncementEventName(lang);
    const level=$("levelText").value.trim();
    const notes=$("notes").value.trim();
    const title="【Sunrisers | "+name+(level?" "+level:"")+"】";
    const times=TimeGroups();
    let intro="";
    let timeTitle="";
    let noteTitle="";
    let closing="";

    if(lang==="zh-TW"){
        intro="Sunrisers，下一場 "+name+" 準備開始啦。大家有空的話一起來參加，活動時間如下：";
        timeTitle="■ 活動時間";
        noteTitle="■ 注意事項";
        closing="※ 到時候見，Sunrisers。一起輕鬆參加、一起拿獎勵。";
    }else if(lang==="vi"){
        intro="Sunrisers, sự kiện "+name+" sắp bắt đầu. Nếu có thời gian, hãy cùng tham gia với mọi người nhé. Thời gian như sau:";
        timeTitle="■ Thời gian";
        noteTitle="■ Lưu ý";
        closing="※ Hẹn gặp mọi người nhé, Sunrisers. Cùng tham gia vui vẻ và nhận phần thưởng.";
    }else{
        intro="Sunrisers, our next "+name+" is coming up. If you're free, come join everyone and enjoy the event together. Times are below:";
        timeTitle="■ Event Time";
        noteTitle="■ Note";
        closing="※ See you there, Sunrisers. Let's enjoy the event and collect the rewards together.";
    }

    const lines=[title,"",intro,"",timeTitle];
    times.forEach(x=>lines.push(x.region+"  "+x.time));
    if(notes){lines.push("",noteTitle,notes);}
    lines.push("",closing);
    return lines.join("\n");
};

RenderAnnouncement();
