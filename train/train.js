"use strict";

const SupabaseClient = window.supabase.createClient(
    SupabaseUrl,
    SupabasePublishableKey
);

let Members = [];
let CurrentUser = null;
let CurrentTrainWeek = null;

const LoginStatus = document.getElementById("loginStatus");
const LoginForm = document.getElementById("loginForm");
const LogoutArea = document.getElementById("logoutArea");

const EmailInput = document.getElementById("emailInput");
const PasswordInput = document.getElementById("passwordInput");
const LoginButton = document.getElementById("loginButton");
const LogoutButton = document.getElementById("logoutButton");
const LoginMessage = document.getElementById("loginMessage");

const WeekStartInput = document.getElementById("weekStartInput");
const WeekDrawCountInput = document.getElementById("weekDrawCountInput");
const LoadWeekButton = document.getElementById("loadWeekButton");
const SaveWeekButton = document.getElementById("saveWeekButton");
const WeekMessage = document.getElementById("weekMessage");
const CurrentWeekText = document.getElementById("currentWeekText");
const CurrentWeekStatus = document.getElementById("currentWeekStatus");

const ReloadButton = document.getElementById("reloadButton");
const SearchInput = document.getElementById("searchInput");
const SelectAllButton = document.getElementById("selectAllButton");
const ClearAllButton = document.getElementById("clearAllButton");

const MemberCount = document.getElementById("memberCount");
const EligibleCount = document.getElementById("eligibleCount");
const LoadingMessage = document.getElementById("loadingMessage");
const MemberList = document.getElementById("memberList");

const DrawButton = document.getElementById("drawButton");
const DrawMessage = document.getElementById("drawMessage");
const ResultArea = document.getElementById("resultArea");
const ResultList = document.getElementById("resultList");
const DrawTime = document.getElementById("drawTime");

document.addEventListener("DOMContentLoaded", InitializePage);

LoginButton.addEventListener("click", Login);
LogoutButton.addEventListener("click", Logout);

LoadWeekButton.addEventListener("click", LoadTrainWeek);
SaveWeekButton.addEventListener("click", SaveTrainWeek);

ReloadButton.addEventListener("click", LoadMembers);
SearchInput.addEventListener("input", FilterMembers);
SelectAllButton.addEventListener("click", SelectVisibleMembers);
ClearAllButton.addEventListener("click", ClearAllMembers);

DrawButton.addEventListener("click", DrawMembers);

PasswordInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        Login();
    }
});

async function InitializePage() {
    try {
        SetDefaultWeekStart();

        const sessionResult =
            await SupabaseClient.auth.getSession();

        if (sessionResult.error) {
            throw sessionResult.error;
        }

        CurrentUser = sessionResult.data.session
            ? sessionResult.data.session.user
            : null;

        SupabaseClient.auth.onAuthStateChange(
            function (event, session) {
                CurrentUser = session
                    ? session.user
                    : null;

                UpdateLoginDisplay();
            }
        );

        UpdateLoginDisplay();

        await LoadMembers();
        await LoadTrainWeek();
    } catch (error) {
        ShowMessage(
            LoginMessage,
            "初始化失敗：" + GetErrorMessage(error),
            true
        );
    }
}

function SetDefaultWeekStart() {
    const now = new Date();
    const day = now.getDay();

    const difference =
        day === 0
            ? -6
            : 1 - day;

    const monday = new Date(now);
    monday.setDate(now.getDate() + difference);

    WeekStartInput.value =
        FormatDateInput(monday);
}

function FormatDateInput(date) {
    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return year + "-" + month + "-" + day;
}

async function Login() {
const email =
    NormalizeSunriseAccount(
        EmailInput.value
    );

const password =
    PasswordInput.value;

    ClearMessage(LoginMessage);

    if (!email || !password) {
        ShowMessage(
            LoginMessage,
            "請輸入 Email 與密碼。",
            true
        );

        return;
    }

    LoginButton.disabled = true;
    LoginButton.textContent = "登入中……";

    try {
        const result =
            await SupabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (result.error) {
            throw result.error;
        }

        CurrentUser = result.data.user;
        PasswordInput.value = "";

        UpdateLoginDisplay();

        ShowMessage(
            LoginMessage,
            "登入成功。",
            false
        );

        await LoadTrainWeek();
    } catch (error) {
        console.error("Login error:", error);

        ShowMessage(
            LoginMessage,
            "登入失敗：" + GetErrorMessage(error),
            true
        );
    } finally {
        LoginButton.disabled = false;
        LoginButton.textContent = "登入";
    }
}

