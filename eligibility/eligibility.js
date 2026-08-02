"use strict";

const SupabaseClient =
    window.supabase.createClient(
        SupabaseUrl,
        SupabasePublishableKey
    );

const SearchInput =
    document.getElementById(
        "searchInput"
    );

const SearchButton =
    document.getElementById(
        "searchButton"
    );

const Message =
    document.getElementById(
        "message"
    );

const LoadingMessage =
    document.getElementById(
        "loadingMessage"
    );

const WeekInformation =
    document.getElementById(
        "weekInformation"
    );

const WeekStartText =
    document.getElementById(
        "weekStartText"
    );

const WeekStatusText =
    document.getElementById(
        "weekStatusText"
    );

const ResultList =
    document.getElementById(
        "resultList"
    );

SearchButton.addEventListener(
    "click",
    SearchEligibility
);

SearchInput.addEventListener(
    "keydown",
    function (event) {
        if (event.key === "Enter") {
            SearchEligibility();
        }
    }
);

async function SearchEligibility() {
    ClearMessage();

    const keyword =
        SearchInput.value.trim();

    if (!keyword) {
        ShowMessage(
            "請輸入要查詢的成員名稱。",
            true
        );

        return;
    }

    SearchButton.disabled = true;
    SearchButton.textContent =
        "查詢中……";

    LoadingMessage.classList.remove(
        "hidden"
    );

    WeekInformation.classList.add(
        "hidden"
    );

    ResultList.innerHTML = "";

    try {
        const result =
            await SupabaseClient.rpc(
                "get_public_train_eligibility",
                {
                    p_search_text: keyword
                }
            );

        if (result.error) {
            throw result.error;
        }

        const rows =
            result.data || [];

        RenderResults(rows);
    } catch (error) {
        ShowMessage(
            "查詢失敗：" +
            GetErrorMessage(error),
            true
        );
    } finally {
        LoadingMessage.classList.add(
            "hidden"
        );

        SearchButton.disabled = false;
        SearchButton.textContent =
            "查詢資格";
    }
}

function RenderResults(rows) {
    ResultList.innerHTML = "";

    if (rows.length === 0) {
        ShowMessage(
            "找不到成員，或本週尚未建立抽選資料。",
            true
        );

        return;
    }

    const firstRow = rows[0];

    WeekStartText.textContent =
        FormatDate(
            firstRow.current_week_start
        );

    WeekStatusText.textContent =
        firstRow.current_week_status ===
        "completed"
            ? "已完成抽選"
            : "資格整理中";

    WeekInformation.classList.remove(
        "hidden"
    );

    rows.forEach(
        function (row) {
            ResultList.appendChild(
                CreateResultCard(row)
            );
        }
    );

    ShowMessage(
        "共找到 " +
        rows.length +
        " 位符合名稱的成員。",
        false
    );
}

function CreateResultCard(row) {
    const card =
        document.createElement(
            "article"
        );

    card.className =
        "result-card";

    const header =
        document.createElement(
            "div"
        );

    header.className =
        "result-header";

    const name =
        document.createElement(
            "h2"
        );

    name.className =
        "member-name";

    name.textContent =
        row.member_name;

    const status =
        CreateStatusBadge(
            row.eligibility_status
        );

    header.appendChild(name);
    header.appendChild(status);

    const informationGrid =
        document.createElement(
            "div"
        );

    informationGrid.className =
        "information-grid";

    informationGrid.appendChild(
        CreateInformationItem(
            "R4 本週資格名單",
            row.is_selected
                ? "✅ 已列入"
                : "❌ 未列入",
            row.is_selected
                ? "已達成本週 R4 設定的資格"
                : "本週沒有被加入合格名單"
        )
    );

    informationGrid.appendChild(
        CreateInformationItem(
            "冷卻狀態",
            row.is_cooling
                ? "⛔ 冷卻中"
                : "✅ 無冷卻",
            row.is_cooling
                ? "恢復週次：" +
                  FormatDate(
                      row.available_again_week
                  )
                : "目前不受兩週冷卻限制"
        )
    );

    informationGrid.appendChild(
        CreateInformationItem(
            "歷史中獎次數",
            String(
                row.previous_win_count
            ) + " 次",
            row.last_win_week
                ? "上次中獎：" +
                  FormatDate(
                      row.last_win_week
                  )
                : "從未中獎"
        )
    );

    informationGrid.appendChild(
        CreateInformationItem(
            "本週抽選權重",
            row.draw_weight === null
                ? "—"
                : String(
                    row.draw_weight
                ),
            GetWeightNote(row)
        )
    );

    card.appendChild(header);
    card.appendChild(
        informationGrid
    );

    return card;
}

function CreateStatusBadge(status) {
    const badge =
        document.createElement(
            "span"
        );

    badge.className =
        "status-badge";

    switch (status) {
        case "winner":
            badge.classList.add(
                "status-winner"
            );

            badge.textContent =
                "🎉 本週已中獎";
            break;

        case "cooling":
            badge.classList.add(
                "status-cooling"
            );

            badge.textContent =
                "冷卻中";
            break;

        case "available":
            badge.classList.add(
                "status-available"
            );

            badge.textContent =
                "可參加抽選";
            break;

        default:
            badge.classList.add(
                "status-not-selected"
            );

            badge.textContent =
                "本週未列入";
            break;
    }

    return badge;
}

function CreateInformationItem(
    labelText,
    valueText,
    noteText
) {
    const item =
        document.createElement(
            "div"
        );

    item.className =
        "information-item";

    const label =
        document.createElement(
            "span"
        );

    label.className =
        "information-label";

    label.textContent =
        labelText;

    const value =
        document.createElement(
            "strong"
        );

    value.className =
        "information-value";

    value.textContent =
        valueText;

    const note =
        document.createElement(
            "small"
        );

    note.className =
        "information-note";

    note.textContent =
        noteText;

    item.appendChild(label);
    item.appendChild(value);
    item.appendChild(note);

    return item;
}

function GetWeightNote(row) {
    switch (
        row.eligibility_status
    ) {
        case "winner":
            return "本週抽選已完成";

        case "cooling":
            return "冷卻期間不計算權重";

        case "not_selected":
            return "未列入資格名單，不計算權重";

        default:
            return "權重越高，本週中獎機率越高";
    }
}

function FormatDate(value) {
    if (!value) {
        return "—";
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
        parts[2]
    );
}

function ShowMessage(
    message,
    isError
) {
    Message.textContent =
        message;

    Message.classList.toggle(
        "error",
        isError
    );

    Message.classList.toggle(
        "success",
        !isError
    );
}

function ClearMessage() {
    Message.textContent = "";

    Message.classList.remove(
        "error",
        "success"
    );
}

function GetErrorMessage(error) {
    if (
        error &&
        typeof error.message ===
            "string"
    ) {
        return error.message;
    }

    return String(error);
}
