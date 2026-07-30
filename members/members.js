"use strict";

const SupabaseClient =
    window.supabase.createClient(
        SupabaseUrl,
        SupabasePublishableKey
    );

let CurrentUser = null;
let CurrentProfile = null;
let Members = [];

const LoginStatus =
    document.getElementById("loginStatus");

const LoginForm =
    document.getElementById("loginForm");

const LogoutArea =
    document.getElementById("logoutArea");

const EmailInput =
    document.getElementById("emailInput");

const PasswordInput =
    document.getElementById("passwordInput");

const LoginButton =
    document.getElementById("loginButton");

const LogoutButton =
    document.getElementById("logoutButton");

const LoginMessage =
    document.getElementById("loginMessage");

const AddMemberButton =
    document.getElementById("addMemberButton");

const ReloadButton =
    document.getElementById("reloadButton");

const SearchInput =
    document.getElementById("searchInput");

const StatusFilter =
    document.getElementById("statusFilter");

const TotalCount =
    document.getElementById("totalCount");

const ActiveCount =
    document.getElementById("activeCount");

const InactiveCount =
    document.getElementById("inactiveCount");

const MemberMessage =
    document.getElementById("memberMessage");

const LoadingMessage =
    document.getElementById("loadingMessage");

const MemberList =
    document.getElementById("memberList");

const EditorOverlay =
    document.getElementById("editorOverlay");

const EditorTitle =
    document.getElementById("editorTitle");

const MemberIdInput =
    document.getElementById("memberIdInput");

const GameNameInput =
    document.getElementById("gameNameInput");

const SortOrderInput =
    document.getElementById("sortOrderInput");

const IsActiveInput =
    document.getElementById("isActiveInput");

const EditorMessage =
    document.getElementById("editorMessage");

const SaveMemberButton =
    document.getElementById("saveMemberButton");

const CancelEditorButton =
    document.getElementById("cancelEditorButton");

const CloseEditorButton =
    document.getElementById("closeEditorButton");

document.addEventListener(
    "DOMContentLoaded",
    InitializePage
);

LoginButton.addEventListener(
    "click",
    Login
);

LogoutButton.addEventListener(
    "click",
    Logout
);

AddMemberButton.addEventListener(
    "click",
    OpenNewMemberEditor
);

ReloadButton.addEventListener(
    "click",
    LoadMembers
);

SearchInput.addEventListener(
    "input",
    RenderMembers
);

StatusFilter.addEventListener(
    "change",
    RenderMembers
);

SaveMemberButton.addEventListener(
    "click",
    SaveMember
);

CancelEditorButton.addEventListener(
    "click",
    CloseEditor
);

CloseEditorButton.addEventListener(
    "click",
    CloseEditor
);

PasswordInput.addEventListener(
    "keydown",
    function (event) {
        if (event.key === "Enter") {
            Login();
        }
    }
);

EditorOverlay.addEventListener(
    "click",
    function (event) {
        if (event.target === EditorOverlay) {
            CloseEditor();
        }
    }
);

async function InitializePage() {
    try {
        const sessionResult =
            await SupabaseClient.auth.getSession();

        if (sessionResult.error) {
            throw sessionResult.error;
        }

        CurrentUser =
            sessionResult.data.session
                ? sessionResult.data.session.user
                : null;

        SupabaseClient.auth.onAuthStateChange(
            function (event, session) {
                CurrentUser =
                    session
                        ? session.user
                        : null;

                HandleAuthenticationChange();
            }
        );

        await HandleAuthenticationChange();
    } catch (error) {
        ShowMessage(
            LoginMessage,
            "初始化失敗：" +
            GetErrorMessage(error),
            true
        );
    }
}

async function HandleAuthenticationChange() {
    CurrentProfile = null;

    if (CurrentUser) {
        await LoadCurrentProfile();
    }

    UpdateLoginDisplay();
    await LoadMembers();
}

async function LoadCurrentProfile() {
    const result =
        await SupabaseClient
            .from("profiles")
            .select("id, email, role")
            .eq("id", CurrentUser.id)
            .single();

    if (result.error) {
        throw result.error;
    }

    CurrentProfile = result.data;
}