async function Logout() {
    ClearMessage(LoginMessage);

    try {
        const result =
            await SupabaseClient.auth.signOut({
                scope: "local"
            });

        if (result.error) {
            throw result.error;
        }

        CurrentUser = null;
        CurrentTrainWeek = null;

        UpdateLoginDisplay();
        ResetWeekDisplay();
        ClearAllMembers();
        ClearDrawResult();

        ShowMessage(
            LoginMessage,
            "已登出。",
            false
        );
    } catch (error) {
        ShowMessage(
            LoginMessage,
            "登出失敗：" + GetErrorMessage(error),
            true
        );
    }
}

function UpdateLoginDisplay() {
    const isLoggedIn =
        CurrentUser !== null;

    LoginForm.classList.toggle(
        "hidden",
        isLoggedIn
    );

    LogoutArea.classList.toggle(
        "hidden",
        !isLoggedIn
    );

LoginStatus.textContent = isLoggedIn
    ? "已登入：" +
      GetSunriseAccountDisplay(
          CurrentUser.email
      )
    : "尚未登入";

    UpdateManagementEnabled();
}

function UpdateManagementEnabled() {
    const isLoggedIn =
        CurrentUser !== null;

    const isDraft =
        CurrentTrainWeek !== null &&
        CurrentTrainWeek.status === "draft";

    const canEdit =
        isLoggedIn && isDraft;

    LoadWeekButton.disabled = !isLoggedIn;
    SaveWeekButton.disabled = !canEdit;

    SelectAllButton.disabled = !canEdit;
    ClearAllButton.disabled = !canEdit;

    WeekDrawCountInput.disabled =
        !isLoggedIn ||
        (
            CurrentTrainWeek !== null &&
            CurrentTrainWeek.status === "completed"
        );

    DrawButton.disabled = !canEdit;

    const checkboxes =
        MemberList.querySelectorAll(
            ".member-checkbox"
        );

    checkboxes.forEach(function (checkbox) {
        checkbox.disabled = !canEdit;
    });
}

async function LoadMembers() {
    LoadingMessage.classList.remove("hidden");
    LoadingMessage.textContent =
        "正在讀取成員名單……";

    MemberList.innerHTML = "";

    try {
        const result = await SupabaseClient
            .from("members")
            .select("id, game_name, sort_order")
            .eq("is_active", true)
            .order("sort_order", {
                ascending: true
            })
            .order("game_name", {
                ascending: true
            });

        if (result.error) {
            throw result.error;
        }

        Members = result.data || [];

        RenderMembers();
    } catch (error) {
        Members = [];

        LoadingMessage.textContent =
            "讀取成員失敗：" +
            GetErrorMessage(error);

        MemberCount.textContent = "0";
        EligibleCount.textContent = "0";
    }
}

function RenderMembers() {
    MemberList.innerHTML = "";

    MemberCount.textContent =
        String(Members.length);

    if (Members.length === 0) {
        LoadingMessage.classList.remove("hidden");
        LoadingMessage.textContent =
            "目前沒有可顯示的成員。";

        UpdateEligibleCount();
        return;
    }

    LoadingMessage.classList.add("hidden");

    Members.forEach(function (member) {
        const label =
            document.createElement("label");

        label.className = "member-item";
        label.dataset.memberName =
            member.game_name.toLowerCase();

        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.className = "member-checkbox";
        checkbox.value = String(member.id);
        checkbox.dataset.memberName =
            member.game_name;

        checkbox.addEventListener(
            "change",
            function () {
                label.classList.toggle(
                    "selected",
                    checkbox.checked
                );

                UpdateEligibleCount();
                ClearDrawResult();
            }
        );

        const name =
            document.createElement("span");

        name.textContent =
            member.game_name;

        label.appendChild(checkbox);
        label.appendChild(name);

        MemberList.appendChild(label);
    });

    FilterMembers();
    UpdateEligibleCount();
    UpdateManagementEnabled();
}

