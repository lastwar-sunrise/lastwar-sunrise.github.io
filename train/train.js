"use strict";

const SupabaseClient = window.supabase.createClient(
    SupabaseUrl,
    SupabasePublishableKey
);

let Members = [];
let CurrentUser = null;

const LoginStatus = document.getElementById("loginStatus");
const LoginForm = document.getElementById("loginForm");
const LogoutArea = document.getElementById("logoutArea");

const EmailInput = document.getElementById("emailInput");
const PasswordInput = document.getElementById("passwordInput");
const LoginButton = document.getElementById("loginButton");
const LogoutButton = document.getElementById("logoutButton");
const LoginMessage = document.getElementById("loginMessage");

const ReloadButton = document.getElementById("reloadButton");
const SearchInput = document.getElementById("searchInput");
const SelectAllButton = document.getElementById("selectAllButton");
const ClearAllButton = document.getElementById("clearAllButton");

const MemberCount = document.getElementById("memberCount");
const EligibleCount = document.getElementById("eligibleCount");
const LoadingMessage = document.getElementById("loadingMessage");
const MemberList = document.getElementById("memberList");

const DrawCountInput = document.getElementById("drawCountInput");
const DrawButton = document.getElementById("drawButton");
const DrawMessage = document.getElementById("drawMessage");
const ResultArea = document.getElementById("resultArea");
const ResultList = document.getElementById("resultList");
const DrawTime = document.getElementById("drawTime");

document.addEventListener("DOMContentLoaded", InitializePage);

LoginButton.addEventListener("click", Login);
LogoutButton.addEventListener("click", Logout);
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
        const sessionResult =
            await SupabaseClient.auth.getSession();

        if (sessionResult.error) {
            throw sessionResult.error;
        }

        if (sessionResult.data.session) {
            CurrentUser =
                sessionResult.data.session.user;
        }

        UpdateLoginDisplay();
        await LoadMembers();
    } catch (error) {
        ShowMessage(
            LoginMessage,
            "初始化失敗：" + GetErrorMessage(error),
            true
        );
    }
}

async function Login() {
    const email = EmailInput.value.trim();
    const password = PasswordInput.value;

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
            await SupabaseClient.auth.signOut();

        if (result.error) {
            throw result.error;
        }

        CurrentUser = null;

        UpdateLoginDisplay();
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
    const isLoggedIn = CurrentUser !== null;

    LoginForm.classList.toggle(
        "hidden",
        isLoggedIn
    );

    LogoutArea.classList.toggle(
        "hidden",
        !isLoggedIn
    );

    LoginStatus.textContent = isLoggedIn
        ? "已登入：" + CurrentUser.email
        : "尚未登入";

    SetManagementEnabled(isLoggedIn);
}

function SetManagementEnabled(enabled) {
    SelectAllButton.disabled = !enabled;
    ClearAllButton.disabled = !enabled;
    DrawCountInput.disabled = !enabled;
    DrawButton.disabled = !enabled;

    const checkboxes =
        MemberList.querySelectorAll(
            ".member-checkbox"
        );

    checkboxes.forEach(function (checkbox) {
        checkbox.disabled = !enabled;
    });
}

async function LoadMembers() {
    LoadingMessage.classList.remove("hidden");
    LoadingMessage.textContent =
        "正在讀取成員名單……";

    MemberList.innerHTML = "";
    ClearDrawResult();

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

        checkbox.disabled =
            CurrentUser === null;

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

        name.textContent = member.game_name;

        label.appendChild(checkbox);
        label.appendChild(name);

        MemberList.appendChild(label);
    });

    FilterMembers();
    UpdateEligibleCount();
}

function FilterMembers() {
    const keyword =
        SearchInput.value.trim().toLowerCase();

    const items =
        MemberList.querySelectorAll(
            ".member-item"
        );

    items.forEach(function (item) {
        const memberName =
            item.dataset.memberName || "";

        const visible =
            memberName.includes(keyword);

        item.classList.toggle(
            "hidden-member",
            !visible
        );
    });
}

function SelectVisibleMembers() {
    if (!CurrentUser) {
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

function DrawMembers() {
    ClearMessage(DrawMessage);

    if (!CurrentUser) {
        ShowMessage(
            DrawMessage,
            "請先使用 R4 帳號登入。",
            true
        );
        return;
    }

    const candidates =
        GetSelectedMembers();

    const drawCount =
        Number.parseInt(
            DrawCountInput.value,
            10
        );

    if (
        !Number.isInteger(drawCount) ||
        drawCount <= 0
    ) {
        ShowMessage(
            DrawMessage,
            "抽選人數必須大於 0。",
            true
        );
        return;
    }

    if (candidates.length === 0) {
        ShowMessage(
            DrawMessage,
            "請至少勾選一名合格成員。",
            true
        );
        return;
    }

    if (drawCount > candidates.length) {
        ShowMessage(
            DrawMessage,
            "抽選人數不能超過合格人數。",
            true
        );
        return;
    }

    const shuffled =
        ShuffleMembers(candidates);

    const results =
        shuffled.slice(0, drawCount);

    ShowDrawResult(results);

    ShowMessage(
        DrawMessage,
        "抽選完成。",
        false
    );
}

function ShuffleMembers(members) {
    const result = members.slice();

    for (
        let index = result.length - 1;
        index > 0;
        index--
    ) {
        const randomValues =
            new Uint32Array(1);

        window.crypto.getRandomValues(
            randomValues
        );

        const randomIndex =
            randomValues[0] % (index + 1);

        const temporary =
            result[index];

        result[index] =
            result[randomIndex];

        result[randomIndex] =
            temporary;
    }

    return result;
}

function ShowDrawResult(results) {
    ResultList.innerHTML = "";

    results.forEach(function (member) {
        const item =
            document.createElement("li");

        item.textContent =
            member.gameName;

        ResultList.appendChild(item);
    });

    DrawTime.textContent =
        "抽選時間：" +
        new Date().toLocaleString(
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
