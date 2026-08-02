"use strict";

const SunriseSupportedLanguages = [
    "zh-TW",
    "en",
    "vi"
];

const SunriseTranslations = {
    "zh-TW": {
        translation: {
            common: {
                language: "語言",
                chinese: "繁體中文",
                english: "English",
                vietnamese: "Tiếng Việt",
                home: "返回管理中心",
                loading: "載入中……",
                unknownError: "發生未知錯誤"
            },

            home: {
                pageTitle: "Sunrise 管理中心",
                title: "☀️ Sunrise 管理中心",
                subtitle: "Sunrise 聯盟管理工具",

                allianceInfoTitle: "Sunrise 聯盟資訊",
                allianceInfoDescription:
                    "查看值日生、火車駕駛、盟內公告、紅星戰區與近七日策略。",

                trainTitle: "火車資格抽選",
                trainDescription:
                    "建立每週資格名單並進行正式抽選。",

                membersTitle: "成員管理",
                membersDescription:
                    "新增、修改、啟用或停用聯盟成員。",

                historyTitle: "抽選歷史",
                historyDescription:
                    "查看過去每一週的火車資格抽選結果。",

                eligibilityTitle: "火車資格查詢",
                eligibilityDescription:
                    "查詢本週資格、冷卻狀態、歷史中獎次數與抽選權重。",

                settingsTitle: "系統設定",
                settingsDescription:
                    "帳號、角色與系統設定，即將推出。",

                footer: "Sunrise 聯盟"
            },

            train: {
                pageTitle: "Sunrise 火車資格抽選",
                backHome: "← 返回管理中心",
                title: "🚂 Sunrise 火車資格抽選",
                subtitle:
                    "由當週值日 R4 勾選合格成員並進行正式抽選",

                notLoggedIn: "尚未登入",
                loggedIn: "已登入：{{account}}",

                loginTitle: "R4 登入",
                account: "帳號",
                accountPlaceholder: "例如：kindsun",
                password: "密碼",
                passwordPlaceholder: "請輸入密碼",
                login: "登入",
                loggingIn: "登入中……",
                logout: "登出",

                weekSettingsTitle: "本週抽選設定",
                weekSettingsDescription:
                    "建立或載入指定週次的火車抽選",
                weekStart: "週次開始日",
                drawCount: "抽選名額",
                loadWeek: "載入週次",
                loadingWeek: "載入中……",
                saveEligibility: "儲存本週資格",
                saving: "儲存中……",
                currentWeek: "目前週次：",
                notLoaded: "尚未載入",
                status: "狀態：",
                editing: "編輯中",
                completed: "已完成",

                eligibleTitle: "本週合格成員",
                eligibleDescription:
                    "請根據本週資格條件勾選合格成員",
                reloadMembers: "重新載入成員",
                searchPlaceholder: "搜尋成員名稱",
                selectAll: "全選",
                clearAll: "全部取消",
                allianceMembers: "聯盟成員：",
                selectedEligible: "已選合格：",
                people: "人",
                readingMembers: "正在讀取成員名單……",
                noMembers: "目前沒有可顯示的成員。",

                previewTitle: "抽獎池預覽",
                previewDescription:
                    "查看冷卻狀態、歷史中獎次數與本週權重",
                previewButton: "預覽抽獎池",
                calculating: "計算中……",
                selectedByR4: "R4 勾選",
                cooling: "冷卻中",
                available: "實際可抽",
                totalWeight: "權重總和",
                calculatingPool: "正在計算抽獎池……",
                availableStatus: "可抽選",
                previousWins: "中獎次數",
                currentWeight: "本週權重",
                neverWon: "從未中獎",
                lastWon: "上次中獎：",
                availableAgain: "恢復：",

                officialDrawTitle: "正式抽選",
                officialDrawDescription:
                    "只會從已儲存的合格成員中抽選，完成後不能重抽",
                officialDrawButton: "正式抽選",
                drawing: "正式抽選中……",
                resultTitle: "🎉 本週抽選結果",
                drawTime: "抽選時間：",

                initializeFailed: "初始化失敗：",
                enterAccountPassword: "請輸入帳號與密碼。",
                loginSuccess: "登入成功。",
                loginFailed: "登入失敗：",
                logoutSuccess: "已登出。",
                logoutFailed: "登出失敗：",
                readMembersFailed: "讀取成員失敗：",
                selectWeekStart: "請選擇週次開始日。",
                weekLoadedEditable:
                    "週次已載入，可以編輯合格名單。",
                weekCompleted: "此週已完成正式抽選。",
                loadWeekFailed: "載入週次失敗：",
                loginFirst: "請先登入。",
                loadWeekFirst: "請先載入週次。",
                completedCannotModify:
                    "此週已完成，不能再修改。",
                selectOneMember:
                    "請至少勾選一名合格成員。",
                drawCountExceeds:
                    "抽選名額不能超過合格人數。",
                saveFailed: "儲存失敗：",
                eligibilitySaved:
                    "本週資格已儲存，共 {{count}} 人。",
                r4LoginFirst:
                    "請先使用 R4 帳號登入。",
                alreadyDrawn:
                    "此週已完成正式抽選，不能重抽。",
                drawConfirmation:
                    "正式抽選後將無法重抽，確定繼續嗎？",
                drawSuccess:
                    "正式抽選完成，結果已保存。",
                drawFailed: "正式抽選失敗：",

                previewLoginFirst:
                    "請先登入 R4 帳號。",
                previewCompleted:
                    "抽獎池預覽已完成。",
                previewFailed: "預覽失敗：",
                noSavedCandidates:
                    "本週尚未儲存任何合格成員。",

                footer: "Sunrise 聯盟"
            }
        }
    },

    en: {
        translation: {
            common: {
                language: "Language",
                chinese: "繁體中文",
                english: "English",
                vietnamese: "Tiếng Việt",
                home: "Back to Management Center",
                loading: "Loading…",
                unknownError: "An unknown error occurred"
            },

            home: {
                pageTitle: "Sunrise Management Center",
                title: "☀️ Sunrise Management Center",
                subtitle: "Sunrise Alliance Management Tools",

                allianceInfoTitle: "Sunrise Alliance Information",
                allianceInfoDescription:
                    "View duty officers, train drivers, alliance announcements, red-star warzone information, and the seven-day strategy.",

                trainTitle: "Train Qualification Draw",
                trainDescription:
                    "Create the weekly eligibility list and conduct the official draw.",

                membersTitle: "Member Management",
                membersDescription:
                    "Add, edit, activate, or deactivate alliance members.",

                historyTitle: "Draw History",
                historyDescription:
                    "View the train qualification results from previous weeks.",

                eligibilityTitle: "Train Eligibility Lookup",
                eligibilityDescription:
                    "Check this week's eligibility, cooldown status, previous wins, and draw weight.",

                settingsTitle: "System Settings",
                settingsDescription:
                    "Account, role, and system settings—coming soon.",

                footer: "Sunrise Alliance"
            },

            train: {
                pageTitle: "Sunrise Train Qualification Draw",
                backHome: "← Back to Management Center",
                title: "🚂 Sunrise Train Qualification Draw",
                subtitle:
                    "The R4 officer on duty selects eligible members and conducts the official draw",

                notLoggedIn: "Not signed in",
                loggedIn: "Signed in: {{account}}",

                loginTitle: "R4 Sign In",
                account: "Account",
                accountPlaceholder: "Example: kindsun",
                password: "Password",
                passwordPlaceholder: "Enter your password",
                login: "Sign In",
                loggingIn: "Signing in…",
                logout: "Sign Out",

                weekSettingsTitle: "Weekly Draw Settings",
                weekSettingsDescription:
                    "Create or load the train draw for a selected week",
                weekStart: "Week Start",
                drawCount: "Number of Winners",
                loadWeek: "Load Week",
                loadingWeek: "Loading…",
                saveEligibility: "Save Weekly Eligibility",
                saving: "Saving…",
                currentWeek: "Current week:",
                notLoaded: "Not loaded",
                status: "Status:",
                editing: "Editing",
                completed: "Completed",

                eligibleTitle: "Eligible Members This Week",
                eligibleDescription:
                    "Select members who meet this week's requirements",
                reloadMembers: "Reload Members",
                searchPlaceholder: "Search member name",
                selectAll: "Select All",
                clearAll: "Clear All",
                allianceMembers: "Alliance members:",
                selectedEligible: "Selected as eligible:",
                people: "",
                readingMembers: "Loading member list…",
                noMembers: "No members are available.",

                previewTitle: "Draw Pool Preview",
                previewDescription:
                    "View cooldown status, previous wins, and this week's weight",
                previewButton: "Preview Draw Pool",
                calculating: "Calculating…",
                selectedByR4: "Selected by R4",
                cooling: "On Cooldown",
                available: "Available",
                totalWeight: "Total Weight",
                calculatingPool: "Calculating draw pool…",
                availableStatus: "Eligible",
                previousWins: "Previous Wins",
                currentWeight: "Weight",
                neverWon: "Never won",
                lastWon: "Last win: ",
                availableAgain: "Available: ",

                officialDrawTitle: "Official Draw",
                officialDrawDescription:
                    "Only saved eligible members will be included. The draw cannot be repeated once completed.",
                officialDrawButton: "Official Draw",
                drawing: "Drawing…",
                resultTitle: "🎉 This Week's Results",
                drawTime: "Draw time: ",

                initializeFailed: "Initialization failed: ",
                enterAccountPassword:
                    "Enter your account and password.",
                loginSuccess: "Signed in successfully.",
                loginFailed: "Sign-in failed: ",
                logoutSuccess: "Signed out.",
                logoutFailed: "Sign-out failed: ",
                readMembersFailed:
                    "Failed to load members: ",
                selectWeekStart:
                    "Select the week start date.",
                weekLoadedEditable:
                    "The week has been loaded. You may edit the eligibility list.",
                weekCompleted:
                    "The official draw for this week has been completed.",
                loadWeekFailed:
                    "Failed to load the week: ",
                loginFirst: "Sign in first.",
                loadWeekFirst: "Load a week first.",
                completedCannotModify:
                    "This week is completed and cannot be changed.",
                selectOneMember:
                    "Select at least one eligible member.",
                drawCountExceeds:
                    "The number of winners cannot exceed the number of eligible members.",
                saveFailed: "Save failed: ",
                eligibilitySaved:
                    "Weekly eligibility saved: {{count}} members.",
                r4LoginFirst:
                    "Sign in with an R4 account first.",
                alreadyDrawn:
                    "This week's official draw is complete and cannot be repeated.",
                drawConfirmation:
                    "The official draw cannot be repeated. Continue?",
                drawSuccess:
                    "Official draw completed and saved.",
                drawFailed: "Official draw failed: ",

                previewLoginFirst:
                    "Sign in with an R4 account first.",
                previewCompleted:
                    "Draw pool preview completed.",
                previewFailed: "Preview failed: ",
                noSavedCandidates:
                    "No eligible members have been saved for this week.",

                footer: "Sunrise Alliance"
            }
        }
    },

    vi: {
        translation: {
            common: {
                language: "Ngôn ngữ",
                chinese: "繁體中文",
                english: "English",
                vietnamese: "Tiếng Việt",
                home: "Quay lại trung tâm quản lý",
                loading: "Đang tải…",
                unknownError: "Đã xảy ra lỗi không xác định"
            },

            home: {
                pageTitle: "Trung tâm quản lý Sunrise",
                title: "☀️ Trung tâm quản lý Sunrise",
                subtitle: "Công cụ quản lý Liên minh Sunrise",

                allianceInfoTitle: "Thông tin Liên minh Sunrise",
                allianceInfoDescription:
                    "Xem người trực, người lái tàu, thông báo liên minh, thông tin chiến khu sao đỏ và chiến lược bảy ngày.",

                trainTitle: "Bốc thăm quyền lái tàu",
                trainDescription:
                    "Lập danh sách đủ điều kiện hằng tuần và tiến hành bốc thăm chính thức.",

                membersTitle: "Quản lý thành viên",
                membersDescription:
                    "Thêm, sửa, kích hoạt hoặc vô hiệu hóa thành viên liên minh.",

                historyTitle: "Lịch sử bốc thăm",
                historyDescription:
                    "Xem kết quả bốc thăm quyền lái tàu của các tuần trước.",

                eligibilityTitle: "Tra cứu điều kiện lái tàu",
                eligibilityDescription:
                    "Kiểm tra điều kiện tuần này, trạng thái hồi chiêu, số lần trúng và trọng số.",

                settingsTitle: "Cài đặt hệ thống",
                settingsDescription:
                    "Cài đặt tài khoản, vai trò và hệ thống—sắp ra mắt.",

                footer: "Liên minh Sunrise"
            },

            train: {
                pageTitle: "Bốc thăm quyền lái tàu Sunrise",
                backHome: "← Quay lại trung tâm quản lý",
                title: "🚂 Bốc thăm quyền lái tàu Sunrise",
                subtitle:
                    "R4 trực tuần chọn các thành viên đủ điều kiện và tiến hành bốc thăm chính thức",

                notLoggedIn: "Chưa đăng nhập",
                loggedIn: "Đã đăng nhập: {{account}}",

                loginTitle: "Đăng nhập R4",
                account: "Tài khoản",
                accountPlaceholder: "Ví dụ: kindsun",
                password: "Mật khẩu",
                passwordPlaceholder: "Nhập mật khẩu",
                login: "Đăng nhập",
                loggingIn: "Đang đăng nhập…",
                logout: "Đăng xuất",

                weekSettingsTitle: "Thiết lập bốc thăm tuần",
                weekSettingsDescription:
                    "Tạo hoặc tải kỳ bốc thăm của tuần được chọn",
                weekStart: "Ngày bắt đầu tuần",
                drawCount: "Số người được chọn",
                loadWeek: "Tải tuần",
                loadingWeek: "Đang tải…",
                saveEligibility: "Lưu điều kiện tuần",
                saving: "Đang lưu…",
                currentWeek: "Tuần hiện tại:",
                notLoaded: "Chưa tải",
                status: "Trạng thái:",
                editing: "Đang chỉnh sửa",
                completed: "Đã hoàn tất",

                eligibleTitle: "Thành viên đủ điều kiện tuần này",
                eligibleDescription:
                    "Chọn những thành viên đạt yêu cầu của tuần này",
                reloadMembers: "Tải lại thành viên",
                searchPlaceholder: "Tìm tên thành viên",
                selectAll: "Chọn tất cả",
                clearAll: "Bỏ chọn tất cả",
                allianceMembers: "Thành viên liên minh:",
                selectedEligible: "Đã chọn đủ điều kiện:",
                people: " người",
                readingMembers: "Đang tải danh sách thành viên…",
                noMembers: "Không có thành viên để hiển thị.",

                previewTitle: "Xem trước danh sách bốc thăm",
                previewDescription:
                    "Xem trạng thái hồi chiêu, số lần trúng và trọng số tuần này",
                previewButton: "Xem trước",
                calculating: "Đang tính…",
                selectedByR4: "R4 đã chọn",
                cooling: "Đang hồi chiêu",
                available: "Có thể bốc thăm",
                totalWeight: "Tổng trọng số",
                calculatingPool:
                    "Đang tính danh sách bốc thăm…",
                availableStatus: "Có thể tham gia",
                previousWins: "Số lần trúng",
                currentWeight: "Trọng số tuần",
                neverWon: "Chưa từng trúng",
                lastWon: "Lần trúng gần nhất: ",
                availableAgain: "Có thể tham gia lại: ",

                officialDrawTitle: "Bốc thăm chính thức",
                officialDrawDescription:
                    "Chỉ những thành viên đủ điều kiện đã lưu mới được tham gia. Sau khi hoàn tất không thể bốc lại.",
                officialDrawButton: "Bốc thăm chính thức",
                drawing: "Đang bốc thăm…",
                resultTitle: "🎉 Kết quả tuần này",
                drawTime: "Thời gian bốc thăm: ",

                initializeFailed: "Khởi tạo thất bại: ",
                enterAccountPassword:
                    "Vui lòng nhập tài khoản và mật khẩu.",
                loginSuccess: "Đăng nhập thành công.",
                loginFailed: "Đăng nhập thất bại: ",
                logoutSuccess: "Đã đăng xuất.",
                logoutFailed: "Đăng xuất thất bại: ",
                readMembersFailed:
                    "Không thể tải thành viên: ",
                selectWeekStart:
                    "Vui lòng chọn ngày bắt đầu tuần.",
                weekLoadedEditable:
                    "Đã tải tuần. Bạn có thể chỉnh sửa danh sách đủ điều kiện.",
                weekCompleted:
                    "Tuần này đã hoàn tất bốc thăm chính thức.",
                loadWeekFailed:
                    "Không thể tải tuần: ",
                loginFirst: "Vui lòng đăng nhập trước.",
                loadWeekFirst:
                    "Vui lòng tải tuần trước.",
                completedCannotModify:
                    "Tuần này đã hoàn tất và không thể chỉnh sửa.",
                selectOneMember:
                    "Vui lòng chọn ít nhất một thành viên đủ điều kiện.",
                drawCountExceeds:
                    "Số người được chọn không thể lớn hơn số thành viên đủ điều kiện.",
                saveFailed: "Lưu thất bại: ",
                eligibilitySaved:
                    "Đã lưu điều kiện tuần cho {{count}} thành viên.",
                r4LoginFirst:
                    "Vui lòng đăng nhập bằng tài khoản R4.",
                alreadyDrawn:
                    "Tuần này đã bốc thăm và không thể bốc lại.",
                drawConfirmation:
                    "Sau khi bốc thăm chính thức sẽ không thể bốc lại. Tiếp tục?",
                drawSuccess:
                    "Đã hoàn tất và lưu kết quả bốc thăm.",
                drawFailed: "Bốc thăm thất bại: ",

                previewLoginFirst:
                    "Vui lòng đăng nhập bằng tài khoản R4.",
                previewCompleted:
                    "Đã hoàn tất xem trước danh sách.",
                previewFailed: "Xem trước thất bại: ",
                noSavedCandidates:
                    "Tuần này chưa lưu thành viên đủ điều kiện.",

                footer: "Liên minh Sunrise"
            }
        }
    }
};

