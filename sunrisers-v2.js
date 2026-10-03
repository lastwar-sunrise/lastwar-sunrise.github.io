"use strict";

const V2Supabase = window.supabase.createClient(
    SupabaseUrl,
    SupabasePublishableKey
);

const V2Text = {
    "zh-TW": {
        period: "時段", zone: "戰區", red: "🔴 紅星", yes: "有任務", no: "無任務",
        today: "建議派出(當日的)", saved: "建議派出(先前保留的)", save: "建議保留",
        truck: "🚚 貨車", ur: "限 UR", ssr: "優先 SSR 再 UR", event: "✨ 事件",
        zombie: "🧟 殭屍入侵", boss: "👹 狂暴首領(國會周圍)", vanguard: "👨‍🏫 先鋒教官",
        doomsday: "🌋 末日降臨(打3隻阿胖)", none: "無特殊大型活動", drill: "⚔️ 聯盟軍演",
        note: "📝 備註", exp: "需要打完遠征", shop: "購買商店物品", radar: "存雷達",
        mine: "晚上挖礦到隔天10點(不能離開礦點)", on: "護盾 ON (GMT+8 10:00)",
        off: "護盾 OFF (GMT+8 10:00)", noDuty: "暫無設定"
    },
    en: {
        period: "Period", zone: "Zones", red: "🔴 Red Star", yes: "Available", no: "None",
        today: "Dispatch (Today)", saved: "Dispatch (Saved)", save: "SAVE",
        truck: "🚚 Truck", ur: "UR only", ssr: "SSR first, then UR", event: "✨ Event",
        zombie: "🧟 Zombie Invasion", boss: "👹 Rampage Boss", vanguard: "👨‍🏫 Vanguard",
        doomsday: "🌋 Doomsday", none: "No major event", drill: "⚔️ Drill",
        note: "📝 Note", exp: "Complete Campaign", shop: "Purchase Shop Items", radar: "Save Radar tasks",
        mine: "Mine overnight until 10 AM", on: "Shield ON (10:00 AM)", off: "Shield OFF (10:00 AM)",
        noDuty: "Not configured"
    },
    vi: {
        period: "Thời gian", zone: "Chiến khu", red: "🔴 Sao Đỏ", yes: "Có nhiệm vụ", no: "Không có",
        today: "Gửi đi (Hôm nay)", saved: "Gửi đi (Đã lưu)", save: "LƯU LẠI",
        truck: "🚚 Xe tải", ur: "Chỉ UR", ssr: "Ưu tiên SSR -> UR", event: "✨ Sự kiện",
        zombie: "🧟 Thây ma xâm chiếm", boss: "👹 Boss cuồng bạo", vanguard: "👨‍🏫 Huấn luyện viên",
        doomsday: "🌋 Ngày tận thế", none: "Không có sự kiện", drill: "⚔️ Diễn tập liên minh",
        note: "📝 Ghi chú", exp: "Hoàn thành Viễn chinh", shop: "Mua đồ trong Shop", radar: "Lưu nhiệm vụ Radar",
        mine: "Đào mỏ qua đêm", on: "Bật Khiên (09:00 AM ICT)", off: "Tắt Khiên (09:00 AM ICT)",
        noDuty: "Chưa thiết lập"
    }
};

function GetV2Language() {
    return window.i18next && i18next.language ? i18next.language : "zh-TW";
}

function GetV2Text() {
    return V2Text[GetV2Language()] || V2Text.en;
}

function GetTaiwanNow() {
    const now = new Date();
    return new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 8 * 3600000);
}

function GetLogicDate() {
    const now = GetTaiwanNow();
    const logicDate = new Date(now);
    if (now.getHours() < 10) {
        logicDate.setDate(logicDate.getDate() - 1);
    }
    return new Date(logicDate.getFullYear(), logicDate.getMonth(), logicDate.getDate());
}

function GetDutyWeekStart(date) {
    const result = new Date(date);
    const day = result.getDay();
    result.setDate(result.getDate() + (day === 0 ? -6 : 1 - day));
    result.setHours(10, 0, 0, 0);
    if (date < result) {
        result.setDate(result.getDate() - 7);
    }
    return result;
}

function ToDateKey(date) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
}

