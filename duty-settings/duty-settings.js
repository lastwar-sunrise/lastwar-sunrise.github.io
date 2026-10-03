"use strict";

Object.assign(SunriseTranslations["zh-TW"].translation, {
    dutySettings: {
        back: "← Sunrise V2",
        title: "內務名單設定",
        intro: "所有成員都可以直接檢視目前排班；只有 R4 / admin 登入後可以修改。",
        viewMode: "檢視模式",
        editMode: "編輯模式",
        publicView: "未登入也可檢視",
        noPermission: "此帳號無修改權限",
        loggedIn: "已登入：{{account}}",
        accountPlaceholder: "帳號",
        passwordPlaceholder: "密碼",
        login: "R4 / Admin 登入",
        logout: "登出",
        loginFailed: "登入失敗：{{error}}",
        trainTitle: "本週火車順序",
        trainHelp: "週一到週六依本週正式抽選結果顯示；週日固定為 MVP。臨時交換只改本週排班，不會修改原始抽選紀錄。",
        noTrainResult: "本週尚無完成的正式抽選結果。",
        trainReadFailed: "讀取抽選結果失敗。",
        trainCountInvalid: "本週正式抽選結果不是 6 人，無法建立週一到週六順序。",
        saveTrain: "儲存火車順序",
        restoreTrain: "恢復原始抽選順序",
        trainSaved: "本週火車順序已儲存",
        trainRestored: "已恢復原始抽選順序",
        trainDuplicate: "週一到週六必須各使用不同的 6 位抽選成員。",
        dutyOverrideTitle: "本週值日生 override",
        dutyOverrideHelp: "用於臨時交換本週值日生；未設定 override 時會依輪替群組自動計算。",
        saveDuty: "儲存本週調整",
        restoreDuty: "恢復自動輪替",
        dutySaved: "本週值日生已儲存",
        dutyRestored: "已恢復自動輪替",
        rotationTitle: "值日生輪替群組（每組可多人）",
        rotationHelp: "這是長期輪替設定，通常只需設定一次。",
        anchorWeek: "基準週",
        addGroup: "＋新增一週群組",
        saveRotation: "儲存輪替",
        rotationSaved: "輪替設定已儲存",
        noGroups: "尚未設定輪替群組。",
        weekN: "第 {{number}} 週",
        delete: "刪除",
        monday: "週一",
        tuesday: "週二",
        wednesday: "週三",
        thursday: "週四",
        friday: "週五",
        saturday: "週六",
        sunday: "週日",
        loading: "載入中..."
    }
});

Object.assign(SunriseTranslations.en.translation, {
    dutySettings: {
        back: "← Sunrise V2",
        title: "Internal Roster Settings",
        intro: "All members can view the current roster. Only R4 / admin accounts can make changes.",
        viewMode: "View mode",
        editMode: "Edit mode",
        publicView: "Available to view without signing in",
        noPermission: "This account does not have edit permission",
        loggedIn: "Signed in: {{account}}",
        accountPlaceholder: "Account",
        passwordPlaceholder: "Password",
        login: "R4 / Admin Sign In",
        logout: "Sign Out",
        loginFailed: "Sign-in failed: {{error}}",
        trainTitle: "This Week's Train Schedule",
        trainHelp: "Monday through Saturday follow this week's official draw. Sunday is always MVP. Swaps only change this week's roster and do not modify the original draw results.",
        noTrainResult: "No completed official draw is available for this week.",
        trainReadFailed: "Failed to load draw results.",
        trainCountInvalid: "This week's official draw does not contain 6 members, so a Monday–Saturday schedule cannot be created.",
        saveTrain: "Save Train Schedule",
        restoreTrain: "Restore Original Draw Order",
        trainSaved: "This week's train schedule has been saved",
        trainRestored: "Original draw order restored",
        trainDuplicate: "Monday through Saturday must use all 6 drawn members exactly once.",
        dutyOverrideTitle: "This Week's Duty Override",
        dutyOverrideHelp: "Use this for temporary duty swaps. Without an override, the automatic rotation is used.",
        saveDuty: "Save This Week",
        restoreDuty: "Restore Automatic Rotation",
        dutySaved: "This week's duty roster has been saved",
        dutyRestored: "Automatic rotation restored",
        rotationTitle: "Duty Rotation Groups (Multiple Members Allowed)",
        rotationHelp: "This is the long-term rotation and normally only needs to be configured once.",
        anchorWeek: "Anchor week",
        addGroup: "+ Add Weekly Group",
        saveRotation: "Save Rotation",
        rotationSaved: "Rotation settings saved",
        noGroups: "No rotation groups have been configured.",
        weekN: "Week {{number}}",
        delete: "Delete",
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday",
        loading: "Loading..."
    }
});