const SunriseDynamicTextRules = [
    {
        pattern: /^已登入：(.*)$/,
        key: "train.loggedIn",
        getOptions: function (match) {
            return { account: match[1] };
        }
    },
    {
        pattern: /^本週資格已儲存，共 (\d+) 人。$/,
        key: "train.eligibilitySaved",
        getOptions: function (match) {
            return { count: match[1] };
        }
    },
    {
        pattern: /^初始化失敗：(.*)$/,
        key: "train.initializeFailed",
        suffixGroup: 1
    },
    {
        pattern: /^登入失敗：(.*)$/,
        key: "train.loginFailed",
        suffixGroup: 1
    },
    {
        pattern: /^登出失敗：(.*)$/,
        key: "train.logoutFailed",
        suffixGroup: 1
    },
    {
        pattern: /^讀取成員失敗：(.*)$/,
        key: "train.readMembersFailed",
        suffixGroup: 1
    },
    {
        pattern: /^載入週次失敗：(.*)$/,
        key: "train.loadWeekFailed",
        suffixGroup: 1
    },
    {
        pattern: /^儲存失敗：(.*)$/,
        key: "train.saveFailed",
        suffixGroup: 1
    },
    {
        pattern: /^正式抽選失敗：(.*)$/,
        key: "train.drawFailed",
        suffixGroup: 1
    },
    {
        pattern: /^預覽失敗：(.*)$/,
        key: "train.previewFailed",
        suffixGroup: 1
    },
    {
        pattern: /^抽選時間：(.*)$/,
        key: "train.drawTime",
        suffixGroup: 1
    },
    {
        pattern: /^上次中獎：(.*)$/,
        key: "train.lastWon",
        suffixGroup: 1
    },
    {
        pattern: /^恢復：(.*)$/,
        key: "train.availableAgain",
        suffixGroup: 1
    }
];