async function LoadTrainWeek() {
    ClearMessage(WeekMessage);
    ClearDrawResult();

    if (!CurrentUser) {
        CurrentTrainWeek = null;
        ResetWeekDisplay();
        UpdateManagementEnabled();
        return;
    }

    const weekStart =
        WeekStartInput.value;

    if (!weekStart) {
        ShowMessage(
            WeekMessage,
            "請選擇週次開始日。",
            true
        );

        return;
    }

    LoadWeekButton.disabled = true;
    LoadWeekButton.textContent = "載入中……";

    try {
        const weekResult =
            await SupabaseClient
                .from("train_weeks")
                .select(
                    "id, week_start, draw_count, status, created_at, completed_at"
                )
                .eq("week_start", weekStart)
                .maybeSingle();

        if (weekResult.error) {
            throw weekResult.error;
        }

        if (!weekResult.data) {
            CurrentTrainWeek =
                await CreateTrainWeek(weekStart);
        } else {
            CurrentTrainWeek =
                weekResult.data;
        }

        WeekDrawCountInput.value =
            String(CurrentTrainWeek.draw_count);

        UpdateWeekDisplay();

        await LoadEligibleMembers();

        if (
            CurrentTrainWeek.status ===
            "completed"
        ) {
            await new Promise(function (resolve) {
    setTimeout(resolve, 500);
});

await LoadDrawResults();
        }

        ShowMessage(
            WeekMessage,
            CurrentTrainWeek.status === "draft"
                ? "週次已載入，可以編輯合格名單。"
                : "此週已完成正式抽選。",
            false
        );
    } catch (error) {
        CurrentTrainWeek = null;

        ResetWeekDisplay();
        ClearAllMembers();

        ShowMessage(
            WeekMessage,
            "載入週次失敗：" +
            GetErrorMessage(error),
            true
        );
    } finally {
        LoadWeekButton.disabled = false;
        LoadWeekButton.textContent = "載入週次";

        UpdateManagementEnabled();
    }
}

async function CreateTrainWeek(weekStart) {
    const drawCount =
        ParseDrawCount();

    const result =
        await SupabaseClient
            .from("train_weeks")
            .insert({
                week_start: weekStart,
                draw_count: drawCount
            })
            .select(
                "id, week_start, draw_count, status, created_at, completed_at"
            )
            .single();

    if (result.error) {
        throw result.error;
    }

    return result.data;
}

async function LoadEligibleMembers() {
    ClearAllMembers();

    if (!CurrentTrainWeek) {
        return;
    }

    const result =
        await SupabaseClient
            .from("train_eligible_members")
            .select("member_id")
            .eq(
                "train_week_id",
                CurrentTrainWeek.id
            );

    if (result.error) {
        throw result.error;
    }

    const selectedIds =
        new Set(
            (result.data || []).map(
                function (row) {
                    return String(row.member_id);
                }
            )
        );

    const items =
        MemberList.querySelectorAll(
            ".member-item"
        );

    items.forEach(function (item) {
        const checkbox =
            item.querySelector(
                ".member-checkbox"
            );

        checkbox.checked =
            selectedIds.has(checkbox.value);

        item.classList.toggle(
            "selected",
            checkbox.checked
        );
    });

    UpdateEligibleCount();
}