async function LoadDuty() {
    const dutyElement = document.getElementById("dutyList");
    try {
        const weekStart = ToDateKey(GetDutyWeekStart(GetTaiwanNow()));
        const overrideResult = await V2Supabase.from("duty_week_overrides").select("member_ids").eq("week_start", weekStart).maybeSingle();
        if (overrideResult.error) throw overrideResult.error;
        let memberIds = overrideResult.data ? overrideResult.data.member_ids : null;

        if (!memberIds) {
            const settingsResult = await V2Supabase.from("duty_settings").select("rotation_groups, anchor_week").eq("id", 1).maybeSingle();
            if (settingsResult.error) throw settingsResult.error;
            const settings = settingsResult.data;
            if (settings && Array.isArray(settings.rotation_groups) && settings.rotation_groups.length > 0) {
                const anchor = new Date(settings.anchor_week + "T10:00:00");
                const weeks = Math.floor((GetDutyWeekStart(GetTaiwanNow()) - anchor) / 604800000);
                const groups = settings.rotation_groups;
                const index = ((weeks % groups.length) + groups.length) % groups.length;
                memberIds = groups[index];
            }
        }

        if (!Array.isArray(memberIds) || memberIds.length === 0) {
            dutyElement.textContent = GetV2Text().noDuty;
            return;
        }

        const memberResult = await V2Supabase.from("members").select("id, game_name").in("id", memberIds);
        if (memberResult.error) throw memberResult.error;
        const memberMap = new Map((memberResult.data || []).map(function (member) { return [String(member.id), member.game_name]; }));
        const names = memberIds.map(function (id) { return memberMap.get(String(id)); }).filter(Boolean);
        dutyElement.textContent = names.length > 0 ? names.join(" 、 ") : GetV2Text().noDuty;
    } catch (error) {
        console.error("LoadDuty failed:", error);
        dutyElement.textContent = "讀取失敗";
    }
}

async function LoadTrain() {
    const trainElement = document.getElementById("trainDriver");
    try {
        const now = GetTaiwanNow();
        const currentWeek = ToDateKey(GetDutyWeekStart(now));
        const logicDate = new Date(now);
        if (now.getHours() < 10) logicDate.setDate(logicDate.getDate() - 1);
        const dayOfWeek = logicDate.getDay();

        if (dayOfWeek === 0) {
            trainElement.textContent = "MVP";
            return;
        }

        const overrideResult = await V2Supabase.from("train_schedule_overrides").select("member_ids").eq("week_start", currentWeek).maybeSingle();
        if (overrideResult.error) throw overrideResult.error;
        let memberIds = overrideResult.data ? overrideResult.data.member_ids : null;

        if (!Array.isArray(memberIds) || memberIds.length !== 6) {
            const weekResult = await V2Supabase.from("train_weeks").select("id").eq("week_start", currentWeek).eq("status", "completed").maybeSingle();
            if (weekResult.error) throw weekResult.error;
            if (!weekResult.data) {
                trainElement.textContent = "-";
                return;
            }

            const result = await V2Supabase.from("train_draw_results").select("member_id, draw_order").eq("train_week_id", weekResult.data.id).order("draw_order", { ascending: true });
            if (result.error) throw result.error;
            memberIds = (result.data || []).map(function (row) { return row.member_id; });
        }

        if (!Array.isArray(memberIds) || memberIds.length < dayOfWeek) {
            trainElement.textContent = "-";
            return;
        }

        const memberId = memberIds[dayOfWeek - 1];
        const memberResult = await V2Supabase.from("members").select("game_name").eq("id", memberId).maybeSingle();
        if (memberResult.error) throw memberResult.error;
        trainElement.textContent = memberResult.data ? memberResult.data.game_name : "-";
    } catch (error) {
        console.error("LoadTrain failed:", error);
        trainElement.textContent = "讀取失敗";
    }
}