let SunriseI18nReady = false;
let SunriseTranslationObserver = null;

function GetInitialSunriseLanguage() {
    const savedLanguage =
        localStorage.getItem("sunriseLanguage");

    if (
        SunriseSupportedLanguages.includes(
            savedLanguage
        )
    ) {
        return savedLanguage;
    }

    const browserLanguage =
        String(
            navigator.language || ""
        ).toLowerCase();

    if (
        browserLanguage.startsWith("vi")
    ) {
        return "vi";
    }

    if (
        browserLanguage.startsWith("zh")
    ) {
        return "zh-TW";
    }

    return "en";
}

async function InitializeSunriseI18n() {
    await i18next.init({
        resources: SunriseTranslations,
        lng: GetInitialSunriseLanguage(),
        fallbackLng: "en",
        supportedLngs:
            SunriseSupportedLanguages,
        interpolation: {
            escapeValue: false
        }
    });

    SunriseI18nReady = true;

    ApplySunriseTranslations();
    StartSunriseTranslationObserver();
}

function SunriseT(key, options) {
    if (!SunriseI18nReady) {
        return key;
    }

    return i18next.t(
        key,
        options || {}
    );
}

async function ChangeSunriseLanguage(language) {
    if (
        !SunriseSupportedLanguages.includes(
            language
        )
    ) {
        return;
    }

    localStorage.setItem(
        "sunriseLanguage",
        language
    );

    await i18next.changeLanguage(
        language
    );

    ApplySunriseTranslations();

    document.dispatchEvent(
        new CustomEvent(
            "sunriseLanguageChanged",
            {
                detail: {
                    language: language
                }
            }
        )
    );
}

