"use strict";

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
        start.setDate(
            start.getDate() - 7
        );
    }

    return (
        start.getFullYear() +
        "-" +
        String(
            start.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            start.getDate()
        ).padStart(2, "0")
    );
}

async function loadProfile() {
    currentProfile = null;
    canEdit = false;

    const sessionResult =
        await db.auth.getSession();

    currentUser =
        sessionResult.data.session
            ? sessionResult.data.session.user
            : null;

    if (!currentUser) {
        return;
    }

    const result =
        await db
            .from("profiles")
            .select("role")
            .eq("id", currentUser.id)
            .maybeSingle();

    if (result.data) {
        currentProfile = result.data;

        const role =
            String(
                currentProfile.role || ""
            ).toLowerCase();

        canEdit =
            role === "admin" ||
            role === "r4";
    }
}

function updateMode() {
    const badge = $("modeBadge");

    badge.classList.toggle(
        "mode-edit",
        canEdit
    );

    if (canEdit) {
        badge.textContent =
            "編輯模式";

        $("status").textContent =
            "已登入：" +
            GetSunriseAccountDisplay(
                currentUser.email
            );
    } else if (currentUser) {
        badge.textContent =
            "檢視模式";

        $("status").textContent =
            "此帳號無修改權限";
    } else {
        badge.textContent =
            "檢視模式";

        $("status").textContent =
            "未登入也可檢視";
    }

    $("logoutBtn").classList.toggle(
        "hidden",
        !currentUser
    );

    $("trainActions").classList.toggle(
        "hidden",
        !canEdit
    );

    $("dutyOverrideActions").classList.toggle(
        "hidden",
        !canEdit
    );

    $("rotationActions").classList.toggle(
        "hidden",
        !canEdit
    );

    $("anchor").disabled = !canEdit;

    document
        .querySelectorAll(
            "#groups input, #overrideMembers input, .train-select"
        )
        .forEach(
            function (element) {
                element.disabled =
                    !canEdit;
            }
        );

    document
        .querySelectorAll(
            "#groups [data-del]"
        )
        .forEach(
            function (button) {
                button.classList.toggle(
                    "hidden",
                    !canEdit
                );
            }
        );
}

async function loadMembers() {
    const result =
        await db
            .from("members")
            .select(
                "id, game_name, is_active, sort_order"
            )
            .order(
                "sort_order",
                { ascending: true }
            )
            .order(
                "game_name",
                { ascending: true }
            );

    members =
        result.data || [];
}

function checks(selected, name) {
    const container =
        document.createElement("div");

    const selectedIds =
        (selected || []).map(String);

    members
        .filter(
            function (member) {
                return member.is_active;
            }
        )
        .forEach(
            function (member) {
                const label =
                    document.createElement("label");

                label.className =
                    "member";

                const input =
                    document.createElement("input");

                input.type = "checkbox";
                input.value =
                    String(member.id);
                input.checked =
                    selectedIds.includes(
                        String(member.id)
                    );
                input.disabled =
                    !canEdit;

                const span =
                    document.createElement("span");

                span.textContent =
                    member.game_name;
                span.setAttribute(
                    "translate",
                    "no"
                );

                label.appendChild(input);
                label.appendChild(span);
                container.appendChild(label);
            }
        );

    container.dataset.name = name;

    return container;
}

function renderGroups() {
    $("groups").innerHTML = "";

    if (groups.length === 0) {
        $("groups").textContent =
            "尚未設定輪替群組。";
        return;
    }

    groups.forEach(
        function (group, index) {
            const box =
                document.createElement("div");

            box.className = "group";

            const title =
                document.createElement("b");

            title.textContent =
                "第 " +
                (index + 1) +
                " 週";

            const deleteButton =
                document.createElement("button");

            deleteButton.type = "button";
            deleteButton.dataset.del =
                String(index);
            deleteButton.textContent =
                "刪除";
            deleteButton.classList.toggle(
                "hidden",
                !canEdit
            );

            deleteButton.addEventListener(
                "click",
                function () {
                    groups.splice(
                        index,
                        1
                    );
                    renderGroups();
                }
            );

            box.appendChild(title);
            box.appendChild(
                document.createTextNode(" ")
            );
            box.appendChild(deleteButton);
            box.appendChild(
                checks(
                    group,
                    "g" + index
                )
            );

            $("groups").appendChild(box);
        }
    );
}