async function SaveTrainWeek() {
    ClearMessage(WeekMessage);

    if (!CurrentUser) {
        ShowMessage(
            WeekMessage,
            "請先登入。",
            true
        );

        return;
    }

    if (!CurrentTrainWeek) {
        ShowMessage(
            WeekMessage,
            "請先載入週次。",
            true
        );

        return;
    }

    if (
        CurrentTrainWeek.status !==
        "draft"
    ) {
        ShowMessage(
            WeekMessage,
            "此週已完成，不能再修改。",
            true
        );

        return;
    }

    const selectedMembers =
        GetSelectedMembers();

    if (selectedMembers.length === 0) {
        ShowMessage(
            WeekMessage,
            "請至少勾選一名合格成員。",
            true
        );

        return;
    }

    const drawCount =
        ParseDrawCount();

    if (
        drawCount >
        selectedMembers.length
    ) {
        ShowMessage(
            WeekMessage,
            "抽選名額不能超過合格人數。",
            true
        );

        return;
    }

    SaveWeekButton.disabled = true;
    SaveWeekButton.textContent = "儲存中……";

    try {
        const updateResult =
            await SupabaseClient
                .from("train_weeks")
                .update({
                    draw_count: drawCount
                })
                .eq(
                    "id",
                    CurrentTrainWeek.id
                )
                .eq("status", "draft")
                .select(
                    "id, week_start, draw_count, status, created_at, completed_at"
                )
                .single();

        if (updateResult.error) {
            throw updateResult.error;
        }

        const deleteResult =
            await SupabaseClient
                .from("train_eligible_members")
                .delete()
                .eq(
                    "train_week_id",
                    CurrentTrainWeek.id
                );

        if (deleteResult.error) {
            throw deleteResult.error;
        }

        const rows =
            selectedMembers.map(
                function (member) {
                    return {
                        train_week_id:
                            CurrentTrainWeek.id,
                        member_id:
                            member.id
                    };
                }
            );

        const insertResult =
            await SupabaseClient
                .from("train_eligible_members")
                .insert(rows);

        if (insertResult.error) {
            throw insertResult.error;
        }

        CurrentTrainWeek =
            updateResult.data;

        UpdateWeekDisplay();

        ShowMessage(
            WeekMessage,
            "本週資格已儲存，共 " +
            selectedMembers.length +
            " 人。",
            false
        );
    } catch (error) {
        ShowMessage(
            WeekMessage,
            "儲存失敗：" +
            GetErrorMessage(error),
            true
        );
    } finally {
        SaveWeekButton.disabled = false;
        SaveWeekButton.textContent =
            "儲存本週資格";

        UpdateManagementEnabled();
    }
}

async function DrawMembers() {
    ClearMessage(DrawMessage);

    if (!CurrentUser) {
        ShowMessage(
            DrawMessage,
            "請先使用 R4 帳號登入。",
            true
        );

        return;
    }

    if (!CurrentTrainWeek) {
        ShowMessage(
            DrawMessage,
            "請先載入週次。",
            true
        );

        return;
    }

    if (
        CurrentTrainWeek.status !==
        "draft"
    ) {
        ShowMessage(
            DrawMessage,
            "此週已完成正式抽選，不能重抽。",
            true
        );

        return;
    }

    const confirmed =
        window.confirm(
            "正式抽選後將無法重抽，確定繼續嗎？"
        );

    if (!confirmed) {
        return;
    }

    DrawButton.disabled = true;
    DrawButton.textContent = "正式抽選中……";

    try {
        await SaveTrainWeek();

        const result =
            await SupabaseClient.rpc(
                "draw_train_members",
                {
                    p_train_week_id:
                        CurrentTrainWeek.id
                }
            );
console.log(result.data);
        if (result.error) {
            throw result.error;
        }

        await LoadDrawResults();

        CurrentTrainWeek.status =
            "completed";

        CurrentTrainWeek.completed_at =
            new Date().toISOString();

        UpdateWeekDisplay();
        UpdateManagementEnabled();

        ShowMessage(
            DrawMessage,
            "正式抽選完成，結果已保存。",
            false
        );
    } catch (error) {
        ShowMessage(
            DrawMessage,
            "正式抽選失敗：" +
            GetErrorMessage(error),
            true
        );
    } finally {
        DrawButton.textContent =
            "正式抽選";

        UpdateManagementEnabled();
    }
}

async function LoadDrawResults() {
    if (!CurrentTrainWeek) {
        return;
    }

    const result =
        await SupabaseClient
            .from("train_draw_results")
            .select(
                "draw_order, drawn_at, members(game_name)"
            )
            .eq(
                "train_week_id",
                CurrentTrainWeek.id
            )
            .order("draw_order", {
                ascending: true
            });

    if (result.error) {
        throw result.error;
    }

    const rows =
        (result.data || []).map(
            function (row) {
                return {
                    draw_order:
                        row.draw_order,
                    game_name:
                        row.members
                            ? row.members.game_name
                            : "未知成員",
                    drawn_at:
                        row.drawn_at
                };
            }
        );

    ShowDrawResult(rows);
}