function ApplySunriseTranslations() {
    if (!SunriseI18nReady) {
        return;
    }

    document.documentElement.lang =
        i18next.language;

    document
        .querySelectorAll(
            "[data-i18n]"
        )
        .forEach(
            function (element) {
                const key =
                    element.dataset.i18n;

                element.textContent =
                    SunriseT(key);
            }
        );

    document
        .querySelectorAll(
            "[data-i18n-placeholder]"
        )
        .forEach(
            function (element) {
                const key =
                    element.dataset
                        .i18nPlaceholder;

                element.placeholder =
                    SunriseT(key);
            }
        );

    document
        .querySelectorAll(
            "[data-i18n-title]"
        )
        .forEach(
            function (element) {
                const key =
                    element.dataset
                        .i18nTitle;

                element.title =
                    SunriseT(key);
            }
        );

    document
        .querySelectorAll(
            "[data-language-select]"
        )
        .forEach(
            function (select) {
                select.value =
                    i18next.language;
            }
        );

    TranslateKnownDynamicElements(
        document.body
    );
}

function TranslateKnownDynamicElements(root) {
    if (
        !root ||
        !SunriseI18nReady
    ) {
        return;
    }

    const elements = [];

    if (
        root.nodeType ===
        Node.ELEMENT_NODE
    ) {
        elements.push(root);
    }

    if (root.querySelectorAll) {
        root
            .querySelectorAll(
                "*"
            )
            .forEach(
                function (element) {
                    elements.push(element);
                }
            );
    }

    elements.forEach(
        function (element) {
            if (
                element.closest(
                    '[translate="no"]'
                )
            ) {
                return;
            }

            if (
                element.hasAttribute(
                    "data-i18n"
                )
            ) {
                return;
            }

            if (
                element.children.length > 0
            ) {
                return;
            }

            const originalText =
                element.dataset
                    .originalSystemText ||
                element.textContent.trim();

            if (!originalText) {
                return;
            }

            const translatedText =
                TranslateSunriseDynamicText(
                    originalText
                );

            if (
                translatedText ===
                originalText
            ) {
                return;
            }

            if (
                !element.dataset
                    .originalSystemText
            ) {
                element.dataset
                    .originalSystemText =
                    originalText;
            }

            element.textContent =
                translatedText;
        }
    );
}