Object.assign(SunriseTranslations.vi.translation, {
    dutySettings: {
        back: "← Sunrise V2",
        title: "Cài đặt danh sách nội bộ",
        intro: "Tất cả thành viên đều có thể xem lịch hiện tại; chỉ tài khoản R4 / admin mới có thể chỉnh sửa.",
        viewMode: "Chế độ xem",
        editMode: "Chế độ chỉnh sửa",
        publicView: "Có thể xem mà không cần đăng nhập",
        noPermission: "Tài khoản này không có quyền chỉnh sửa",
        loggedIn: "Đã đăng nhập: {{account}}",
        accountPlaceholder: "Tài khoản",
        passwordPlaceholder: "Mật khẩu",
        login: "Đăng nhập R4 / Admin",
        logout: "Đăng xuất",
        loginFailed: "Đăng nhập thất bại: {{error}}",
        trainTitle: "Lịch lái tàu tuần này",
        trainHelp: "Thứ Hai đến Thứ Bảy theo kết quả bốc thăm chính thức của tuần này; Chủ Nhật luôn là MVP. Việc đổi lịch chỉ thay đổi lịch tuần này, không sửa kết quả bốc thăm gốc.",
        noTrainResult: "Tuần này chưa có kết quả bốc thăm chính thức đã hoàn tất.",
        trainReadFailed: "Không thể tải kết quả bốc thăm.",
        trainCountInvalid: "Kết quả bốc thăm chính thức tuần này không đủ 6 người nên không thể tạo lịch từ Thứ Hai đến Thứ Bảy.",
        saveTrain: "Lưu lịch lái tàu",
        restoreTrain: "Khôi phục thứ tự bốc thăm gốc",
        trainSaved: "Đã lưu lịch lái tàu tuần này",
        trainRestored: "Đã khôi phục thứ tự bốc thăm gốc",
        trainDuplicate: "Thứ Hai đến Thứ Bảy phải dùng đủ 6 thành viên đã được bốc thăm và không được trùng.",
        dutyOverrideTitle: "Điều chỉnh trực nhật tuần này",
        dutyOverrideHelp: "Dùng khi cần đổi người trực tạm thời trong tuần này. Nếu không có điều chỉnh, hệ thống sẽ dùng lịch luân phiên tự động.",
        saveDuty: "Lưu điều chỉnh tuần này",
        restoreDuty: "Khôi phục luân phiên tự động",
        dutySaved: "Đã lưu danh sách trực tuần này",
        dutyRestored: "Đã khôi phục luân phiên tự động",
        rotationTitle: "Nhóm luân phiên trực nhật (có thể nhiều người)",
        rotationHelp: "Đây là lịch luân phiên dài hạn và thường chỉ cần thiết lập một lần.",
        anchorWeek: "Tuần mốc",
        addGroup: "+ Thêm nhóm tuần",
        saveRotation: "Lưu luân phiên",
        rotationSaved: "Đã lưu cài đặt luân phiên",
        noGroups: "Chưa thiết lập nhóm luân phiên.",
        weekN: "Tuần {{number}}",
        delete: "Xóa",
        monday: "Thứ Hai",
        tuesday: "Thứ Ba",
        wednesday: "Thứ Tư",
        thursday: "Thứ Năm",
        friday: "Thứ Sáu",
        saturday: "Thứ Bảy",
        sunday: "Chủ Nhật",
        loading: "Đang tải..."
    }
});

const db = window.supabase.createClient(
    SupabaseUrl,
    SupabasePublishableKey
);

let members = [];
let groups = [];
let trainOriginalIds = [];
let currentUser = null;
let currentProfile = null;
let canEdit = false;

const $ = function (id) {
    return document.getElementById(id);
};

