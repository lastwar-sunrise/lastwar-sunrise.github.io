"use strict";

const PreviewPoolButton =
    document.getElementById("previewPoolButton");

const PoolSummary =
    document.getElementById("poolSummary");

const PreviewSelectedCount =
    document.getElementById("previewSelectedCount");

const PreviewCoolingCount =
    document.getElementById("previewCoolingCount");

const PreviewAvailableCount =
    document.getElementById("previewAvailableCount");

const PreviewWeightTotal =
    document.getElementById("previewWeightTotal");

const PreviewMessage =
    document.getElementById("previewMessage");

const PreviewLoading =
    document.getElementById("previewLoading");

const PoolPreviewList =
    document.getElementById("poolPreviewList");

PreviewPoolButton.addEventListener(
    "click",
    LoadPoolPreview
);

async function LoadPoolPreview() {
    ClearPreviewMessage();

    if (!CurrentUser) {
        ShowPreviewMessage(
            "請先登入 R4 帳號。",
            true
        );

        return;
    }

    if (!CurrentTrainWeek) {
        ShowPreviewMessage(
            "請先載入週次。",
            true
        );

        return;
    }

    PreviewPoolButton.disabled = true;
    PreviewPoolButton.textContent =
        "計算中……";

    PreviewLoading.classList.remove(
        "hidden"
    );

    PoolSummary.classList.add(
        "hidden"
    );

    PoolPreviewList.innerHTML = "";

    try {
        const result =
            await SupabaseClient.rpc(
                "get_train_pool_preview",
                {
                    p_train_week_id:
                        CurrentTrainWeek.id
                }
            );

        if (result.error) {
            throw result.error;
        }

        const rows = result.data || [];

        RenderPoolPreview(rows);

        ShowPreviewMessage(
            "抽獎池預覽已完成。",
            false
        );
    } catch (error) {
        ShowPreviewMessage(
            "預覽失敗：" +
            GetPreviewErrorMessage(error),
            true
        );
    } finally {
        PreviewLoading.classList.add(
            "hidden"
        );

        PreviewPoolButton.disabled = false;
        PreviewPoolButton.textContent =
            "預覽抽獎池";
    }
}

function RenderPoolPreview(rows) {
    PoolPreviewList.innerHTML = "";

    const coolingRows =
        rows.filter(
            function (row) {
                return row.preview_is_cooling;
            }
        );

    const availableRows =
        rows.filter(
            function (row) {
                return !row.preview_is_cooling;
            }
        );

    const totalWeight =
        availableRows.reduce(
            function (total, row) {
                return total +
                    (
                        Number(
                            row.preview_draw_weight
                        ) || 0
                    );
            },
            0
        );

    PreviewSelectedCount.textContent =
        String(rows.length);

    PreviewCoolingCount.textContent =
        String(coolingRows.length);

    PreviewAvailableCount.textContent =
        String(availableRows.length);

    PreviewWeightTotal.textContent =
        String(totalWeight);

    PoolSummary.classList.remove(
        "hidden"
    );

    if (rows.length === 0) {
        PreviewLoading.classList.remove(
            "hidden"
        );

        PreviewLoading.textContent =
            "本週尚未儲存任何合格成員。";

        return;
    }

    rows.forEach(
        function (row) {
            PoolPreviewList.appendChild(
                CreatePoolPreviewRow(row)
            );
        }
    );
}

function CreatePoolPreviewRow(row) {
    const container =
        document.createElement("div");

    container.className =
        "pool-preview-row";

    if (row.preview_is_cooling) {
        container.classList.add(
            "pool-preview-cooling"
        );
    }

    const memberArea =
        document.createElement("div");

    memberArea.className =
        "pool-member-area";

    const memberName =
        document.createElement("strong");

    memberName.className =
        "pool-member-name";

    memberName.textContent =
        row.preview_member_name;
    
memberName.setAttribute(
    "translate",
    "no"
);
    const lastWinText =
        document.createElement("span");

    lastWinText.className =
        "pool-last-win";

    if (row.preview_last_win_week) {
        lastWinText.textContent =
            "上次中獎：" +
            FormatPreviewDate(
                row.preview_last_win_week
            );
    } else {
        lastWinText.textContent =
            "從未中獎";
    }

    memberArea.appendChild(memberName);
    memberArea.appendChild(lastWinText);

    const winCount =
        CreatePreviewValue(
            "中獎次數",
            String(
                row.preview_previous_win_count
            )
        );

    const weight =
        CreatePreviewValue(
            "本週權重",
            row.preview_is_cooling
                ? "—"
                : String(
                    row.preview_draw_weight
                )
        );

    const statusArea =
        document.createElement("div");

    statusArea.className =
        "pool-status-area";

    const statusBadge =
        document.createElement("span");

    statusBadge.className =
        row.preview_is_cooling
            ? "pool-status pool-status-cooling"
            : "pool-status pool-status-available";

    statusBadge.textContent =
        row.preview_is_cooling
            ? "冷卻中"
            : "可抽選";

    statusArea.appendChild(statusBadge);

    if (
        row.preview_is_cooling &&
        row.preview_available_again_week
    ) {
        const availableDate =
            document.createElement("small");

        availableDate.textContent =
            "恢復：" +
            FormatPreviewDate(
                row.preview_available_again_week
            );

        statusArea.appendChild(
            availableDate
        );
    }

    container.appendChild(memberArea);
    container.appendChild(winCount);
    container.appendChild(weight);
    container.appendChild(statusArea);

    return container;
}

function CreatePreviewValue(
    labelText,
    valueText
) {
    const container =
        document.createElement("div");

    container.className =
        "pool-value";

    const label =
        document.createElement("span");

    label.textContent = labelText;

    const value =
        document.createElement("strong");

    value.textContent = valueText;

    container.appendChild(label);
    container.appendChild(value);

    return container;
}

function FormatPreviewDate(value) {
    if (!value) {
        return "—";
    }

    const parts = value.split("-");

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

function ShowPreviewMessage(
    message,
    isError
) {
    PreviewMessage.textContent = message;

    PreviewMessage.classList.toggle(
        "error",
        isError
    );

    PreviewMessage.classList.toggle(
        "success",
        !isError
    );
}

function ClearPreviewMessage() {
    PreviewMessage.textContent = "";

    PreviewMessage.classList.remove(
        "error",
        "success"
    );
}

function GetPreviewErrorMessage(error) {
    if (
        error &&
        typeof error.message === "string"
    ) {
        return error.message;
    }

    return String(error);
}
