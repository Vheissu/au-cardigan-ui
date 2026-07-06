import { createFixture } from "@aurelia/testing";
import { AuDateInputCustomElement } from "../src/components/au-date-input";

describe("Date input", () => {
  function getShadow(appHost: Element) {
    return appHost.querySelector("au-date-input")?.shadowRoot as ShadowRoot;
  }

  function segment(shadow: ShadowRoot, type: "day" | "month" | "year") {
    return shadow.querySelector(`.segment[data-type="${type}"]`) as HTMLInputElement;
  }

  function setSegment(shadow: ShadowRoot, type: "day" | "month" | "year", text: string) {
    const input = segment(shadow, type);
    input.value = text;
    input.dispatchEvent(new Event("input"));
  }

  test("derives segment order from the locale", async () => {
    const usFixture = await createFixture(
      "<au-date-input locale='en-US'></au-date-input>",
      class App {},
      [AuDateInputCustomElement]
    );
    await usFixture.startPromise;

    const usSegments = getShadow(usFixture.appHost).querySelectorAll(".segment");
    expect(usSegments[0]?.getAttribute("aria-label")).toBe("Month");
    expect(usSegments[1]?.getAttribute("aria-label")).toBe("Day");
    expect(usSegments[2]?.getAttribute("aria-label")).toBe("Year");

    await usFixture.stop(true);

    const gbFixture = await createFixture(
      "<au-date-input locale='en-GB'></au-date-input>",
      class App {},
      [AuDateInputCustomElement]
    );
    await gbFixture.startPromise;

    const gbSegments = getShadow(gbFixture.appHost).querySelectorAll(".segment");
    expect(gbSegments[0]?.getAttribute("aria-label")).toBe("Day");
    expect(gbSegments[1]?.getAttribute("aria-label")).toBe("Month");
    expect(gbSegments[2]?.getAttribute("aria-label")).toBe("Year");

    await gbFixture.stop(true);
  });

  test("typing a complete valid date updates value and dispatches change", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      "<au-date-input locale='en-GB' value.bind='date'></au-date-input>",
      class App {
        public date = "";
      },
      [AuDateInputCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector("au-date-input");
    const events: string[] = [];
    host?.addEventListener("change", event =>
      events.push((event as CustomEvent<{ value: string }>).detail.value)
    );

    const shadow = getShadow(appHost);
    setSegment(shadow, "day", "10");
    setSegment(shadow, "month", "05");
    setSegment(shadow, "year", "2024");
    await Promise.resolve();

    expect(component.date).toBe("2024-05-10");
    expect(events).toEqual(["2024-05-10"]);
    expect(shadow.querySelector(".message.internal")).toBeNull();

    await stop(true);
  });

  test("rejects impossible calendar dates with an internal message", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      "<au-date-input locale='en-GB' value.bind='date'></au-date-input>",
      class App {
        public date = "";
      },
      [AuDateInputCustomElement]
    );

    await startPromise;

    const shadow = getShadow(appHost);
    setSegment(shadow, "day", "31");
    setSegment(shadow, "month", "02");
    setSegment(shadow, "year", "2023");
    await Promise.resolve();

    expect(component.date).toBe("");
    expect(shadow.querySelector(".message.internal")?.textContent).toContain("valid date");

    await stop(true);
  });

  test("rejects dates outside min/max", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      "<au-date-input locale='en-GB' value.bind='date' min='2024-01-01' max='2024-12-31'></au-date-input>",
      class App {
        public date = "";
      },
      [AuDateInputCustomElement]
    );

    await startPromise;

    const shadow = getShadow(appHost);
    setSegment(shadow, "day", "31");
    setSegment(shadow, "month", "12");
    setSegment(shadow, "year", "2023");
    await Promise.resolve();

    expect(component.date).toBe("");
    expect(shadow.querySelector(".message.internal")?.textContent).toContain("on or after");

    setSegment(shadow, "year", "2025");
    await Promise.resolve();

    expect(component.date).toBe("");
    expect(shadow.querySelector(".message.internal")?.textContent).toContain("on or before");

    setSegment(shadow, "year", "2024");
    await Promise.resolve();

    expect(component.date).toBe("2024-12-31");
    expect(shadow.querySelector(".message.internal")).toBeNull();

    await stop(true);
  });

  test("populates segments when value is set externally", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      "<au-date-input locale='en-GB' value.bind='date'></au-date-input>",
      class App {
        public date = "2024-05-10";
      },
      [AuDateInputCustomElement]
    );

    await startPromise;

    const shadow = getShadow(appHost);
    expect(segment(shadow, "day").value).toBe("10");
    expect(segment(shadow, "month").value).toBe("05");
    expect(segment(shadow, "year").value).toBe("2024");

    component.date = "2025-01-02";
    await Promise.resolve();

    expect(segment(shadow, "day").value).toBe("02");
    expect(segment(shadow, "month").value).toBe("01");
    expect(segment(shadow, "year").value).toBe("2025");

    await stop(true);
  });

  test("arrow keys step segment values", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      "<au-date-input locale='en-GB' value.bind='date'></au-date-input>",
      class App {
        public date = "2024-05-10";
      },
      [AuDateInputCustomElement]
    );

    await startPromise;

    const shadow = getShadow(appHost);
    const day = segment(shadow, "day");

    day.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true }));
    await Promise.resolve();

    expect(day.value).toBe("11");
    expect(component.date).toBe("2024-05-11");

    day.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    await Promise.resolve();

    expect(day.value).toBe("10");
    expect(component.date).toBe("2024-05-10");

    await stop(true);
  });

  test("opens the calendar, marks the selected day and selects a new one", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      "<au-date-input locale='en-GB' value.bind='date'></au-date-input>",
      class App {
        public date = "2024-05-10";
      },
      [AuDateInputCustomElement]
    );

    await startPromise;

    const shadow = getShadow(appHost);
    const toggle = shadow.querySelector(".calendar-toggle") as HTMLButtonElement;

    expect(toggle.getAttribute("aria-haspopup")).toBe("dialog");

    toggle.click();
    await Promise.resolve();

    const dialog = shadow.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(shadow.querySelector(".calendar-caption")?.textContent).toContain("2024");
    expect(shadow.querySelectorAll(".calendar-weekday").length).toBe(7);

    const selected = shadow.querySelector('.calendar-day[aria-selected="true"]');
    expect(selected?.textContent?.trim()).toBe("10");

    const days = Array.from(shadow.querySelectorAll(".calendar-day")) as HTMLButtonElement[];
    const fifteenth = days.find(button => button.textContent?.trim() === "15");
    fifteenth?.click();
    await Promise.resolve();

    expect(component.date).toBe("2024-05-15");
    expect(shadow.querySelector('[role="dialog"]')).toBeNull();
    expect(segment(shadow, "day").value).toBe("15");

    await stop(true);
  });

  test("disables calendar days outside min/max", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      "<au-date-input locale='en-GB' value.bind='date' min='2024-05-05' max='2024-05-20'></au-date-input>",
      class App {
        public date = "2024-05-10";
      },
      [AuDateInputCustomElement]
    );

    await startPromise;

    const shadow = getShadow(appHost);
    (shadow.querySelector(".calendar-toggle") as HTMLButtonElement).click();
    await Promise.resolve();

    const days = Array.from(shadow.querySelectorAll(".calendar-day")) as HTMLButtonElement[];
    const fourth = days.find(button => button.textContent?.trim() === "4");
    const tenth = days.find(button => button.textContent?.trim() === "10");
    const twentyFirst = days.find(button => button.textContent?.trim() === "21");

    expect(fourth?.disabled).toBe(true);
    expect(tenth?.disabled).toBe(false);
    expect(twentyFirst?.disabled).toBe(true);

    await stop(true);
  });

  test("escape closes the calendar", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      "<au-date-input locale='en-GB'></au-date-input>",
      class App {},
      [AuDateInputCustomElement]
    );

    await startPromise;

    const shadow = getShadow(appHost);
    const toggle = shadow.querySelector(".calendar-toggle") as HTMLButtonElement;
    toggle.click();
    await Promise.resolve();

    expect(shadow.querySelector('[role="dialog"]')).not.toBeNull();

    toggle.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    await Promise.resolve();

    expect(shadow.querySelector('[role="dialog"]')).toBeNull();

    await stop(true);
  });

  test("navigates between months", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      "<au-date-input locale='en-US' value.bind='date'></au-date-input>",
      class App {
        public date = "2024-05-10";
      },
      [AuDateInputCustomElement]
    );

    await startPromise;

    const shadow = getShadow(appHost);
    (shadow.querySelector(".calendar-toggle") as HTMLButtonElement).click();
    await Promise.resolve();

    expect(shadow.querySelector(".calendar-caption")?.textContent).toBe("May 2024");

    const nav = shadow.querySelectorAll(".calendar-nav");
    (nav[1] as HTMLButtonElement).click();
    await Promise.resolve();

    expect(shadow.querySelector(".calendar-caption")?.textContent).toBe("June 2024");

    (nav[0] as HTMLButtonElement).click();
    (nav[0] as HTMLButtonElement).click();
    await Promise.resolve();

    expect(shadow.querySelector(".calendar-caption")?.textContent).toBe("April 2024");

    await stop(true);
  });

  test("hides the calendar toggle when showCalendar is false", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      "<au-date-input show-calendar.bind='false'></au-date-input>",
      class App {},
      [AuDateInputCustomElement]
    );

    await startPromise;

    expect(getShadow(appHost).querySelector(".calendar-toggle")).toBeNull();

    await stop(true);
  });
});
