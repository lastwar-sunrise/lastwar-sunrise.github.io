"use strict";

const SunriseAccountDomain = "@sunrise.local";

function NormalizeSunriseAccount(account) {
    const normalizedAccount =
        String(account || "")
            .trim()
            .toLowerCase();

    if (!normalizedAccount) {
        return "";
    }

    if (normalizedAccount.includes("@")) {
        return normalizedAccount;
    }

    return normalizedAccount +
        SunriseAccountDomain;
}

function GetSunriseAccountDisplay(email) {
    const normalizedEmail =
        String(email || "")
            .trim()
            .toLowerCase();

    if (
        normalizedEmail.endsWith(
            SunriseAccountDomain
        )
    ) {
        return normalizedEmail.slice(
            0,
            -SunriseAccountDomain.length
        );
    }

    return normalizedEmail;
}