function TranslateSunriseDynamicText(text) {
    const exactKey =
        SunriseExactSystemTextKeys[
            text
        ];

    if (exactKey) {
        return SunriseT(exactKey);
    }

    for (
        const rule of
        SunriseDynamicTextRules
    ) {
        const match =
            text.match(rule.pattern);

        if (!match) {
            continue;
        }

        if (rule.getOptions) {
            return SunriseT(
                rule.key,
                rule.getOptions(match)
            );
        }

        if (rule.suffixGroup) {
            return (
                SunriseT(rule.key) +
                match[rule.suffixGroup]
            );
        }
    }

    return text;
}

function StartSunriseTranslationObserver() {
    if (
        SunriseTranslationObserver
    ) {
        return;
    }

    SunriseTranslationObserver =
        new MutationObserver(
            function (mutations) {
                mutations.forEach(
                    function (mutation) {
                        if (
                            mutation.type ===
                            "characterData"
                        ) {
                            TranslateKnownDynamicElements(
                                mutation.target
                                    .parentElement
                            );

                            return;
                        }

                        mutation.addedNodes.forEach(
                            function (node) {
                                if (
                                    node.nodeType ===
                                    Node.ELEMENT_NODE
                                ) {
                                    TranslateKnownDynamicElements(
                                        node
                                    );
                                }
                            }
                        );
                    }
                );
            }
        );

    SunriseTranslationObserver.observe(
        document.body,
        {
            childList: true,
            subtree: true,
            characterData: true
        }
    );
}

