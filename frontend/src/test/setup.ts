import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";

window.HTMLElement.prototype.scrollIntoView = () => {};
window.HTMLElement.prototype.hasPointerCapture = () => false;
window.HTMLElement.prototype.setPointerCapture = () => {};
window.HTMLElement.prototype.releasePointerCapture = () => {};

beforeEach(() => {
  window.localStorage?.clear();
});