async function loadDutySettings() {
    const settingsResult =
        await db
            .from("duty_settings")
            .select("*")
            .eq("id", 1)
            .maybeSingle();

    const settings =
        settingsResult.data;

    groups =
        settings &&
        Array.isArray(
            settings.rotation_groups
        )
            ? settings.rotation_groups
            : [];

    $("anchor").value =
        settings &&
        settings.anchor_week
            ? settings.anchor_week
            : week();

    renderGroups();
}

async function loadOverride() {
    const result =
        await db
            .from("duty_week_overrides")
            .select("member_ids")
            .eq("week_start", week())
            .maybeSingle();

    let selected = [];

    if (
        result.data &&
        Array.isArray(
            result.data.member_ids
        )
    ) {
        selected =
            result.data.member_ids;
    } else {
        const settingsResult =
            await db
                .from("duty_settings")
                .select(
                    "rotation_groups, anchor_week"
                )
                .eq("id", 1)
                .maybeSingle();

        const settings =
            settingsResult.data;

        if (
            settings &&
            Array.isArray(
                settings.rotation_groups
            ) &&
            settings.rotation_groups.length > 0
        ) {
            const current =
                new Date(
                    week() +
                    "T10:00:00"
                );

            const anchor =
                new Date(
                    settings.anchor_week +
                    "T10:00:00"
                );

            const weeks =
                Math.floor(
                    (
                        current -
                        anchor
                    ) /
                    604800000
                );

            const index =
                (
                    (
                        weeks %
                        settings.rotation_groups.length
                    ) +
                    settings.rotation_groups.length
                ) %
                settings.rotation_groups.length;

            selected =
                settings.rotation_groups[
                    index
                ];
        }
    }

    $("overrideMembers").innerHTML = "";
    $("overrideMembers").appendChild(
        checks(
            selected,
            "override"
        )
    );
}

