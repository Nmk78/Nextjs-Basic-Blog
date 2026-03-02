/**
 * Edge-safe stub for openid-client. Used only when the middleware/edge bundle
 * would otherwise pull in openid-client (e.g. via next-auth), which uses
 * Node-only APIs (e.g. util.inspect.custom) and fails in Edge runtime.
 * Do not use this stub in API routes or server code — they use the real package.
 */
const noop = () => {};
const empty = {};

module.exports = {
  Issuer: class StubIssuer {},
  Strategy: class StubStrategy {},
  TokenSet: class StubTokenSet {},
  errors: { OPError: class {}, RPError: class {} },
  custom: {
    setHttpOptionsDefaults: noop,
    http_options: empty,
    clock_tolerance: 0,
  },
  generators: empty,
};
