import { fetchWithoutToken, fetchWithToken } from "../../helpers/fetch";

describe("Tests for helper Fetch", () => {
    let token = "";

    test("fetchWithoutToken should work", async () => {
        const resp = await fetchWithoutToken(
            "auth",
            { email: "joseluis@mail.com", password: "123456" },
            "POST"
        );

        expect(resp instanceof Response).toBe(true);

        const body = await resp.json();
        expect(body.ok).toBe(true);

        // We save token to use it on next tests
        token = body.token;
    });

    test("fetchWithToken should work", async () => {
        localStorage.setItem("token", token);

        const resp = await fetchWithToken(
            "events/6111f3388cda9f228e46367c",
            {},
            "DELETE"
        );
        const body = await resp.json();

        expect(body.msg).toBe("Event doesn't exist");
    });
});
