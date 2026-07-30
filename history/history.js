"use strict";

const SupabaseClient =
    window.supabase.createClient(
        SupabaseUrl,
        SupabasePublishableKey
    );

let HistoryRows = [];
let HistoryWeeks = [];

const ReloadButton =
    document.getElementById("reloadButton");

const SearchInput =
    document.getElementById("searchInput");

const SummaryText =
    document.getElementById("summaryText");

const Message =
    document.getElementById("message");

const LoadingMessage =
    document.getElementById("loadingMessage");

const HistoryList =
    document.getElementById("historyList");

document.addEventListener(
    "DOMContentLoaded",
    LoadHistory
);

ReloadButton.addEventListener(
    "click",
    LoadHistory
);

SearchInput.addEventListener(
    "input",
    RenderHistory
);

async function LoadHistory() {
    ClearMessage();

    ReloadButton.disabled = true;
    ReloadButton.textContent =
        "載入中……";

    LoadingMessage.classList.remove(
        "hidden"
    );

    LoadingMessage.textContent =
        "正在載入抽選紀錄……";

    HistoryList.innerHTML = "";

    try {
        const result =
            await SupabaseClient.rpc(
                "get_train_history"
            );

        if (result.error) {
            throw result.error;
        }

        HistoryRows = result.data || [];
        HistoryWeeks = GroupHistoryRows(
            HistoryRows
        );

        UpdateSummary();
        RenderHistory();
    } catch (error) {
        HistoryRows = [];
        HistoryWeeks = [];

        UpdateSummary();

        LoadingMessage.classList.remove(
            "hidden"
        );

        LoadingMessage.textContent =
            "載入失敗。";

        ShowMessage(
            "讀取抽選歷史失敗：" +
            GetErrorMessage(error)
        );
    } finally {
        ReloadButton.disabled = false;
        ReloadButton.textContent =
            "重新整理";
    }
}

function GroupHistoryRows(rows) {
    const weekMap =
        new Map();

    rows.forEach(
        function (row) {
            const key =
                String(row.week_id);

            if (!weekMap.has(key)) {
                weekMap.set(
                    key,
                    {
                        weekId: row.week_id,
                        weekStart: row.week_start,
                        drawCount: row.draw_count,
                        completedAt: row.completed_at,
                        completedByEmail:
                            row.completed_by_email,
                        winners: []
                    }
                );
            }

            weekMap.get(key).winners.push({
                drawOrder: row.draw_order,
                memberId: row.member_id,
                memberName: row.member_name
            });
        }
    );

    return Array.from(
        weekMap.values()
    );
}

function UpdateSummary() {
    const totalWinners =
        HistoryWeeks.reduce(
            function (total, week) {
                return (
                    total +
                    week.winners.length
                );
            },
            0
        );

    SummaryText.textContent =
        "共 " +
        HistoryWeeks.length +
        " 週，累計 " +
        totalWinners +
        " 個抽選名額";
}

function RenderHistory() {
    HistoryList.innerHTML = "";

    const keyword =
        SearchInput.value
            .trim()
            .toLowerCase();

    const filteredWeeks =
        HistoryWeeks.filter(
            function (week) {
                if (!keyword) {
                    return true;
                }

                return week.winners.some(
                    function (winner) {
                        return winner.memberName
                            .toLowerCase()
                            .includes(keyword);
                    }
                );
            }
        );

    if (filteredWeeks.length === 0) {
        LoadingMessage.classList.remove(
            "hidden"
        );

        LoadingMessage.textContent =
            keyword
                ? "找不到這位成員的抽選紀錄。"
                : "目前沒有已完成的抽選紀錄。";

        return;
    }

    LoadingMessage.classList.add(
        "hidden"
    );

    filteredWeeks.forEach(
        function (week) {
            HistoryList.appendChild(
                CreateHistoryCard(
                    week,
                    keyword
                )
            );
        }
    );
}

function CreateHistoryCard(
    week,
    keyword
) {
    const card =
        document.createElement("article");

    card.className =
        "history-card";

    const header =
        document.createElement("div");

    header.className =
        "history-header";

    const headerText =
        document.createElement("div");

    const title =
        document.createElement("h3");

    title.className =
        "history-date";

    title.textContent =
        "🚂 " +
        FormatWeekDate(
            week.weekStart
        );

    const metadata =
        document.createElement("p");

    metadata.className =
        "history-meta";

    const completedTime =
        FormatDateTime(
            week.completedAt
        );

    const completedBy =
        week.completedByEmail ||
        "未知帳號";

    metadata.textContent =
        "抽選時間：" +
        completedTime +
        "｜執行者：" +
        completedBy;

    const count =
        document.createElement("div");

    count.className =
        "draw-count";

    count.textContent =
        week.winners.length +
        " 個名額";

    headerText.appendChild(title);
    headerText.appendChild(metadata);

    header.appendChild(headerText);
    header.appendChild(count);

    const winnerList =
        document.createElement("ol");

    winnerList.className =
        "winner-list";

    let displayedWinners =
        week.winners;

    if (keyword) {
        displayedWinners =
            week.winners.filter(
                function (winner) {
                    return winner.memberName
                        .toLowerCase()
                        .includes(keyword);
                }
            );
    }

    displayedWinners.forEach(
        function (winner) {
            const row =
                document.createElement("li");

            row.className =
                "winner-row";

            const order =
                document.createElement("div");

            order.className =
                "winner-order";

            order.textContent =
                String(winner.drawOrder);

            const name =
                document.createElement("div");

            name.className =
                "winner-name";

            name.textContent =
                winner.memberName;

            row.appendChild(order);
            row.appendChild(name);

            winnerList.appendChild(row);
        }
    );

    card.appendChild(header);
    card.appendChild(winnerList);

    return card;
}

function FormatWeekDate(value) {
    if (!value) {
        return "日期不明";
    }

    const parts =
        value.split("-");

    if (parts.length !== 3) {
        return value;
    }

    return (
        parts[0] +
        "/" +
        parts[1] +
        "/" +
        parts[2] +
        " 當週"
    );
}

function FormatDateTime(value) {
    if (!value) {
        return "時間不明";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value;
    }

    return date.toLocaleString(
        "zh-TW",
        {
            timeZone: "Asia/Taipei",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }
    );
}

function ShowMessage(message) {
    Message.textContent = message;
    Message.classList.add("error");
}

function ClearMessage() {
    Message.textContent = "";
    Message.classList.remove("error");
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
