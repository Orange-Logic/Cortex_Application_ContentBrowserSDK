/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add(
  'reactComponent',
  {
    prevSubject: 'element',
  },
  ($el) => {
    if ($el.length !== 1) {
      throw new Error(
        `cy.component() requires element of length 1 but got ${$el.length}`,
      );
    }
    // Query for key starting with __reactInternalInstance$ for React v16.x
    const key = Object.keys($el.get(0)).find((item) =>
      item.startsWith('__reactFiber$'),
    );
    const domFiber = $el.prop(key || '');
    Cypress.log({
      name: 'component',
      consoleProps() {
        return {
          component: domFiber,
        };
      },
    });
    return domFiber.return;
  },
);

Cypress.Commands.add('waitForCustomElement', (tagName) => {
  cy.window().then((win) => win.customElements.whenDefined(tagName));
});