const SunriseExactSystemTextKeys = {
    "尚未登入":
        "train.notLoggedIn",
    "登入中……":
        "train.loggingIn",
    "登入":
        "train.login",
    "登出":
        "train.logout",
    "登入成功。":
        "train.loginSuccess",
    "已登出。":
        "train.logoutSuccess",
    "請輸入 Email 與密碼。":
        "train.enterAccountPassword",
    "請輸入帳號與密碼。":
        "train.enterAccountPassword",

    "載入週次":
        "train.loadWeek",
    "載入中……":
        "train.loadingWeek",
    "儲存本週資格":
        "train.saveEligibility",
    "儲存中……":
        "train.saving",
    "尚未載入":
        "train.notLoaded",
    "編輯中":
        "train.editing",
    "已完成":
        "train.completed",

    "重新載入成員":
        "train.reloadMembers",
    "全選":
        "train.selectAll",
    "全部取消":
        "train.clearAll",
    "正在讀取成員名單……":
        "train.readingMembers",
    "目前沒有可顯示的成員。":
        "train.noMembers",

    "預覽抽獎池":
        "train.previewButton",
    "計算中……":
        "train.calculating",
    "正在計算抽獎池……":
        "train.calculatingPool",
    "冷卻中":
        "train.cooling",
    "可抽選":
        "train.availableStatus",
    "中獎次數":
        "train.previousWins",
    "本週權重":
        "train.currentWeight",
    "從未中獎":
        "train.neverWon",

    "正式抽選":
        "train.officialDrawButton",
    "正式抽選中……":
        "train.drawing",
    "本週抽選已完成，不可重新抽選":
        "train.alreadyDrawn",

    "週次已載入，可以編輯合格名單。":
        "train.weekLoadedEditable",
    "此週已完成正式抽選。":
        "train.weekCompleted",
    "請選擇週次開始日。":
        "train.selectWeekStart",
    "請先登入。":
        "train.loginFirst",
    "請先載入週次。":
        "train.loadWeekFirst",
    "此週已完成，不能再修改。":
        "train.completedCannotModify",
    "請至少勾選一名合格成員。":
        "train.selectOneMember",
    "抽選名額不能超過合格人數。":
        "train.drawCountExceeds",
    "請先使用 R4 帳號登入。":
        "train.r4LoginFirst",
    "此週已完成正式抽選，不能重抽。":
        "train.alreadyDrawn",
    "正式抽選完成，結果已保存。":
        "train.drawSuccess",

    "請先登入 R4 帳號。":
        "train.previewLoginFirst",
    "抽獎池預覽已完成。":
        "train.previewCompleted",
    "本週尚未儲存任何合格成員。":
        "train.noSavedCandidates"
};

document.addEventListener(
    "DOMContentLoaded",
    InitializeSunriseI18n
);
