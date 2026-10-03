"use strict";

(function () {
    let Applying = false;
    let ApplyQueued = false;

    const Texts = {
        en: {
            back:"← Back to Management Center",heroTitle:"👥 Sunrise Member Management",heroDesc:"Add, edit, activate, or deactivate alliance members.",directory:"Directory",flow:"Search · Filter · Review · Manage",heroNote:"A cleaner member directory with the same management logic as production.",adminLogin:"Admin Sign In",adminOnly:"Only admin accounts can modify member data.",account:"Account",password:"Password",totalMembers:"Total members",active:"Active",inactive:"Inactive",allianceMembers:"Alliance Members",inactiveNote:"Inactive members will not appear in train draw eligibility lists.",allStatuses:"All statuses",activeOnly:"Active only",inactiveOnly:"Inactive only",directoryLabel:"Member directory",directoryHint:"Use search and status filters to find members quickly.",memberProfile:"Member profile",memberName:"Member Name",sortOrder:"Sort Order",activeMember:"Active member",
            accountPlaceholder:"Example: kindsun",passwordPlaceholder:"Enter your password",searchPlaceholder:"Search member name",gameNamePlaceholder:"Enter game name",
            signIn:"Sign In",signOut:"Sign Out",addMember:"＋ Add Member",reload:"Reload",cancel:"Cancel",save:"Save",notSignedIn:"Not signed in",noPermission:"No management permission",adminPrefix:"Admin: ",loggingIn:"Signing in…",loginSuccess:"Admin signed in successfully.",loginNonAdmin:"Signed in, but this account is not an admin.",loginFailed:"Sign-in failed: ",logoutSuccess:"Signed out.",logoutFailed:"Sign-out failed: ",initFailed:"Initialization failed: ",enterCredentials:"Enter your account and password.",readingMembers:"Loading members…",loadFailed:"Failed to load: ",noMatch:"No members match the current filters.",enabled:"Active",disabled:"Inactive",edit:"Edit",view:"View",addMemberTitle:"Add Member",editMember:"Edit Member",viewMember:"View Member",adminAddOnly:"Only admin can add members.",adminEditOnly:"Only admin can edit members.",enterName:"Enter a member name.",invalidOrder:"Sort order must be an integer greater than 0.",duplicateName:"A member with the same name already exists.",saving:"Saving…",updated:"Member information updated.",created:"New member created.",saveFailed:"Save failed: ",reloadBusy:"Reloading…"
        },
        "zh-TW": {
            back:"← 返回管理中心",heroTitle:"👥 Sunrise 成員管理",heroDesc:"新增、修改、啟用或停用聯盟成員。",directory:"成員目錄",flow:"搜尋 · 篩選 · 查看 · 管理",heroNote:"以更清楚的方式管理成員，功能邏輯與正式版本相同。",adminLogin:"管理員登入",adminOnly:"只有 admin 帳號可以修改成員資料。",account:"帳號",password:"密碼",totalMembers:"全部成員",active:"啟用",inactive:"停用",allianceMembers:"聯盟成員",inactiveNote:"停用成員不會出現在火車抽選資格名單。",allStatuses:"全部狀態",activeOnly:"僅顯示啟用",inactiveOnly:"僅顯示停用",directoryLabel:"成員目錄",directoryHint:"使用搜尋與狀態篩選快速找到成員。",memberProfile:"成員資料",memberName:"成員名稱",sortOrder:"排序",activeMember:"啟用此成員",
            accountPlaceholder:"例如：kindsun",passwordPlaceholder:"請輸入密碼",searchPlaceholder:"搜尋成員名稱",gameNamePlaceholder:"請輸入遊戲名稱",
            signIn:"登入",signOut:"登出",addMember:"＋ 新增成員",reload:"重新載入",cancel:"取消",save:"儲存",notSignedIn:"尚未登入",noPermission:"無管理權限",adminPrefix:"Admin：",loggingIn:"登入中……",loginSuccess:"管理員登入成功。",loginNonAdmin:"登入成功，但此帳號不是 admin。",loginFailed:"登入失敗：",logoutSuccess:"已登出。",logoutFailed:"登出失敗：",initFailed:"初始化失敗：",enterCredentials:"請輸入帳號與密碼。",readingMembers:"正在讀取成員……",loadFailed:"讀取失敗：",noMatch:"找不到符合條件的成員。",enabled:"啟用",disabled:"停用",edit:"編輯",view:"查看",addMemberTitle:"新增成員",editMember:"編輯成員",viewMember:"查看成員",adminAddOnly:"只有 admin 可以新增成員。",adminEditOnly:"只有 admin 可以修改成員。",enterName:"請輸入成員名稱。",invalidOrder:"排序必須是大於 0 的整數。",duplicateName:"已有相同名稱的成員。",saving:"儲存中……",updated:"成員資料已更新。",created:"新成員已建立。",saveFailed:"儲存失敗：",reloadBusy:"重新載入中……"
        },
        vi: {
            back:"← Quay lại trung tâm quản lý",heroTitle:"👥 Quản lý thành viên Sunrise",heroDesc:"Thêm, sửa, kích hoạt hoặc vô hiệu hóa thành viên liên minh.",directory:"Danh bạ",flow:"Tìm kiếm · Lọc · Xem · Quản lý",heroNote:"Danh bạ thành viên rõ ràng hơn với cùng logic quản lý như bản chính.",adminLogin:"Đăng nhập quản trị",adminOnly:"Chỉ tài khoản admin mới có thể sửa dữ liệu thành viên.",account:"Tài khoản",password:"Mật khẩu",totalMembers:"Tổng thành viên",active:"Đang hoạt động",inactive:"Đã vô hiệu hóa",allianceMembers:"Thành viên liên minh",inactiveNote:"Thành viên bị vô hiệu hóa sẽ không xuất hiện trong danh sách đủ điều kiện bốc thăm tàu.",allStatuses:"Tất cả trạng thái",activeOnly:"Chỉ đang hoạt động",inactiveOnly:"Chỉ đã vô hiệu hóa",directoryLabel:"Danh bạ thành viên",directoryHint:"Dùng tìm kiếm và bộ lọc trạng thái để tìm thành viên nhanh chóng.",memberProfile:"Hồ sơ thành viên",memberName:"Tên thành viên",sortOrder:"Thứ tự",activeMember:"Kích hoạt thành viên",
            accountPlaceholder:"Ví dụ: kindsun",passwordPlaceholder:"Nhập mật khẩu",searchPlaceholder:"Tìm tên thành viên",gameNamePlaceholder:"Nhập tên trong game",
            signIn:"Đăng nhập",signOut:"Đăng xuất",addMember:"＋ Thêm thành viên",reload:"Tải lại",cancel:"Hủy",save:"Lưu",notSignedIn:"Chưa đăng nhập",noPermission:"Không có quyền quản lý",adminPrefix:"Admin: ",loggingIn:"Đang đăng nhập…",loginSuccess:"Đăng nhập quản trị thành công.",loginNonAdmin:"Đăng nhập thành công nhưng tài khoản này không phải admin.",loginFailed:"Đăng nhập thất bại: ",logoutSuccess:"Đã đăng xuất.",logoutFailed:"Đăng xuất thất bại: ",initFailed:"Khởi tạo thất bại: ",enterCredentials:"Vui lòng nhập tài khoản và mật khẩu.",readingMembers:"Đang tải thành viên…",loadFailed:"Tải thất bại: ",noMatch:"Không tìm thấy thành viên phù hợp.",enabled:"Hoạt động",disabled:"Vô hiệu hóa",edit:"Sửa",view:"Xem",addMemberTitle:"Thêm thành viên",editMember:"Sửa thành viên",viewMember:"Xem thành viên",adminAddOnly:"Chỉ admin mới có thể thêm thành viên.",adminEditOnly:"Chỉ admin mới có thể sửa thành viên.",enterName:"Vui lòng nhập tên thành viên.",invalidOrder:"Thứ tự phải là số nguyên lớn hơn 0.",duplicateName:"Đã có thành viên cùng tên.",saving:"Đang lưu…",updated:"Đã cập nhật thông tin thành viên.",created:"Đã tạo thành viên mới.",saveFailed:"Lưu thất bại: ",reloadBusy:"Đang tải lại…"
        }
    };

    const SourceKeys = {
        "尚未登入":"notSignedIn","登入中……":"loggingIn","登入":"signIn","登出":"signOut","管理員登入成功。":"loginSuccess","登入成功，但此帳號不是 admin。":"loginNonAdmin","已登出。":"logoutSuccess","正在讀取成員……":"readingMembers","找不到符合條件的成員。":"noMatch","啟用":"enabled","停用":"disabled","編輯":"edit","查看":"view","新增成員":"addMemberTitle","編輯成員":"editMember","查看成員":"viewMember","取消":"cancel","儲存":"save","儲存中……":"saving","成員資料已更新。":"updated","新成員已建立。":"created","重新載入":"reload",
        "Not signed in":"notSignedIn","Sign In":"signIn","Sign Out":"signOut","Active":"enabled","Inactive":"disabled","Edit":"edit","View":"view","Add Member":"addMemberTitle","Edit Member":"editMember","View Member":"viewMember","Cancel":"cancel","Save":"save","Reload":"reload"
    };

    function Lang() {
        const value = window.i18next && i18next.language ? i18next.language : (localStorage.getItem("sunriseLanguage") || "en");
        return value === "zh-TW" || value === "vi" ? value : "en";
    }

    function T(key) { return Texts[Lang()][key] || Texts.en[key] || key; }
    function SetText(el, value) { if (el && el.textContent !== value) el.textContent = value; }
    function SetPlaceholder(el, value) { if (el && el.placeholder !== value) el.placeholder = value; }

    function TranslateStatic() {
        document.querySelectorAll("[data-v1-i18n]").forEach(function (el) { SetText(el, T(el.dataset.v1I18n)); });
        document.querySelectorAll("[data-v1-placeholder]").forEach(function (el) { SetPlaceholder(el, T(el.dataset.v1Placeholder)); });
    }

    function RememberKey(el, key) {
        if (el && key) el.dataset.membersV1Key = key;
        return key;
    }

    function TranslateDynamic(el) {
        if (!el || el.nodeType !== 1 || el.classList.contains("member-name")) return;
        const current = el.textContent.trim();
        let key = el.dataset.membersV1Key || SourceKeys[current];
        if (key) { RememberKey(el, key); SetText(el, T(key)); return; }

        let m = current.match(/^Admin[：:]\s*(.+)$/);
        if (m) {
            el.dataset.membersV1Mode = "admin";
            el.dataset.membersV1Account = m[1];
        }
        m = current.match(/^(.+)（無管理權限）$/);
        if (m) {
            el.dataset.membersV1Mode = "readonly";
            el.dataset.membersV1Account = m[1];
        }
        if (el.dataset.membersV1Account) {
            SetText(el, el.dataset.membersV1Mode === "admin" ? T("adminPrefix") + el.dataset.membersV1Account : el.dataset.membersV1Account + " (" + T("noPermission") + ")");
            return;
        }

        const prefixes = [["初始化失敗：","initFailed"],["登入失敗：","loginFailed"],["登出失敗：","logoutFailed"],["讀取失敗：","loadFailed"],["儲存失敗：","saveFailed"]];
        for (let i = 0; i < prefixes.length; i++) {
            if (current.indexOf(prefixes[i][0]) === 0) {
                el.dataset.membersV1PrefixKey = prefixes[i][1];
                el.dataset.membersV1Suffix = current.substring(prefixes[i][0].length);
                break;
            }
        }
        if (el.dataset.membersV1PrefixKey) SetText(el, T(el.dataset.membersV1PrefixKey) + (el.dataset.membersV1Suffix || ""));
    }

    function TranslateControls() {
        const map = [
            ["loginButton","signIn"],["logoutButton","signOut"],["addMemberButton","addMember"],["reloadButton","reload"],["cancelEditorButton","cancel"],["saveMemberButton","save"]
        ];
        map.forEach(function (item) {
            const el = document.getElementById(item[0]);
            if (!el) return;
            if (el.disabled && (item[0] === "loginButton" || item[0] === "saveMemberButton")) return;
            SetText(el, T(item[1]));
        });
    }

    function Apply() {
        if (Applying) return;
        Applying = true;
        try {
            TranslateStatic();
            TranslateControls();
            document.querySelectorAll("#loginStatus,#loginMessage,#memberMessage,#loadingMessage,#editorTitle,#editorMessage,.status-badge,.edit-button").forEach(TranslateDynamic);
        } finally {
            Applying = false;
        }
    }

    function QueueApply() {
        if (ApplyQueued) return;
        ApplyQueued = true;
        setTimeout(function () { ApplyQueued = false; Apply(); }, 0);
    }

    document.addEventListener("DOMContentLoaded", function () { Apply(); setTimeout(Apply, 150); });
    document.addEventListener("sunriseLanguageChanged", Apply);
    new MutationObserver(function () { if (!Applying) QueueApply(); }).observe(document.documentElement, { childList:true, subtree:true, characterData:true });
})();