function DT(key, options) {
    return SunriseT(
        "dutySettings." + key,
        options || {}
    );
}

function week() {
    const now = new Date(
        new Date().toLocaleString(
            "en-US",
            { timeZone: "Asia/Taipei" }
        )
    );

    const day = now.getDay();
    const start = new Date(now);

    start.setDate(
        now.getDate() +
        (day === 0 ? -6 : 1 - day)
    );
    start.setHours(10, 0, 0, 0);

    if (now < start) {
        start.setDate(start.getDate() - 7);
    }

    return (
        start.getFullYear() +
        "-" +
        String(start.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(start.getDate()).padStart(2, "0")
    );
}

function applyDutyTranslations() {
    document.documentElement.lang = i18next.language;

    document.querySelectorAll("[data-duty-i18n]").forEach(
        function (element) {
            element.textContent = DT(element.dataset.dutyI18n);
        }
    );

    document.querySelectorAll("[data-duty-i18n-placeholder]").forEach(
        function (element) {
            element.placeholder = DT(element.dataset.dutyI18nPlaceholder);
        }
    );

    $("languageSelect").value = i18next.language;
    updateMode();
    renderGroups();
    loadTrainSchedule();
}

async function loadProfile() {
    currentProfile = null;
    canEdit = false;

    const sessionResult = await db.auth.getSession();
    currentUser = sessionResult.data.session
        ? sessionResult.data.session.user
        : null;

    if (!currentUser) {
        return;
    }

    const result = await db
        .from("profiles")
        .select("role")
        .eq("id", currentUser.id)
        .maybeSingle();

    if (result.data) {
        currentProfile = result.data;
        const role = String(currentProfile.role || "").toLowerCase();
        canEdit = role === "admin" || role === "r4";
    }
}

function updateMode() {
    if (!$("modeBadge")) return;

    $("modeBadge").classList.toggle("mode-edit", canEdit);
    $("modeBadge").textContent = canEdit
        ? DT("editMode")
        : DT("viewMode");

    $("loginFormArea").classList.toggle("hidden", currentUser !== null);
    $("loggedArea").classList.toggle("hidden", currentUser === null);

    if (currentUser) {
        $("loggedAccount").textContent = DT(
            "loggedIn",
            {
                account: GetSunriseAccountDisplay(currentUser.email)
            }
        );

        $("status").textContent = canEdit
            ? ""
            : DT("noPermission");
    } else {
        $("loggedAccount").textContent = "";
        $("status").textContent = DT("publicView");
    }

    $("trainActions").classList.toggle("hidden", !canEdit);
    $("dutyOverrideActions").classList.toggle("hidden", !canEdit);
    $("rotationActions").classList.toggle("hidden", !canEdit);
    $("anchor").disabled = !canEdit;

    document
        .querySelectorAll("#groups input, #overrideMembers input, .train-select")
        .forEach(function (element) {
            element.disabled = !canEdit;
        });

    document
        .querySelectorAll("#groups [data-del]")
        .forEach(function (button) {
            button.classList.toggle("hidden", !canEdit);
        });
}

async function loadMembers() {
    const result = await db
        .from("members")
        .select("id, game_name, is_active, sort_order")
        .order("sort_order", { ascending: true })
        .order("game_name", { ascending: true });

    members = result.data || [];
}

function checks(selected, name) {
    const container = document.createElement("div");
    const selectedIds = (selected || []).map(String);

    members
        .filter(function (member) {
            return member.is_active;
        })
        .forEach(function (member) {
            const label = document.createElement("label");
            label.className = "member";

            const input = document.createElement("input");
            input.type = "checkbox";
            input.value = String(member.id);
            input.checked = selectedIds.includes(String(member.id));
            input.disabled = !canEdit;

            const span = document.createElement("span");
            span.textContent = member.game_name;
            span.setAttribute("translate", "no");

            label.appendChild(input);
            label.appendChild(span);
            container.appendChild(label);
        });

    container.dataset.name = name;
    return container;
}

function renderGroups() {
    if (!$("groups")) return;

    $("groups").innerHTML = "";

    if (groups.length === 0) {
        $("groups").textContent = DT("noGroups");
        return;
    }

    groups.forEach(function (group, index) {
        const box = document.createElement("div");
        box.className = "group";

        const title = document.createElement("b");
        title.textContent = DT("weekN", { number: index + 1 });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.dataset.del = String(index);
        deleteButton.textContent = DT("delete");
        deleteButton.classList.toggle("hidden", !canEdit);
        deleteButton.addEventListener("click", function () {
            if (!canEdit) return;
            groups.splice(index, 1);
            renderGroups();
        });

        box.appendChild(title);
        box.appendChild(document.createTextNode(" "));
        box.appendChild(deleteButton);
        box.appendChild(checks(group, "g" + index));
        $("groups").appendChild(box);
    });
}

async function loadDutySettings() {
    const result = await db
        .from("duty_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

    const settings = result.data;
    groups = settings && Array.isArray(settings.rotation_groups)
        ? settings.rotation_groups
        : [];

    $("anchor").value = settings && settings.anchor_week
        ? settings.anchor_week
        : week();

    renderGroups();
}

async function loadOverride() {
    const result = await db
        .from("duty_week_overrides")
        .select("member_ids")
        .eq("week_start", week())
        .maybeSingle();

    let selected = [];

    if (result.data && Array.isArray(result.data.member_ids)) {
        selected = result.data.member_ids;
    } else {
        const settingsResult = await db
            .from("duty_settings")
            .select("rotation_groups, anchor_week")
            .eq("id", 1)
            .maybeSingle();

        const settings = settingsResult.data;

        if (
            settings &&
            Array.isArray(settings.rotation_groups) &&
            settings.rotation_groups.length > 0
        ) {
            const current = new Date(week() + "T10:00:00");
            const anchor = new Date(settings.anchor_week + "T10:00:00");
            const weeks = Math.floor((current - anchor) / 604800000);
            const index = ((weeks % settings.rotation_groups.length) + settings.rotation_groups.length) % settings.rotation_groups.length;
            selected = settings.rotation_groups[index];
        }
    }

    $("overrideMembers").innerHTML = "";
    $("overrideMembers").appendChild(checks(selected, "override"));
}

async function loadTrainSchedule() {
    if (!$("trainSchedule")) return;

    const currentWeek = week();
    $("trainSchedule").textContent = DT("loading");

    const weekResult = await db
        .from("train_weeks")
        .select("id")
        .eq("week_start", currentWeek)
        .eq("status", "completed")
        .maybeSingle();

    if (weekResult.error || !weekResult.data) {
        $("trainSchedule").textContent = DT("noTrainResult");
        trainOriginalIds = [];
        return;
    }

    const drawResult = await db
        .from("train_draw_results")
        .select("member_id, draw_order")
        .eq("train_week_id", weekResult.data.id)
        .order("draw_order", { ascending: true });

    if (drawResult.error) {
        $("trainSchedule").textContent = DT("trainReadFailed");
        return;
    }

    trainOriginalIds = (drawResult.data || []).map(function (row) {
        return row.member_id;
    });

    if (trainOriginalIds.length !== 6) {
        $("trainSchedule").textContent = DT("trainCountInvalid");
        return;
    }

    const overrideResult = await db
        .from("train_schedule_overrides")
        .select("member_ids")
        .eq("week_start", currentWeek)
        .maybeSingle();

    const activeIds =
        overrideResult.data &&
        Array.isArray(overrideResult.data.member_ids) &&
        overrideResult.data.member_ids.length === 6
            ? overrideResult.data.member_ids
            : trainOriginalIds;

    const memberResult = await db
        .from("members")
        .select("id, game_name")
        .in("id", trainOriginalIds);

    const memberMap = new Map(
        (memberResult.data || []).map(function (member) {
            return [String(member.id), member.game_name];
        })
    );

    const labels = [
        DT("monday"),
        DT("tuesday"),
        DT("wednesday"),
        DT("thursday"),
        DT("friday"),
        DT("saturday")
    ];

    $("trainSchedule").innerHTML = "";

    labels.forEach(function (label, index) {
        const row = document.createElement("div");
        row.className = "train-row";

        const day = document.createElement("strong");
        day.textContent = label;

        const select = document.createElement("select");
        select.className = "train-select";
        select.disabled = !canEdit;

        trainOriginalIds.forEach(function (id) {
            const option = document.createElement("option");
            option.value = String(id);
            option.textContent = memberMap.get(String(id)) || String(id);
            if (String(activeIds[index]) === String(id)) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        row.appendChild(day);
        row.appendChild(select);
        $("trainSchedule").appendChild(row);
    });

    const sunday = document.createElement("div");
    sunday.className = "train-row";

    const sundayLabel = document.createElement("strong");
    sundayLabel.textContent = DT("sunday");

    const mvp = document.createElement("span");
    mvp.textContent = "MVP";

    sunday.appendChild(sundayLabel);
    sunday.appendChild(mvp);
    $("trainSchedule").appendChild(sunday);
}

async function loadAll() {
    await loadProfile();
    await loadMembers();
    await Promise.all([
        loadDutySettings(),
        loadOverride(),
        loadTrainSchedule()
    ]);
    updateMode();
}

$("languageSelect").addEventListener("change", function () {
    ChangeSunriseLanguage(this.value);
});

$("loginBtn").addEventListener("click", async function () {
    const result = await db.auth.signInWithPassword({
        email: NormalizeSunriseAccount($("account").value),
        password: $("password").value
    });

    if (result.error) {
        $("status").textContent = DT("loginFailed", { error: result.error.message });
        return;
    }

    $("password").value = "";
    await loadAll();
});

$("password").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        $("loginBtn").click();
    }
});

$("logoutBtn").addEventListener("click", async function () {
    await db.auth.signOut({ scope: "local" });
    await loadAll();
});

$("addGroup").addEventListener("click", function () {
    if (!canEdit) return;
    groups.push([]);
    renderGroups();
});

$("save").addEventListener("click", async function () {
    if (!canEdit) return;

    groups = [...$("groups").querySelectorAll("[data-name]")].map(
        function (container) {
            return [...container.querySelectorAll("input:checked")].map(
                function (input) {
                    return +input.value;
                }
            );
        }
    );

    const result = await db.from("duty_settings").upsert({
        id: 1,
        anchor_week: $("anchor").value,
        rotation_groups: groups,
        updated_at: new Date().toISOString()
    });

    $("status").textContent = result.error
        ? result.error.message
        : DT("rotationSaved");
});

$("saveOverride").addEventListener("click", async function () {
    if (!canEdit) return;

    const ids = [...$("overrideMembers").querySelectorAll("input:checked")].map(
        function (input) {
            return +input.value;
        }
    );

    const result = await db.from("duty_week_overrides").upsert(
        {
            week_start: week(),
            member_ids: ids,
            updated_at: new Date().toISOString()
        },
        { onConflict: "week_start" }
    );

    $("status").textContent = result.error
        ? result.error.message
        : DT("dutySaved");
});

$("clearOverride").addEventListener("click", async function () {
    if (!canEdit) return;
    await db.from("duty_week_overrides").delete().eq("week_start", week());
    $("status").textContent = DT("dutyRestored");
    await loadOverride();
    updateMode();
});

$("saveTrainOverride").addEventListener("click", async function () {
    if (!canEdit) return;

    const ids = [...document.querySelectorAll(".train-select")].map(
        function (select) {
            return +select.value;
        }
    );

    if (ids.length !== 6 || new Set(ids).size !== 6) {
        $("status").textContent = DT("trainDuplicate");
        return;
    }

    const result = await db.from("train_schedule_overrides").upsert(
        {
            week_start: week(),
            member_ids: ids,
            updated_at: new Date().toISOString()
        },
        { onConflict: "week_start" }
    );

    $("status").textContent = result.error
        ? result.error.message
        : DT("trainSaved");
});

$("clearTrainOverride").addEventListener("click", async function () {
    if (!canEdit) return;
    await db.from("train_schedule_overrides").delete().eq("week_start", week());
    $("status").textContent = DT("trainRestored");
    await loadTrainSchedule();
    updateMode();
});

document.addEventListener("sunriseLanguageChanged", function () {
    applyDutyTranslations();
});

document.addEventListener("DOMContentLoaded", async function () {
    if (!SunriseI18nReady) {
        await InitializeSunriseI18n();
    }

    applyDutyTranslations();
    await loadAll();
});