function UpdateWeekDisplay() {
    if (!CurrentTrainWeek) {
        ResetWeekDisplay();
        return;
    }

    CurrentWeekText.textContent =
        CurrentTrainWeek.week_start;

    CurrentWeekStatus.textContent =
        CurrentTrainWeek.status ===
        "completed"
            ? "已完成"
            : "編輯中";

    UpdateManagementEnabled();
}

function ResetWeekDisplay() {
    CurrentWeekText.textContent =
        "尚未載入";

    CurrentWeekStatus.textContent =
        "－";
}

function ParseDrawCount() {
    const drawCount =
        Number.parseInt(
            WeekDrawCountInput.value,
            10
        );

    if (
        !Number.isInteger(drawCount) ||
        drawCount <= 0
    ) {
        throw new Error(
            "抽選名額必須大於 0。"
        );
    }

    return drawCount;
}

function FilterMembers() {
    const keyword =
        SearchInput.value
            .trim()
            .toLowerCase();

    const items =
        MemberList.querySelectorAll(
            ".member-item"
        );

    items.forEach(function (item) {
        const memberName =
            item.dataset.memberName || "";

        item.classList.toggle(
            "hidden-member",
            !memberName.includes(keyword)
        );
    });
}

function SelectVisibleMembers() {
    if (
        !CurrentUser ||
        !CurrentTrainWeek ||
        CurrentTrainWeek.status !== "draft"
    ) {
        return;
    }

    const visibleItems =
        MemberList.querySelectorAll(
            ".member-item:not(.hidden-member)"
        );

    visibleItems.forEach(function (item) {
        const checkbox =
            item.querySelector(
                ".member-checkbox"
            );

        checkbox.checked = true;
        item.classList.add("selected");
    });

    UpdateEligibleCount();
    ClearDrawResult();
}

function ClearAllMembers() {
    const items =
        MemberList.querySelectorAll(
            ".member-item"
        );

    items.forEach(function (item) {
        const checkbox =
            item.querySelector(
                ".member-checkbox"
            );

        checkbox.checked = false;
        item.classList.remove("selected");
    });

    UpdateEligibleCount();
    ClearDrawResult();
}

function GetSelectedMembers() {
    const selectedCheckboxes =
        MemberList.querySelectorAll(
            ".member-checkbox:checked"
        );

    return Array.from(
        selectedCheckboxes
    ).map(function (checkbox) {
        return {
            id: Number(checkbox.value),
            gameName:
                checkbox.dataset.memberName
        };
    });
}

function UpdateEligibleCount() {
    EligibleCount.textContent =
        String(GetSelectedMembers().length);
}

function ShowDrawResult(results) {
    ResultList.innerHTML = "";

    results.forEach(function (row) {
        const item =
            document.createElement("li");

        item.textContent =
            row.game_name;

        ResultList.appendChild(item);
    });

    const firstResult =
        results.length > 0
            ? results[0]
            : null;

    const resultTime =
        firstResult &&
        firstResult.drawn_at
            ? new Date(firstResult.drawn_at)
            : new Date();

    DrawTime.textContent =
        "抽選時間：" +
        resultTime.toLocaleString(
            "zh-TW",
            {
                timeZone: "Asia/Taipei"
            }
        );

    ResultArea.classList.remove("hidden");
}

function ClearDrawResult() {
    ResultList.innerHTML = "";
    DrawTime.textContent = "";
    ResultArea.classList.add("hidden");
    ClearMessage(DrawMessage);
}

function ShowMessage(
    element,
    message,
    isError
) {
    element.textContent = message;

    element.classList.toggle(
        "error",
        isError
    );

    element.classList.toggle(
        "success",
        !isError
    );
}

function ClearMessage(element) {
    element.textContent = "";

    element.classList.remove(
        "error",
        "success"
    );
}

function GetErrorMessage(error) {
    if (
        error &&
        typeof error.message === "string"
    ) {
        return error.message;
    }

    return String(error);
}
