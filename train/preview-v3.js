"use strict";

const PreviewPoolButton = document.getElementById("previewPoolButton");
const PoolSummary = document.getElementById("poolSummary");
const PreviewSelectedCount = document.getElementById("previewSelectedCount");
const PreviewCoolingCount = document.getElementById("previewCoolingCount");
const PreviewAvailableCount = document.getElementById("previewAvailableCount");
const PreviewWeightTotal = document.getElementById("previewWeightTotal");
const PreviewMessage = document.getElementById("previewMessage");
const PreviewLoading = document.getElementById("previewLoading");
const PoolPreviewList = document.getElementById("poolPreviewList");

function V3PreviewLang(){
    const lang=(window.i18next&&i18next.language)||localStorage.getItem("sunriseLanguage")||"en";
    return lang==="zh-TW"||lang==="vi"?lang:"en";
}

function V3PreviewText(key){
    const text={
        en:{loadFirst:"Please load a week first.",calculating:"Calculating…",done:"Draw pool preview is ready.",failed:"Preview failed: ",empty:"No eligible members have been saved for this week.",lastWin:"Last win: ",never:"Never won",winCount:"Previous wins",weight:"Weight",cooling:"Cooling",available:"Available",restore:"Available: ",preview:"Preview Draw Pool"},
        "zh-TW":{loadFirst:"請先載入週次。",calculating:"計算中……",done:"抽獎池預覽已完成。",failed:"預覽失敗：",empty:"本週尚未儲存任何合格成員。",lastWin:"上次中獎：",never:"從未中獎",winCount:"中獎次數",weight:"本週權重",cooling:"冷卻中",available:"可抽選",restore:"恢復：",preview:"預覽抽獎池"},
        vi:{loadFirst:"Vui lòng tải tuần trước.",calculating:"Đang tính…",done:"Đã hoàn tất xem trước nhóm quay.",failed:"Xem trước thất bại: ",empty:"Tuần này chưa lưu thành viên đủ điều kiện.",lastWin:"Lần trúng gần nhất: ",never:"Chưa từng trúng",winCount:"Số lần trúng",weight:"Trọng số tuần này",cooling:"Đang chờ",available:"Có thể quay",restore:"Có lại từ: ",preview:"Xem trước nhóm quay"}
    };
    return text[V3PreviewLang()][key];
}

PreviewPoolButton.addEventListener("click", LoadPoolPreview);

async function LoadPoolPreview() {
    ClearPreviewMessage();

    if (!CurrentTrainWeek) {
        ShowPreviewMessage(V3PreviewText("loadFirst"), true);
        return;
    }

    PreviewPoolButton.disabled = true;
    PreviewPoolButton.textContent = V3PreviewText("calculating");
    PreviewLoading.classList.remove("hidden");
    PreviewLoading.textContent = V3PreviewText("calculating");
    PoolSummary.classList.add("hidden");
    PoolPreviewList.innerHTML = "";

    try {
        const result = await SupabaseClient.rpc("get_train_pool_preview_public", {
            p_train_week_id: CurrentTrainWeek.id
        });

        if (result.error) throw result.error;

        const rows = result.data || [];
        RenderPoolPreview(rows);
        ShowPreviewMessage(V3PreviewText("done"), false);
    } catch (error) {
        ShowPreviewMessage(V3PreviewText("failed") + GetPreviewErrorMessage(error), true);
    } finally {
        PreviewLoading.classList.add("hidden");
        PreviewPoolButton.disabled = false;
        PreviewPoolButton.textContent = V3PreviewText("preview");
    }
}

function RenderPoolPreview(rows) {
    PoolPreviewList.innerHTML = "";

    const coolingRows = rows.filter(function (row) { return row.preview_is_cooling; });
    const availableRows = rows.filter(function (row) { return !row.preview_is_cooling; });
    const totalWeight = availableRows.reduce(function (total, row) {
        return total + (Number(row.preview_draw_weight) || 0);
    }, 0);

    PreviewSelectedCount.textContent = String(rows.length);
    PreviewCoolingCount.textContent = String(coolingRows.length);
    PreviewAvailableCount.textContent = String(availableRows.length);
    PreviewWeightTotal.textContent = String(totalWeight);
    PoolSummary.classList.remove("hidden");

    if (rows.length === 0) {
        PreviewLoading.classList.remove("hidden");
        PreviewLoading.textContent = V3PreviewText("empty");
        return;
    }

    rows.forEach(function (row) {
        PoolPreviewList.appendChild(CreatePoolPreviewRow(row));
    });
}

function CreatePoolPreviewRow(row) {
    const container = document.createElement("div");
    container.className = "pool-preview-row";
    if (row.preview_is_cooling) container.classList.add("pool-preview-cooling");

    const memberArea = document.createElement("div");
    memberArea.className = "pool-member-area";

    const memberName = document.createElement("strong");
    memberName.className = "pool-member-name";
    memberName.textContent = row.preview_member_name;
    memberName.setAttribute("translate", "no");

    const lastWinText = document.createElement("span");
    lastWinText.className = "pool-last-win";
    lastWinText.textContent = row.preview_last_win_week
        ? V3PreviewText("lastWin") + FormatPreviewDate(row.preview_last_win_week)
        : V3PreviewText("never");

    memberArea.appendChild(memberName);
    memberArea.appendChild(lastWinText);

    const winCount = CreatePreviewValue(V3PreviewText("winCount"), String(row.preview_previous_win_count));
    const weight = CreatePreviewValue(V3PreviewText("weight"), row.preview_is_cooling ? "—" : String(row.preview_draw_weight));

    const statusArea = document.createElement("div");
    statusArea.className = "pool-status-area";

    const statusBadge = document.createElement("span");
    statusBadge.className = row.preview_is_cooling
        ? "pool-status pool-status-cooling"
        : "pool-status pool-status-available";
    statusBadge.textContent = row.preview_is_cooling ? V3PreviewText("cooling") : V3PreviewText("available");
    statusArea.appendChild(statusBadge);

    if (row.preview_is_cooling && row.preview_available_again_week) {
        const availableDate = document.createElement("small");
        availableDate.textContent = V3PreviewText("restore") + FormatPreviewDate(row.preview_available_again_week);
        statusArea.appendChild(availableDate);
    }

    container.appendChild(memberArea);
    container.appendChild(winCount);
    container.appendChild(weight);
    container.appendChild(statusArea);
    return container;
}

function CreatePreviewValue(labelText, valueText) {
    const container = document.createElement("div");
    container.className = "pool-value";
    const label = document.createElement("span");
    label.textContent = labelText;
    const value = document.createElement("strong");
    value.textContent = valueText;
    container.appendChild(label);
    container.appendChild(value);
    return container;
}

function FormatPreviewDate(value) {
    if (!value) return "—";
    const parts = value.split("-");
    return parts.length === 3 ? parts[0] + "/" + parts[1] + "/" + parts[2] : value;
}

function ShowPreviewMessage(message, isError) {
    PreviewMessage.textContent = message;
    PreviewMessage.classList.toggle("error", isError);
    PreviewMessage.classList.toggle("success", !isError);
}

function ClearPreviewMessage() {
    PreviewMessage.textContent = "";
    PreviewMessage.classList.remove("error", "success");
}

function GetPreviewErrorMessage(error) {
    if (error && typeof error.message === "string") return error.message;
    return String(error);
}
