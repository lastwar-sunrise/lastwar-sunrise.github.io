"use strict";

(function () {
    let Applying = false;

    const Texts = {
        en: {
            back: "← Back to Management Center", heroTitle: "👥 Sunrise Member Management", heroDesc: "Add, edit, activate, or deactivate alliance members.", directory: "Directory", flow: "Search · Filter · Review · Manage", heroNote: "A cleaner member directory with the same management logic as production.", adminLogin: "Admin Sign In", adminOnly: "Only admin accounts can modify member data.", account: "Account", password: "Password", signIn: "Sign In", signOut: "Sign Out", totalMembers: "Total members", active: "Active", inactive: "Inactive", allianceMembers: "Alliance Members", inactiveNote: "Inactive members will not appear in train draw eligibility lists.", addMember: "＋ Add Member", allStatuses: "All statuses", activeOnly: "Active only", inactiveOnly: "Inactive only", reload: "Reload", directoryLabel: "Member directory", directoryHint: "Use search and status filters to find members quickly.", loadingMembers: "Loading members…", memberProfile: "Member profile", editMember: "Edit Member", addMemberTitle: "Add Member", viewMember: "View Member", memberName: "Member Name", sortOrder: "Sort Order", activeMember: "Active member", cancel: "Cancel", save: "Save", notSignedIn: "Not signed in", noPermission: "No management permission", adminPrefix: "Admin: ", loggingIn: "Signing in…", loginSuccess: "Admin signed in successfully.", loginNonAdmin: "Signed in, but this account is not an admin.", loginFailed: "Sign-in failed: ", logoutSuccess: "Signed out.", logoutFailed: "Sign-out failed: ", initFailed: "Initialization failed: ", enterCredentials: "Enter your account and password.", readingMembers: "Loading members…", loadFailed: "Failed to load: ", noMatch: "No members match the current filters.", enabled: "Active", disabled: "Inactive", edit: "Edit", view: "View", adminAddOnly: "Only admin can add members.", adminEditOnly: "Only admin can edit members.", enterName: "Enter a member name.", invalidOrder: "Sort order must be an integer greater than 0.", duplicateName: "A member with the same name already exists.", saving: "Saving…", updated: "Member information updated.", created: "New member created.", saveFailed: "Save failed: ", reloadBusy: "Reloading…"
        },
        "zh-TW": {
            back: "← 返回管理中心", heroTitle: "👥 Sunrise 成員管理", heroDesc: "新增、修改、啟用或停用聯盟成員。", directory: "成員目錄", flow: "搜尋 · 篩選 · 查看 · 管理", heroNote: "以更清楚的方式管理成員，功能邏輯與正式版本相同。", adminLogin: "管理員登入", adminOnly: "只有 admin 帳號可以修改成員資料。", account: "帳號", password: "密碼", signIn: "登入", signOut: "登出", totalMembers: "全部成員", active: "啟用", inactive: "停用", allianceMembers: "聯盟成員", inactiveNote: "停用成員不會出現在火車抽選資格名單。", addMember: "＋ 新增成員", allStatuses: "全部狀態", activeOnly: "僅顯示啟用", inactiveOnly: "僅顯示停用", reload: "重新載入", directoryLabel: "成員目錄", directoryHint: "使用搜尋與狀態篩選快速找到成員。", loadingMembers: "正在讀取成員……", memberProfile: "成員資料", editMember: "編輯成員", addMemberTitle: "新增成員", viewMember: "查看成員", memberName: "成員名稱", sortOrder: "排序", activeMember: "啟用此成員", cancel: "取消", save: "儲存", notSignedIn: "尚未登入", noPermission: "無管理權限", adminPrefix: "Admin：", loggingIn: "登入中……", loginSuccess: "管理員登入成功。", loginNonAdmin: "登入成功，但此帳號不是 admin。", loginFailed: "登入失敗：", logoutSuccess: "已登出。", logoutFailed: "登出失敗：", initFailed: "初始化失敗：", enterCredentials: "請輸入帳號與密碼。", readingMembers: "正在讀取成員……", loadFailed: "讀取失敗：", noMatch: "找不到符合條件的成員。", enabled: "啟用", disabled: "停用", edit: "編輯", view: "查看", adminAddOnly: "只有 admin 可以新增成員。", adminEditOnly: "只有 admin 可以修改成員。", enterName: "請輸入成員名稱。", invalidOrder: "排序必須是大於 0 的整數。", duplicateName: "已有相同名稱的成員。", saving: "儲存中……", updated: "成員資料已更新。", created: "新成員已建立。", saveFailed: "儲存失敗：", reloadBusy: "重新載入中……"
        },
        vi: {
            back: "← Quay lại trung tâm quản lý", heroTitle: "👥 Quản lý thành viên Sunrise", heroDesc: "Thêm, sửa, kích hoạt hoặc vô hiệu hóa thành viên liên minh.", directory: "Danh bạ", flow: "Tìm kiếm · Lọc · Xem · Quản lý", heroNote: "Danh bạ thành viên rõ ràng hơn với cùng logic quản lý như bản chính.", adminLogin: "Đăng nhập quản trị", adminOnly: "Chỉ tài khoản admin mới có thể sửa dữ liệu thành viên.", account: "Tài khoản", password: "Mật khẩu", signIn: "Đăng nhập", signOut: "Đăng xuất", totalMembers: "Tổng thành viên", active: "Đang hoạt động", inactive: "Đã vô hiệu hóa", allianceMembers: "Thành viên liên minh", inactiveNote: "Thành viên bị vô hiệu hóa sẽ không xuất hiện trong danh sách đủ điều kiện bốc thăm tàu.", addMember: "＋ Thêm thành viên", allStatuses: "Tất cả trạng thái", activeOnly: "Chỉ đang hoạt động", inactiveOnly: "Chỉ đã vô hiệu hóa", reload: "Tải lại", directoryLabel: "Danh bạ thành viên", directoryHint: "Dùng tìm kiếm và bộ lọc trạng thái để tìm thành viên nhanh chóng.", loadingMembers: "Đang tải thành viên…", memberProfile: "Hồ sơ thành viên", editMember: "Sửa thành viên", addMemberTitle: "Thêm thành viên", viewMember: "Xem thành viên", memberName: "Tên thành viên", sortOrder: "Thứ tự", activeMember: "Kích hoạt thành viên", cancel: "Hủy", save: "Lưu", notSignedIn: "Chưa đăng nhập", noPermission: "Không có quyền quản lý", adminPrefix: "Admin: ", loggingIn: "Đang đăng nhập…", loginSuccess: "Đăng nhập quản trị thành công.", loginNonAdmin: "Đăng nhập thành công nhưng tài khoản này không phải admin.", loginFailed: "Đăng nhập thất bại: ", logoutSuccess: "Đã đăng xuất.", logoutFailed: "Đăng xuất thất bại: ", initFailed: "Khởi tạo thất bại: ", enterCredentials: "Vui lòng nhập tài khoản và mật khẩu.", readingMembers: "Đang tải thành viên…", loadFailed: "Tải thất bại: ", noMatch: "Không tìm thấy thành viên phù hợp.", enabled: "Hoạt động", disabled: "Vô hiệu hóa", edit: "Sửa", view: "Xem", adminAddOnly: "Chỉ admin mới có thể thêm thành viên.", adminEditOnly: "Chỉ admin mới có thể sửa thành viên.", enterName: "Vui lòng nhập tên thành viên.", invalidOrder: "Thứ tự phải là số nguyên lớn hơn 0.", duplicateName: "Đã có thành viên cùng tên.", saving: "Đang lưu…", updated: "Đã cập nhật thông tin thành viên.", created: "Đã tạo thành viên mới.", saveFailed: "Lưu thất bại: ", reloadBusy: "Đang tải lại…"
        }
    };

    function GetLanguage() {
        const value = window.i18next && i18next.language ? i18next.language : (localStorage.getItem("sunriseLanguage") || "en");
        return value === "zh-TW" || value === "vi" ? value : "en";
    }

    function T(key) {
        return Texts[GetLanguage()][key] || Texts.en[key] || key;
    }

    function SetText(element, value) {
        if (element && element.textContent !== value) element.textContent = value;
    }

    function SetPlaceholder(element, value) {
        if (element && element.placeholder !== value) element.placeholder = value;
    }

    function TranslateStatic() {
        SetText(document.querySelector(".back-link"), T("back"));
        SetText(document.querySelector(".hero-main h1"), T("heroTitle"));
        SetText(document.querySelector(".hero-main p"), T("heroDesc"));
        SetText(document.querySelector(".hero-side-label"), T("directory"));
        SetText(document.querySelector(".hero-side strong"), T("flow"));
        SetText(document.querySelector(".hero-side-note"), T("heroNote"));
        const cards = document.querySelectorAll(".card");
        if (cards[0]) {
            const h2 = cards[0].querySelector("h2");
            if (h2) {
                const badge = h2.querySelector(".step-badge");
                h2.childNodes.forEach(function (n) { if (n.nodeType === 3) n.textContent = ""; });
                if (!h2.querySelector(".members-v1-title-text")) {
                    const span = document.createElement("span"); span.className = "members-v1-title-text"; h2.appendChild(span);
                }
                SetText(h2.querySelector(".members-v1-title-text"), T("adminLogin"));
            }
            SetText(cards[0].querySelector(".section-title p"), T("adminOnly"));
        }
        const labels = document.querySelectorAll("#loginForm label");
        if (labels[0] && labels[0].firstChild) labels[0].firstChild.nodeValue = T("account");
        if (labels[1] && labels[1].firstChild) labels[1].firstChild.nodeValue = T("password");
        SetPlaceholder(document.getElementById("emailInput"), GetLanguage() === "vi" ? "Ví dụ: kindsun" : GetLanguage() === "zh-TW" ? "例如：kindsun" : "Example: kindsun");
        SetPlaceholder(document.getElementById("passwordInput"), GetLanguage() === "vi" ? "Nhập mật khẩu" : GetLanguage() === "zh-TW" ? "請輸入密碼" : "Enter your password");
        SetText(document.getElementById("loginButton"), T("signIn"));
        SetText(document.getElementById("logoutButton"), T("signOut"));
        const statLabels = document.querySelectorAll(".stats-card span");
        if (statLabels[0]) SetText(statLabels[0], T("totalMembers"));
        if (statLabels[1]) SetText(statLabels[1], T("active"));
        if (statLabels[2]) SetText(statLabels[2], T("inactive"));
        const memberCard = document.querySelector(".member-card");
        if (memberCard) {
            const h2 = memberCard.querySelector("h2");
            if (h2) {
                h2.childNodes.forEach(function (n) { if (n.nodeType === 3) n.textContent = ""; });
                if (!h2.querySelector(".members-v1-title-text")) { const span = document.createElement("span"); span.className = "members-v1-title-text"; h2.appendChild(span); }
                SetText(h2.querySelector(".members-v1-title-text"), T("allianceMembers"));
            }
            SetText(memberCard.querySelector(".section-title p"), T("inactiveNote"));
        }
        SetText(document.getElementById("addMemberButton"), T("addMember"));
        SetPlaceholder(document.getElementById("searchInput"), GetLanguage() === "vi" ? "Tìm tên thành viên" : GetLanguage() === "zh-TW" ? "搜尋成員名稱" : "Search member name");
        const filter = document.getElementById("statusFilter");
        if (filter) { SetText(filter.options[0], T("allStatuses")); SetText(filter.options[1], T("activeOnly")); SetText(filter.options[2], T("inactiveOnly")); }
        SetText(document.getElementById("reloadButton"), T("reload"));
        const summary = document.querySelector(".summary-strip");
        if (summary) { SetText(summary.querySelector("span"), T("directoryLabel")); SetText(summary.querySelector("strong"), T("directoryHint")); }
        SetText(document.querySelector(".dialog-kicker"), T("memberProfile"));
        const dialogLabels = document.querySelectorAll(".editor-dialog > label:not(.checkbox-label)");
        if (dialogLabels[0] && dialogLabels[0].firstChild) dialogLabels[0].firstChild.nodeValue = T("memberName");
        if (dialogLabels[1] && dialogLabels[1].firstChild) dialogLabels[1].firstChild.nodeValue = T("sortOrder");
        SetPlaceholder(document.getElementById("gameNameInput"), GetLanguage() === "vi" ? "Nhập tên trong game" : GetLanguage() === "zh-TW" ? "請輸入遊戲名稱" : "Enter game name");
        SetText(document.querySelector(".checkbox-label span"), T("activeMember"));
        SetText(document.getElementById("cancelEditorButton"), T("cancel"));
        if (!document.getElementById("saveMemberButton").disabled) SetText(document.getElementById("saveMemberButton"), T("save"));
    }

    const ExactDynamic = {
        "尚未登入":"notSignedIn","登入中……":"loggingIn","登入":"signIn","登出":"signOut","管理員登入成功。":"loginSuccess","登入成功，但此帳號不是 admin。":"loginNonAdmin","已登出。":"logoutSuccess","正在讀取成員……":"readingMembers","找不到符合條件的成員。":"noMatch","啟用":"enabled","停用":"disabled","編輯":"edit","查看":"view","新增成員":"addMemberTitle","編輯成員":"editMember","查看成員":"viewMember","取消":"cancel","儲存":"save","儲存中……":"saving","成員資料已更新。":"updated","新成員已建立。":"created","重新載入":"reload"
    };

    function TranslateDynamicElement(element) {
        if (!element || element.nodeType !== 1) return;
        if (element.classList.contains("member-name")) return;
        const current = element.textContent.trim();
        const key = ExactDynamic[current] || element.dataset.membersV1Key;
        if (key) {
            element.dataset.membersV1Key = key;
            SetText(element, T(key));
            return;
        }
        let match;
        if ((match = current.match(/^Admin[：:]\s*(.+)$/))) { element.dataset.membersV1Account = match[1]; SetText(element, T("adminPrefix") + match[1]); return; }
        if ((match = current.match(/^(.+)（無管理權限）$/))) { element.dataset.membersV1Account = match[1]; SetText(element, match[1] + " (" + T("noPermission") + ")"); return; }
        const prefixes = [
            ["初始化失敗：","initFailed"],["登入失敗：","loginFailed"],["登出失敗：","logoutFailed"],["讀取失敗：","loadFailed"],["儲存失敗：","saveFailed"]
        ];
        for (let i = 0; i < prefixes.length; i++) {
            if (current.startsWith(prefixes[i][0])) { element.dataset.membersV1Suffix = current.substring(prefixes[i][0].length); element.dataset.membersV1PrefixKey = prefixes[i][1]; SetText(element, T(prefixes[i][1]) + element.dataset.membersV1Suffix); return; }
        }
        if (element.dataset.membersV1PrefixKey) SetText(element, T(element.dataset.membersV1PrefixKey) + (element.dataset.membersV1Suffix || ""));
        if (element.dataset.membersV1Account) {
            if (element.dataset.membersV1Admin === "1") SetText(element, T("adminPrefix") + element.dataset.membersV1Account);
        }
    }

    function Apply() {
        if (Applying) return;
        Applying = true;
        try {
            TranslateStatic();
            document.querySelectorAll("#loginStatus,#loginMessage,#memberMessage,#loadingMessage,#editorTitle,#editorMessage,.status-badge,.edit-button,#saveMemberButton,#reloadButton").forEach(TranslateDynamicElement);
        } finally {
            Applying = false;
        }
    }

    document.addEventListener("DOMContentLoaded", function () { Apply(); setTimeout(Apply, 150); });
    document.addEventListener("sunriseLanguageChanged", Apply);
    new MutationObserver(function () { if (!Applying) Apply(); }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