function IsAdmin() {
    return (
        CurrentProfile !== null &&
        CurrentProfile.role === "admin"
    );
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

    if (!isLoggedIn) {
        LoginStatus.textContent =
            "尚未登入";
    } else if (IsAdmin()) {
        LoginStatus.textContent =
            "Admin：" + CurrentUser.email;
    } else {
        LoginStatus.textContent =
            CurrentUser.email +
            "（無管理權限）";
    }

    AddMemberButton.disabled =
        !IsAdmin();
}

async function Login() {
    ClearMessage(LoginMessage);

    const email =
        EmailInput.value.trim();

    const password =
        PasswordInput.value;

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
            await SupabaseClient.auth
                .signInWithPassword({
                    email: email,
                    password: password
                });

        if (result.error) {
            throw result.error;
        }

        CurrentUser = result.data.user;
        PasswordInput.value = "";

        await HandleAuthenticationChange();

        if (IsAdmin()) {
            ShowMessage(
                LoginMessage,
                "管理員登入成功。",
                false
            );
        } else {
            ShowMessage(
                LoginMessage,
                "登入成功，但此帳號不是 admin。",
                true
            );
        }
    } catch (error) {
        ShowMessage(
            LoginMessage,
            "登入失敗：" +
            GetErrorMessage(error),
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
        CurrentProfile = null;

        UpdateLoginDisplay();
        CloseEditor();

        ShowMessage(
            LoginMessage,
            "已登出。",
            false
        );
    } catch (error) {
        ShowMessage(
            LoginMessage,
            "登出失敗：" +
            GetErrorMessage(error),
            true
        );
    }
}

async function LoadMembers() {
    ClearMessage(MemberMessage);

    LoadingMessage.classList.remove(
        "hidden"
    );

    LoadingMessage.textContent =
        "正在讀取成員……";

    MemberList.innerHTML = "";

    try {
        const result =
            await SupabaseClient
                .from("members")
                .select(
                    "id, game_name, is_active, sort_order"
                )
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

        UpdateCounts();
        RenderMembers();
    } catch (error) {
        Members = [];

        UpdateCounts();

        LoadingMessage.textContent =
            "讀取失敗：" +
            GetErrorMessage(error);
    }
}

function UpdateCounts() {
    TotalCount.textContent =
        String(Members.length);

    const activeMembers =
        Members.filter(
            function (member) {
                return member.is_active;
            }
        );

    ActiveCount.textContent =
        String(activeMembers.length);

    InactiveCount.textContent =
        String(
            Members.length -
            activeMembers.length
        );
}

function RenderMembers() {
    MemberList.innerHTML = "";

    const keyword =
        SearchInput.value
            .trim()
            .toLowerCase();

    const status =
        StatusFilter.value;

    const filteredMembers =
        Members.filter(
            function (member) {
                const matchesKeyword =
                    member.game_name
                        .toLowerCase()
                        .includes(keyword);

                const matchesStatus =
                    status === "all" ||
                    (
                        status === "active" &&
                        member.is_active
                    ) ||
                    (
                        status === "inactive" &&
                        !member.is_active
                    );

                return (
                    matchesKeyword &&
                    matchesStatus
                );
            }
        );

    if (filteredMembers.length === 0) {
        LoadingMessage.classList.remove(
            "hidden"
        );

        LoadingMessage.textContent =
            "找不到符合條件的成員。";

        return;
    }

    LoadingMessage.classList.add(
        "hidden"
    );

    filteredMembers.forEach(
        function (member) {
            const row =
                document.createElement("div");

            row.className = "member-row";

            const name =
                document.createElement("div");

            name.className = "member-name";
            name.textContent = member.game_name;

            const order =
                document.createElement("div");

            order.className = "member-order";
            order.textContent =
                "#" + member.sort_order;

            const statusBadge =
                document.createElement("div");

            statusBadge.className =
                "status-badge " +
                (
                    member.is_active
                        ? "status-active"
                        : "status-inactive"
                );

            statusBadge.textContent =
                member.is_active
                    ? "啟用"
                    : "停用";

            const editButton =
                document.createElement("button");

            editButton.type = "button";
            editButton.className =
                "edit-button";

            editButton.textContent =
                IsAdmin()
                    ? "編輯"
                    : "查看";

            editButton.addEventListener(
                "click",
                function () {
                    OpenMemberEditor(member);
                }
            );

            row.appendChild(name);
            row.appendChild(order);
            row.appendChild(statusBadge);
            row.appendChild(editButton);

            MemberList.appendChild(row);
        }
    );
}