async function loadTrainSchedule() {
    const currentWeek = week();

    $("trainSchedule").innerHTML = "";

    const weekResult =
        await db
            .from("train_weeks")
            .select("id")
            .eq(
                "week_start",
                currentWeek
            )
            .eq(
                "status",
                "completed"
            )
            .maybeSingle();

    if (
        weekResult.error ||
        !weekResult.data
    ) {
        $("trainSchedule").textContent =
            "本週尚無完成的正式抽選結果。";
        trainOriginalIds = [];
        return;
    }

    const drawResult =
        await db
            .from("train_draw_results")
            .select(
                "member_id, draw_order"
            )
            .eq(
                "train_week_id",
                weekResult.data.id
            )
            .order(
                "draw_order",
                { ascending: true }
            );

    if (drawResult.error) {
        $("trainSchedule").textContent =
            "讀取抽選結果失敗。";
        return;
    }

    trainOriginalIds =
        (drawResult.data || [])
            .map(
                function (row) {
                    return row.member_id;
                }
            );

    if (trainOriginalIds.length !== 6) {
        $("trainSchedule").textContent =
            "本週正式抽選結果不是 6 人，無法建立週一到週六順序。";
        return;
    }

    const overrideResult =
        await db
            .from(
                "train_schedule_overrides"
            )
            .select("member_ids")
            .eq(
                "week_start",
                currentWeek
            )
            .maybeSingle();

    const activeIds =
        overrideResult.data &&
        Array.isArray(
            overrideResult.data.member_ids
        ) &&
        overrideResult.data.member_ids.length === 6
            ? overrideResult.data.member_ids
            : trainOriginalIds;

    const memberResult =
        await db
            .from("members")
            .select("id, game_name")
            .in(
                "id",
                trainOriginalIds
            );

    const memberMap =
        new Map(
            (memberResult.data || [])
                .map(
                    function (member) {
                        return [
                            String(member.id),
                            member.game_name
                        ];
                    }
                )
        );

    const labels = [
        "週一",
        "週二",
        "週三",
        "週四",
        "週五",
        "週六"
    ];

    labels.forEach(
        function (label, index) {
            const row =
                document.createElement("div");

            row.className =
                "train-row";

            const day =
                document.createElement("strong");

            day.textContent = label;

            const select =
                document.createElement("select");

            select.className =
                "train-select";
            select.disabled =
                !canEdit;

            trainOriginalIds.forEach(
                function (id) {
                    const option =
                        document.createElement("option");

                    option.value =
                        String(id);
                    option.textContent =
                        memberMap.get(
                            String(id)
                        ) ||
                        String(id);

                    if (
                        String(
                            activeIds[index]
                        ) ===
                        String(id)
                    ) {
                        option.selected = true;
                    }

                    select.appendChild(option);
                }
            );

            row.appendChild(day);
            row.appendChild(select);
            $("trainSchedule").appendChild(row);
        }
    );

    const sunday =
        document.createElement("div");

    sunday.className =
        "train-row";

    sunday.innerHTML =
        "<strong>週日</strong><span>MVP</span>";

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

$("loginBtn").addEventListener(
    "click",
    async function () {
        const result =
            await db.auth
                .signInWithPassword({
                    email:
                        NormalizeSunriseAccount(
                            $("account").value
                        ),
                    password:
                        $("password").value
                });

        if (result.error) {
            $("status").textContent =
                "登入失敗：" +
                result.error.message;
            return;
        }

        $("password").value = "";
        await loadAll();
    }
);

$("logoutBtn").addEventListener(
    "click",
    async function () {
        await db.auth.signOut({
            scope: "local"
        });
        await loadAll();
    }
);

$("addGroup").addEventListener(
    "click",
    function () {
        if (!canEdit) return;
        groups.push([]);
        renderGroups();
    }
);

$("save").addEventListener(
    "click",
    async function () {
        if (!canEdit) return;

        groups = [
            ...$("groups")
                .querySelectorAll(
                    "[data-name]"
                )
        ].map(
            function (container) {
                return [
                    ...container
                        .querySelectorAll(
                            "input:checked"
                        )
                ].map(
                    function (input) {
                        return +input.value;
                    }
                );
            }
        );

        const result =
            await db
                .from("duty_settings")
                .upsert({
                    id: 1,
                    anchor_week:
                        $("anchor").value,
                    rotation_groups:
                        groups,
                    updated_at:
                        new Date().toISOString()
                });

        $("status").textContent =
            result.error
                ? result.error.message
                : "輪替設定已儲存";
    }
);

$("saveOverride").addEventListener(
    "click",
    async function () {
        if (!canEdit) return;

        const ids = [
            ...$("overrideMembers")
                .querySelectorAll(
                    "input:checked"
                )
        ].map(
            function (input) {
                return +input.value;
            }
        );

        const result =
            await db
                .from(
                    "duty_week_overrides"
                )
                .upsert(
                    {
                        week_start: week(),
                        member_ids: ids,
                        updated_at:
                            new Date().toISOString()
                    },
                    {
                        onConflict:
                            "week_start"
                    }
                );

        $("status").textContent =
            result.error
                ? result.error.message
                : "本週值日生已儲存";
    }
);

$("clearOverride").addEventListener(
    "click",
    async function () {
        if (!canEdit) return;

        await db
            .from(
                "duty_week_overrides"
            )
            .delete()
            .eq(
                "week_start",
                week()
            );

        $("status").textContent =
            "已恢復自動輪替";

        await loadOverride();
        updateMode();
    }
);

$("saveTrainOverride").addEventListener(
    "click",
    async function () {
        if (!canEdit) return;

        const ids = [
            ...document
                .querySelectorAll(
                    ".train-select"
                )
        ].map(
            function (select) {
                return +select.value;
            }
        );

        if (
            ids.length !== 6 ||
            new Set(ids).size !== 6
        ) {
            $("status").textContent =
                "週一到週六必須各使用不同的 6 位抽選成員。";
            return;
        }

        const result =
            await db
                .from(
                    "train_schedule_overrides"
                )
                .upsert(
                    {
                        week_start: week(),
                        member_ids: ids,
                        updated_at:
                            new Date().toISOString()
                    },
                    {
                        onConflict:
                            "week_start"
                    }
                );

        $("status").textContent =
            result.error
                ? result.error.message
                : "本週火車順序已儲存";
    }
);

$("clearTrainOverride").addEventListener(
    "click",
    async function () {
        if (!canEdit) return;

        await db
            .from(
                "train_schedule_overrides"
            )
            .delete()
            .eq(
                "week_start",
                week()
            );

        $("status").textContent =
            "已恢復原始抽選順序";

        await loadTrainSchedule();
        updateMode();
    }
);

document.addEventListener(
    "DOMContentLoaded",
    loadAll
);