function RenderStrategy() {
    const text = GetV2Text();
    const logicZero = GetLogicDate();
    const zones = [
        ["1769","1772","1775","1776","1783","1789","1790","1793","1796"],
        ["1765","1770","1771","1777","1778","1779","1784","1785","1791","1797"],
        ["1766","1767","1768","1773","1774","1780","1781","1782","1786","1787","1788","1792","1794","1795"]
    ];
    const baseRotation = new Date(2026, 2, 20);
    let zoneIndex = Math.floor((logicZero - baseRotation) / 86400000) % 3;
    if (zoneIndex < 0) zoneIndex += 3;
    const displayHour = GetV2Language() === "vi" ? 9 : 10;
    const displayEnd = new Date(logicZero.getTime() + 86400000);

    document.getElementById("zone").innerHTML =
        "<strong>" + text.period + "：</strong>" + (logicZero.getMonth() + 1) + "/" + logicZero.getDate() + " " + displayHour + ":00 AM ~ " +
        (displayEnd.getMonth() + 1) + "/" + displayEnd.getDate() + " " + displayHour + ":00 AM " +
        (GetV2Language() === "vi" ? "(GMT+7)" : "(GMT+8)") +
        "<br><strong>" + text.zone + "：</strong>" + zones[zoneIndex].join(", ");

    let strategyHtml = "";
    for (let index = 0; index < 7; index += 1) {
        const loopDate = new Date(logicZero.getTime() + index * 86400000);
        const dayOfWeek = loopDate.getDay();
        const hasRed = Math.floor((loopDate - new Date(2026, 2, 24)) / 86400000) % 3 === 0;
        const isSpecialDay = dayOfWeek === 2 || dayOfWeek === 6;
        const isWeekOne = Math.floor((loopDate - new Date(2026, 3, 6)) / (7 * 86400000)) % 2 === 0;
        const hasDrill = Math.floor((loopDate - new Date(2026, 3, 6)) / 86400000) % 2 !== 0;
        let redContent = hasRed ? "<span class='red'>" + text.yes + "</span> / " : text.no;

        if (hasRed) {
            if (isSpecialDay) {
                redContent += "<span class='green'>" + text.today + "</span>";
            } else {
                let willSave = false;
                for (let offset = 1; offset <= 2; offset += 1) {
                    if (new Date(loopDate.getTime() + offset * 86400000).getDay() % 4 === 2) willSave = true;
                }
                redContent += willSave ? "<span class='red'>" + text.save + "</span>" : "<span class='green'>" + text.today + "</span>";
            }
        } else if (isSpecialDay) {
            redContent += " / <span class='green'>" + text.saved + "</span>";
        }

        let mainEvent = "";
        if (isWeekOne) {
            if (dayOfWeek >= 3 && dayOfWeek <= 5) mainEvent = text.zombie;
            else if (dayOfWeek === 0) mainEvent = text.boss;
        } else {
            if (dayOfWeek >= 3 && dayOfWeek <= 5) mainEvent = text.vanguard;
            else if (dayOfWeek === 0) mainEvent = text.doomsday;
        }

        let eventDisplay = mainEvent || text.none;
        if (hasDrill) eventDisplay += " / " + text.drill;
        const notes = [];
        if ([1, 3, 5].includes(dayOfWeek)) notes.push(text.exp);
        if (dayOfWeek === 0) notes.push(text.shop);
        if ([0, 2, 4].includes(dayOfWeek)) notes.push(text.radar);
        if (dayOfWeek === 0) notes.push(text.mine);

        let row =
            "<strong>" + loopDate.toLocaleDateString(GetV2Language(), { month: "2-digit", day: "2-digit", weekday: "long" }) + "</strong>" +
            "<br>└ " + text.red + "：" + redContent +
            "<br>└ " + text.truck + "：<span class='" + (isSpecialDay ? "gold" : "purple") + "'>" + (isSpecialDay ? text.ur : text.ssr) + "</span>" +
            "<br>└ " + text.event + "：<span class='event-text'>" + eventDisplay + "</span>";

        if (notes.length > 0) row += "<br>└ " + text.note + "：<span class='note-text'>" + notes.join(" / ") + "</span>";
        if (dayOfWeek === 6) row += "<br>└ 🛡️ <span class='shield-alert'>" + text.on + "</span>";
        else if (dayOfWeek === 0) row += "<br>└ 🛡️ <span class='shield-alert'>" + text.off + "</span>";

        strategyHtml += index === 0 ? "<div class='today-row'>" + row + "</div>" : row;
        if (index < 6) strategyHtml += "<hr>";
    }

    document.getElementById("strategy").innerHTML = strategyHtml;
}

document.addEventListener("DOMContentLoaded", function () {
    RenderStrategy();
    LoadDuty();
    LoadTrain();
});

document.addEventListener("sunriseLanguageChanged", function () {
    RenderStrategy();
    LoadDuty();
    LoadTrain();
});