function OpenNewMemberEditor() {
    if (!IsAdmin()) {
        ShowMessage(
            MemberMessage,
            "只有 admin 可以新增成員。",
            true
        );

        return;
    }

    const nextSortOrder =
        Members.reduce(
            function (maximum, member) {
                return Math.max(
                    maximum,
                    Number(member.sort_order) || 0
                );
            },
            0
        ) + 1;

    EditorTitle.textContent =
        "新增成員";

    MemberIdInput.value = "";
    GameNameInput.value = "";
    SortOrderInput.value =
        String(nextSortOrder);

    IsActiveInput.checked = true;

    SetEditorEnabled(true);
    ClearMessage(EditorMessage);

    EditorOverlay.classList.remove(
        "hidden"
    );

    GameNameInput.focus();
}

function OpenMemberEditor(member) {
    EditorTitle.textContent =
        IsAdmin()
            ? "編輯成員"
            : "查看成員";

    MemberIdInput.value =
        String(member.id);

    GameNameInput.value =
        member.game_name;

    SortOrderInput.value =
        String(member.sort_order);

    IsActiveInput.checked =
        member.is_active;

    SetEditorEnabled(IsAdmin());
    ClearMessage(EditorMessage);

    EditorOverlay.classList.remove(
        "hidden"
    );
}

function SetEditorEnabled(enabled) {
    GameNameInput.disabled = !enabled;
    SortOrderInput.disabled = !enabled;
    IsActiveInput.disabled = !enabled;

    SaveMemberButton.classList.toggle(
        "hidden",
        !enabled
    );
}

function CloseEditor() {
    EditorOverlay.classList.add(
        "hidden"
    );

    ClearMessage(EditorMessage);
}

async function SaveMember() {
    ClearMessage(EditorMessage);

    if (!IsAdmin()) {
        ShowMessage(
            EditorMessage,
            "只有 admin 可以修改成員。",
            true
        );

        return;
    }

    const memberId =
        MemberIdInput.value.trim();

    const gameName =
        GameNameInput.value.trim();

    const sortOrder =
        Number.parseInt(
            SortOrderInput.value,
            10
        );

    if (!gameName) {
        ShowMessage(
            EditorMessage,
            "請輸入成員名稱。",
            true
        );

        return;
    }

    if (
        !Number.isInteger(sortOrder) ||
        sortOrder <= 0
    ) {
        ShowMessage(
            EditorMessage,
            "排序必須是大於 0 的整數。",
            true
        );

        return;
    }

    const duplicate =
        Members.some(
            function (member) {
                return (
                    String(member.id) !==
                        memberId &&
                    member.game_name
                        .trim()
                        .toLowerCase() ===
                    gameName.toLowerCase()
                );
            }
        );

    if (duplicate) {
        ShowMessage(
            EditorMessage,
            "已有相同名稱的成員。",
            true
        );

        return;
    }

    SaveMemberButton.disabled = true;
    SaveMemberButton.textContent =
        "儲存中……";

    try {
        let result;

        if (memberId) {
            result =
                await SupabaseClient
                    .from("members")
                    .update({
                        game_name: gameName,
                        sort_order: sortOrder,
                        is_active:
                            IsActiveInput.checked
                    })
                    .eq("id", memberId)
                    .select(
                        "id, game_name, is_active, sort_order"
                    )
                    .single();
        } else {
            result =
                await SupabaseClient
                    .from("members")
                    .insert({
                        game_name: gameName,
                        sort_order: sortOrder,
                        is_active:
                            IsActiveInput.checked
                    })
                    .select(
                        "id, game_name, is_active, sort_order"
                    )
                    .single();
        }

        if (result.error) {
            throw result.error;
        }

        CloseEditor();
        await LoadMembers();

        ShowMessage(
            MemberMessage,
            memberId
                ? "成員資料已更新。"
                : "新成員已建立。",
            false
        );
    } catch (error) {
        ShowMessage(
            EditorMessage,
            "儲存失敗：" +
            GetErrorMessage(error),
            true
        );
    } finally {
        SaveMemberButton.disabled = false;
        SaveMemberButton.textContent =
            "儲存";
    }
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
