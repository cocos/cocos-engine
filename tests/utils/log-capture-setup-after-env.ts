import { hookAfterEach, hookBeforeEach } from "./log-capture";

beforeEach(() => {
    hookBeforeEach();
});

afterEach(() => {
    hookAfterEach();
});