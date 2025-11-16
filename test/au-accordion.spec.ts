import { createFixture } from '@aurelia/testing';
import { AuAccordionCustomElement } from '../src/components/au-accordion';
import { AuAccordionItemCustomElement } from '../src/components/au-accordion-item';

describe('Accordion', () => {
  const template = `
    <au-accordion>
      <au-accordion-item heading="One">Panel One</au-accordion-item>
      <au-accordion-item heading="Two">Panel Two</au-accordion-item>
    </au-accordion>
  `;

  test('expands item when trigger clicked', async () => {
    const { appHost, startPromise, stop } = await createFixture(
      template,
      class App {},
      [AuAccordionCustomElement, AuAccordionItemCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector('au-accordion');
    const firstTrigger = host
      ?.querySelector('au-accordion-item')
      ?.shadowRoot?.querySelector('button');

    firstTrigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await Promise.resolve();

    expect(firstTrigger?.getAttribute('aria-expanded')).toBe('true');

    await stop(true);
  });

  test('collapses other items when multiple=false', async () => {
    const { appHost, startPromise, stop } = await createFixture(
      template,
      class App {},
      [AuAccordionCustomElement, AuAccordionItemCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector('au-accordion');
    const items = host?.querySelectorAll('au-accordion-item');
    const firstTrigger = items?.[0]?.shadowRoot?.querySelector('button');
    const secondTrigger = items?.[1]?.shadowRoot?.querySelector('button');

    firstTrigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    secondTrigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await Promise.resolve();

    expect(firstTrigger?.getAttribute('aria-expanded')).toBe('false');
    expect(secondTrigger?.getAttribute('aria-expanded')).toBe('true');

    await stop(true);
  });

  test('allows multiple open when configured', async () => {
    const { appHost, startPromise, stop } = await createFixture(
      `
        <au-accordion multiple="true">
          <au-accordion-item heading="One">Panel One</au-accordion-item>
          <au-accordion-item heading="Two">Panel Two</au-accordion-item>
        </au-accordion>
      `,
      class App {},
      [AuAccordionCustomElement, AuAccordionItemCustomElement]
    );

    await startPromise;

    const items = appHost.querySelectorAll('au-accordion-item');
    const firstTrigger = items?.[0]?.shadowRoot?.querySelector('button');
    const secondTrigger = items?.[1]?.shadowRoot?.querySelector('button');

    firstTrigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    secondTrigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await Promise.resolve();

    expect(firstTrigger?.getAttribute('aria-expanded')).toBe('true');
    expect(secondTrigger?.getAttribute('aria-expanded')).toBe('true');

    await stop(true);
  });
});
