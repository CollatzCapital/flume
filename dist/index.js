'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var ReactDOM = _interopDefault(require('react-dom'));

function canUseDOM() {
  return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}

/**
 * React currently throws a warning when using useLayoutEffect on the server. To
 * get around it, we can conditionally useEffect on the server (no-op) and
 * useLayoutEffect in the browser. We occasionally need useLayoutEffect to
 * ensure we don't get a render flash for certain operations, but we may also
 * need affected components to render on the server. One example is when setting
 * a component's descendants to retrieve their index values.
 *
 * Important to note that using this hook as an escape hatch will break the
 * eslint dependency warnings unless you rename the import to `useLayoutEffect`.
 * Use sparingly only when the effect won't effect the rendered HTML to avoid
 * any server/client mismatch.
 *
 * If a useLayoutEffect is needed and the result would create a mismatch, it's
 * likely that the component in question shouldn't be rendered on the server at
 * all, so a better approach would be to lazily render those in a parent
 * component after client-side hydration.
 *
 * https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
 * https://github.com/reduxjs/react-redux/blob/master/src/utils/useIsomorphicLayoutEffect.js
 *
 * @param effect
 * @param deps
 */

var useIsomorphicLayoutEffect = /*#__PURE__*/canUseDOM() ? React.useLayoutEffect : React.useEffect;

/*
 * Welcome to @reach/auto-id!

 * Let's see if we can make sense of why this hook exists and its
 * implementation.
 *
 * Some background:
 *   1. Accessibility APIs rely heavily on element IDs
 *   2. Requiring developers to put IDs on every element in Reach UI is both
 *      cumbersome and error-prone
 *   3. With a component model, we can generate IDs for them!
 *
 * Solution 1: Generate random IDs.
 *
 * This works great as long as you don't server render your app. When React (in
 * the client) tries to reuse the markup from the server, the IDs won't match
 * and React will then recreate the entire DOM tree.
 *
 * Solution 2: Increment an integer
 *
 * This sounds great. Since we're rendering the exact same tree on the server
 * and client, we can increment a counter and get a deterministic result between
 * client and server. Also, JS integers can go up to nine-quadrillion. I'm
 * pretty sure the tab will be closed before an app never needs
 * 10 quadrillion IDs!
 *
 * Problem solved, right?
 *
 * Ah, but there's a catch! React's concurrent rendering makes this approach
 * non-deterministic. While the client and server will end up with the same
 * elements in the end, depending on suspense boundaries (and possibly some user
 * input during the initial render) the incrementing integers won't always match
 * up.
 *
 * Solution 3: Don't use IDs at all on the server; patch after first render.
 *
 * What we've done here is solution 2 with some tricks. With this approach, the
 * ID returned is an empty string on the first render. This way the server and
 * client have the same markup no matter how wild the concurrent rendering may
 * have gotten.
 *
 * After the render, we patch up the components with an incremented ID. This
 * causes a double render on any components with `useId`. Shouldn't be a problem
 * since the components using this hook should be small, and we're only updating
 * the ID attribute on the DOM, nothing big is happening.
 *
 * It doesn't have to be an incremented number, though--we could do generate
 * random strings instead, but incrementing a number is probably the cheapest
 * thing we can do.
 *
 * Additionally, we only do this patchup on the very first client render ever.
 * Any calls to `useId` that happen dynamically in the client will be
 * populated immediately with a value. So, we only get the double render after
 * server hydration and never again, SO BACK OFF ALRIGHT?
 */
var serverHandoffComplete = false;
var id = 0;

var genId = function genId() {
  return ++id;
};
/**
 * useId
 *
 * Autogenerate IDs to facilitate WAI-ARIA and server rendering.
 *
 * Note: The returned ID will initially be `null` and will update after a
 * component mounts. Users may need to supply their own ID if they need
 * consistent values for SSR.
 *
 * @see Docs https://reach.tech/auto-id
 */


function useId(idFromProps) {
  /*
   * If this instance isn't part of the initial render, we don't have to do the
   * double render/patch-up dance. We can just generate the ID and return it.
   */
  var initialId = idFromProps || (serverHandoffComplete ? genId() : null);

  var _React$useState = React.useState(initialId),
      id = _React$useState[0],
      setId = _React$useState[1];

  useIsomorphicLayoutEffect(function () {
    if (id === null) {
      /*
       * Patch the ID after render. We do this in `useLayoutEffect` to avoid any
       * rendering flicker, though it'll make the first render slower (unlikely
       * to matter, but you're welcome to measure your app and let us know if
       * it's a problem).
       */
      setId(genId());
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);
  React.useEffect(function () {
    if (serverHandoffComplete === false) {
      /*
       * Flag all future uses of `useId` to skip the update dance. This is in
       * `useEffect` because it goes after `useLayoutEffect`, ensuring we don't
       * accidentally bail out of the patch-up dance prematurely.
       */
      serverHandoffComplete = true;
    }
  }, []);
  return id != null ? String(id) : undefined;
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".Stage_wrapper__1X5K_ {\r\n  width: 100%;\r\n  height: 100%;\r\n  min-height: 100px;\r\n  background-color: gray;\r\n  background-image: linear-gradient(\r\n      0deg,\r\n      transparent 24%,\r\n      rgba(255, 255, 255, 0.04) 25%,\r\n      rgba(255, 255, 255, 0.04) 26%,\r\n      transparent 27%,\r\n      transparent 74%,\r\n      rgba(255, 255, 255, 0.04) 75%,\r\n      rgba(255, 255, 255, 0.04) 76%,\r\n      transparent 77%,\r\n      transparent\r\n    ),\r\n    linear-gradient(\r\n      90deg,\r\n      transparent 24%,\r\n      rgba(255, 255, 255, 0.04) 25%,\r\n      rgba(255, 255, 255, 0.04) 26%,\r\n      transparent 27%,\r\n      transparent 74%,\r\n      rgba(255, 255, 255, 0.04) 75%,\r\n      rgba(255, 255, 255, 0.04) 76%,\r\n      transparent 77%,\r\n      transparent\r\n    );\r\n  color: #000;\r\n  background-size: 30px 30px;\r\n  position: relative;\r\n  overflow: hidden;\r\n  -webkit-overflow-scrolling: touch;\r\n  font-family: Helvetica, sans-serif;\r\n  text-align: left;\r\n  line-height: 1;\r\n  outline: none !important;\r\n}\r\n.Stage_wrapper__1X5K_ * {\r\n  box-sizing: border-box;\r\n}\r\n.Stage_wrapper__1X5K_ input,\r\ntextarea,\r\nselect {\r\n  font-family: Helvetica, sans-serif;\r\n}\r\n.Stage_transformWrapper__3CfIp {\r\n  transform-origin: center center;\r\n  position: absolute;\r\n  left: 50%;\r\n  top: 50%;\r\n  width: 0px;\r\n  height: 0px;\r\n}\r\n.Stage_scaleWrapper__2Y7Ck {\r\n  position: absolute;\r\n  left: 0px;\r\n  top: 0px;\r\n  width: 0px;\r\n  height: 0px;\r\n}\r\n";
var styles = { "wrapper": "Stage_wrapper__1X5K_", "transformWrapper": "Stage_transformWrapper__3CfIp", "scaleWrapper": "Stage_scaleWrapper__2Y7Ck" };
styleInject(css);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}var AsyncMode=l;var ConcurrentMode=m;var ContextConsumer=k;var ContextProvider=h;var Element=c;var ForwardRef=n;var Fragment=e;var Lazy=t;var Memo=r;var Portal=d;
var Profiler=g;var StrictMode=f;var Suspense=p;var isAsyncMode=function(a){return A(a)||z(a)===l};var isConcurrentMode=A;var isContextConsumer=function(a){return z(a)===k};var isContextProvider=function(a){return z(a)===h};var isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c};var isForwardRef=function(a){return z(a)===n};var isFragment=function(a){return z(a)===e};var isLazy=function(a){return z(a)===t};
var isMemo=function(a){return z(a)===r};var isPortal=function(a){return z(a)===d};var isProfiler=function(a){return z(a)===g};var isStrictMode=function(a){return z(a)===f};var isSuspense=function(a){return z(a)===p};
var isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};var typeOf=z;

var reactIs_production_min = {
	AsyncMode: AsyncMode,
	ConcurrentMode: ConcurrentMode,
	ContextConsumer: ContextConsumer,
	ContextProvider: ContextProvider,
	Element: Element,
	ForwardRef: ForwardRef,
	Fragment: Fragment,
	Lazy: Lazy,
	Memo: Memo,
	Portal: Portal,
	Profiler: Profiler,
	StrictMode: StrictMode,
	Suspense: Suspense,
	isAsyncMode: isAsyncMode,
	isConcurrentMode: isConcurrentMode,
	isContextConsumer: isContextConsumer,
	isContextProvider: isContextProvider,
	isElement: isElement,
	isForwardRef: isForwardRef,
	isFragment: isFragment,
	isLazy: isLazy,
	isMemo: isMemo,
	isPortal: isPortal,
	isProfiler: isProfiler,
	isStrictMode: isStrictMode,
	isSuspense: isSuspense,
	isValidElementType: isValidElementType,
	typeOf: typeOf
};

var reactIs_development = createCommonjsModule(function (module, exports) {



if (process.env.NODE_ENV !== "production") {
  (function() {

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}
});
var reactIs_development_1 = reactIs_development.AsyncMode;
var reactIs_development_2 = reactIs_development.ConcurrentMode;
var reactIs_development_3 = reactIs_development.ContextConsumer;
var reactIs_development_4 = reactIs_development.ContextProvider;
var reactIs_development_5 = reactIs_development.Element;
var reactIs_development_6 = reactIs_development.ForwardRef;
var reactIs_development_7 = reactIs_development.Fragment;
var reactIs_development_8 = reactIs_development.Lazy;
var reactIs_development_9 = reactIs_development.Memo;
var reactIs_development_10 = reactIs_development.Portal;
var reactIs_development_11 = reactIs_development.Profiler;
var reactIs_development_12 = reactIs_development.StrictMode;
var reactIs_development_13 = reactIs_development.Suspense;
var reactIs_development_14 = reactIs_development.isAsyncMode;
var reactIs_development_15 = reactIs_development.isConcurrentMode;
var reactIs_development_16 = reactIs_development.isContextConsumer;
var reactIs_development_17 = reactIs_development.isContextProvider;
var reactIs_development_18 = reactIs_development.isElement;
var reactIs_development_19 = reactIs_development.isForwardRef;
var reactIs_development_20 = reactIs_development.isFragment;
var reactIs_development_21 = reactIs_development.isLazy;
var reactIs_development_22 = reactIs_development.isMemo;
var reactIs_development_23 = reactIs_development.isPortal;
var reactIs_development_24 = reactIs_development.isProfiler;
var reactIs_development_25 = reactIs_development.isStrictMode;
var reactIs_development_26 = reactIs_development.isSuspense;
var reactIs_development_27 = reactIs_development.isValidElementType;
var reactIs_development_28 = reactIs_development.typeOf;

var reactIs = createCommonjsModule(function (module) {

if (process.env.NODE_ENV === 'production') {
  module.exports = reactIs_production_min;
} else {
  module.exports = reactIs_development;
}
});

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

var printWarning = function() {};

if (process.env.NODE_ENV !== 'production') {
  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};
  var has = Function.call.bind(Object.prototype.hasOwnProperty);

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (process.env.NODE_ENV !== 'production') {
    loggedTypeFailures = {};
  }
};

var checkPropTypes_1 = checkPropTypes;

var has$1 = Function.call.bind(Object.prototype.hasOwnProperty);
var printWarning$1 = function() {};

if (process.env.NODE_ENV !== 'production') {
  printWarning$1 = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning$1(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!reactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (process.env.NODE_ENV !== 'production') {
        if (arguments.length > 1) {
          printWarning$1(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning$1('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has$1(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? printWarning$1('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning$1(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = objectAssign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.resetWarningCache = checkPropTypes_1.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  }  shim.isRequired = shim;
  function getShim() {
    return shim;
  }  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var ReactIs = reactIs;

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = factoryWithTypeCheckers(ReactIs.isElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

var canUseDOM$1 = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Portal$1 = function (_React$Component) {
  _inherits(Portal, _React$Component);

  function Portal() {
    _classCallCheck(this, Portal);

    return _possibleConstructorReturn(this, (Portal.__proto__ || Object.getPrototypeOf(Portal)).apply(this, arguments));
  }

  _createClass(Portal, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.defaultNode) {
        document.body.removeChild(this.defaultNode);
      }
      this.defaultNode = null;
    }
  }, {
    key: 'render',
    value: function render() {
      if (!canUseDOM$1) {
        return null;
      }
      if (!this.props.node && !this.defaultNode) {
        this.defaultNode = document.createElement('div');
        document.body.appendChild(this.defaultNode);
      }
      return ReactDOM.createPortal(this.props.children, this.props.node || this.defaultNode);
    }
  }]);

  return Portal;
}(React__default.Component);

Portal$1.propTypes = {
  children: propTypes.node.isRequired,
  node: propTypes.any
};

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Portal$2 = function (_React$Component) {
  _inherits$1(Portal, _React$Component);

  function Portal() {
    _classCallCheck$1(this, Portal);

    return _possibleConstructorReturn$1(this, (Portal.__proto__ || Object.getPrototypeOf(Portal)).apply(this, arguments));
  }

  _createClass$1(Portal, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.renderPortal();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(props) {
      this.renderPortal();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      ReactDOM.unmountComponentAtNode(this.defaultNode || this.props.node);
      if (this.defaultNode) {
        document.body.removeChild(this.defaultNode);
      }
      this.defaultNode = null;
      this.portal = null;
    }
  }, {
    key: 'renderPortal',
    value: function renderPortal(props) {
      if (!this.props.node && !this.defaultNode) {
        this.defaultNode = document.createElement('div');
        document.body.appendChild(this.defaultNode);
      }

      var children = this.props.children;
      // https://gist.github.com/jimfb/d99e0678e9da715ccf6454961ef04d1b
      if (typeof this.props.children.type === 'function') {
        children = React__default.cloneElement(this.props.children);
      }

      this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(this, children, this.props.node || this.defaultNode);
    }
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return Portal;
}(React__default.Component);


Portal$2.propTypes = {
  children: propTypes.node.isRequired,
  node: propTypes.any
};

var Portal$3 = void 0;

if (ReactDOM.createPortal) {
  Portal$3 = Portal$1;
} else {
  Portal$3 = Portal$2;
}

var Portal$4 = Portal$3;

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$2(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KEYCODES = {
  ESCAPE: 27
};

var PortalWithState = function (_React$Component) {
  _inherits$2(PortalWithState, _React$Component);

  function PortalWithState(props) {
    _classCallCheck$2(this, PortalWithState);

    var _this = _possibleConstructorReturn$2(this, (PortalWithState.__proto__ || Object.getPrototypeOf(PortalWithState)).call(this, props));

    _this.portalNode = null;
    _this.state = { active: !!props.defaultOpen };
    _this.openPortal = _this.openPortal.bind(_this);
    _this.closePortal = _this.closePortal.bind(_this);
    _this.wrapWithPortal = _this.wrapWithPortal.bind(_this);
    _this.handleOutsideMouseClick = _this.handleOutsideMouseClick.bind(_this);
    _this.handleKeydown = _this.handleKeydown.bind(_this);
    return _this;
  }

  _createClass$2(PortalWithState, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.closeOnEsc) {
        document.addEventListener('keydown', this.handleKeydown);
      }
      if (this.props.closeOnOutsideClick) {
        document.addEventListener('click', this.handleOutsideMouseClick);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.closeOnEsc) {
        document.removeEventListener('keydown', this.handleKeydown);
      }
      if (this.props.closeOnOutsideClick) {
        document.removeEventListener('click', this.handleOutsideMouseClick);
      }
    }
  }, {
    key: 'openPortal',
    value: function openPortal(e) {
      if (this.state.active) {
        return;
      }
      if (e && e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation();
      }
      this.setState({ active: true }, this.props.onOpen);
    }
  }, {
    key: 'closePortal',
    value: function closePortal() {
      if (!this.state.active) {
        return;
      }
      this.setState({ active: false }, this.props.onClose);
    }
  }, {
    key: 'wrapWithPortal',
    value: function wrapWithPortal(children) {
      var _this2 = this;

      if (!this.state.active) {
        return null;
      }
      return React__default.createElement(
        Portal$4,
        {
          node: this.props.node,
          key: 'react-portal',
          ref: function ref(portalNode) {
            return _this2.portalNode = portalNode;
          }
        },
        children
      );
    }
  }, {
    key: 'handleOutsideMouseClick',
    value: function handleOutsideMouseClick(e) {
      if (!this.state.active) {
        return;
      }
      var root = this.portalNode && (this.portalNode.props.node || this.portalNode.defaultNode);
      if (!root || root.contains(e.target) || e.button && e.button !== 0) {
        return;
      }
      this.closePortal();
    }
  }, {
    key: 'handleKeydown',
    value: function handleKeydown(e) {
      if (e.keyCode === KEYCODES.ESCAPE && this.state.active) {
        this.closePortal();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children({
        openPortal: this.openPortal,
        closePortal: this.closePortal,
        portal: this.wrapWithPortal,
        isOpen: this.state.active
      });
    }
  }]);

  return PortalWithState;
}(React__default.Component);

PortalWithState.propTypes = {
  children: propTypes.func.isRequired,
  defaultOpen: propTypes.bool,
  node: propTypes.any,
  closeOnEsc: propTypes.bool,
  closeOnOutsideClick: propTypes.bool,
  onOpen: propTypes.func,
  onClose: propTypes.func
};

PortalWithState.defaultProps = {
  onOpen: function onOpen() {},
  onClose: function onClose() {}
};

var css$1 = ".ContextMenu_menuWrapper__1BheJ {\r\n  position: fixed;\r\n  z-index: 9999;\r\n  background: white;\r\n  box-shadow: 0px 6px 7px rgba(0, 0, 0, 0.3);\r\n  border: 1px solid darkblue;\r\n  font-size: 14px;\r\n  max-width: 300px;\r\n  min-width: 150px;\r\n  font-family: Helvetica, sans-serif;\r\n  line-height: 1.15;\r\n  outline: none;\r\n}\r\n@supports (backdrop-filter: blur(6px)) {\r\n  .ContextMenu_menuWrapper__1BheJ {\r\n    backdrop-filter: blur(6px);\r\n    background: white;\r\n  }\r\n}\r\n.ContextMenu_menuHeader__1Cw58 {\r\n  padding: 5px;\r\n  border-bottom: 1px solid white;\r\n  display: flex;\r\n  flex-direction: column;\r\n}\r\n.ContextMenu_menuHeader__1Cw58:after {\r\n  border-bottom: 2px solid black;\r\n  content: \"\";\r\n  display: block;\r\n  margin-top: 5px;\r\n  margin-left: 30%;\r\n  width: 40%;\r\n}\r\n.ContextMenu_menuLabel__158Pv {\r\n  margin: 0px;\r\n  color: black;\r\n  font-size: 14px;\r\n  font-weight: 600;\r\n}\r\n.ContextMenu_menuDescription__5rFNS {\r\n  margin: 0px;\r\n}\r\n.ContextMenu_optionsWrapper__2YK_z {\r\n  max-height: 300px;\r\n  overflow-y: auto;\r\n  display: flex;\r\n  flex-direction: column;\r\n}\r\n.ContextMenu_menuFilter__1goBp {\r\n  border: none;\r\n  background: none;\r\n  height: 24px;\r\n  flex: 1 1 auto;\r\n  width: 100%;\r\n  outline: none;\r\n  color: black;\r\n  border: 1px solid black;\r\n}\r\n.ContextMenu_menuFilter__1goBp::placeholder {\r\n    font-style: italic;\r\n  }\r\n.ContextMenu_option__33MDL {\r\n  display: flex;\r\n  flex-direction: column;\r\n  flex-shrink: 0;\r\n  padding: 5px;\r\n  border-bottom: 1px solid darkblue;\r\n  color: black;\r\n}\r\n.ContextMenu_option__33MDL:last-child {\r\n    border-bottom: none;\r\n  }\r\n.ContextMenu_option__33MDL:hover {\r\n    background: darkblue;\r\n    color: white;\r\n  }\r\n.ContextMenu_option__33MDL:hover p {\r\n      color: white;\r\n    }\r\n.ContextMenu_option__33MDL label {\r\n    margin-bottom: 5px;\r\n    user-select: none;\r\n  }\r\n.ContextMenu_option__33MDL label:last-child {\r\n      margin-bottom: 0px;\r\n    }\r\n.ContextMenu_option__33MDL p {\r\n    margin: 0px;\r\n    font-style: italic;\r\n    font-size: 12px;\r\n    color: black;\r\n    user-select: none;\r\n  }\r\n.ContextMenu_option__33MDL[data-selected=\"true\"] {\r\n    background: white;\r\n  }\r\n.ContextMenu_emptyText__2rcXy {\r\n  color: black;\r\n  padding: 5px;\r\n}\r\n";
var styles$1 = { "menuWrapper": "ContextMenu_menuWrapper__1BheJ", "menuHeader": "ContextMenu_menuHeader__1Cw58", "menuLabel": "ContextMenu_menuLabel__158Pv", "menuDescription": "ContextMenu_menuDescription__5rFNS", "optionsWrapper": "ContextMenu_optionsWrapper__2YK_z", "menuFilter": "ContextMenu_menuFilter__1goBp", "option": "ContextMenu_option__33MDL", "emptyText": "ContextMenu_emptyText__2rcXy" };
styleInject(css$1);

/**
 * The base implementation of `_.clamp` which doesn't coerce arguments.
 *
 * @private
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 */
function baseClamp(number, lower, upper) {
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}

var _baseClamp = baseClamp;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol_1(value)) {
    return NAN;
  }
  if (isObject_1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject_1(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber;

/**
 * Clamps `number` within the inclusive `lower` and `upper` bounds.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Number
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 * @example
 *
 * _.clamp(-10, -5, 5);
 * // => -5
 *
 * _.clamp(10, -5, 5);
 * // => 5
 */
function clamp(number, lower, upper) {
  if (upper === undefined) {
    upper = lower;
    lower = undefined;
  }
  if (upper !== undefined) {
    upper = toNumber_1(upper);
    upper = upper === upper ? upper : 0;
  }
  if (lower !== undefined) {
    lower = toNumber_1(lower);
    lower = lower === lower ? lower : 0;
  }
  return _baseClamp(toNumber_1(number), lower, upper);
}

var clamp_1 = clamp;

// This alphabet uses a-z A-Z 0-9 _- symbols.
// Symbols are generated for smaller size.
// -_zyxwvutsrqponmlkjihgfedcba9876543210ZYXWVUTSRQPONMLKJIHGFEDCBA
var url = '-_';
// Loop from 36 to 0 (from z to a and 9 to 0 in Base36).
var i = 36;
while (i--) {
  // 36 is radix. Number.prototype.toString(36) returns number
  // in Base36 representation. Base36 is like hex, but it uses 0–9 and a-z.
  url += i.toString(36);
}
// Loop from 36 to 10 (from Z to A in Base36).
i = 36;
while (i-- - 10) {
  url += i.toString(36).toUpperCase();
}

/**
 * Generate URL-friendly unique ID. This method use non-secure predictable
 * random generator with bigger collision probability.
 *
 * @param {number} [size=21] The number of symbols in ID.
 *
 * @return {string} Random string.
 *
 * @example
 * const nanoid = require('nanoid/non-secure')
 * model.id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqL"
 *
 * @name nonSecure
 * @function
 */
var nonSecure = function (size) {
  var id = '';
  i = size || 21;
  // Compact alternative for `for (var i = 0; i < size; i++)`
  while (i--) {
    // `| 0` is compact and faster alternative for `Math.floor()`
    id += url[Math.random() * 64 | 0];
  }
  return id
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var ContextMenu = function ContextMenu(_ref) {
  var x = _ref.x,
      y = _ref.y,
      _ref$options = _ref.options,
      options = _ref$options === undefined ? [] : _ref$options,
      onRequestClose = _ref.onRequestClose,
      onOptionSelected = _ref.onOptionSelected,
      label = _ref.label,
      description = _ref.description,
      hideHeader = _ref.hideHeader,
      hideFilter = _ref.hideFilter,
      emptyText = _ref.emptyText;

  var menuWrapper = React__default.useRef();
  var menuOptionsWrapper = React__default.useRef();
  var filterInput = React__default.useRef();

  var _React$useState = React__default.useState(""),
      _React$useState2 = slicedToArray(_React$useState, 2),
      filter = _React$useState2[0],
      setFilter = _React$useState2[1];

  var _React$useState3 = React__default.useState(0),
      _React$useState4 = slicedToArray(_React$useState3, 2),
      menuWidth = _React$useState4[0],
      setMenuWidth = _React$useState4[1];

  var _React$useState5 = React__default.useState(0),
      _React$useState6 = slicedToArray(_React$useState5, 2),
      selectedIndex = _React$useState6[0],
      setSelectedIndex = _React$useState6[1];

  var menuId = React__default.useRef(nonSecure(10));

  var handleOptionSelected = function handleOptionSelected(option) {
    onOptionSelected(option);
    onRequestClose();
  };

  var testClickOutside = React__default.useCallback(function (e) {
    if (menuWrapper.current && !menuWrapper.current.contains(e.target)) {
      onRequestClose();
      document.removeEventListener("click", testClickOutside, { capture: true });
      document.removeEventListener("contextmenu", testClickOutside, { capture: true });
    }
  }, [menuWrapper, onRequestClose]);

  var testEscape = React__default.useCallback(function (e) {
    if (e.keyCode === 27) {
      onRequestClose();
      document.removeEventListener("keydown", testEscape, { capture: true });
    }
  }, [onRequestClose]);

  React__default.useEffect(function () {
    if (filterInput.current) {
      filterInput.current.focus();
    }
    setMenuWidth(menuWrapper.current.getBoundingClientRect().width);
    document.addEventListener("keydown", testEscape, { capture: true });
    document.addEventListener("click", testClickOutside, { capture: true });
    document.addEventListener("contextmenu", testClickOutside, { capture: true });
    return function () {
      document.removeEventListener("click", testClickOutside, { capture: true });
      document.removeEventListener("contextmenu", testClickOutside, { capture: true });
      document.removeEventListener("keydown", testEscape, { capture: true });
    };
  }, [testClickOutside, testEscape]);

  var filteredOptions = React__default.useMemo(function () {
    if (!filter) return options;
    var lowerFilter = filter.toLowerCase();
    return options.filter(function (opt) {
      return opt.label.toLowerCase().includes(lowerFilter);
    });
  }, [filter, options]);

  var handleFilterChange = function handleFilterChange(e) {
    var value = e.target.value;
    setFilter(value);
    setSelectedIndex(0);
  };

  var handleKeyDown = function handleKeyDown(e) {
    // Up pressed
    if (e.which === 38) {
      e.preventDefault();
      if (selectedIndex === null) {
        setSelectedIndex(0);
      } else if (selectedIndex > 0) {
        setSelectedIndex(function (i) {
          return i - 1;
        });
      }
    }
    // Down pressed
    if (e.which === 40) {
      e.preventDefault();
      if (selectedIndex === null) {
        setSelectedIndex(0);
      } else if (selectedIndex < filteredOptions.length - 1) {
        setSelectedIndex(function (i) {
          return i + 1;
        });
      }
    }
    // Enter pressed
    if (e.which === 13 && selectedIndex !== null) {
      var option = filteredOptions[selectedIndex];
      if (option) {
        handleOptionSelected(option);
      }
    }
  };

  React__default.useEffect(function () {
    if (hideFilter || hideHeader) {
      menuWrapper.current.focus();
    }
  }, [hideFilter, hideHeader]);

  React__default.useEffect(function () {
    var menuOption = document.getElementById(menuId.current + "-" + selectedIndex);
    if (menuOption) {
      var menuRect = menuOptionsWrapper.current.getBoundingClientRect();
      var optionRect = menuOption.getBoundingClientRect();
      if (optionRect.y + optionRect.height > menuRect.y + menuRect.height || optionRect.y < menuRect.y) {
        menuOption.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  return React__default.createElement(
    "div",
    {
      className: styles$1.menuWrapper,
      onMouseDown: function onMouseDown(e) {
        return e.stopPropagation();
      },
      onKeyDown: handleKeyDown,
      style: {
        left: x,
        top: y,
        width: filter ? menuWidth : "auto"
      },
      ref: menuWrapper,
      tabIndex: 0,
      role: "menu",
      "aria-activedescendant": menuId.current + "-" + selectedIndex
    },
    !hideHeader && (label ? true : !!options.length) ? React__default.createElement(
      "div",
      { className: styles$1.menuHeader },
      React__default.createElement(
        "label",
        { className: styles$1.menuLabel },
        label
      ),
      description ? React__default.createElement(
        "p",
        { className: styles$1.menuDescription },
        description
      ) : null,
      !hideFilter && options.length ? React__default.createElement("input", {
        type: "text",
        placeholder: "Filter options",
        value: filter,
        onChange: handleFilterChange,
        className: styles$1.menuFilter,
        autoFocus: true,
        ref: filterInput
      }) : null
    ) : null,
    React__default.createElement(
      "div",
      {
        className: styles$1.optionsWrapper,
        role: "menu",
        ref: menuOptionsWrapper,
        style: { maxHeight: clamp_1(window.innerHeight - y - 70, 10, 300) }
      },
      filteredOptions.map(function (option, i) {
        return React__default.createElement(
          ContextOption,
          {
            menuId: menuId.current,
            selected: selectedIndex === i,
            onClick: function onClick() {
              return handleOptionSelected(option);
            },
            onMouseEnter: function onMouseEnter() {
              return setSelectedIndex(null);
            },
            index: i,
            key: option.value + i
          },
          React__default.createElement(
            "label",
            null,
            option.label
          ),
          option.description ? React__default.createElement(
            "p",
            null,
            option.description
          ) : null
        );
      }),
      !options.length ? React__default.createElement(
        "span",
        { className: styles$1.emptyText },
        emptyText
      ) : null
    )
  );
};

var ContextOption = function ContextOption(_ref2) {
  var menuId = _ref2.menuId,
      index = _ref2.index,
      children = _ref2.children,
      onClick = _ref2.onClick,
      selected = _ref2.selected,
      onMouseEnter = _ref2.onMouseEnter;

  return React__default.createElement(
    "div",
    {
      className: styles$1.option,
      role: "menuitem",
      onClick: onClick,
      onMouseEnter: onMouseEnter,
      "data-selected": selected,
      id: menuId + "-" + index
    },
    children
  );
};

var ThemeContext = React__default.createContext();
var NodeTypesContext = React__default.createContext();
var PortTypesContext = React__default.createContext();
var NodeDispatchContext = React__default.createContext();
var ConnectionRecalculateContext = React__default.createContext();
var ContextContext = React__default.createContext();
var StageContext = React__default.createContext();
var CacheContext = React__default.createContext();
var RecalculateStageRectContext = React__default.createContext();
var EditorIdContext = React__default.createContext();

var Draggable = (function (_ref) {
  var children = _ref.children,
      stageState = _ref.stageState,
      stageRect = _ref.stageRect,
      onDragDelayStart = _ref.onDragDelayStart,
      onDragStart = _ref.onDragStart,
      onDrag = _ref.onDrag,
      onDragEnd = _ref.onDragEnd,
      _onMouseDown = _ref.onMouseDown,
      _onTouchStart = _ref.onTouchStart,
      disabled = _ref.disabled,
      _ref$delay = _ref.delay,
      delay = _ref$delay === undefined ? 6 : _ref$delay,
      innerRef = _ref.innerRef,
      rest = objectWithoutProperties(_ref, ["children", "stageState", "stageRect", "onDragDelayStart", "onDragStart", "onDrag", "onDragEnd", "onMouseDown", "onTouchStart", "disabled", "delay", "innerRef"]);

  var startCoordinates = React__default.useRef(null);
  var offset = React__default.useRef();
  var wrapper = React__default.useRef();

  var byScale = function byScale(value) {
    return 1 / stageState.scale * value;
  };

  var getScaledCoordinates = function getScaledCoordinates(e) {
    var x = byScale(e.clientX - (stageRect ? stageRect.current.left : 0) - offset.current.x - (stageRect ? stageRect.current.width : 0) / 2) + byScale(stageState.translate.x);
    var y = byScale(e.clientY - (stageRect ? stageRect.current.top : 0) - offset.current.y - (stageRect ? stageRect.current.height : 0) / 2) + byScale(stageState.translate.y);
    return { x: x, y: y };
  };

  var updateCoordinates = function updateCoordinates(e) {
    var coordinates = getScaledCoordinates(e);
    if (onDrag) {
      onDrag(coordinates, e);
    }
  };

  var stopDrag = function stopDrag(e) {
    var coordinates = getScaledCoordinates(e);
    if (onDragEnd) {
      onDragEnd(e, coordinates);
    }
    window.removeEventListener("mouseup", stopDrag);
    window.removeEventListener("mousemove", updateCoordinates);
  };

  var startDrag = function startDrag(e) {
    if (onDragStart) {
      onDragStart(e);
    }
    var nodeRect = wrapper.current.getBoundingClientRect();
    offset.current = {
      x: startCoordinates.current.x - nodeRect.left,
      y: startCoordinates.current.y - nodeRect.top
    };
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("mousemove", updateCoordinates);
  };

  var checkDragDelay = function checkDragDelay(e) {
    var x = void 0;
    var y = void 0;
    if ("ontouchstart" in window && e.touches) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      e.preventDefault();
      x = e.clientX;
      y = e.clientY;
    }
    var a = Math.abs(startCoordinates.current.x - x);
    var b = Math.abs(startCoordinates.current.y - y);
    var distance = Math.round(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)));
    var dragDistance = delay;
    if (distance >= dragDistance) {
      startDrag(e);
      endDragDelay();
    }
  };

  var endDragDelay = function endDragDelay() {
    document.removeEventListener("mouseup", endDragDelay);
    document.removeEventListener("mousemove", checkDragDelay);
    startCoordinates.current = null;
  };

  var startDragDelay = function startDragDelay(e) {
    if (onDragDelayStart) {
      onDragDelayStart(e);
    }
    e.stopPropagation();
    var x = void 0;
    var y = void 0;
    if ("ontouchstart" in window && e.touches) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      e.preventDefault();
      x = e.clientX;
      y = e.clientY;
    }
    startCoordinates.current = { x: x, y: y };
    document.addEventListener("mouseup", endDragDelay);
    document.addEventListener("mousemove", checkDragDelay);
  };

  return React__default.createElement(
    "div",
    _extends({
      onMouseDown: function onMouseDown(e) {
        if (!disabled) {
          startDragDelay(e);
        }
        if (_onMouseDown) {
          _onMouseDown(e);
        }
      },
      onTouchStart: function onTouchStart(e) {
        if (!disabled) {
          startDragDelay(e);
        }
        if (_onTouchStart) {
          _onTouchStart(e);
        }
      },
      onDragStart: function onDragStart(e) {
        e.preventDefault();
        e.stopPropagation();
      },
      ref: function ref(_ref2) {
        wrapper.current = _ref2;
        if (innerRef) {
          innerRef.current = _ref2;
        }
      }
    }, rest),
    children
  );
});

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

var _ListCache = ListCache;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new _ListCache;
  this.size = 0;
}

var _stackClear = stackClear;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

/* Built-in method references that are verified to be native. */
var Map = _getNative(_root, 'Map');

var _Map = Map;

/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$3.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$4.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

var _Hash = Hash;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

var _MapCache = MapCache;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof _ListCache) {
    var pairs = data.__data__;
    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new _MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new _ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;

var _Stack = Stack;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

var _setCacheAdd = setCacheAdd;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

var _setCacheHas = setCacheHas;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new _MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
SetCache.prototype.has = _setCacheHas;

var _SetCache = SetCache;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

var _arraySome = arraySome;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

var _cacheHas = cacheHas;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new _SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!_arraySome(other, function(othValue, othIndex) {
            if (!_cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

var _equalArrays = equalArrays;

/** Built-in value references. */
var Uint8Array = _root.Uint8Array;

var _Uint8Array = Uint8Array;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var _mapToArray = mapToArray;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray = setToArray;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag$1 = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq_1(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = _mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = _setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag$1:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

var _equalByTag = equalByTag;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

var _arrayFilter = arrayFilter;

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

var stubArray_1 = stubArray;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return _arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

var _getSymbols = getSymbols;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$5.call(value, 'callee') &&
    !propertyIsEnumerable$1.call(value, 'callee');
};

var isArguments_1 = isArguments;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

var isLength_1 = isLength;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag$1 = '[object Map]',
    numberTag$1 = '[object Number]',
    objectTag = '[object Object]',
    regexpTag$1 = '[object RegExp]',
    setTag$1 = '[object Set]',
    stringTag$1 = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] =
typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag$1] =
typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag$1] = typedArrayTags[numberTag$1] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag$1] =
typedArrayTags[setTag$1] = typedArrayTags[stringTag$1] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$6.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           _isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$8;

  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$7.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}

var keys_1 = keys;

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}

var _getAllKeys = getAllKeys;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = _getAllKeys(object),
      objLength = objProps.length,
      othProps = _getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$8.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

var _equalObjects = equalObjects;

/* Built-in method references that are verified to be native. */
var DataView = _getNative(_root, 'DataView');

var _DataView = DataView;

/* Built-in method references that are verified to be native. */
var Promise$1 = _getNative(_root, 'Promise');

var _Promise = Promise$1;

/* Built-in method references that are verified to be native. */
var Set = _getNative(_root, 'Set');

var _Set = Set;

/* Built-in method references that are verified to be native. */
var WeakMap = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap;

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]',
    objectTag$1 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$2 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$2 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
    (_Map && getTag(new _Map) != mapTag$2) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag$2) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$2;
        case mapCtorString: return mapTag$2;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$2;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    objectTag$2 = '[object Object]';

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$b.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_1(object),
      othIsArr = isArray_1(other),
      objTag = objIsArr ? arrayTag$1 : _getTag(object),
      othTag = othIsArr ? arrayTag$1 : _getTag(other);

  objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
  othTag = othTag == argsTag$2 ? objectTag$2 : othTag;

  var objIsObj = objTag == objectTag$2,
      othIsObj = othTag == objectTag$2,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer_1(object)) {
    if (!isBuffer_1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack);
    return (objIsArr || isTypedArray_1(object))
      ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$9.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$9.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new _Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new _Stack);
  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

var _baseIsEqualDeep = baseIsEqualDeep;

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
    return value !== value && other !== other;
  }
  return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

var _baseIsEqual = baseIsEqual;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new _Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

var _baseIsMatch = baseIsMatch;

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject_1(value);
}

var _isStrictComparable = isStrictComparable;

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys_1(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, _isStrictComparable(value)];
  }
  return result;
}

var _getMatchData = getMatchData;

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

var _matchesStrictComparable = matchesStrictComparable;

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = _getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || _baseIsMatch(object, source, matchData);
  };
}

var _baseMatches = baseMatches;

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray_1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol_1(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var _isKey = isKey;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || _MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = _MapCache;

var memoize_1 = memoize;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize_1(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

var _memoizeCapped = memoizeCapped;

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = _memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var _stringToPath = stringToPath;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray_1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return _arrayMap(value, baseToString) + '';
  }
  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

var _baseToString = baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString;

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray_1(value)) {
    return value;
  }
  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
}

var _castPath = castPath;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol_1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

var _toKey = toKey;

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = _castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[_toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

var _baseGet = baseGet;

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get$1(object, path, defaultValue) {
  var result = object == null ? undefined : _baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var get_1 = get$1;

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

var _baseHasIn = baseHasIn;

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = _toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_1(length) && _isIndex(key, length) &&
    (isArray_1(object) || isArguments_1(object));
}

var _hasPath = hasPath;

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && _hasPath(object, path, _baseHasIn);
}

var hasIn_1 = hasIn;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (_isKey(path) && _isStrictComparable(srcValue)) {
    return _matchesStrictComparable(_toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get_1(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn_1(object, path)
      : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
  };
}

var _baseMatchesProperty = baseMatchesProperty;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var identity_1 = identity;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

var _baseProperty = baseProperty;

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return _baseGet(object, path);
  };
}

var _basePropertyDeep = basePropertyDeep;

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
}

var property_1 = property;

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity_1;
  }
  if (typeof value == 'object') {
    return isArray_1(value)
      ? _baseMatchesProperty(value[0], value[1])
      : _baseMatches(value);
  }
  return property_1(value);
}

var _baseIteratee = baseIteratee;

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var _createBaseFor = createBaseFor;

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = _createBaseFor();

var _baseFor = baseFor;

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && _baseFor(object, iteratee, keys_1);
}

var _baseForOwn = baseForOwn;

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike_1(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

var _createBaseEach = createBaseEach;

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = _createBaseEach(_baseForOwn);

var _baseEach = baseEach;

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike_1(collection) ? Array(collection.length) : [];

  _baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

var _baseMap = baseMap;

/**
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their corresponding
 * values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */
function baseSortBy(array, comparer) {
  var length = array.length;

  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}

var _baseSortBy = baseSortBy;

/**
 * Compares values to sort them in ascending order.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol_1(value);

    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol_1(other);

    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
        (valIsNull && othIsDefined && othIsReflexive) ||
        (!valIsDefined && othIsReflexive) ||
        !valIsReflexive) {
      return 1;
    }
    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
        (othIsNull && valIsDefined && valIsReflexive) ||
        (!othIsDefined && valIsReflexive) ||
        !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

var _compareAscending = compareAscending;

/**
 * Used by `_.orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
 * specify an order of "desc" for descending or "asc" for ascending sort order
 * of corresponding values.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {boolean[]|string[]} orders The order to sort by for each property.
 * @returns {number} Returns the sort order indicator for `object`.
 */
function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = _compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to provide the same value for
  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
  // for more details.
  //
  // This also ensures a stable sort in V8 and other engines.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
  return object.index - other.index;
}

var _compareMultiple = compareMultiple;

/**
 * The base implementation of `_.orderBy` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
 * @param {string[]} orders The sort orders of `iteratees`.
 * @returns {Array} Returns the new sorted array.
 */
function baseOrderBy(collection, iteratees, orders) {
  var index = -1;
  iteratees = _arrayMap(iteratees.length ? iteratees : [identity_1], _baseUnary(_baseIteratee));

  var result = _baseMap(collection, function(value, key, collection) {
    var criteria = _arrayMap(iteratees, function(iteratee) {
      return iteratee(value);
    });
    return { 'criteria': criteria, 'index': ++index, 'value': value };
  });

  return _baseSortBy(result, function(object, other) {
    return _compareMultiple(object, other, orders);
  });
}

var _baseOrderBy = baseOrderBy;

/**
 * This method is like `_.sortBy` except that it allows specifying the sort
 * orders of the iteratees to sort by. If `orders` is unspecified, all values
 * are sorted in ascending order. Otherwise, specify an order of "desc" for
 * descending or "asc" for ascending sort order of corresponding values.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
 *  The iteratees to sort by.
 * @param {string[]} [orders] The sort orders of `iteratees`.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 34 },
 *   { 'user': 'fred',   'age': 40 },
 *   { 'user': 'barney', 'age': 36 }
 * ];
 *
 * // Sort by `user` in ascending order and by `age` in descending order.
 * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 */
function orderBy(collection, iteratees, orders, guard) {
  if (collection == null) {
    return [];
  }
  if (!isArray_1(iteratees)) {
    iteratees = iteratees == null ? [] : [iteratees];
  }
  orders = guard ? undefined : orders;
  if (!isArray_1(orders)) {
    orders = orders == null ? [] : [orders];
  }
  return _baseOrderBy(collection, iteratees, orders);
}

var orderBy_1 = orderBy;

var STAGE_ID = '__node_editor_stage__';
var DRAG_CONNECTION_ID = '__node_editor_drag_connection__';
var CONNECTIONS_ID = '__node_editor_connections__';

var Stage = function Stage(_ref) {
  var scale = _ref.scale,
      translate = _ref.translate,
      editorId = _ref.editorId,
      dispatchStageState = _ref.dispatchStageState,
      children = _ref.children,
      outerStageChildren = _ref.outerStageChildren,
      numNodes = _ref.numNodes,
      stageRef = _ref.stageRef,
      spaceToPan = _ref.spaceToPan,
      dispatchComments = _ref.dispatchComments,
      disableComments = _ref.disableComments,
      disablePan = _ref.disablePan,
      disableZoom = _ref.disableZoom;

  var nodeTypes = React__default.useContext(NodeTypesContext);
  var dispatchNodes = React__default.useContext(NodeDispatchContext);
  var wrapper = React__default.useRef();
  var translateWrapper = React__default.useRef();

  var _React$useState = React__default.useState(false),
      _React$useState2 = slicedToArray(_React$useState, 2),
      menuOpen = _React$useState2[0],
      setMenuOpen = _React$useState2[1];

  var _React$useState3 = React__default.useState({ x: 0, y: 0 }),
      _React$useState4 = slicedToArray(_React$useState3, 2),
      menuCoordinates = _React$useState4[0],
      setMenuCoordinates = _React$useState4[1];

  var dragData = React__default.useRef({ x: 0, y: 0 });

  var _React$useState5 = React__default.useState(false),
      _React$useState6 = slicedToArray(_React$useState5, 2),
      spaceIsPressed = _React$useState6[0],
      setSpaceIsPressed = _React$useState6[1];

  var setStageRect = React__default.useCallback(function () {
    stageRef.current = wrapper.current.getBoundingClientRect();
  }, []);

  React__default.useEffect(function () {
    stageRef.current = wrapper.current.getBoundingClientRect();
    window.addEventListener("resize", setStageRect);
    return function () {
      window.removeEventListener("resize", setStageRect);
    };
  }, [stageRef, setStageRect]);

  var handleWheel = React__default.useCallback(function (e) {
    if (e.target.nodeName === "TEXTAREA" || e.target.dataset.comment) {
      if (e.target.clientHeight < e.target.scrollHeight) return;
    }
    e.preventDefault();
    if (numNodes > 0) {
      var delta = e.deltaY;
      dispatchStageState(function (_ref2) {
        var scale = _ref2.scale;
        return {
          type: "SET_SCALE",
          scale: clamp_1(scale - clamp_1(delta, -10, 10) * 0.005, 0.1, 7)
        };
      });
    }
  }, [dispatchStageState, numNodes]);

  var handleDragDelayStart = function handleDragDelayStart(e) {
    wrapper.current.focus();
  };

  var handleDragStart = function handleDragStart(e) {
    e.preventDefault();
    dragData.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  var handleMouseDrag = function handleMouseDrag(coords, e) {
    var xDistance = dragData.current.x - e.clientX;
    var yDistance = dragData.current.y - e.clientY;
    translateWrapper.current.style.transform = "translate(" + -(translate.x + xDistance) + "px, " + -(translate.y + yDistance) + "px)";
  };

  var handleDragEnd = function handleDragEnd(e) {
    var xDistance = dragData.current.x - e.clientX;
    var yDistance = dragData.current.y - e.clientY;
    dragData.current.x = e.clientX;
    dragData.current.y = e.clientY;
    dispatchStageState(function (_ref3) {
      var tran = _ref3.translate;
      return {
        type: "SET_TRANSLATE",
        translate: {
          x: tran.x + xDistance,
          y: tran.y + yDistance
        }
      };
    });
  };

  var handleContextMenu = function handleContextMenu(e) {
    e.preventDefault();
    setMenuCoordinates({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
    return false;
  };

  var closeContextMenu = function closeContextMenu() {
    setMenuOpen(false);
  };

  var byScale = function byScale(value) {
    return 1 / scale * value;
  };

  var addNode = function addNode(_ref4) {
    var node = _ref4.node,
        internalType = _ref4.internalType;

    var wrapperRect = wrapper.current.getBoundingClientRect();
    var x = byScale(menuCoordinates.x - wrapperRect.x - wrapperRect.width / 2) + byScale(translate.x);
    var y = byScale(menuCoordinates.y - wrapperRect.y - wrapperRect.height / 2) + byScale(translate.y);
    if (internalType === "comment") {
      dispatchComments({
        type: "ADD_COMMENT",
        x: x,
        y: y
      });
    } else {
      dispatchNodes({
        type: "ADD_NODE",
        x: x,
        y: y,
        nodeType: node.type
      });
    }
  };

  var handleDocumentKeyUp = function handleDocumentKeyUp(e) {
    if (e.which === 32) {
      setSpaceIsPressed(false);
      document.removeEventListener("keyup", handleDocumentKeyUp);
    }
  };

  var handleKeyDown = function handleKeyDown(e) {
    if (e.which === 32 && document.activeElement === wrapper.current) {
      e.preventDefault();
      e.stopPropagation();
      setSpaceIsPressed(true);
      document.addEventListener("keyup", handleDocumentKeyUp);
    }
  };

  var handleMouseEnter = function handleMouseEnter() {
    if (!wrapper.current.contains(document.activeElement)) {
      wrapper.current.focus();
    }
  };

  React__default.useEffect(function () {
    if (!disableZoom) {
      var stageWrapper = wrapper.current;
      stageWrapper.addEventListener("wheel", handleWheel);
      return function () {
        stageWrapper.removeEventListener("wheel", handleWheel);
      };
    }
  }, [handleWheel, disableZoom]);

  var menuOptions = React__default.useMemo(function () {
    var options = orderBy_1(Object.values(nodeTypes).filter(function (node) {
      return node.addable !== false;
    }).map(function (node) {
      return {
        value: node.type,
        label: node.label,
        description: node.description,
        sortIndex: node.sortIndex,
        node: node
      };
    }), ["sortIndex", "label"]);
    if (!disableComments) {
      options.push({ value: "comment", label: "Comment", description: "A comment for documenting nodes", internalType: "comment" });
    }
    return options;
  }, [nodeTypes, disableComments]);

  return React__default.createElement(
    Draggable,
    {
      id: "" + STAGE_ID + editorId,
      className: styles.wrapper,
      innerRef: wrapper,
      onContextMenu: handleContextMenu,
      onMouseEnter: handleMouseEnter,
      onDragDelayStart: handleDragDelayStart,
      onDragStart: handleDragStart,
      onDrag: handleMouseDrag,
      onDragEnd: handleDragEnd,
      onKeyDown: handleKeyDown,
      tabIndex: -1,
      stageState: { scale: scale, translate: translate },
      style: { cursor: spaceIsPressed && spaceToPan ? "grab" : "" },
      disabled: disablePan || spaceToPan && !spaceIsPressed,
      "data-flume-stage": true
    },
    menuOpen ? React__default.createElement(
      Portal$4,
      null,
      React__default.createElement(ContextMenu, {
        x: menuCoordinates.x,
        y: menuCoordinates.y,
        options: menuOptions,
        onRequestClose: closeContextMenu,
        onOptionSelected: addNode,
        label: "Add Node"
      })
    ) : null,
    React__default.createElement(
      "div",
      {
        ref: translateWrapper,
        className: styles.transformWrapper,
        style: { transform: "translate(" + -translate.x + "px, " + -translate.y + "px)" }
      },
      React__default.createElement(
        "div",
        {
          className: styles.scaleWrapper,
          style: { transform: "scale(" + scale + ")" }
        },
        children
      )
    ),
    outerStageChildren
  );
};

var css$2 = ".Node_wrapper__3SmT7 {\r\n  background: white;\r\n  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);\r\n  position: absolute;\r\n  left: 0px;\r\n  top: 0px;\r\n  user-select: none;\r\n  display: flex;\r\n  flex-direction: column;\r\n  z-index: 1;\r\n  cursor: default;\r\n}\r\n\r\n.Node_label__3MmhF {\r\n  font-size: 13px;\r\n  padding: 5px;\r\n  background: darkblue;\r\n  color: white;\r\n  margin: 0px;\r\n  margin-bottom: 3px;\r\n  border-bottom: 1px solid rgba(0, 0, 0, 0.15);\r\n}\r\n\r\n.Node_titleBar__2eexY {\r\n  display: flex;\r\n  background: darkblue;\r\n  color: white;\r\n  width: 100%;\r\n  padding: 0.25rem;\r\n}\r\n\r\n.Node_title__YTBiU {\r\n  margin: 0rem 0.25rem;\r\n  flex-grow: 2;\r\n  font-weight: bold;\r\n  white-space: nowrap;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n}\r\n\r\n.Node_titleBarInfoIcon__1i0UW {\r\n  padding: 0 0.25rem;\r\n}\r\n\r\n.Node_titleBarInfoIcon__1i0UW:hover .Node_nodeTooltip__NQ7Es {\r\n  display: block;\r\n}\r\n\r\n.Node_titleBarCloseIcon__1o7BD {\r\n  padding: 0 0.25rem;\r\n}\r\n\r\n.Node_titleBarCloseIcon__1o7BD:hover {\r\n  background-color: #e81123;\r\n}\r\n\r\n.Node_nodeTooltip__NQ7Es {\r\n  display: none;\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  margin: 0;\r\n  padding: 4px;\r\n  color: black;\r\n  background-color: white;\r\n  border: black 1px solid;\r\n  font-size: 14px;\r\n  z-index: 1;\r\n}\r\n\r\n.Node_nodeTooltipTitle__boW0w {\r\n  margin: 0;\r\n  font-weight: bold;\r\n}\r\n";
var styles$2 = { "wrapper": "Node_wrapper__3SmT7", "label": "Node_label__3MmhF", "titleBar": "Node_titleBar__2eexY", "title": "Node_title__YTBiU", "titleBarInfoIcon": "Node_titleBarInfoIcon__1i0UW", "nodeTooltip": "Node_nodeTooltip__NQ7Es", "titleBarCloseIcon": "Node_titleBarCloseIcon__1o7BD", "nodeTooltipTitle": "Node_nodeTooltipTitle__boW0w" };
styleInject(css$2);

var css$3 = ".Connection_svg__-fKLY{\r\n  position: absolute;\r\n  left: 0px;\r\n  top: 0px;\r\n  pointer-events: none;\r\n  z-index: 0;\r\n  overflow: visible !important;\r\n}\r\n";
var styles$3 = { "svg": "Connection_svg__-fKLY" };
styleInject(css$3);

var pi = Math.PI,
    tau = 2 * pi,
    epsilon = 1e-6,
    tauEpsilon = tau - epsilon;

function Path() {
  this._x0 = this._y0 = // start of current subpath
  this._x1 = this._y1 = null; // end of current subpath
  this._ = "";
}

function path() {
  return new Path;
}

Path.prototype = path.prototype = {
  constructor: Path,
  moveTo: function(x, y) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
  },
  closePath: function() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  },
  lineTo: function(x, y) {
    this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  quadraticCurveTo: function(x1, y1, x, y) {
    this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  bezierCurveTo: function(x1, y1, x2, y2, x, y) {
    this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  arcTo: function(x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
    var x0 = this._x1,
        y0 = this._y1,
        x21 = x2 - x1,
        y21 = y2 - y1,
        x01 = x0 - x1,
        y01 = y0 - y1,
        l01_2 = x01 * x01 + y01 * y01;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x1,y1).
    if (this._x1 === null) {
      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
    }

    // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
    else if (!(l01_2 > epsilon));

    // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
    // Equivalently, is (x1,y1) coincident with (x2,y2)?
    // Or, is the radius zero? Line to (x1,y1).
    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
      this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
    }

    // Otherwise, draw an arc!
    else {
      var x20 = x2 - x0,
          y20 = y2 - y0,
          l21_2 = x21 * x21 + y21 * y21,
          l20_2 = x20 * x20 + y20 * y20,
          l21 = Math.sqrt(l21_2),
          l01 = Math.sqrt(l01_2),
          l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
          t01 = l / l01,
          t21 = l / l21;

      // If the start tangent is not coincident with (x0,y0), line to.
      if (Math.abs(t01 - 1) > epsilon) {
        this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
      }

      this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
    }
  },
  arc: function(x, y, r, a0, a1, ccw) {
    x = +x, y = +y, r = +r, ccw = !!ccw;
    var dx = r * Math.cos(a0),
        dy = r * Math.sin(a0),
        x0 = x + dx,
        y0 = y + dy,
        cw = 1 ^ ccw,
        da = ccw ? a0 - a1 : a1 - a0;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x0,y0).
    if (this._x1 === null) {
      this._ += "M" + x0 + "," + y0;
    }

    // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
      this._ += "L" + x0 + "," + y0;
    }

    // Is this arc empty? We’re done.
    if (!r) return;

    // Does the angle go the wrong way? Flip the direction.
    if (da < 0) da = da % tau + tau;

    // Is this a complete circle? Draw two arcs to complete the circle.
    if (da > tauEpsilon) {
      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
    }

    // Is this arc non-empty? Draw an arc!
    else if (da > epsilon) {
      this._ += "A" + r + "," + r + ",0," + (+(da >= pi)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
    }
  },
  rect: function(x, y, w, h) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
  },
  toString: function() {
    return this._;
  }
};

function constant(x) {
  return function constant() {
    return x;
  };
}

var pi$1 = Math.PI;

function Linear(context) {
  this._context = context;
}

Linear.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; // proceed
      default: this._context.lineTo(x, y); break;
    }
  }
};

function curveLinear(context) {
  return new Linear(context);
}

function x$1(p) {
  return p[0];
}

function y$1(p) {
  return p[1];
}

function line() {
  var x$$1 = x$1,
      y$$1 = y$1,
      defined = constant(true),
      context = null,
      curve = curveLinear,
      output = null;

  function line(data) {
    var i,
        n = data.length,
        d,
        defined0 = false,
        buffer;

    if (context == null) output = curve(buffer = path());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) output.lineStart();
        else output.lineEnd();
      }
      if (defined0) output.point(+x$$1(d, i, data), +y$$1(d, i, data));
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  line.x = function(_) {
    return arguments.length ? (x$$1 = typeof _ === "function" ? _ : constant(+_), line) : x$$1;
  };

  line.y = function(_) {
    return arguments.length ? (y$$1 = typeof _ === "function" ? _ : constant(+_), line) : y$$1;
  };

  line.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant(!!_), line) : defined;
  };

  line.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
  };

  line.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
  };

  return line;
}

function point(that, x, y) {
  that._context.bezierCurveTo(
    (2 * that._x0 + that._x1) / 3,
    (2 * that._y0 + that._y1) / 3,
    (that._x0 + 2 * that._x1) / 3,
    (that._y0 + 2 * that._y1) / 3,
    (that._x0 + 4 * that._x1 + x) / 6,
    (that._y0 + 4 * that._y1 + y) / 6
  );
}

function Basis(context) {
  this._context = context;
}

Basis.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 =
    this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 3: point(this, this._x1, this._y1); // proceed
      case 2: this._context.lineTo(this._x1, this._y1); break;
    }
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6); // proceed
      default: point(this, x, y); break;
    }
    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
  }
};

function curveBasis(context) {
  return new Basis(context);
}

function sign(x) {
  return x < 0 ? -1 : 1;
}

// Calculate the slopes of the tangents (Hermite-type interpolation) based on
// the following paper: Steffen, M. 1990. A Simple Method for Monotonic
// Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
// NOV(II), P. 443, 1990.
function slope3(that, x2, y2) {
  var h0 = that._x1 - that._x0,
      h1 = x2 - that._x1,
      s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
      s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
      p = (s0 * h1 + s1 * h0) / (h0 + h1);
  return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
}

// Calculate a one-sided slope.
function slope2(that, t) {
  var h = that._x1 - that._x0;
  return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
}

// According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
// "you can express cubic Hermite interpolation in terms of cubic Bézier curves
// with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
function point$3(that, t0, t1) {
  var x0 = that._x0,
      y0 = that._y0,
      x1 = that._x1,
      y1 = that._y1,
      dx = (x1 - x0) / 3;
  that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
}

function MonotoneX(context) {
  this._context = context;
}

MonotoneX.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 =
    this._y0 = this._y1 =
    this._t0 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2: this._context.lineTo(this._x1, this._y1); break;
      case 3: point$3(this, this._t0, slope2(this, this._t0)); break;
    }
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    var t1 = NaN;

    x = +x, y = +y;
    if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; point$3(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
      default: point$3(this, this._t0, t1 = slope3(this, x, y)); break;
    }

    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
    this._t0 = t1;
  }
};

function MonotoneY(context) {
  this._context = new ReflectContext(context);
}

(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
  MonotoneX.prototype.point.call(this, y, x);
};

function ReflectContext(context) {
  this._context = context;
}

ReflectContext.prototype = {
  moveTo: function(x, y) { this._context.moveTo(y, x); },
  closePath: function() { this._context.closePath(); },
  lineTo: function(x, y) { this._context.lineTo(y, x); },
  bezierCurveTo: function(x1, y1, x2, y2, x, y) { this._context.bezierCurveTo(y1, x1, y2, x2, y, x); }
};

var getPort = function getPort(nodeId, portName) {
  var transputType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "input";
  return document.querySelector('[data-node-id="' + nodeId + '"] [data-port-name="' + portName + '"][data-port-transput-type="' + transputType + '"]');
};

var getPortRect = function getPortRect(nodeId, portName) {
  var transputType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "input";
  var cache = arguments[3];

  if (cache) {
    var portCacheName = nodeId + portName + transputType;
    var cachedPort = cache.current.ports[portCacheName];
    if (cachedPort) {
      return cachedPort.getBoundingClientRect();
    } else {
      var port = getPort(nodeId, portName, transputType);
      cache.current.ports[portCacheName] = port;
      return port && port.getBoundingClientRect();
    }
  } else {
    var _port = getPort(nodeId, portName, transputType);
    return _port && _port.getBoundingClientRect();
  }
};

var calculateCurve = function calculateCurve(from, to) {
  var length = to.x - from.x;
  var thirdLength = length / 3;
  var curve = line().curve(curveBasis)([[from.x, from.y], [from.x + thirdLength, from.y], [from.x + thirdLength * 2, to.y], [to.x, to.y]]);
  return curve;
};

var deleteConnection = function deleteConnection(_ref3) {
  var id = _ref3.id;

  var line$$1 = document.querySelector('[data-connection-id="' + id + '"]');
  if (line$$1) line$$1.parentNode.remove();
};

var deleteConnectionsByNodeId = function deleteConnectionsByNodeId(nodeId) {
  var lines = document.querySelectorAll('[data-output-node-id="' + nodeId + '"], [data-input-node-id="' + nodeId + '"]');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _line = _step.value;

      _line.parentNode.remove();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

var updateConnection = function updateConnection(_ref4) {
  var line$$1 = _ref4.line,
      from = _ref4.from,
      to = _ref4.to;

  line$$1.setAttribute("d", calculateCurve(from, to));
};

var createSVG = function createSVG(_ref5) {
  var from = _ref5.from,
      to = _ref5.to,
      stage = _ref5.stage,
      id = _ref5.id,
      outputNodeId = _ref5.outputNodeId,
      outputPortName = _ref5.outputPortName,
      inputNodeId = _ref5.inputNodeId,
      inputPortName = _ref5.inputPortName;

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", styles$3.svg);
  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  var curve = calculateCurve(from, to);
  path.setAttribute("d", curve);
  path.setAttribute("stroke", "black");
  path.setAttribute("stroke-width", "3");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("fill", "none");
  path.setAttribute("data-connection-id", id);
  path.setAttribute("data-output-node-id", outputNodeId);
  path.setAttribute("data-output-port-name", outputPortName);
  path.setAttribute("data-input-node-id", inputNodeId);
  path.setAttribute("data-input-port-name", inputPortName);
  svg.appendChild(path);
  stage.appendChild(svg);
  return svg;
};

var getStageRef = function getStageRef(editorId) {
  return document.getElementById('' + CONNECTIONS_ID + editorId);
};

var createConnections = function createConnections(nodes, _ref6, editorId) {
  var scale = _ref6.scale,
      stageId = _ref6.stageId;

  var stageRef = getStageRef(editorId);
  if (stageRef) {
    var stage = stageRef.getBoundingClientRect();
    var stageHalfWidth = stage.width / 2;
    var stageHalfHeight = stage.height / 2;

    var byScale = function byScale(value) {
      return 1 / scale * value;
    };

    Object.values(nodes).forEach(function (node) {
      if (node.connections && node.connections.inputs) {
        Object.entries(node.connections.inputs).forEach(function (_ref7, k) {
          var _ref8 = slicedToArray(_ref7, 2),
              inputName = _ref8[0],
              outputs = _ref8[1];

          outputs.forEach(function (output) {
            var fromPort = getPortRect(output.nodeId, output.portName, "output");
            var toPort = getPortRect(node.id, inputName, "input");
            var portHalf = fromPort ? fromPort.width / 2 : 0;
            if (fromPort && toPort) {
              var id = output.nodeId + output.portName + node.id + inputName;
              var existingLine = document.querySelector('[data-connection-id="' + id + '"]');
              if (existingLine) {
                updateConnection({
                  line: existingLine,
                  from: {
                    x: byScale(fromPort.x - stage.x + portHalf - stageHalfWidth),
                    y: byScale(fromPort.y - stage.y + portHalf - stageHalfHeight)
                  },
                  to: {
                    x: byScale(toPort.x - stage.x + portHalf - stageHalfWidth),
                    y: byScale(toPort.y - stage.y + portHalf - stageHalfHeight)
                  }
                });
              } else {
                createSVG({
                  id: id,
                  outputNodeId: output.nodeId,
                  outputPortName: output.portName,
                  inputNodeId: node.id,
                  inputPortName: inputName,
                  from: {
                    x: byScale(fromPort.x - stage.x + portHalf - stageHalfWidth),
                    y: byScale(fromPort.y - stage.y + portHalf - stageHalfHeight)
                  },
                  to: {
                    x: byScale(toPort.x - stage.x + portHalf - stageHalfWidth),
                    y: byScale(toPort.y - stage.y + portHalf - stageHalfHeight)
                  },
                  stage: stageRef
                });
              }
            }
          });
        });
      }
    });
  }
};

var css$4 = ".IoPorts_wrapper__3d2hh{\r\n  display: flex;\r\n  flex-direction: column;\r\n  margin-top: auto;\r\n  width: 100%;\r\n  padding: 5px;\r\n}\r\n.IoPorts_inputs__2etkb{\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: flex-end;\r\n  width: 100%;\r\n  margin-bottom: 10px;\r\n}\r\n.IoPorts_inputs__2etkb:last-child{\r\n    margin-bottom: 0px;\r\n  }\r\n.IoPorts_inputs__2etkb .IoPorts_transput__1wbHA:first-child .IoPorts_portLabel__qOE7y, .IoPorts_inputs__2etkb .IoPorts_transput__1wbHA:first-child .IoPorts_port__1_a6J{\r\n        margin-top: 5px;\r\n      }\r\n.IoPorts_inputs__2etkb .IoPorts_transput__1wbHA:last-child .IoPorts_portLabel__qOE7y, .IoPorts_inputs__2etkb .IoPorts_transput__1wbHA:last-child .IoPorts_port__1_a6J{\r\n        margin-bottom: 5px;\r\n      }\r\n.IoPorts_outputs__3JGh-{\r\n  display: flex;\r\n  flex-direction: column;\r\n  margin-left: auto;\r\n  justify-content: flex-end;\r\n  align-items: flex-end;\r\n  width: 100%;\r\n}\r\n.IoPorts_outputs__3JGh- .IoPorts_transput__1wbHA:last-child .IoPorts_portLabel__qOE7y, .IoPorts_outputs__3JGh- .IoPorts_transput__1wbHA:last-child .IoPorts_port__1_a6J{\r\n        margin-bottom: 5px;\r\n      }\r\n.IoPorts_outputs__3JGh-:first-child{\r\n    margin-top: 5px;\r\n  }\r\n.IoPorts_transput__1wbHA{\r\n  display: flex;\r\n  align-items: center;\r\n  margin-top: 6px;\r\n  margin-bottom: 6px;\r\n}\r\n.IoPorts_transput__1wbHA:first-child{\r\n    margin-top: 0px;\r\n  }\r\n.IoPorts_transput__1wbHA[data-controlless=\"true\"]{\r\n    margin-top: 6px;\r\n    margin-bottom: 6px;\r\n  }\r\n.IoPorts_transput__1wbHA[data-controlless=\"true\"]:first-child{\r\n      margin-top: 0px;\r\n    }\r\n.IoPorts_transput__1wbHA[data-controlless=\"false\"]{\r\n    margin-top: 2px;\r\n    margin-bottom: 2px;\r\n  }\r\n.IoPorts_controls__1dKFt{\r\n  display: flex;\r\n  flex-direction: column;\r\n  width: 100%;\r\n}\r\n.IoPorts_portLabel__qOE7y{\r\n  font-size: 13px;\r\n  font-weight: 400;\r\n}\r\n.IoPorts_port__1_a6J{\r\n  width: 12px;\r\n  height: 12px;\r\n  background: linear-gradient(to bottom, #acb1b4, #919699);\r\n  border-radius: 100%;\r\n  margin-right: 5px;\r\n  margin-left: -11px;\r\n  flex: 0 0 auto;\r\n  box-shadow: 0px 2px 1px 0px rgba(0,0,0,.6);\r\n}\r\n.IoPorts_port__1_a6J:last-child{\r\n    margin-right: -11px;\r\n    margin-left: 5px;\r\n  }\r\n.IoPorts_port__1_a6J[data-port-color=\"red\"]{\r\n    background: #fa4a6f;\r\n  }\r\n.IoPorts_port__1_a6J[data-port-color=\"purple\"]{\r\n    background: #9e55fb;\r\n  }\r\n.IoPorts_port__1_a6J[data-port-color=\"blue\"]{\r\n    background: #4284f7;\r\n  }\r\n.IoPorts_port__1_a6J[data-port-color=\"green\"]{\r\n    background: #31dd9f;\r\n  }\r\n.IoPorts_port__1_a6J[data-port-color=\"yellow\"]{\r\n    background: #d6bf47;\r\n  }\r\n.IoPorts_port__1_a6J[data-port-color=\"orange\"]{\r\n    background: #fa7841;\r\n  }\r\n.IoPorts_port__1_a6J[data-port-color=\"pink\"]{\r\n    background: #fe8aeb;\r\n  }\r\n";
var styles$4 = { "wrapper": "IoPorts_wrapper__3d2hh", "inputs": "IoPorts_inputs__2etkb", "transput": "IoPorts_transput__1wbHA", "portLabel": "IoPorts_portLabel__qOE7y", "port": "IoPorts_port__1_a6J", "outputs": "IoPorts_outputs__3JGh-", "controls": "IoPorts_controls__1dKFt" };
styleInject(css$4);

var css$5 = ".Control_wrapper__VZIiC {\r\n  width: 100%;\r\n  padding-right: 3px;\r\n  padding-top: 3px;\r\n  padding-bottom: 5px;\r\n}\r\n.Control_label__1OX-Q {\r\n  font-size: 14px;\r\n}\r\n.Control_controlLabel__3ga2- {\r\n  font-size: 13px;\r\n  display: inline-block;\r\n  margin-left: 2px;\r\n}\r\n";
var styles$5 = { "wrapper": "Control_wrapper__VZIiC", "label": "Control_label__1OX-Q", "controlLabel": "Control_controlLabel__3ga2-" };
styleInject(css$5);

var css$6 = ".Checkbox_wrapper__aSqyY{\r\n  display: flex;\r\n  align-items: center;\r\n}\r\n.Checkbox_checkbox__Qv5gn{\r\n  background: linear-gradient(to bottom, #5b5f62, #6f7477);\r\n  border: 1px solid #3c3e40;\r\n  border-radius: 4px;\r\n  margin-right: 8px;\r\n}\r\n.Checkbox_label__2RxP-{\r\n  padding-top: 2px;\r\n  font-size: 13px;\r\n}\r\n";
var styles$6 = { "wrapper": "Checkbox_wrapper__aSqyY", "checkbox": "Checkbox_checkbox__Qv5gn", "label": "Checkbox_label__2RxP-" };
styleInject(css$6);

var Checkbox = function Checkbox(_ref) {
  var label = _ref.label,
      data = _ref.data,
      _onChange = _ref.onChange;

  var id = React__default.useRef(nonSecure(10));

  return React__default.createElement(
    "div",
    { className: styles$6.wrapper },
    React__default.createElement("input", {
      className: styles$6.checkbox,
      type: "checkbox",
      id: id,
      value: data,
      checked: data,
      onChange: function onChange(e) {
        return _onChange(e.target.checked);
      }
    }),
    React__default.createElement(
      "label",
      { className: styles$6.label, htmlFor: id },
      label
    )
  );
};

var css$7 = ".TextInput_wrapper__tefOZ{\r\n  background: none;\r\n  border: none;\r\n}\r\n.TextInput_input__1QHwS{\r\n  background: white;\r\n  width: 100%;\r\n  border-width: 1px;\r\n  border-color: black;\r\n  font-size: 13px;\r\n  padding: 5px;\r\n  resize: none;\r\n  outline: none;\r\n}\r\n.TextInput_input__1QHwS::placeholder{\r\n    color: rgb(47, 49, 50);\r\n  }\r\n";
var styles$7 = { "wrapper": "TextInput_wrapper__tefOZ", "input": "TextInput_input__1QHwS" };
styleInject(css$7);

var TextInput = function TextInput(_ref) {
  var placeholder = _ref.placeholder,
      updateNodeConnections = _ref.updateNodeConnections,
      _onChange = _ref.onChange,
      data = _ref.data,
      step = _ref.step,
      type = _ref.type;

  var textInput = React__default.useRef();
  var numberInput = React__default.useRef();
  var recalculateStageRect = React__default.useContext(RecalculateStageRectContext);

  var handleDragEnd = function handleDragEnd() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleDragEnd);
  };

  var handleMouseMove = function handleMouseMove(e) {
    e.stopPropagation();
    updateNodeConnections();
  };

  var handlePossibleResize = function handlePossibleResize(e) {
    e.stopPropagation();
    recalculateStageRect();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleDragEnd);
  };

  return React__default.createElement(
    "div",
    { className: styles$7.wrapper },
    type === "number" ? React__default.createElement("input", {
      onKeyDown: function onKeyDown(e) {
        if (e.keyCode === 69) {
          e.preventDefault();
          return false;
        } else if (e.key === "Escape") {
          numberInput.current.value = 0;
          _onChange(0);
        }
      },
      onChange: function onChange(e) {
        var inputValue = e.target.value.replace(/[^0-9.]+/g, "");
        if (!!inputValue) {
          var value = parseFloat(inputValue, 10);
          if (Number.isNaN(value)) {
            _onChange(0);
          } else {
            _onChange(value);
            numberInput.current.value = value;
          }
        }
      },
      onBlur: function onBlur(e) {
        if (!e.target.value) {
          _onChange(0);
          numberInput.current.value = 0;
        }
      },
      step: step || "1",
      onMouseDown: handlePossibleResize,
      type: type || "text",
      placeholder: placeholder,
      className: styles$7.input,
      defaultValue: data,
      onDragStart: function onDragStart(e) {
        return e.stopPropagation();
      },
      ref: numberInput
    }) : React__default.createElement("input", {
      ref: textInput,
      onKeyDown: function onKeyDown(e) {
        if (e.key === "Escape") {
          textInput.current.value = "";
          _onChange("");
        }
      },
      onChange: function onChange(e) {
        return _onChange(e.target.value);
      },
      onMouseDown: handlePossibleResize,
      type: "text",
      placeholder: placeholder,
      className: styles$7.input,
      value: data,
      spellCheck: false,
      onDragStart: function onDragStart(e) {
        return e.stopPropagation();
      }
    })
    // <textarea
    //   onChange={e => onChange(e.target.value)}
    //   onMouseDown={handlePossibleResize}
    //   type="text"
    //   placeholder={placeholder}
    //   className={styles.input}
    //   value={data}
    //   onDragStart={e => e.stopPropagation()}
    // />

  );
};

var css$8 = ".Select_wrapper__eAPoQ{\r\n  font-size: 14px;\r\n  padding: 3px 6px;\r\n  background: white;\r\n  width: 100%;\r\n  border: 1px solid darkblue;\r\n  padding-right: 15px;\r\n  position: relative;\r\n}\r\n  .Select_wrapper__eAPoQ::after{\r\n    content: \"\";\r\n    position: absolute;\r\n    background: none;\r\n    right: 5px;\r\n    top: 8px;\r\n    width: 0;\r\n    height: 0;\r\n    border-style: solid;\r\n    border-width: 6px 5px 0 5px;\r\n    border-color: #191b1c transparent transparent transparent;\r\n  }\r\n  .Select_wrapper__eAPoQ:hover{\r\n    background: aliceblue;\r\n  }\r\n.Select_chipWrapper__3hK2u{\r\n  font-size: 14px;\r\n  padding: 3px 6px;\r\n  background: white;\r\n  border: 1px solid darkblue;\r\n  margin: 2px;\r\n  position: relative;\r\n}\r\n.Select_chipWrapper__3hK2u:hover .Select_deleteButton__1FnLK{\r\n  opacity: 1;\r\n}\r\n.Select_chipsWrapper__4Alw8{\r\n  display: flex;\r\n  flex-direction: column;\r\n  margin-bottom: 6px;\r\n}\r\n.Select_deleteButton__1FnLK{\r\n  position: absolute;\r\n  right: 0px;\r\n  top: 0px;\r\n  height: 100%;\r\n  width: 22px;\r\n  padding: 0px;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  background: white;\r\n  border: none;\r\n  font-weight: bold;\r\n  opacity: 0;\r\n}\r\n.Select_deleteButton__1FnLK:focus{\r\n  opacity: 1;\r\n}\r\n.Select_deleteButton__1FnLK:hover{\r\n  background: aliceblue;\r\n}\r\n.Select_selectedWrapper__SUs4D{\r\n  display: flex;\r\n  flex-direction: column;\r\n  background: white;\r\n  width: 100%;\r\n  border: 1px solid darkblue;\r\n  font-size: 14px;\r\n  padding: 3px 6px;\r\n  padding-right: 15px;\r\n  position: relative;\r\n}\r\n.Select_selectedWrapper__SUs4D::after{\r\n    content: \"\";\r\n    position: absolute;\r\n    background: none;\r\n    right: 5px;\r\n    top: calc(50% - 4px);\r\n    width: 0;\r\n    height: 0;\r\n    border-style: solid;\r\n    border-width: 6px 5px 0 5px;\r\n    border-color: #191b1c transparent transparent transparent;\r\n  }\r\n.Select_selectedWrapper__SUs4D label{\r\n    margin: 0px;\r\n  }\r\n.Select_selectedWrapper__SUs4D p{\r\n    margin: 0px;\r\n    margin-top: 5px;\r\n    font-size: 12px;\r\n    font-style: italic;\r\n    color: rgb(50, 50, 50);\r\n  }\r\n";
var styles$8 = { "wrapper": "Select_wrapper__eAPoQ", "chipWrapper": "Select_chipWrapper__3hK2u", "deleteButton": "Select_deleteButton__1FnLK", "chipsWrapper": "Select_chipsWrapper__4Alw8", "selectedWrapper": "Select_selectedWrapper__SUs4D" };
styleInject(css$8);

var MAX_LABEL_LENGTH = 50;

var Select = function Select(_ref) {
  var _ref$options = _ref.options,
      options = _ref$options === undefined ? [] : _ref$options,
      _ref$placeholder = _ref.placeholder,
      placeholder = _ref$placeholder === undefined ? "[Select an option]" : _ref$placeholder,
      onChange = _ref.onChange,
      data = _ref.data,
      allowMultiple = _ref.allowMultiple;

  var _React$useState = React__default.useState(false),
      _React$useState2 = slicedToArray(_React$useState, 2),
      drawerOpen = _React$useState2[0],
      setDrawerOpen = _React$useState2[1];

  var _React$useState3 = React__default.useState({
    x: 0,
    y: 0
  }),
      _React$useState4 = slicedToArray(_React$useState3, 2),
      drawerCoordinates = _React$useState4[0],
      setDrawerCoordinates = _React$useState4[1];

  var wrapper = React__default.useRef();

  var closeDrawer = function closeDrawer() {
    setDrawerOpen(false);
  };

  var openDrawer = function openDrawer() {
    if (!drawerOpen) {
      var wrapperRect = wrapper.current.getBoundingClientRect();
      setDrawerCoordinates({
        x: wrapperRect.x,
        y: wrapperRect.y + wrapperRect.height
      });
      setDrawerOpen(true);
    }
  };

  var handleOptionSelected = function handleOptionSelected(option) {
    if (allowMultiple) {
      onChange([].concat(toConsumableArray(data), [option.value]));
    } else {
      onChange(option.value);
    }
  };

  var handleOptionDeleted = function handleOptionDeleted(optionIndex) {
    onChange([].concat(toConsumableArray(data.slice(0, optionIndex)), toConsumableArray(data.slice(optionIndex + 1))));
  };

  var getFilteredOptions = function getFilteredOptions() {
    return allowMultiple ? options.filter(function (opt) {
      return !data.includes(opt.value);
    }) : options;
  };

  var selectedOption = React__default.useMemo(function () {
    var option = options.find(function (o) {
      return o.value === data;
    });
    if (option) {
      return _extends({}, option, {
        label: option.label.length > MAX_LABEL_LENGTH ? option.label.slice(0, MAX_LABEL_LENGTH) + "..." : option.label
      });
    }
  }, [options, data]);

  return React__default.createElement(
    React__default.Fragment,
    null,
    allowMultiple ? data.length ? React__default.createElement(
      "div",
      { className: styles$8.chipsWrapper },
      data.map(function (val, i) {
        var optLabel = (options.find(function (opt) {
          return opt.value === val;
        }) || {}).label || "";
        return React__default.createElement(
          OptionChip,
          {
            onRequestDelete: function onRequestDelete() {
              return handleOptionDeleted(i);
            },
            key: val
          },
          optLabel
        );
      })
    ) : null : data ? React__default.createElement(SelectedOption, {
      wrapperRef: wrapper,
      option: selectedOption,
      onClick: openDrawer
    }) : null,
    (allowMultiple || !data) && React__default.createElement(
      "div",
      { className: styles$8.wrapper, ref: wrapper, onClick: openDrawer },
      placeholder
    ),
    drawerOpen && React__default.createElement(
      Portal$4,
      null,
      React__default.createElement(ContextMenu, {
        x: drawerCoordinates.x,
        y: drawerCoordinates.y,
        emptyText: "There are no options",
        options: getFilteredOptions(),
        onOptionSelected: handleOptionSelected,
        onRequestClose: closeDrawer
      })
    )
  );
};

var SelectedOption = function SelectedOption(_ref2) {
  var _ref2$option = _ref2.option;
  _ref2$option = _ref2$option === undefined ? {} : _ref2$option;
  var label = _ref2$option.label,
      description = _ref2$option.description,
      wrapperRef = _ref2.wrapperRef,
      onClick = _ref2.onClick;
  return React__default.createElement(
    "div",
    { className: styles$8.selectedWrapper, onClick: onClick, ref: wrapperRef },
    React__default.createElement(
      "label",
      null,
      label
    ),
    description ? React__default.createElement(
      "p",
      null,
      description
    ) : null
  );
};

var OptionChip = function OptionChip(_ref3) {
  var children = _ref3.children,
      onRequestDelete = _ref3.onRequestDelete;
  return React__default.createElement(
    "div",
    { className: styles$8.chipWrapper },
    children,
    React__default.createElement(
      "button",
      {
        className: styles$8.deleteButton,
        onMouseDown: function onMouseDown(e) {
          e.stopPropagation();
        },
        onClick: onRequestDelete
      },
      "\u2715"
    )
  );
};

var Control = function Control(_ref) {
  var type = _ref.type,
      name = _ref.name,
      nodeId = _ref.nodeId,
      portName = _ref.portName,
      label = _ref.label,
      inputLabel = _ref.inputLabel,
      data = _ref.data,
      allData = _ref.allData,
      render = _ref.render,
      step = _ref.step,
      _ref$options = _ref.options,
      options = _ref$options === undefined ? [] : _ref$options,
      placeholder = _ref.placeholder,
      inputData = _ref.inputData,
      triggerRecalculation = _ref.triggerRecalculation,
      updateNodeConnections = _ref.updateNodeConnections,
      getOptions = _ref.getOptions,
      setValue = _ref.setValue,
      defaultValue = _ref.defaultValue,
      isMonoControl = _ref.isMonoControl;

  var nodesDispatch = React__default.useContext(NodeDispatchContext);
  var executionContext = React__default.useContext(ContextContext);

  var calculatedLabel = isMonoControl ? inputLabel : label;

  var onChange = function onChange(data) {
    nodesDispatch({
      type: "SET_PORT_DATA",
      data: data,
      nodeId: nodeId,
      portName: portName,
      controlName: name,
      setValue: setValue
    });
    triggerRecalculation();
  };

  var getControlByType = function getControlByType(type) {
    var commonProps = {
      triggerRecalculation: triggerRecalculation,
      updateNodeConnections: updateNodeConnections,
      onChange: onChange,
      data: data
    };
    switch (type) {
      case "select":
        return React__default.createElement(Select, _extends({}, commonProps, {
          options: getOptions ? getOptions(inputData, executionContext) : options,
          placeholder: placeholder
        }));
      case "text":
        return React__default.createElement(TextInput, _extends({}, commonProps, { placeholder: placeholder }));
      case "number":
        return React__default.createElement(TextInput, _extends({}, commonProps, { step: step, type: "number", placeholder: placeholder }));
      case "checkbox":
        return React__default.createElement(Checkbox, _extends({}, commonProps, { label: calculatedLabel }));
      case "multiselect":
        return React__default.createElement(Select, _extends({
          allowMultiple: true
        }, commonProps, {
          options: getOptions ? getOptions(inputData, executionContext) : options,
          placeholder: placeholder,
          label: label
        }));
      case "custom":
        return render(data, onChange, executionContext, triggerRecalculation, {
          label: label,
          name: name,
          portName: portName,
          inputLabel: inputLabel,
          defaultValue: defaultValue
        }, allData);
      default:
        return React__default.createElement(
          "div",
          null,
          "Control"
        );
    }
  };

  return React__default.createElement(
    "div",
    { className: styles$5.wrapper },
    calculatedLabel && type !== "checkbox" && type !== "custom" && React__default.createElement(
      "label",
      { className: styles$5.controlLabel },
      calculatedLabel
    ),
    getControlByType(type)
  );
};

var Connection = function Connection(_ref) {
  var from = _ref.from,
      to = _ref.to,
      id = _ref.id,
      lineRef = _ref.lineRef,
      outputNodeId = _ref.outputNodeId,
      outputPortName = _ref.outputPortName,
      inputNodeId = _ref.inputNodeId,
      inputPortName = _ref.inputPortName;

  var curve = calculateCurve(from, to);
  return React__default.createElement(
    "svg",
    { className: styles$3.svg },
    React__default.createElement("path", {
      "data-connection-id": id,
      "data-output-node-id": outputNodeId,
      "data-output-port-name": outputPortName,
      "data-input-node-id": inputNodeId,
      "data-input-port-name": inputPortName,
      stroke: "black",
      fill: "none",
      strokeWidth: 3,
      strokeLinecap: "round",
      d: curve,
      ref: lineRef
    })
  );
};

var usePrevious = function usePrevious(value) {
  var ref = React__default.useRef();
  React__default.useEffect(function () {
    ref.current = value;
  });
  return ref.current;
};

function useTransputs(transputsFn, transputType, nodeId, inputData, connections) {
  var nodesDispatch = React__default.useContext(NodeDispatchContext);
  var executionContext = React__default.useContext(ContextContext);

  var transputs = React__default.useMemo(function () {
    if (Array.isArray(transputsFn)) return transputsFn;
    return transputsFn(inputData, connections, executionContext);
  }, [transputsFn, inputData, connections, executionContext]);
  var prevTransputs = usePrevious(transputs);

  React__default.useEffect(function () {
    if (!prevTransputs || Array.isArray(transputsFn)) return;

    var _loop = function _loop(transput) {
      var current = transputs.find(function (_ref) {
        var name = _ref.name;
        return transput.name === name;
      });
      if (!current) {
        nodesDispatch({
          type: 'DESTROY_TRANSPUT',
          transputType: transputType,
          transput: { nodeId: nodeId, portName: '' + transput.name }
        });
      }
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = prevTransputs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var transput = _step.value;

        _loop(transput);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }, [transputsFn, transputs, prevTransputs, nodesDispatch, nodeId, transputType]);

  return transputs;
}

var IoPorts = function IoPorts(_ref2) {
  var nodeId = _ref2.nodeId,
      _ref2$inputs = _ref2.inputs,
      inputs = _ref2$inputs === undefined ? [] : _ref2$inputs,
      _ref2$outputs = _ref2.outputs,
      outputs = _ref2$outputs === undefined ? [] : _ref2$outputs,
      connections = _ref2.connections,
      inputData = _ref2.inputData,
      updateNodeConnections = _ref2.updateNodeConnections;

  var inputTypes = React__default.useContext(PortTypesContext);
  var triggerRecalculation = React__default.useContext(ConnectionRecalculateContext);
  var resolvedInputs = useTransputs(inputs, 'input', nodeId, inputData, connections);
  var resolvedOutputs = useTransputs(outputs, 'output', nodeId, inputData, connections);

  return React__default.createElement(
    "div",
    { className: styles$4.wrapper },
    resolvedInputs.length ? React__default.createElement(
      "div",
      { className: styles$4.inputs },
      resolvedInputs.map(function (input) {
        return React__default.createElement(Input, _extends({}, input, {
          data: inputData[input.name] || {},
          isConnected: !!connections.inputs[input.name],
          triggerRecalculation: triggerRecalculation,
          updateNodeConnections: updateNodeConnections,
          inputTypes: inputTypes,
          nodeId: nodeId,
          inputData: inputData,
          key: input.name
        }));
      })
    ) : null,
    !!resolvedOutputs.length && React__default.createElement(
      "div",
      { className: styles$4.outputs },
      resolvedOutputs.map(function (output) {
        return React__default.createElement(Output, _extends({}, output, {
          triggerRecalculation: triggerRecalculation,
          inputTypes: inputTypes,
          nodeId: nodeId,
          inputData: inputData,
          portOnRight: true,
          key: output.name
        }));
      })
    )
  );
};

var Input = function Input(_ref3) {
  var type = _ref3.type,
      label = _ref3.label,
      name = _ref3.name,
      nodeId = _ref3.nodeId,
      data = _ref3.data,
      localControls = _ref3.controls,
      inputTypes = _ref3.inputTypes,
      noControls = _ref3.noControls,
      triggerRecalculation = _ref3.triggerRecalculation,
      updateNodeConnections = _ref3.updateNodeConnections,
      isConnected = _ref3.isConnected,
      inputData = _ref3.inputData,
      hidePort = _ref3.hidePort;

  var _ref4 = inputTypes[type] || {},
      defaultLabel = _ref4.label,
      color = _ref4.color,
      _ref4$controls = _ref4.controls,
      defaultControls = _ref4$controls === undefined ? [] : _ref4$controls;

  var prevConnected = usePrevious(isConnected);

  var controls = localControls || defaultControls;

  React__default.useEffect(function () {
    if (isConnected !== prevConnected) {
      triggerRecalculation();
    }
  }, [isConnected, prevConnected, triggerRecalculation]);

  return React__default.createElement(
    "div",
    {
      className: styles$4.transput,
      "data-controlless": isConnected || noControls || !controls.length,
      onDragStart: function onDragStart(e) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    !hidePort ? React__default.createElement(Port, {
      type: type,
      color: color,
      name: name,
      nodeId: nodeId,
      isInput: true,
      triggerRecalculation: triggerRecalculation
    }) : null,
    (!controls.length || noControls || isConnected) && React__default.createElement(
      "label",
      { className: styles$4.portLabel },
      label || defaultLabel
    ),
    !noControls && !isConnected ? React__default.createElement(
      "div",
      { className: styles$4.controls },
      controls.map(function (control) {
        return React__default.createElement(Control, _extends({}, control, {
          nodeId: nodeId,
          portName: name,
          triggerRecalculation: triggerRecalculation,
          updateNodeConnections: updateNodeConnections,
          inputLabel: label,
          data: data[control.name],
          allData: data,
          key: control.name,
          inputData: inputData,
          isMonoControl: controls.length === 1
        }));
      })
    ) : null
  );
};

var Output = function Output(_ref5) {
  var label = _ref5.label,
      name = _ref5.name,
      nodeId = _ref5.nodeId,
      type = _ref5.type,
      inputTypes = _ref5.inputTypes,
      triggerRecalculation = _ref5.triggerRecalculation;

  var _ref6 = inputTypes[type] || {},
      defaultLabel = _ref6.label,
      color = _ref6.color;

  return React__default.createElement(
    "div",
    {
      className: styles$4.transput,
      "data-controlless": true,
      onDragStart: function onDragStart(e) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    React__default.createElement(
      "label",
      { className: styles$4.portLabel },
      label || defaultLabel
    ),
    React__default.createElement(Port, {
      type: type,
      name: name,
      color: color,
      nodeId: nodeId,
      triggerRecalculation: triggerRecalculation
    })
  );
};

var Port = function Port(_ref7) {
  var _ref7$color = _ref7.color,
      color = _ref7$color === undefined ? "grey" : _ref7$color,
      _ref7$name = _ref7.name,
      name = _ref7$name === undefined ? "" : _ref7$name,
      type = _ref7.type,
      isInput = _ref7.isInput,
      nodeId = _ref7.nodeId,
      triggerRecalculation = _ref7.triggerRecalculation;

  var nodesDispatch = React__default.useContext(NodeDispatchContext);
  var stageState = React__default.useContext(StageContext);
  var editorId = React__default.useContext(EditorIdContext);
  var stageId = "" + STAGE_ID + editorId;
  var inputTypes = React__default.useContext(PortTypesContext);

  var _React$useState = React__default.useState(false),
      _React$useState2 = slicedToArray(_React$useState, 2),
      isDragging = _React$useState2[0],
      setIsDragging = _React$useState2[1];

  var _React$useState3 = React__default.useState({
    x: 0,
    y: 0
  }),
      _React$useState4 = slicedToArray(_React$useState3, 2),
      dragStartCoordinates = _React$useState4[0],
      setDragStartCoordinates = _React$useState4[1];

  var dragStartCoordinatesCache = React__default.useRef(dragStartCoordinates);
  var port = React__default.useRef();
  var line = React__default.useRef();
  var lineInToPort = React__default.useRef();

  var byScale = function byScale(value) {
    return 1 / stageState.scale * value;
  };

  var handleDrag = function handleDrag(e) {
    var stage = document.getElementById(stageId).getBoundingClientRect();

    if (isInput) {
      var to = {
        x: byScale(e.clientX - stage.x - stage.width / 2) + byScale(stageState.translate.x),
        y: byScale(e.clientY - stage.y - stage.height / 2) + byScale(stageState.translate.y)
      };
      lineInToPort.current.setAttribute("d", calculateCurve(dragStartCoordinatesCache.current, to));
    } else {
      var _to = {
        x: byScale(e.clientX - stage.x - stage.width / 2) + byScale(stageState.translate.x),
        y: byScale(e.clientY - stage.y - stage.height / 2) + byScale(stageState.translate.y)
      };
      line.current.setAttribute("d", calculateCurve(dragStartCoordinatesCache.current, _to));
    }
  };

  var handleDragEnd = function handleDragEnd(e) {
    var droppedOnPort = !!e.target.dataset.portName;

    if (isInput) {
      var _lineInToPort$current = lineInToPort.current.dataset,
          inputNodeId = _lineInToPort$current.inputNodeId,
          inputPortName = _lineInToPort$current.inputPortName,
          outputNodeId = _lineInToPort$current.outputNodeId,
          outputPortName = _lineInToPort$current.outputPortName;

      nodesDispatch({
        type: "REMOVE_CONNECTION",
        input: { nodeId: inputNodeId, portName: inputPortName },
        output: { nodeId: outputNodeId, portName: outputPortName }
      });
      if (droppedOnPort) {
        var _e$target$dataset = e.target.dataset,
            connectToPortName = _e$target$dataset.portName,
            connectToNodeId = _e$target$dataset.nodeId,
            connectToPortType = _e$target$dataset.portType,
            connectToTransputType = _e$target$dataset.portTransputType;

        var isNotSameNode = outputNodeId !== connectToNodeId;
        if (isNotSameNode && connectToTransputType !== "output") {
          var inputWillAcceptConnection = inputTypes[connectToPortType].acceptTypes.includes(type);
          if (inputWillAcceptConnection) {
            nodesDispatch({
              type: "ADD_CONNECTION",
              input: { nodeId: connectToNodeId, portName: connectToPortName },
              output: { nodeId: outputNodeId, portName: outputPortName }
            });
          }
        }
      }
    } else {
      if (droppedOnPort) {
        var _e$target$dataset2 = e.target.dataset,
            _inputPortName = _e$target$dataset2.portName,
            _inputNodeId = _e$target$dataset2.nodeId,
            inputNodeType = _e$target$dataset2.portType,
            inputTransputType = _e$target$dataset2.portTransputType;

        var _isNotSameNode = _inputNodeId !== nodeId;
        if (_isNotSameNode && inputTransputType !== "output") {
          var _inputWillAcceptConnection = inputTypes[inputNodeType].acceptTypes.includes(type);
          if (_inputWillAcceptConnection) {
            nodesDispatch({
              type: "ADD_CONNECTION",
              output: { nodeId: nodeId, portName: name },
              input: { nodeId: _inputNodeId, portName: _inputPortName }
            });
            triggerRecalculation();
          }
        }
      }
    }
    setIsDragging(false);
    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("mousemove", handleDrag);
  };

  var handleDragStart = function handleDragStart(e) {
    e.preventDefault();
    e.stopPropagation();
    var startPort = port.current.getBoundingClientRect();
    var stage = document.getElementById(stageId).getBoundingClientRect();

    if (isInput) {
      lineInToPort.current = document.querySelector("[data-input-node-id=\"" + nodeId + "\"][data-input-port-name=\"" + name + "\"]");
      var portIsConnected = !!lineInToPort.current;
      if (portIsConnected) {
        lineInToPort.current.parentNode.style.zIndex = 9999;
        var outputPort = getPortRect(lineInToPort.current.dataset.outputNodeId, lineInToPort.current.dataset.outputPortName, "output");
        var coordinates = {
          x: byScale(outputPort.x - stage.x + outputPort.width / 2 - stage.width / 2) + byScale(stageState.translate.x),
          y: byScale(outputPort.y - stage.y + outputPort.width / 2 - stage.height / 2) + byScale(stageState.translate.y)
        };
        setDragStartCoordinates(coordinates);
        dragStartCoordinatesCache.current = coordinates;
        setIsDragging(true);
        document.addEventListener("mouseup", handleDragEnd);
        document.addEventListener("mousemove", handleDrag);
      }
    } else {
      var _coordinates = {
        x: byScale(startPort.x - stage.x + startPort.width / 2 - stage.width / 2) + byScale(stageState.translate.x),
        y: byScale(startPort.y - stage.y + startPort.width / 2 - stage.height / 2) + byScale(stageState.translate.y)
      };
      setDragStartCoordinates(_coordinates);
      dragStartCoordinatesCache.current = _coordinates;
      setIsDragging(true);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("mousemove", handleDrag);
    }
  };

  return React__default.createElement(
    React__default.Fragment,
    null,
    React__default.createElement("div", {
      style: { zIndex: 999 },
      onMouseDown: handleDragStart,
      className: styles$4.port,
      "data-port-color": color,
      "data-port-name": name,
      "data-port-type": type,
      "data-port-transput-type": isInput ? "input" : "output",
      "data-node-id": nodeId,
      onDragStart: function onDragStart(e) {
        e.preventDefault();
        e.stopPropagation();
      },
      ref: port
    }),
    isDragging && !isInput ? React__default.createElement(
      Portal$4,
      {
        node: document.getElementById("" + DRAG_CONNECTION_ID + editorId)
      },
      React__default.createElement(Connection, {
        from: dragStartCoordinates,
        to: dragStartCoordinates,
        lineRef: line
      })
    ) : null
  );
};

/*!
 * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
var faTimes = {
  prefix: 'fas',
  iconName: 'times',
  icon: [352, 512, [], "f00d", "M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"]
};

/*!
 * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */

function _classCallCheck$3(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass$3(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var noop$1 = function noop() {};

var _WINDOW = {};
var _DOCUMENT = {};
var _PERFORMANCE = {
  mark: noop$1,
  measure: noop$1
};

try {
  if (typeof window !== 'undefined') _WINDOW = window;
  if (typeof document !== 'undefined') _DOCUMENT = document;
  if (typeof performance !== 'undefined') _PERFORMANCE = performance;
} catch (e) {}

var _ref = _WINDOW.navigator || {},
    _ref$userAgent = _ref.userAgent,
    userAgent = _ref$userAgent === void 0 ? '' : _ref$userAgent;

var WINDOW = _WINDOW;
var DOCUMENT = _DOCUMENT;
var PERFORMANCE = _PERFORMANCE;
var IS_BROWSER = !!WINDOW.document;
var IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === 'function' && typeof DOCUMENT.createElement === 'function';
var IS_IE = ~userAgent.indexOf('MSIE') || ~userAgent.indexOf('Trident/');

var NAMESPACE_IDENTIFIER = '___FONT_AWESOME___';
var DEFAULT_FAMILY_PREFIX = 'fa';
var DEFAULT_REPLACEMENT_CLASS = 'svg-inline--fa';
var DATA_FA_I2SVG = 'data-fa-i2svg';
var PRODUCTION = function () {
  try {
    return process.env.NODE_ENV === 'production';
  } catch (e) {
    return false;
  }
}();
var DUOTONE_CLASSES = {
  GROUP: 'group',
  SWAP_OPACITY: 'swap-opacity',
  PRIMARY: 'primary',
  SECONDARY: 'secondary'
};

var initial = WINDOW.FontAwesomeConfig || {};

function getAttrConfig(attr) {
  var element = DOCUMENT.querySelector('script[' + attr + ']');

  if (element) {
    return element.getAttribute(attr);
  }
}

function coerce(val) {
  // Getting an empty string will occur if the attribute is set on the HTML tag but without a value
  // We'll assume that this is an indication that it should be toggled to true
  // For example <script data-search-pseudo-elements src="..."></script>
  if (val === '') return true;
  if (val === 'false') return false;
  if (val === 'true') return true;
  return val;
}

if (DOCUMENT && typeof DOCUMENT.querySelector === 'function') {
  var attrs = [['data-family-prefix', 'familyPrefix'], ['data-replacement-class', 'replacementClass'], ['data-auto-replace-svg', 'autoReplaceSvg'], ['data-auto-add-css', 'autoAddCss'], ['data-auto-a11y', 'autoA11y'], ['data-search-pseudo-elements', 'searchPseudoElements'], ['data-observe-mutations', 'observeMutations'], ['data-mutate-approach', 'mutateApproach'], ['data-keep-original-source', 'keepOriginalSource'], ['data-measure-performance', 'measurePerformance'], ['data-show-missing-icons', 'showMissingIcons']];
  attrs.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        attr = _ref2[0],
        key = _ref2[1];

    var val = coerce(getAttrConfig(attr));

    if (val !== undefined && val !== null) {
      initial[key] = val;
    }
  });
}

var _default = {
  familyPrefix: DEFAULT_FAMILY_PREFIX,
  replacementClass: DEFAULT_REPLACEMENT_CLASS,
  autoReplaceSvg: true,
  autoAddCss: true,
  autoA11y: true,
  searchPseudoElements: false,
  observeMutations: true,
  mutateApproach: 'async',
  keepOriginalSource: true,
  measurePerformance: false,
  showMissingIcons: true
};

var _config = _objectSpread({}, _default, initial);

if (!_config.autoReplaceSvg) _config.observeMutations = false;

var config = _objectSpread({}, _config);

WINDOW.FontAwesomeConfig = config;

var w$1 = WINDOW || {};
if (!w$1[NAMESPACE_IDENTIFIER]) w$1[NAMESPACE_IDENTIFIER] = {};
if (!w$1[NAMESPACE_IDENTIFIER].styles) w$1[NAMESPACE_IDENTIFIER].styles = {};
if (!w$1[NAMESPACE_IDENTIFIER].hooks) w$1[NAMESPACE_IDENTIFIER].hooks = {};
if (!w$1[NAMESPACE_IDENTIFIER].shims) w$1[NAMESPACE_IDENTIFIER].shims = [];
var namespace = w$1[NAMESPACE_IDENTIFIER];

var functions = [];

var listener = function listener() {
  DOCUMENT.removeEventListener('DOMContentLoaded', listener);
  loaded = 1;
  functions.map(function (fn) {
    return fn();
  });
};

var loaded = false;

if (IS_DOM) {
  loaded = (DOCUMENT.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT.readyState);
  if (!loaded) DOCUMENT.addEventListener('DOMContentLoaded', listener);
}

var isNode = typeof global !== 'undefined' && typeof global.process !== 'undefined' && typeof global.process.emit === 'function';
var meaninglessTransform = {
  size: 16,
  x: 0,
  y: 0,
  rotate: 0,
  flipX: false,
  flipY: false
};
function insertCss(css) {
  if (!css || !IS_DOM) {
    return;
  }

  var style = DOCUMENT.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  var headChildren = DOCUMENT.head.childNodes;
  var beforeChild = null;

  for (var i = headChildren.length - 1; i > -1; i--) {
    var child = headChildren[i];
    var tagName = (child.tagName || '').toUpperCase();

    if (['STYLE', 'LINK'].indexOf(tagName) > -1) {
      beforeChild = child;
    }
  }

  DOCUMENT.head.insertBefore(style, beforeChild);
  return css;
}
var idPool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function nextUniqueId() {
  var size = 12;
  var id = '';

  while (size-- > 0) {
    id += idPool[Math.random() * 62 | 0];
  }

  return id;
}
function htmlEscape(str) {
  return "".concat(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function joinAttributes(attributes) {
  return Object.keys(attributes || {}).reduce(function (acc, attributeName) {
    return acc + "".concat(attributeName, "=\"").concat(htmlEscape(attributes[attributeName]), "\" ");
  }, '').trim();
}
function joinStyles(styles) {
  return Object.keys(styles || {}).reduce(function (acc, styleName) {
    return acc + "".concat(styleName, ": ").concat(styles[styleName], ";");
  }, '');
}
function transformIsMeaningful(transform) {
  return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
}
function transformForSvg(_ref) {
  var transform = _ref.transform,
      containerWidth = _ref.containerWidth,
      iconWidth = _ref.iconWidth;
  var outer = {
    transform: "translate(".concat(containerWidth / 2, " 256)")
  };
  var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
  var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
  var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
  var inner = {
    transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
  };
  var path = {
    transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
  };
  return {
    outer: outer,
    inner: inner,
    path: path
  };
}

var ALL_SPACE = {
  x: 0,
  y: 0,
  width: '100%',
  height: '100%'
};

function fillBlack(abstract) {
  var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (abstract.attributes && (abstract.attributes.fill || force)) {
    abstract.attributes.fill = 'black';
  }

  return abstract;
}

function deGroup(abstract) {
  if (abstract.tag === 'g') {
    return abstract.children;
  } else {
    return [abstract];
  }
}

function makeIconMasking (_ref) {
  var children = _ref.children,
      attributes = _ref.attributes,
      main = _ref.main,
      mask = _ref.mask,
      explicitMaskId = _ref.maskId,
      transform = _ref.transform;
  var mainWidth = main.width,
      mainPath = main.icon;
  var maskWidth = mask.width,
      maskPath = mask.icon;
  var trans = transformForSvg({
    transform: transform,
    containerWidth: maskWidth,
    iconWidth: mainWidth
  });
  var maskRect = {
    tag: 'rect',
    attributes: _objectSpread({}, ALL_SPACE, {
      fill: 'white'
    })
  };
  var maskInnerGroupChildrenMixin = mainPath.children ? {
    children: mainPath.children.map(fillBlack)
  } : {};
  var maskInnerGroup = {
    tag: 'g',
    attributes: _objectSpread({}, trans.inner),
    children: [fillBlack(_objectSpread({
      tag: mainPath.tag,
      attributes: _objectSpread({}, mainPath.attributes, trans.path)
    }, maskInnerGroupChildrenMixin))]
  };
  var maskOuterGroup = {
    tag: 'g',
    attributes: _objectSpread({}, trans.outer),
    children: [maskInnerGroup]
  };
  var maskId = "mask-".concat(explicitMaskId || nextUniqueId());
  var clipId = "clip-".concat(explicitMaskId || nextUniqueId());
  var maskTag = {
    tag: 'mask',
    attributes: _objectSpread({}, ALL_SPACE, {
      id: maskId,
      maskUnits: 'userSpaceOnUse',
      maskContentUnits: 'userSpaceOnUse'
    }),
    children: [maskRect, maskOuterGroup]
  };
  var defs = {
    tag: 'defs',
    children: [{
      tag: 'clipPath',
      attributes: {
        id: clipId
      },
      children: deGroup(maskPath)
    }, maskTag]
  };
  children.push(defs, {
    tag: 'rect',
    attributes: _objectSpread({
      fill: 'currentColor',
      'clip-path': "url(#".concat(clipId, ")"),
      mask: "url(#".concat(maskId, ")")
    }, ALL_SPACE)
  });
  return {
    children: children,
    attributes: attributes
  };
}

function makeIconStandard (_ref) {
  var children = _ref.children,
      attributes = _ref.attributes,
      main = _ref.main,
      transform = _ref.transform,
      styles = _ref.styles;
  var styleString = joinStyles(styles);

  if (styleString.length > 0) {
    attributes['style'] = styleString;
  }

  if (transformIsMeaningful(transform)) {
    var trans = transformForSvg({
      transform: transform,
      containerWidth: main.width,
      iconWidth: main.width
    });
    children.push({
      tag: 'g',
      attributes: _objectSpread({}, trans.outer),
      children: [{
        tag: 'g',
        attributes: _objectSpread({}, trans.inner),
        children: [{
          tag: main.icon.tag,
          children: main.icon.children,
          attributes: _objectSpread({}, main.icon.attributes, trans.path)
        }]
      }]
    });
  } else {
    children.push(main.icon);
  }

  return {
    children: children,
    attributes: attributes
  };
}

function asIcon (_ref) {
  var children = _ref.children,
      main = _ref.main,
      mask = _ref.mask,
      attributes = _ref.attributes,
      styles = _ref.styles,
      transform = _ref.transform;

  if (transformIsMeaningful(transform) && main.found && !mask.found) {
    var width = main.width,
        height = main.height;
    var offset = {
      x: width / height / 2,
      y: 0.5
    };
    attributes['style'] = joinStyles(_objectSpread({}, styles, {
      'transform-origin': "".concat(offset.x + transform.x / 16, "em ").concat(offset.y + transform.y / 16, "em")
    }));
  }

  return [{
    tag: 'svg',
    attributes: attributes,
    children: children
  }];
}

function asSymbol (_ref) {
  var prefix = _ref.prefix,
      iconName = _ref.iconName,
      children = _ref.children,
      attributes = _ref.attributes,
      symbol = _ref.symbol;
  var id = symbol === true ? "".concat(prefix, "-").concat(config.familyPrefix, "-").concat(iconName) : symbol;
  return [{
    tag: 'svg',
    attributes: {
      style: 'display: none;'
    },
    children: [{
      tag: 'symbol',
      attributes: _objectSpread({}, attributes, {
        id: id
      }),
      children: children
    }]
  }];
}

function makeInlineSvgAbstract(params) {
  var _params$icons = params.icons,
      main = _params$icons.main,
      mask = _params$icons.mask,
      prefix = params.prefix,
      iconName = params.iconName,
      transform = params.transform,
      symbol = params.symbol,
      title = params.title,
      maskId = params.maskId,
      titleId = params.titleId,
      extra = params.extra,
      _params$watchable = params.watchable,
      watchable = _params$watchable === void 0 ? false : _params$watchable;

  var _ref = mask.found ? mask : main,
      width = _ref.width,
      height = _ref.height;

  var isUploadedIcon = prefix === 'fak';
  var widthClass = isUploadedIcon ? '' : "fa-w-".concat(Math.ceil(width / height * 16));
  var attrClass = [config.replacementClass, iconName ? "".concat(config.familyPrefix, "-").concat(iconName) : '', widthClass].filter(function (c) {
    return extra.classes.indexOf(c) === -1;
  }).filter(function (c) {
    return c !== '' || !!c;
  }).concat(extra.classes).join(' ');
  var content = {
    children: [],
    attributes: _objectSpread({}, extra.attributes, {
      'data-prefix': prefix,
      'data-icon': iconName,
      'class': attrClass,
      'role': extra.attributes.role || 'img',
      'xmlns': 'http://www.w3.org/2000/svg',
      'viewBox': "0 0 ".concat(width, " ").concat(height)
    })
  };
  var uploadedIconWidthStyle = isUploadedIcon && !~extra.classes.indexOf('fa-fw') ? {
    width: "".concat(width / height * 16 * 0.0625, "em")
  } : {};

  if (watchable) {
    content.attributes[DATA_FA_I2SVG] = '';
  }

  if (title) content.children.push({
    tag: 'title',
    attributes: {
      id: content.attributes['aria-labelledby'] || "title-".concat(titleId || nextUniqueId())
    },
    children: [title]
  });

  var args = _objectSpread({}, content, {
    prefix: prefix,
    iconName: iconName,
    main: main,
    mask: mask,
    maskId: maskId,
    transform: transform,
    symbol: symbol,
    styles: _objectSpread({}, uploadedIconWidthStyle, extra.styles)
  });

  var _ref2 = mask.found && main.found ? makeIconMasking(args) : makeIconStandard(args),
      children = _ref2.children,
      attributes = _ref2.attributes;

  args.children = children;
  args.attributes = attributes;

  if (symbol) {
    return asSymbol(args);
  } else {
    return asIcon(args);
  }
}

var noop$1$1 = function noop() {};

var p$1 = config.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : {
  mark: noop$1$1,
  measure: noop$1$1
};

/**
 * Internal helper to bind a function known to have 4 arguments
 * to a given context.
 */

var bindInternal4 = function bindInternal4(func, thisContext) {
  return function (a, b, c, d) {
    return func.call(thisContext, a, b, c, d);
  };
};

/**
 * # Reduce
 *
 * A fast object `.reduce()` implementation.
 *
 * @param  {Object}   subject      The object to reduce over.
 * @param  {Function} fn           The reducer function.
 * @param  {mixed}    initialValue The initial value for the reducer, defaults to subject[0].
 * @param  {Object}   thisContext  The context for the reducer.
 * @return {mixed}                 The final result.
 */


var reduce = function fastReduceObject(subject, fn, initialValue, thisContext) {
  var keys = Object.keys(subject),
      length = keys.length,
      iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn,
      i,
      key,
      result;

  if (initialValue === undefined) {
    i = 1;
    result = subject[keys[0]];
  } else {
    i = 0;
    result = initialValue;
  }

  for (; i < length; i++) {
    key = keys[i];
    result = iterator(result, subject[key], key, subject);
  }

  return result;
};

function defineIcons(prefix, icons) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _params$skipHooks = params.skipHooks,
      skipHooks = _params$skipHooks === void 0 ? false : _params$skipHooks;
  var normalized = Object.keys(icons).reduce(function (acc, iconName) {
    var icon = icons[iconName];
    var expanded = !!icon.icon;

    if (expanded) {
      acc[icon.iconName] = icon.icon;
    } else {
      acc[iconName] = icon;
    }

    return acc;
  }, {});

  if (typeof namespace.hooks.addPack === 'function' && !skipHooks) {
    namespace.hooks.addPack(prefix, normalized);
  } else {
    namespace.styles[prefix] = _objectSpread({}, namespace.styles[prefix] || {}, normalized);
  }
  /**
   * Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
   * of new styles we needed to differentiate between them. Prefix `fa` is now an alias
   * for `fas` so we'll easy the upgrade process for our users by automatically defining
   * this as well.
   */


  if (prefix === 'fas') {
    defineIcons('fa', icons);
  }
}

var styles$9 = namespace.styles,
    shims = namespace.shims;
var _byUnicode = {};
var _byLigature = {};
var _byOldName = {};
var build = function build() {
  var lookup = function lookup(reducer) {
    return reduce(styles$9, function (o, style, prefix) {
      o[prefix] = reduce(style, reducer, {});
      return o;
    }, {});
  };

  _byUnicode = lookup(function (acc, icon, iconName) {
    if (icon[3]) {
      acc[icon[3]] = iconName;
    }

    return acc;
  });
  _byLigature = lookup(function (acc, icon, iconName) {
    var ligatures = icon[2];
    acc[iconName] = iconName;
    ligatures.forEach(function (ligature) {
      acc[ligature] = iconName;
    });
    return acc;
  });
  var hasRegular = 'far' in styles$9;
  _byOldName = reduce(shims, function (acc, shim) {
    var oldName = shim[0];
    var prefix = shim[1];
    var iconName = shim[2];

    if (prefix === 'far' && !hasRegular) {
      prefix = 'fas';
    }

    acc[oldName] = {
      prefix: prefix,
      iconName: iconName
    };
    return acc;
  }, {});
};
build();

var styles$1$1 = namespace.styles;
function iconFromMapping(mapping, prefix, iconName) {
  if (mapping && mapping[prefix] && mapping[prefix][iconName]) {
    return {
      prefix: prefix,
      iconName: iconName,
      icon: mapping[prefix][iconName]
    };
  }
}

function toHtml(abstractNodes) {
  var tag = abstractNodes.tag,
      _abstractNodes$attrib = abstractNodes.attributes,
      attributes = _abstractNodes$attrib === void 0 ? {} : _abstractNodes$attrib,
      _abstractNodes$childr = abstractNodes.children,
      children = _abstractNodes$childr === void 0 ? [] : _abstractNodes$childr;

  if (typeof abstractNodes === 'string') {
    return htmlEscape(abstractNodes);
  } else {
    return "<".concat(tag, " ").concat(joinAttributes(attributes), ">").concat(children.map(toHtml).join(''), "</").concat(tag, ">");
  }
}

var parseTransformString = function parseTransformString(transformString) {
  var transform = {
    size: 16,
    x: 0,
    y: 0,
    flipX: false,
    flipY: false,
    rotate: 0
  };

  if (!transformString) {
    return transform;
  } else {
    return transformString.toLowerCase().split(' ').reduce(function (acc, n) {
      var parts = n.toLowerCase().split('-');
      var first = parts[0];
      var rest = parts.slice(1).join('-');

      if (first && rest === 'h') {
        acc.flipX = true;
        return acc;
      }

      if (first && rest === 'v') {
        acc.flipY = true;
        return acc;
      }

      rest = parseFloat(rest);

      if (isNaN(rest)) {
        return acc;
      }

      switch (first) {
        case 'grow':
          acc.size = acc.size + rest;
          break;

        case 'shrink':
          acc.size = acc.size - rest;
          break;

        case 'left':
          acc.x = acc.x - rest;
          break;

        case 'right':
          acc.x = acc.x + rest;
          break;

        case 'up':
          acc.y = acc.y - rest;
          break;

        case 'down':
          acc.y = acc.y + rest;
          break;

        case 'rotate':
          acc.rotate = acc.rotate + rest;
          break;
      }

      return acc;
    }, transform);
  }
};

function MissingIcon(error) {
  this.name = 'MissingIcon';
  this.message = error || 'Icon unavailable';
  this.stack = new Error().stack;
}
MissingIcon.prototype = Object.create(Error.prototype);
MissingIcon.prototype.constructor = MissingIcon;

var FILL = {
  fill: 'currentColor'
};
var ANIMATION_BASE = {
  attributeType: 'XML',
  repeatCount: 'indefinite',
  dur: '2s'
};
var RING = {
  tag: 'path',
  attributes: _objectSpread({}, FILL, {
    d: 'M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z'
  })
};

var OPACITY_ANIMATE = _objectSpread({}, ANIMATION_BASE, {
  attributeName: 'opacity'
});

var DOT = {
  tag: 'circle',
  attributes: _objectSpread({}, FILL, {
    cx: '256',
    cy: '364',
    r: '28'
  }),
  children: [{
    tag: 'animate',
    attributes: _objectSpread({}, ANIMATION_BASE, {
      attributeName: 'r',
      values: '28;14;28;28;14;28;'
    })
  }, {
    tag: 'animate',
    attributes: _objectSpread({}, OPACITY_ANIMATE, {
      values: '1;0;1;1;0;1;'
    })
  }]
};
var QUESTION = {
  tag: 'path',
  attributes: _objectSpread({}, FILL, {
    opacity: '1',
    d: 'M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z'
  }),
  children: [{
    tag: 'animate',
    attributes: _objectSpread({}, OPACITY_ANIMATE, {
      values: '1;0;0;0;0;1;'
    })
  }]
};
var EXCLAMATION = {
  tag: 'path',
  attributes: _objectSpread({}, FILL, {
    opacity: '0',
    d: 'M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z'
  }),
  children: [{
    tag: 'animate',
    attributes: _objectSpread({}, OPACITY_ANIMATE, {
      values: '0;0;1;1;0;0;'
    })
  }]
};

var styles$2$1 = namespace.styles;
function asFoundIcon(icon) {
  var width = icon[0];
  var height = icon[1];

  var _icon$slice = icon.slice(4),
      _icon$slice2 = _slicedToArray(_icon$slice, 1),
      vectorData = _icon$slice2[0];

  var element = null;

  if (Array.isArray(vectorData)) {
    element = {
      tag: 'g',
      attributes: {
        class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.GROUP)
      },
      children: [{
        tag: 'path',
        attributes: {
          class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.SECONDARY),
          fill: 'currentColor',
          d: vectorData[0]
        }
      }, {
        tag: 'path',
        attributes: {
          class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.PRIMARY),
          fill: 'currentColor',
          d: vectorData[1]
        }
      }]
    };
  } else {
    element = {
      tag: 'path',
      attributes: {
        fill: 'currentColor',
        d: vectorData
      }
    };
  }

  return {
    found: true,
    width: width,
    height: height,
    icon: element
  };
}

var styles$3$1 = namespace.styles;

var baseStyles = "svg:not(:root).svg-inline--fa {\n  overflow: visible;\n}\n\n.svg-inline--fa {\n  display: inline-block;\n  font-size: inherit;\n  height: 1em;\n  overflow: visible;\n  vertical-align: -0.125em;\n}\n.svg-inline--fa.fa-lg {\n  vertical-align: -0.225em;\n}\n.svg-inline--fa.fa-w-1 {\n  width: 0.0625em;\n}\n.svg-inline--fa.fa-w-2 {\n  width: 0.125em;\n}\n.svg-inline--fa.fa-w-3 {\n  width: 0.1875em;\n}\n.svg-inline--fa.fa-w-4 {\n  width: 0.25em;\n}\n.svg-inline--fa.fa-w-5 {\n  width: 0.3125em;\n}\n.svg-inline--fa.fa-w-6 {\n  width: 0.375em;\n}\n.svg-inline--fa.fa-w-7 {\n  width: 0.4375em;\n}\n.svg-inline--fa.fa-w-8 {\n  width: 0.5em;\n}\n.svg-inline--fa.fa-w-9 {\n  width: 0.5625em;\n}\n.svg-inline--fa.fa-w-10 {\n  width: 0.625em;\n}\n.svg-inline--fa.fa-w-11 {\n  width: 0.6875em;\n}\n.svg-inline--fa.fa-w-12 {\n  width: 0.75em;\n}\n.svg-inline--fa.fa-w-13 {\n  width: 0.8125em;\n}\n.svg-inline--fa.fa-w-14 {\n  width: 0.875em;\n}\n.svg-inline--fa.fa-w-15 {\n  width: 0.9375em;\n}\n.svg-inline--fa.fa-w-16 {\n  width: 1em;\n}\n.svg-inline--fa.fa-w-17 {\n  width: 1.0625em;\n}\n.svg-inline--fa.fa-w-18 {\n  width: 1.125em;\n}\n.svg-inline--fa.fa-w-19 {\n  width: 1.1875em;\n}\n.svg-inline--fa.fa-w-20 {\n  width: 1.25em;\n}\n.svg-inline--fa.fa-pull-left {\n  margin-right: 0.3em;\n  width: auto;\n}\n.svg-inline--fa.fa-pull-right {\n  margin-left: 0.3em;\n  width: auto;\n}\n.svg-inline--fa.fa-border {\n  height: 1.5em;\n}\n.svg-inline--fa.fa-li {\n  width: 2em;\n}\n.svg-inline--fa.fa-fw {\n  width: 1.25em;\n}\n\n.fa-layers svg.svg-inline--fa {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -0.125em;\n  width: 1em;\n}\n.fa-layers svg.svg-inline--fa {\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter, .fa-layers-text {\n  display: inline-block;\n  position: absolute;\n  text-align: center;\n}\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter {\n  background-color: #ff253a;\n  border-radius: 1em;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  color: #fff;\n  height: 1.5em;\n  line-height: 1;\n  max-width: 5em;\n  min-width: 1.5em;\n  overflow: hidden;\n  padding: 0.25em;\n  right: 0;\n  text-overflow: ellipsis;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-bottom-right {\n  bottom: 0;\n  right: 0;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom right;\n          transform-origin: bottom right;\n}\n\n.fa-layers-bottom-left {\n  bottom: 0;\n  left: 0;\n  right: auto;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom left;\n          transform-origin: bottom left;\n}\n\n.fa-layers-top-right {\n  right: 0;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-top-left {\n  left: 0;\n  right: auto;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top left;\n          transform-origin: top left;\n}\n\n.fa-lg {\n  font-size: 1.3333333333em;\n  line-height: 0.75em;\n  vertical-align: -0.0667em;\n}\n\n.fa-xs {\n  font-size: 0.75em;\n}\n\n.fa-sm {\n  font-size: 0.875em;\n}\n\n.fa-1x {\n  font-size: 1em;\n}\n\n.fa-2x {\n  font-size: 2em;\n}\n\n.fa-3x {\n  font-size: 3em;\n}\n\n.fa-4x {\n  font-size: 4em;\n}\n\n.fa-5x {\n  font-size: 5em;\n}\n\n.fa-6x {\n  font-size: 6em;\n}\n\n.fa-7x {\n  font-size: 7em;\n}\n\n.fa-8x {\n  font-size: 8em;\n}\n\n.fa-9x {\n  font-size: 9em;\n}\n\n.fa-10x {\n  font-size: 10em;\n}\n\n.fa-fw {\n  text-align: center;\n  width: 1.25em;\n}\n\n.fa-ul {\n  list-style-type: none;\n  margin-left: 2.5em;\n  padding-left: 0;\n}\n.fa-ul > li {\n  position: relative;\n}\n\n.fa-li {\n  left: -2em;\n  position: absolute;\n  text-align: center;\n  width: 2em;\n  line-height: inherit;\n}\n\n.fa-border {\n  border: solid 0.08em #eee;\n  border-radius: 0.1em;\n  padding: 0.2em 0.25em 0.15em;\n}\n\n.fa-pull-left {\n  float: left;\n}\n\n.fa-pull-right {\n  float: right;\n}\n\n.fa.fa-pull-left,\n.fas.fa-pull-left,\n.far.fa-pull-left,\n.fal.fa-pull-left,\n.fab.fa-pull-left {\n  margin-right: 0.3em;\n}\n.fa.fa-pull-right,\n.fas.fa-pull-right,\n.far.fa-pull-right,\n.fal.fa-pull-right,\n.fab.fa-pull-right {\n  margin-left: 0.3em;\n}\n\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n          animation: fa-spin 2s infinite linear;\n}\n\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n          animation: fa-spin 1s infinite steps(8);\n}\n\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n.fa-rotate-90 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";\n  -webkit-transform: rotate(90deg);\n          transform: rotate(90deg);\n}\n\n.fa-rotate-180 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";\n  -webkit-transform: rotate(180deg);\n          transform: rotate(180deg);\n}\n\n.fa-rotate-270 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";\n  -webkit-transform: rotate(270deg);\n          transform: rotate(270deg);\n}\n\n.fa-flip-horizontal {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";\n  -webkit-transform: scale(-1, 1);\n          transform: scale(-1, 1);\n}\n\n.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(1, -1);\n          transform: scale(1, -1);\n}\n\n.fa-flip-both, .fa-flip-horizontal.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(-1, -1);\n          transform: scale(-1, -1);\n}\n\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical,\n:root .fa-flip-both {\n  -webkit-filter: none;\n          filter: none;\n}\n\n.fa-stack {\n  display: inline-block;\n  height: 2em;\n  position: relative;\n  width: 2.5em;\n}\n\n.fa-stack-1x,\n.fa-stack-2x {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.svg-inline--fa.fa-stack-1x {\n  height: 1em;\n  width: 1.25em;\n}\n.svg-inline--fa.fa-stack-2x {\n  height: 2em;\n  width: 2.5em;\n}\n\n.fa-inverse {\n  color: #fff;\n}\n\n.sr-only {\n  border: 0;\n  clip: rect(0, 0, 0, 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px;\n}\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  clip: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  position: static;\n  width: auto;\n}\n\n.svg-inline--fa .fa-primary {\n  fill: var(--fa-primary-color, currentColor);\n  opacity: 1;\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa .fa-secondary {\n  fill: var(--fa-secondary-color, currentColor);\n  opacity: 0.4;\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-primary {\n  opacity: 0.4;\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-secondary {\n  opacity: 1;\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa mask .fa-primary,\n.svg-inline--fa mask .fa-secondary {\n  fill: black;\n}\n\n.fad.fa-inverse {\n  color: #fff;\n}";

function css$9 () {
  var dfp = DEFAULT_FAMILY_PREFIX;
  var drc = DEFAULT_REPLACEMENT_CLASS;
  var fp = config.familyPrefix;
  var rc = config.replacementClass;
  var s = baseStyles;

  if (fp !== dfp || rc !== drc) {
    var dPatt = new RegExp("\\.".concat(dfp, "\\-"), 'g');
    var customPropPatt = new RegExp("\\--".concat(dfp, "\\-"), 'g');
    var rPatt = new RegExp("\\.".concat(drc), 'g');
    s = s.replace(dPatt, ".".concat(fp, "-")).replace(customPropPatt, "--".concat(fp, "-")).replace(rPatt, ".".concat(rc));
  }

  return s;
}

var Library =
/*#__PURE__*/
function () {
  function Library() {
    _classCallCheck$3(this, Library);

    this.definitions = {};
  }

  _createClass$3(Library, [{
    key: "add",
    value: function add() {
      var _this = this;

      for (var _len = arguments.length, definitions = new Array(_len), _key = 0; _key < _len; _key++) {
        definitions[_key] = arguments[_key];
      }

      var additions = definitions.reduce(this._pullDefinitions, {});
      Object.keys(additions).forEach(function (key) {
        _this.definitions[key] = _objectSpread({}, _this.definitions[key] || {}, additions[key]);
        defineIcons(key, additions[key]);
        build();
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      this.definitions = {};
    }
  }, {
    key: "_pullDefinitions",
    value: function _pullDefinitions(additions, definition) {
      var normalized = definition.prefix && definition.iconName && definition.icon ? {
        0: definition
      } : definition;
      Object.keys(normalized).map(function (key) {
        var _normalized$key = normalized[key],
            prefix = _normalized$key.prefix,
            iconName = _normalized$key.iconName,
            icon = _normalized$key.icon;
        if (!additions[prefix]) additions[prefix] = {};
        additions[prefix][iconName] = icon;
      });
      return additions;
    }
  }]);

  return Library;
}();

function ensureCss() {
  if (config.autoAddCss && !_cssInserted) {
    insertCss(css$9());

    _cssInserted = true;
  }
}

function apiObject(val, abstractCreator) {
  Object.defineProperty(val, 'abstract', {
    get: abstractCreator
  });
  Object.defineProperty(val, 'html', {
    get: function get() {
      return val.abstract.map(function (a) {
        return toHtml(a);
      });
    }
  });
  Object.defineProperty(val, 'node', {
    get: function get() {
      if (!IS_DOM) return;
      var container = DOCUMENT.createElement('div');
      container.innerHTML = val.html;
      return container.children;
    }
  });
  return val;
}

function findIconDefinition(iconLookup) {
  var _iconLookup$prefix = iconLookup.prefix,
      prefix = _iconLookup$prefix === void 0 ? 'fa' : _iconLookup$prefix,
      iconName = iconLookup.iconName;
  if (!iconName) return;
  return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
}

function resolveIcons(next) {
  return function (maybeIconDefinition) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});
    var mask = params.mask;

    if (mask) {
      mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
    }

    return next(iconDefinition, _objectSpread({}, params, {
      mask: mask
    }));
  };
}

var library = new Library();
var _cssInserted = false;
var parse = {
  transform: function transform(transformString) {
    return parseTransformString(transformString);
  }
};
var icon = resolveIcons(function (iconDefinition) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _params$transform = params.transform,
      transform = _params$transform === void 0 ? meaninglessTransform : _params$transform,
      _params$symbol = params.symbol,
      symbol = _params$symbol === void 0 ? false : _params$symbol,
      _params$mask = params.mask,
      mask = _params$mask === void 0 ? null : _params$mask,
      _params$maskId = params.maskId,
      maskId = _params$maskId === void 0 ? null : _params$maskId,
      _params$title = params.title,
      title = _params$title === void 0 ? null : _params$title,
      _params$titleId = params.titleId,
      titleId = _params$titleId === void 0 ? null : _params$titleId,
      _params$classes = params.classes,
      classes = _params$classes === void 0 ? [] : _params$classes,
      _params$attributes = params.attributes,
      attributes = _params$attributes === void 0 ? {} : _params$attributes,
      _params$styles = params.styles,
      styles = _params$styles === void 0 ? {} : _params$styles;
  if (!iconDefinition) return;
  var prefix = iconDefinition.prefix,
      iconName = iconDefinition.iconName,
      icon = iconDefinition.icon;
  return apiObject(_objectSpread({
    type: 'icon'
  }, iconDefinition), function () {
    ensureCss();

    if (config.autoA11y) {
      if (title) {
        attributes['aria-labelledby'] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
      } else {
        attributes['aria-hidden'] = 'true';
        attributes['focusable'] = 'false';
      }
    }

    return makeInlineSvgAbstract({
      icons: {
        main: asFoundIcon(icon),
        mask: mask ? asFoundIcon(mask.icon) : {
          found: false,
          width: null,
          height: null,
          icon: {}
        }
      },
      prefix: prefix,
      iconName: iconName,
      transform: _objectSpread({}, meaninglessTransform, transform),
      symbol: symbol,
      title: title,
      maskId: maskId,
      titleId: titleId,
      extra: {
        attributes: attributes,
        styles: styles,
        classes: classes
      }
    });
  });
});

function _typeof$2(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$2 = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof$2 = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof$2(obj);
}

function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty$1(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _toConsumableArray$1(arr) {
  return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _nonIterableSpread$1();
}

function _arrayWithoutHoles$1(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray$1(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread$1() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

// Get CSS class list from a props object
function classList(props) {
  var _classes;

  var spin = props.spin,
      pulse = props.pulse,
      fixedWidth = props.fixedWidth,
      inverse = props.inverse,
      border = props.border,
      listItem = props.listItem,
      flip = props.flip,
      size = props.size,
      rotation = props.rotation,
      pull = props.pull; // map of CSS class names to properties

  var classes = (_classes = {
    'fa-spin': spin,
    'fa-pulse': pulse,
    'fa-fw': fixedWidth,
    'fa-inverse': inverse,
    'fa-border': border,
    'fa-li': listItem,
    'fa-flip-horizontal': flip === 'horizontal' || flip === 'both',
    'fa-flip-vertical': flip === 'vertical' || flip === 'both'
  }, _defineProperty$1(_classes, "fa-".concat(size), typeof size !== 'undefined' && size !== null), _defineProperty$1(_classes, "fa-rotate-".concat(rotation), typeof rotation !== 'undefined' && rotation !== null && rotation !== 0), _defineProperty$1(_classes, "fa-pull-".concat(pull), typeof pull !== 'undefined' && pull !== null), _defineProperty$1(_classes, 'fa-swap-opacity', props.swapOpacity), _classes); // map over all the keys in the classes object
  // return an array of the keys where the value for the key is not null

  return Object.keys(classes).map(function (key) {
    return classes[key] ? key : null;
  }).filter(function (key) {
    return key;
  });
}

// Camelize taken from humps
// humps is copyright © 2012+ Dom Christie
// Released under the MIT license.
// Performant way to determine if object coerces to a number
function _isNumerical(obj) {
  obj = obj - 0; // eslint-disable-next-line no-self-compare

  return obj === obj;
}

function camelize(string) {
  if (_isNumerical(string)) {
    return string;
  } // eslint-disable-next-line no-useless-escape


  string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
    return chr ? chr.toUpperCase() : '';
  }); // Ensure 1st char is always lowercase

  return string.substr(0, 1).toLowerCase() + string.substr(1);
}

function capitalize(val) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

function styleToObject(style) {
  return style.split(';').map(function (s) {
    return s.trim();
  }).filter(function (s) {
    return s;
  }).reduce(function (acc, pair) {
    var i = pair.indexOf(':');
    var prop = camelize(pair.slice(0, i));
    var value = pair.slice(i + 1).trim();
    prop.startsWith('webkit') ? acc[capitalize(prop)] = value : acc[prop] = value;
    return acc;
  }, {});
}

function convert(createElement, element) {
  var extraProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (typeof element === 'string') {
    return element;
  }

  var children = (element.children || []).map(function (child) {
    return convert(createElement, child);
  });
  /* eslint-disable dot-notation */

  var mixins = Object.keys(element.attributes || {}).reduce(function (acc, key) {
    var val = element.attributes[key];

    switch (key) {
      case 'class':
        acc.attrs['className'] = val;
        delete element.attributes['class'];
        break;

      case 'style':
        acc.attrs['style'] = styleToObject(val);
        break;

      default:
        if (key.indexOf('aria-') === 0 || key.indexOf('data-') === 0) {
          acc.attrs[key.toLowerCase()] = val;
        } else {
          acc.attrs[camelize(key)] = val;
        }

    }

    return acc;
  }, {
    attrs: {}
  });

  var _extraProps$style = extraProps.style,
      existingStyle = _extraProps$style === void 0 ? {} : _extraProps$style,
      remaining = _objectWithoutProperties(extraProps, ["style"]);

  mixins.attrs['style'] = _objectSpread2({}, mixins.attrs['style'], {}, existingStyle);
  /* eslint-enable */

  return createElement.apply(void 0, [element.tag, _objectSpread2({}, mixins.attrs, {}, remaining)].concat(_toConsumableArray$1(children)));
}

var PRODUCTION$1 = false;

try {
  PRODUCTION$1 = process.env.NODE_ENV === 'production';
} catch (e) {}

function log () {
  if (!PRODUCTION$1 && console && typeof console.error === 'function') {
    var _console;

    (_console = console).error.apply(_console, arguments);
  }
}

function normalizeIconArgs(icon$$1) {
  // this has everything that it needs to be rendered which means it was probably imported
  // directly from an icon svg package
  if (icon$$1 && _typeof$2(icon$$1) === 'object' && icon$$1.prefix && icon$$1.iconName && icon$$1.icon) {
    return icon$$1;
  }


  if (icon$$1 === null) {
    return null;
  } // if the icon is an object and has a prefix and an icon name, return it


  if (icon$$1 && _typeof$2(icon$$1) === 'object' && icon$$1.prefix && icon$$1.iconName) {
    return icon$$1;
  } // if it's an array with length of two


  if (Array.isArray(icon$$1) && icon$$1.length === 2) {
    // use the first item as prefix, second as icon name
    return {
      prefix: icon$$1[0],
      iconName: icon$$1[1]
    };
  } // if it's a string, use it as the icon name


  if (typeof icon$$1 === 'string') {
    return {
      prefix: 'fas',
      iconName: icon$$1
    };
  }
}

// creates an object with a key of key
// and a value of value
// if certain conditions are met
function objectWithKey(key, value) {
  // if the value is a non-empty array
  // or it's not an array but it is truthy
  // then create the object with the key and the value
  // if not, return an empty array
  return Array.isArray(value) && value.length > 0 || !Array.isArray(value) && value ? _defineProperty$1({}, key, value) : {};
}

function FontAwesomeIcon(_ref) {
  var forwardedRef = _ref.forwardedRef,
      props = _objectWithoutProperties(_ref, ["forwardedRef"]);

  var iconArgs = props.icon,
      maskArgs = props.mask,
      symbol = props.symbol,
      className = props.className,
      title = props.title,
      titleId = props.titleId;
  var iconLookup = normalizeIconArgs(iconArgs);
  var classes = objectWithKey('classes', [].concat(_toConsumableArray$1(classList(props)), _toConsumableArray$1(className.split(' '))));
  var transform = objectWithKey('transform', typeof props.transform === 'string' ? parse.transform(props.transform) : props.transform);
  var mask = objectWithKey('mask', normalizeIconArgs(maskArgs));
  var renderedIcon = icon(iconLookup, _objectSpread2({}, classes, {}, transform, {}, mask, {
    symbol: symbol,
    title: title,
    titleId: titleId
  }));

  if (!renderedIcon) {
    log('Could not find icon', iconLookup);
    return null;
  }

  var abstract = renderedIcon.abstract;
  var extraProps = {
    ref: forwardedRef
  };
  Object.keys(props).forEach(function (key) {
    // eslint-disable-next-line no-prototype-builtins
    if (!FontAwesomeIcon.defaultProps.hasOwnProperty(key)) {
      extraProps[key] = props[key];
    }
  });
  return convertCurry(abstract[0], extraProps);
}
FontAwesomeIcon.displayName = 'FontAwesomeIcon';
FontAwesomeIcon.propTypes = {
  border: propTypes.bool,
  className: propTypes.string,
  mask: propTypes.oneOfType([propTypes.object, propTypes.array, propTypes.string]),
  fixedWidth: propTypes.bool,
  inverse: propTypes.bool,
  flip: propTypes.oneOf(['horizontal', 'vertical', 'both']),
  icon: propTypes.oneOfType([propTypes.object, propTypes.array, propTypes.string]),
  listItem: propTypes.bool,
  pull: propTypes.oneOf(['right', 'left']),
  pulse: propTypes.bool,
  rotation: propTypes.oneOf([0, 90, 180, 270]),
  size: propTypes.oneOf(['lg', 'xs', 'sm', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x']),
  spin: propTypes.bool,
  symbol: propTypes.oneOfType([propTypes.bool, propTypes.string]),
  title: propTypes.string,
  transform: propTypes.oneOfType([propTypes.string, propTypes.object]),
  swapOpacity: propTypes.bool
};
FontAwesomeIcon.defaultProps = {
  border: false,
  className: '',
  mask: null,
  fixedWidth: false,
  inverse: false,
  flip: null,
  icon: null,
  listItem: false,
  pull: null,
  pulse: false,
  rotation: null,
  size: null,
  spin: false,
  symbol: false,
  title: '',
  transform: null,
  swapOpacity: false
};
var convertCurry = convert.bind(null, React__default.createElement);

var Node = function Node(_ref) {
  var id = _ref.id,
      width = _ref.width,
      height = _ref.height,
      x = _ref.x,
      y = _ref.y,
      _ref$delay = _ref.delay,
      stageRect = _ref.stageRect,
      connections = _ref.connections,
      type = _ref.type,
      inputData = _ref.inputData,
      onDragStart = _ref.onDragStart,
      onDragEnd = _ref.onDragEnd,
      onDrag = _ref.onDrag;

  var cache = React__default.useContext(CacheContext);
  var nodeTypes = React__default.useContext(NodeTypesContext);
  var nodesDispatch = React__default.useContext(NodeDispatchContext);
  var stageState = React__default.useContext(StageContext);
  var _nodeTypes$type = nodeTypes[type],
      label = _nodeTypes$type.label,
      description = _nodeTypes$type.description,
      deletable = _nodeTypes$type.deletable,
      _nodeTypes$type$input = _nodeTypes$type.inputs,
      inputs = _nodeTypes$type$input === undefined ? [] : _nodeTypes$type$input,
      _nodeTypes$type$outpu = _nodeTypes$type.outputs,
      outputs = _nodeTypes$type$outpu === undefined ? [] : _nodeTypes$type$outpu;


  var nodeWrapper = React__default.useRef();
  var tooltipRef = React__default.useRef();

  var _React$useState = React__default.useState(false),
      _React$useState2 = slicedToArray(_React$useState, 2),
      titleMenuOpen = _React$useState2[0],
      setTitleMenuOpen = _React$useState2[1];

  var _React$useState3 = React__default.useState(false),
      _React$useState4 = slicedToArray(_React$useState3, 2),
      menuOpen = _React$useState4[0],
      setMenuOpen = _React$useState4[1];

  var _React$useState5 = React__default.useState({ x: 0, y: 0 }),
      _React$useState6 = slicedToArray(_React$useState5, 2),
      menuCoordinates = _React$useState6[0],
      setMenuCoordinates = _React$useState6[1];

  var byScale = function byScale(value) {
    return 1 / stageState.scale * value;
  };

  var updateConnectionsByTransput = function updateConnectionsByTransput() {
    var transput = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var isOutput = arguments[1];

    Object.entries(transput).forEach(function (_ref2) {
      var _ref3 = slicedToArray(_ref2, 2),
          portName = _ref3[0],
          outputs = _ref3[1];

      outputs.forEach(function (output) {
        var toRect = getPortRect(id, portName, isOutput ? "output" : "input", cache);
        var fromRect = getPortRect(output.nodeId, output.portName, isOutput ? "input" : "output", cache);
        var portHalf = fromRect.width / 2;
        var combined = void 0;
        if (isOutput) {
          combined = id + portName + output.nodeId + output.portName;
        } else {
          combined = output.nodeId + output.portName + id + portName;
        }
        var cnx = void 0;
        var cachedConnection = cache.current.connections[combined];
        if (cachedConnection) {
          cnx = cachedConnection;
        } else {
          cnx = document.querySelector("[data-connection-id=\"" + combined + "\"]");
          cache.current.connections[combined] = cnx;
        }
        var from = {
          x: byScale(toRect.x - stageRect.current.x + portHalf - stageRect.current.width / 2) + byScale(stageState.translate.x),
          y: byScale(toRect.y - stageRect.current.y + portHalf - stageRect.current.height / 2) + byScale(stageState.translate.y)
        };
        var to = {
          x: byScale(fromRect.x - stageRect.current.x + portHalf - stageRect.current.width / 2) + byScale(stageState.translate.x),
          y: byScale(fromRect.y - stageRect.current.y + portHalf - stageRect.current.height / 2) + byScale(stageState.translate.y)
        };
        cnx.setAttribute("d", calculateCurve(from, to));
      });
    });
  };

  var updateNodeConnections = function updateNodeConnections() {
    if (connections) {
      updateConnectionsByTransput(connections.inputs);
      updateConnectionsByTransput(connections.outputs, true);
    }
  };

  var stopDrag = function stopDrag(e, coordinates) {
    nodesDispatch(_extends({
      type: "SET_NODE_COORDINATES"
    }, coordinates, {
      nodeId: id
    }));
  };

  var handleDrag = function handleDrag(_ref4) {
    var x = _ref4.x,
        y = _ref4.y;

    nodeWrapper.current.style.transform = "translate(" + x + "px," + y + "px)";
    updateNodeConnections();
  };

  var startDrag = function startDrag(e) {
    onDragStart();
  };

  var handleTitleContextMenu = function handleTitleContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    setMenuCoordinates({ x: e.clientX, y: e.clientY });
    setTitleMenuOpen(true);
    return false;
  };
  var closeTitleContextMenu = function closeTitleContextMenu() {
    setTitleMenuOpen(false);
  };

  var handleContextMenu = function handleContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    setMenuCoordinates({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
    return false;
  };

  var deleteNode = function deleteNode() {
    nodesDispatch({
      type: "REMOVE_NODE",
      nodeId: id
    });
  };

  var handleMenuOption = function handleMenuOption(_ref5) {
    var value = _ref5.value;

    switch (value) {
      case "deleteNode":
        deleteNode();
        break;
      default:
        return;
    }
  };

  // const onInfoCircleMouseMove = event => {
  //   const left = event.clientX + 20;
  //   const top = event.clientY + 10;
  //   if (tooltipRef && tooltipRef.current) {
  //     tooltipRef.current.style.left = left + "px";
  //     tooltipRef.current.style.top = top + "px";
  //     tooltipRef.current.style.translate = `translate(${x}px, ${y}px)`;
  //   }
  // };

  return React__default.createElement(
    Draggable,
    {
      className: styles$2.wrapper,
      style: {
        width: width,
        transform: "translate(" + x + "px, " + y + "px)"
      },
      onDragStart: startDrag,
      onDrag: handleDrag,
      onDragEnd: stopDrag,
      innerRef: nodeWrapper,
      "data-node-id": id,
      stageState: stageState,
      stageRect: stageRect,
      onContextMenu: handleContextMenu
    },
    React__default.createElement(
      "div",
      { className: styles$2.titleBar, onContextMenu: handleTitleContextMenu },
      React__default.createElement(
        "p",
        { className: styles$2.title },
        label
      ),
      deletable !== false ? React__default.createElement(
        "div",
        { className: styles$2.titleBarCloseIcon, onClick: deleteNode },
        React__default.createElement(FontAwesomeIcon, { icon: faTimes })
      ) : null
    ),
    React__default.createElement(IoPorts, {
      nodeId: id,
      inputs: inputs,
      outputs: outputs,
      connections: connections,
      updateNodeConnections: updateNodeConnections,
      inputData: inputData
    }),
    titleMenuOpen ? React__default.createElement(
      Portal$4,
      null,
      React__default.createElement(ContextMenu, {
        x: menuCoordinates.x,
        y: menuCoordinates.y,
        options: [{
          label: "Rename",
          value: "rename",
          description: "Renames the current node."
        }],
        onRequestClose: closeTitleContextMenu,
        onOptionSelected: handleMenuOption,
        hideFilter: true,
        label: label,
        description: description,
        emptyText: "This node has no options."
      })
    ) : null
  );
};

var css$a = ".Comment_wrapper__1Pnbd {\r\n  position: absolute;\r\n  left: 0px;\r\n  top: 0px;\r\n  padding: 5px;\r\n  background: rgba(147, 154, 158, 0.7);\r\n  border-radius: 5px;\r\n  border-bottom-right-radius: 2px;\r\n  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);\r\n  min-width: 80px;\r\n  font-size: 14px;\r\n  display: flex;\r\n  text-shadow: 0px 1px rgba(255,255,255,.1);\r\n  border: 1px solid rgba(168, 176, 181, 0.7);\r\n  user-select: none;\r\n}\r\n  .Comment_wrapper__1Pnbd[data-color=\"red\"]{\r\n    background: rgba(213, 84, 103, 0.65);\r\n    border-color: rgba(227, 85, 119, 0.65);\r\n  }\r\n  .Comment_wrapper__1Pnbd[data-color=\"purple\"]{\r\n    background: rgba(153, 83, 196, 0.65);\r\n    border-color: rgba(156, 85, 227, 0.65);\r\n  }\r\n  .Comment_wrapper__1Pnbd[data-color=\"blue\"]{\r\n    background: rgba(76, 142, 203, 0.65);\r\n    border-color: rgba(85, 159, 227, 0.65);\r\n  }\r\n  .Comment_wrapper__1Pnbd[data-color=\"green\"]{\r\n    background: rgba(70, 200, 130, 0.65);\r\n    border-color: rgba(85, 227, 150, 0.65);\r\n  }\r\n  .Comment_wrapper__1Pnbd[data-color=\"yellow\"]{\r\n    background: rgba(200, 167, 63, 0.65);\r\n    border-color: rgba(227, 213, 85, 0.65);\r\n  }\r\n  .Comment_wrapper__1Pnbd[data-color=\"orange\"]{\r\n    background: rgba(215, 123, 64, 0.65);\r\n    border-color: rgba(227, 149, 85, 0.65);\r\n  }\r\n  .Comment_wrapper__1Pnbd[data-color=\"pink\"]{\r\n    background: rgba(255, 102, 208, 0.65);\r\n    border-color: rgba(242, 131, 228, 0.65);\r\n  }\r\n.Comment_text__Ie2nX{\r\n  width: 100%;\r\n  height: 100%;\r\n  overflow: auto;\r\n  white-space: pre-wrap;\r\n  cursor: default;\r\n}\r\n.Comment_resizeThumb__20KWn {\r\n  width: 10px;\r\n  height: 10px;\r\n  border-radius: 4px 0px 4px 0px;\r\n  position: absolute;\r\n  right: 0px;\r\n  bottom: 0px;\r\n  overflow: hidden;\r\n  cursor: nwse-resize;\r\n}\r\n.Comment_resizeThumb__20KWn::before,\r\n  .Comment_resizeThumb__20KWn::after {\r\n    content: \"\";\r\n    position: absolute;\r\n    right: 0px;\r\n    top: 0px;\r\n    width: 250%;\r\n    height: 0px;\r\n    border-top: 1px solid rgba(0, 0, 0, 0.7);\r\n    border-bottom: 2px solid rgba(255, 255, 255, 0.7);\r\n    transform-origin: center right;\r\n    transform: rotate(-45deg) scale(0.5);\r\n  }\r\n.Comment_resizeThumb__20KWn::after {\r\n    transform: rotate(-45deg) translateY(3px) scale(0.5);\r\n  }\r\n.Comment_textarea__2Rze3 {\r\n  resize: none;\r\n  width: calc(100% + 2px);\r\n  height: calc(100% + 2px);\r\n  border-radius: 3px;\r\n  background: rgba(255,255,255,.1);\r\n  border: none;\r\n  outline: none;\r\n  margin: -2px;\r\n  margin-top: -1px;\r\n  padding-top: 0px;\r\n  font-size: 14px;\r\n}\r\n.Comment_textarea__2Rze3::placeholder{\r\n    color: rgba(0,0,0,.5);\r\n  }\r\n";
var styles$a = { "wrapper": "Comment_wrapper__1Pnbd", "text": "Comment_text__Ie2nX", "resizeThumb": "Comment_resizeThumb__20KWn", "textarea": "Comment_textarea__2Rze3" };
styleInject(css$a);

var css$b = ".ColorPicker_wrapper__1M1j2{\r\n  position: fixed;\r\n  z-index: 9999;\r\n  background: rgba(29, 32, 34, 0.95);\r\n  border-radius: 5px;\r\n  box-shadow: 0px 6px 7px rgba(0,0,0,.3);\r\n  border: 1px solid rgba(0,0,0,.4);\r\n  color: #fff;\r\n  display: flex;\r\n  width: 102px;\r\n  flex-wrap: wrap;\r\n  padding: 2px;\r\n}\r\n@supports (backdrop-filter: blur(6px)){\r\n  .ColorPicker_wrapper__1M1j2{\r\n    backdrop-filter: blur(6px);\r\n    background: rgba(29, 32, 34, 0.8);\r\n  }\r\n}\r\n.ColorPicker_colorButtonWrapper__1ijdj{\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  padding: 2px;\r\n}\r\n.ColorPicker_colorButton__1Qcuq{\r\n  border-radius: 3px;\r\n  border: none;\r\n  width: 20px;\r\n  height: 20px;\r\n  background: rgba(204, 204, 204, 1);\r\n}\r\n.ColorPicker_colorButton__1Qcuq[data-color=\"red\"]{\r\n    background: rgba(210, 101, 111, 1)\r\n  }\r\n.ColorPicker_colorButton__1Qcuq[data-color=\"purple\"]{\r\n    background: rgba(159, 101, 210, 1)\r\n  }\r\n.ColorPicker_colorButton__1Qcuq[data-color=\"blue\"]{\r\n    background: rgba(101, 151, 210, 1)\r\n  }\r\n.ColorPicker_colorButton__1Qcuq[data-color=\"green\"]{\r\n    background: rgba(101, 210, 168, 1)\r\n  }\r\n.ColorPicker_colorButton__1Qcuq[data-color=\"orange\"]{\r\n    background: rgba(210, 137, 101, 1)\r\n  }\r\n.ColorPicker_colorButton__1Qcuq[data-color=\"yellow\"]{\r\n    background: rgba(210, 196, 101, 1)\r\n  }\r\n.ColorPicker_colorButton__1Qcuq[data-color=\"pink\"]{\r\n    background: rgba(241, 124, 226, 1)\r\n  }\r\n.ColorPicker_colorButton__1Qcuq:hover{\r\n    opacity: .8;\r\n  }\r\n";
var styles$b = { "wrapper": "ColorPicker_wrapper__1M1j2", "colorButtonWrapper": "ColorPicker_colorButtonWrapper__1ijdj", "colorButton": "ColorPicker_colorButton__1Qcuq" };
styleInject(css$b);

var define = function define(value, defaultValue) {
  return value !== undefined ? value : defaultValue;
};

var buildControlType = function buildControlType(defaultConfig) {
  var validate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  var setup = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
    return {};
  };
  return function (config) {
    validate(config);
    return _extends({
      type: defaultConfig.type,
      label: define(config.label, defaultConfig.label || ""),
      name: define(config.name, defaultConfig.name || ""),
      defaultValue: define(config.defaultValue, defaultConfig.defaultValue),
      setValue: define(config.setValue, undefined)
    }, setup(config));
  };
};

var Controls = {
  text: buildControlType({
    type: "text",
    name: "text",
    defaultValue: ""
  }),
  select: buildControlType({
    type: "select",
    name: "select",
    options: [],
    defaultValue: ""
  }, function () {}, function (config) {
    return {
      options: define(config.options, []),
      getOptions: define(config.getOptions, undefined),
      placeholder: define(config.placeholder, undefined)
    };
  }),
  number: buildControlType({
    type: "number",
    name: "number",
    defaultValue: 0
  }, function () {}, function (config) {
    return {
      step: define(config.step, undefined)
    };
  }),
  checkbox: buildControlType({
    type: "checkbox",
    name: "checkbox",
    defaultValue: false
  }),
  multiselect: buildControlType({
    type: "multiselect",
    name: "multiselect",
    options: [],
    defaultValue: []
  }, function () {}, function (config) {
    return {
      options: define(config.options, []),
      getOptions: define(config.getOptions, undefined),
      placeholder: define(config.placeholder, undefined)
    };
  }),
  custom: buildControlType({
    type: "custom",
    name: "custom",
    render: function render() {},
    defaultValue: undefined
  }, function () {}, function (config) {
    return {
      render: define(config.render, function () {})
    };
  })
};

var Colors = {
  yellow: "yellow",
  orange: "orange",
  red: "red",
  pink: "pink",
  purple: "purple",
  blue: "blue",
  green: "green",
  grey: "grey"
};

var getPortBuilders = function getPortBuilders(ports) {
  return Object.values(ports).reduce(function (obj, port) {
    obj[port.type] = function () {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return {
        type: port.type,
        name: config.name || port.name,
        label: config.label || port.label,
        noControls: define(config.noControls, false),
        color: config.color || port.color,
        hidePort: define(config.hidePort, port.hidePort),
        controls: define(config.controls, port.controls)
      };
    };
    return obj;
  }, {});
};

var FlumeConfig = function () {
  function FlumeConfig(config) {
    classCallCheck(this, FlumeConfig);

    if (config) {
      this.nodeTypes = _extends({}, config.nodeTypes);
      this.portTypes = _extends({}, config.portTypes);
    } else {
      this.nodeTypes = {};
      this.portTypes = {};
    }
  }

  createClass(FlumeConfig, [{
    key: "addRootNodeType",
    value: function addRootNodeType(config) {
      this.addNodeType(_extends({}, config, {
        root: true,
        addable: false,
        deletable: false
      }));
      return this;
    }
  }, {
    key: "addNodeType",
    value: function addNodeType(config) {
      if ((typeof config === "undefined" ? "undefined" : _typeof(config)) !== "object" && config !== null) {
        throw new Error("You must provide a configuration object when calling addNodeType.");
      }
      if (typeof config.type !== "string") {
        throw new Error("Required key, \"type\" must be a string when calling addNodeType.");
      }
      if (typeof config.initialWidth !== "undefined" && typeof config.initialWidth !== "number") {
        throw new Error("Optional key, \"initialWidth\" must be a number when calling addNodeType.");
      }
      if (this.nodeTypes[config.type] !== undefined) {
        throw new Error("A node with type \"" + config.type + "\" has already been declared.");
      }
      var node = {
        type: config.type,
        label: define(config.label, ""),
        description: define(config.description, ""),
        addable: define(config.addable, true),
        deletable: define(config.deletable, true)
      };
      if (config.initialWidth) {
        node.initialWidth = config.initialWidth;
      }
      if (config.sortIndex !== undefined) {
        node.sortIndex = config.sortIndex;
      }
      if (typeof config.inputs === "function") {
        var inputs = config.inputs(getPortBuilders(this.portTypes));
        if (!Array.isArray(inputs) && typeof config.inputs !== 'function') {
          throw new Error("When providing a function to the \"inputs\" key, you must return either an array or a function.");
        }
        node.inputs = inputs;
      } else if (config.inputs === undefined) {
        node.inputs = [];
      } else if (!Array.isArray(config.inputs)) {
        throw new Error("Optional key, \"inputs\" must be an array.");
      } else {
        node.inputs = config.inputs;
      }

      if (typeof config.outputs === "function") {
        var outputs = config.outputs(getPortBuilders(this.portTypes));
        if (!Array.isArray(outputs) && typeof config.outputs !== 'function') {
          throw new Error("When providing a function to the \"outputs\" key, you must return either an array or a function.");
        }
        node.outputs = outputs;
      } else if (config.outputs === undefined) {
        node.outputs = [];
      } else if (config.outputs !== undefined && !Array.isArray(config.outputs)) {
        throw new Error("Optional key, \"outputs\" must be an array.");
      } else {
        node.outputs = config.outputs;
      }

      if (config.root !== undefined) {
        if (typeof config.root !== "boolean") {
          throw new Error("Optional key, \"root\" must be a boolean.");
        } else {
          node.root = config.root;
        }
      }

      this.nodeTypes[config.type] = node;
      return this;
    }
  }, {
    key: "removeNodeType",
    value: function removeNodeType(type) {
      if (!this.nodeTypes[type]) {
        console.error("Non-existent node type \"" + type + "\" cannot be removed.");
      } else {
        var _nodeTypes = this.nodeTypes,
            deleted = _nodeTypes[type],
            nodeTypes = objectWithoutProperties(_nodeTypes, [type]);

        this.nodeTypes = nodeTypes;
      }
      return this;
    }
  }, {
    key: "addPortType",
    value: function addPortType(config) {
      if ((typeof config === "undefined" ? "undefined" : _typeof(config)) !== "object" && config !== null) {
        throw new Error("You must provide a configuration object when calling addPortType");
      }
      if (typeof config.type !== "string") {
        throw new Error("Required key, \"type\" must be a string when calling addPortType.");
      }
      if (this.portTypes[config.type] !== undefined) {
        throw new Error("A port with type \"" + config.type + "\" has already been declared.");
      }
      if (typeof config.name !== "string") {
        throw new Error("Required key, \"name\" must be a string when calling addPortType.");
      }

      var port = {
        type: config.type,
        name: config.name,
        label: define(config.label, ""),
        color: define(config.color, Colors.grey),
        hidePort: define(config.hidePort, false)
      };

      if (config.acceptTypes === undefined) {
        port.acceptTypes = [config.type];
      } else if (!Array.isArray(config.acceptTypes)) {
        throw new Error("Optional key, \"acceptTypes\" must be an array.");
      } else {
        port.acceptTypes = config.acceptTypes;
      }

      if (config.controls === undefined) {
        port.controls = [];
      } else if (!Array.isArray(config.controls)) {
        throw new Error("Optional key, \"controls\" must be an array.");
      } else {
        port.controls = config.controls;
      }

      this.portTypes[config.type] = port;
      return this;
    }
  }, {
    key: "removePortType",
    value: function removePortType(type) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$skipDynamicNodes = _ref.skipDynamicNodesCheck,
          skipDynamicNodesCheck = _ref$skipDynamicNodes === undefined ? false : _ref$skipDynamicNodes;

      if (!this.portTypes[type]) {
        console.error("Non-existent port type \"" + type + "\" cannot be removed.");
      } else {
        if (!skipDynamicNodesCheck) {
          var dynamicNodes = Object.values(this.nodeTypes).filter(function (node) {
            return typeof node.inputs === 'function' || typeof node.outputs === 'function';
          });
          if (dynamicNodes.length) {
            console.warn("We've detected that one or more of your nodes is using dynamic inputs/outputs. This is a potentially dangerous operation as we are unable to detect if this portType is being used in one of those nodes. You can quiet this message by passing { skipDynamicNodesCheck: true } in as the second argument.");
          }
        }
        var affectedNodes = Object.values(this.nodeTypes).filter(function (node) {
          return Array.isArray(node.inputs) && node.inputs.find(function (p) {
            return p.type === type;
          }) || Array.isArray(node.outputs) && node.outputs.find(function (p) {
            return p.type === type;
          });
        });
        if (affectedNodes.length) {
          throw new Error("Cannot delete port type \"" + type + "\" without first deleting all node types using these ports: [" + affectedNodes.map(function (n) {
            return "" + n.type;
          }).join(", ") + "]");
        } else {
          var _portTypes = this.portTypes,
              deleted = _portTypes[type],
              portTypes = objectWithoutProperties(_portTypes, [type]);

          this.portTypes = portTypes;
        }
      }
      return this;
    }
  }]);
  return FlumeConfig;
}();

var ColorPicker = (function (_ref) {
  var x = _ref.x,
      y = _ref.y,
      onColorPicked = _ref.onColorPicked,
      onRequestClose = _ref.onRequestClose;

  var wrapper = React__default.useRef();

  var testClickOutside = React__default.useCallback(function (e) {
    if (!wrapper.current.contains(e.target)) {
      onRequestClose();
      document.removeEventListener("click", testClickOutside);
      document.removeEventListener("contextmenu", testClickOutside);
    }
  }, [wrapper, onRequestClose]);

  var testEscape = React__default.useCallback(function (e) {
    if (e.keyCode === 27) {
      onRequestClose();
      document.removeEventListener("keydown", testEscape);
    }
  }, [onRequestClose]);

  React__default.useEffect(function () {
    document.addEventListener("keydown", testEscape);
    document.addEventListener("click", testClickOutside);
    document.addEventListener("contextmenu", testClickOutside);
    return function () {
      document.removeEventListener("click", testClickOutside);
      document.removeEventListener("contextmenu", testClickOutside);
      document.removeEventListener("keydown", testEscape);
    };
  }, [testClickOutside, testEscape]);

  return React__default.createElement(
    "div",
    {
      ref: wrapper,
      className: styles$b.wrapper,
      style: {
        left: x,
        top: y
      }
    },
    Object.values(Colors).map(function (color) {
      return React__default.createElement(ColorButton, {
        onSelected: function onSelected() {
          onColorPicked(color);
          onRequestClose();
        },
        color: color,
        key: color
      });
    })
  );
});

var ColorButton = function ColorButton(_ref2) {
  var color = _ref2.color,
      onSelected = _ref2.onSelected;
  return React__default.createElement(
    "div",
    { className: styles$b.colorButtonWrapper },
    React__default.createElement("button", {
      className: styles$b.colorButton,
      onClick: onSelected,
      "data-color": color,
      "aria-label": color
    })
  );
};

var Comment = (function (_ref) {
  var dispatch = _ref.dispatch,
      id = _ref.id,
      x = _ref.x,
      y = _ref.y,
      width = _ref.width,
      height = _ref.height,
      color = _ref.color,
      text = _ref.text,
      stageRect = _ref.stageRect,
      onDragStart = _ref.onDragStart,
      isNew = _ref.isNew;

  var stageState = React__default.useContext(StageContext);
  var wrapper = React__default.useRef();
  var textarea = React__default.useRef();

  var _React$useState = React__default.useState(false),
      _React$useState2 = slicedToArray(_React$useState, 2),
      isEditing = _React$useState2[0],
      setIsEditing = _React$useState2[1];

  var _React$useState3 = React__default.useState(false),
      _React$useState4 = slicedToArray(_React$useState3, 2),
      isPickingColor = _React$useState4[0],
      setIsPickingColor = _React$useState4[1];

  var _React$useState5 = React__default.useState(false),
      _React$useState6 = slicedToArray(_React$useState5, 2),
      menuOpen = _React$useState6[0],
      setMenuOpen = _React$useState6[1];

  var _React$useState7 = React__default.useState({ x: 0, y: 0 }),
      _React$useState8 = slicedToArray(_React$useState7, 2),
      menuCoordinates = _React$useState8[0],
      setMenuCoordinates = _React$useState8[1];

  var _React$useState9 = React__default.useState({
    x: 0,
    y: 0
  }),
      _React$useState10 = slicedToArray(_React$useState9, 2),
      colorPickerCoordinates = _React$useState10[0],
      setColorPickerCoordinates = _React$useState10[1];

  var handleContextMenu = function handleContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    setMenuCoordinates({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
    return false;
  };

  var closeContextMenu = function closeContextMenu() {
    return setMenuOpen(false);
  };

  var startDrag = function startDrag(e) {
    onDragStart();
  };

  var handleDrag = function handleDrag(_ref2) {
    var x = _ref2.x,
        y = _ref2.y;

    wrapper.current.style.transform = "translate(" + x + "px," + y + "px)";
  };

  var handleDragEnd = function handleDragEnd(_, _ref3) {
    var x = _ref3.x,
        y = _ref3.y;

    dispatch({
      type: "SET_COMMENT_COORDINATES",
      id: id,
      x: x,
      y: y
    });
  };

  var handleResize = function handleResize(coordinates) {
    var width = clamp_1(coordinates.x - x + 10, 80, 10000);
    var height = clamp_1(coordinates.y - y + 10, 30, 10000);
    wrapper.current.style.width = width + "px";
    wrapper.current.style.height = height + "px";
  };

  var handleResizeEnd = function handleResizeEnd(_, coordinates) {
    var width = clamp_1(coordinates.x - x + 10, 80, 10000);
    var height = clamp_1(coordinates.y - y + 10, 30, 10000);
    dispatch({
      type: "SET_COMMENT_DIMENSIONS",
      id: id,
      width: width,
      height: height
    });
  };

  var handleMenuOption = function handleMenuOption(option, e) {
    switch (option.value) {
      case "edit":
        startTextEdit();
        break;
      case "color":
        setColorPickerCoordinates(menuCoordinates);
        setIsPickingColor(true);
        break;
      case "delete":
        dispatch({
          type: "DELETE_COMMENT",
          id: id
        });
        break;
      default:
    }
  };

  var startTextEdit = function startTextEdit() {
    setIsEditing(true);
  };

  var endTextEdit = function endTextEdit() {
    setIsEditing(false);
  };

  var handleTextChange = function handleTextChange(e) {
    dispatch({
      type: "SET_COMMENT_TEXT",
      id: id,
      text: e.target.value
    });
  };

  var handleColorPicked = function handleColorPicked(color) {
    dispatch({
      type: "SET_COMMENT_COLOR",
      id: id,
      color: color
    });
  };

  React__default.useEffect(function () {
    if (isNew) {
      setIsEditing(true);
      dispatch({
        type: "REMOVE_COMMENT_NEW",
        id: id
      });
    }
  }, [isNew, dispatch, id]);

  return React__default.createElement(
    Draggable,
    {
      innerRef: wrapper,
      className: styles$a.wrapper,
      style: {
        transform: "translate(" + x + "px," + y + "px)",
        width: width,
        height: height,
        zIndex: isEditing ? 999 : ""
      },
      stageState: stageState,
      stageRect: stageRect,
      onDragStart: startDrag,
      onDrag: handleDrag,
      onDragEnd: handleDragEnd,
      onContextMenu: handleContextMenu,
      onDoubleClick: startTextEdit,
      onWheel: function onWheel(e) {
        return e.stopPropagation();
      },
      "data-color": color
    },
    isEditing ? React__default.createElement("textarea", {
      className: styles$a.textarea,
      onChange: handleTextChange,
      onMouseDown: function onMouseDown(e) {
        return e.stopPropagation();
      },
      onBlur: endTextEdit,
      placeholder: "Text of the comment...",
      autoFocus: true,
      value: text,
      ref: textarea
    }) : React__default.createElement(
      "div",
      { "data-comment": true, className: styles$a.text },
      text
    ),
    React__default.createElement(Draggable, {
      className: styles$a.resizeThumb,
      stageState: stageState,
      stageRect: stageRect,
      onDrag: handleResize,
      onDragEnd: handleResizeEnd
    }),
    menuOpen ? React__default.createElement(
      Portal$4,
      null,
      React__default.createElement(ContextMenu, {
        hideFilter: true,
        label: "Comment Options",
        x: menuCoordinates.x,
        y: menuCoordinates.y,
        options: [{
          value: "edit",
          label: "Edit Comment",
          description: "Edit the text of the comment"
        }, {
          value: "color",
          label: "Change Color",
          description: "Change the color of the comment"
        }, {
          value: "delete",
          label: "Delete Comment",
          description: "Delete the comment"
        }],
        onRequestClose: closeContextMenu,
        onOptionSelected: handleMenuOption
      })
    ) : null,
    isPickingColor ? React__default.createElement(
      Portal$4,
      null,
      React__default.createElement(ColorPicker, {
        x: colorPickerCoordinates.x,
        y: colorPickerCoordinates.y,
        onRequestClose: function onRequestClose() {
          return setIsPickingColor(false);
        },
        onColorPicked: handleColorPicked
      })
    ) : null
  );
});

var css$c = ".Toaster_toaster__1eC3T{\r\n  position: absolute;\r\n  left: 0px;\r\n  bottom: 0px;\r\n  width: 100%;\r\n  height: 1px;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  padding-bottom: 15px;\r\n  box-shadow: 0px 5px 10px -2px rgba(0,0,0,.3);\r\n  pointer-events: none;\r\n}\r\n.Toaster_toast__3YHVS{\r\n  position: absolute;\r\n  left: calc(50% - 200px);\r\n  top: 0px;\r\n  pointer-events: all;\r\n  width: 400px;\r\n  padding: 10px;\r\n  padding-top: 7px;\r\n  padding-right: 16px;\r\n  border-radius: 6px;\r\n  background: rgba(231, 231, 231, 1);\r\n  border: 1px solid;\r\n  margin-bottom: 5px;\r\n  transition: transform 300ms;\r\n  flex: 0 0 auto;\r\n  animation: Toaster_fade-in__2526Y 150ms;\r\n  user-select: none;\r\n  font-size: 14px;\r\n  display: flex;\r\n  flex-direction: column;\r\n  will-change: transform;\r\n}\r\n.Toaster_toast__3YHVS[data-type=\"danger\"]{\r\n    background: rgb(255, 116, 137);\r\n    border-color: rgb(254, 99, 136);\r\n    color: rgb(66, 6, 20);\r\n  }\r\n.Toaster_toast__3YHVS[data-type=\"info\"]{\r\n    background: rgb(76, 193, 250);\r\n    border-color: rgb(103, 182, 255);\r\n    color: rgb(5, 36, 64);\r\n  }\r\n.Toaster_toast__3YHVS[data-type=\"success\"]{\r\n    background: rgb(81, 230, 150);\r\n    border-color: rgb(85, 227, 150);\r\n    color: rgb(7, 57, 30);\r\n  }\r\n.Toaster_toast__3YHVS[data-type=\"warning\"]{\r\n    background: rgb(245, 208, 93);\r\n    border-color: rgb(247, 235, 125);\r\n    color: rgb(83, 75, 8);\r\n  }\r\n.Toaster_toast__3YHVS[data-exiting=true]{\r\n    animation: Toaster_fade-out__2lM6E 150ms;\r\n    animation-fill-mode: forwards;\r\n  }\r\n.Toaster_toast__3YHVS p{\r\n  margin: 0px;\r\n}\r\n.Toaster_title__4InNr{\r\n  font-size: 16px;\r\n  font-weight: bold;\r\n  margin-bottom: 5px;\r\n}\r\n.Toaster_timer__3dGzF{\r\n  position: absolute;\r\n  bottom: -1px;\r\n  left: -1px;\r\n  width: calc(100% + 2px);\r\n  height: 3px;\r\n  background: rgba(0,0,0,.4);\r\n  transform-origin: left center;\r\n  animation: Toaster_timer__3dGzF 1000ms linear;\r\n  animation-fill-mode: forwards;\r\n  z-index: 9;\r\n}\r\n.Toaster_exitButton__1S_Ks{\r\n  position: absolute;\r\n  right: 0px;\r\n  top: 0px;\r\n  width: 20px;\r\n  height: 20px;\r\n  padding: 0px;\r\n  background: none;\r\n  border: none;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  font-size: 14px;\r\n  color: inherit;\r\n  opacity: .6;\r\n}\r\n.Toaster_exitButton__1S_Ks:hover{\r\n  opacity: .9;\r\n}\r\n\r\n@keyframes Toaster_fade-in__2526Y {\r\n  from{\r\n    opacity: 0;\r\n  }\r\n  to{\r\n    opacity: 1;\r\n  }\r\n}\r\n\r\n@keyframes Toaster_fade-out__2lM6E {\r\n  from{\r\n    opacity: 1;\r\n  }\r\n  to{\r\n    opacity: 0;\r\n  }\r\n}\r\n\r\n@keyframes Toaster_timer__3dGzF {\r\n  from{\r\n    transform: scaleX(1);\r\n  }\r\n  to{\r\n    transform: scaleX(0);\r\n  }\r\n}\r\n";
var styles$c = { "toaster": "Toaster_toaster__1eC3T", "toast": "Toaster_toast__3YHVS", "fade-in": "Toaster_fade-in__2526Y", "fade-out": "Toaster_fade-out__2lM6E", "title": "Toaster_title__4InNr", "timer": "Toaster_timer__3dGzF", "exitButton": "Toaster_exitButton__1S_Ks" };
styleInject(css$c);

var Toaster = (function (_ref) {
  var _ref$toasts = _ref.toasts,
      toasts = _ref$toasts === undefined ? [] : _ref$toasts,
      dispatchToasts = _ref.dispatchToasts;

  var setHeight = React__default.useCallback(function (id, height) {
    dispatchToasts({
      type: "SET_HEIGHT",
      id: id,
      height: height
    });
  }, [dispatchToasts]);

  var startExit = React__default.useCallback(function (id) {
    dispatchToasts({
      type: "SET_EXITING",
      id: id
    });
  }, [dispatchToasts]);

  var removeToast = React__default.useCallback(function (id) {
    dispatchToasts({
      type: "REMOVE_TOAST",
      id: id
    });
  }, [dispatchToasts]);

  return React__default.createElement(
    "div",
    { className: styles$c.toaster },
    toasts.map(function (toast, i) {
      return React__default.createElement(Toast, _extends({}, toast, {
        onHeightReceived: setHeight,
        onExitRequested: startExit,
        onRemoveRequested: removeToast,
        y: toasts.slice(0, i + 1).reduce(function (y, t) {
          return t.height + y + 5;
        }, 0),
        key: toast.id
      }));
    })
  );
});

var Toast = function Toast(_ref2) {
  var id = _ref2.id,
      title = _ref2.title,
      message = _ref2.message,
      duration = _ref2.duration,
      type = _ref2.type,
      exiting = _ref2.exiting,
      y = _ref2.y,
      onHeightReceived = _ref2.onHeightReceived,
      onExitRequested = _ref2.onExitRequested,
      onRemoveRequested = _ref2.onRemoveRequested;

  var _React$useState = React__default.useState(false),
      _React$useState2 = slicedToArray(_React$useState, 2),
      paused = _React$useState2[0],
      setPaused = _React$useState2[1];

  var wrapper = React__default.useRef();
  var timer = React__default.useRef();

  var stopTimer = React__default.useCallback(function () {
    setPaused(true);
    clearTimeout(timer.current);
  }, []);

  var resumeTimer = React__default.useCallback(function () {
    setPaused(false);
    timer.current = setTimeout(function () {
      return onExitRequested(id);
    }, duration);
  }, [id, duration, onExitRequested]);

  React__default.useLayoutEffect(function () {
    var _wrapper$current$getB = wrapper.current.getBoundingClientRect(),
        height = _wrapper$current$getB.height;

    onHeightReceived(id, height);
  }, [onHeightReceived, id]);

  React__default.useEffect(function () {
    resumeTimer();
    return stopTimer;
  }, [resumeTimer, stopTimer]);

  var handleAnimationEnd = function handleAnimationEnd() {
    if (exiting) {
      onRemoveRequested(id);
    }
  };

  return React__default.createElement(
    "div",
    {
      ref: wrapper,
      className: styles$c.toast,
      "data-type": type,
      style: { transform: "translateY(-" + y + "px)" },
      "data-exiting": exiting,
      onAnimationEnd: handleAnimationEnd,
      onMouseEnter: stopTimer,
      onMouseLeave: resumeTimer,
      role: "alert"
    },
    title ? React__default.createElement(
      "span",
      { className: styles$c.title },
      title
    ) : null,
    React__default.createElement(
      "p",
      null,
      message
    ),
    !paused && React__default.createElement("div", {
      className: styles$c.timer,
      style: { animationDuration: duration + "ms" },
      onAnimationEnd: function onAnimationEnd(e) {
        return e.stopPropagation();
      }
    }),
    React__default.createElement(
      "button",
      { className: styles$c.exitButton, onClick: function onClick() {
          stopTimer();
          onExitRequested(id);
        } },
      "\u2715"
    )
  );
};

var css$d = ".Connections_svgWrapper__3mXcU{\r\n  position: absolute;\r\n  left: 0px;\r\n  height: 0px;\r\n}\r\n";
var styles$d = { "svgWrapper": "Connections_svgWrapper__3mXcU" };
styleInject(css$d);

var Connections = function Connections(_ref) {
  var nodes = _ref.nodes,
      editorId = _ref.editorId;


  return React__default.createElement('div', { className: styles$d.svgWrapper, id: '' + CONNECTIONS_ID + editorId });
};

var checkForCircularNodes = function checkForCircularNodes(nodes, startNodeId) {
  var isCircular = false;
  var walk = function walk(nodeId) {
    var outputs = Object.values(nodes[nodeId].connections.outputs);
    for (var i = 0; i < outputs.length; i++) {
      if (isCircular) {
        break;
      }
      var outputConnections = outputs[i];
      for (var k = 0; k < outputConnections.length; k++) {
        var connectedTo = outputConnections[k];
        if (connectedTo.nodeId === startNodeId) {
          isCircular = true;
          break;
        } else {
          walk(connectedTo.nodeId);
        }
      }
    }
  };
  walk(startNodeId);
  return isCircular;
};

var addConnection = function addConnection(nodes, input, output, portTypes) {
  var _babelHelpers$extends3;

  var newNodes = _extends({}, nodes, (_babelHelpers$extends3 = {}, defineProperty(_babelHelpers$extends3, input.nodeId, _extends({}, nodes[input.nodeId], {
    connections: _extends({}, nodes[input.nodeId].connections, {
      inputs: _extends({}, nodes[input.nodeId].connections.inputs, defineProperty({}, input.portName, [].concat(toConsumableArray(nodes[input.nodeId].connections.inputs[input.portName] || []), [{
        nodeId: output.nodeId,
        portName: output.portName
      }])))
    })
  })), defineProperty(_babelHelpers$extends3, output.nodeId, _extends({}, nodes[output.nodeId], {
    connections: _extends({}, nodes[output.nodeId].connections, {
      outputs: _extends({}, nodes[output.nodeId].connections.outputs, defineProperty({}, output.portName, [].concat(toConsumableArray(nodes[output.nodeId].connections.outputs[output.portName] || []), [{
        nodeId: input.nodeId,
        portName: input.portName
      }])))
    })
  })), _babelHelpers$extends3));
  return newNodes;
};

var removeConnection = function removeConnection(nodes, input, output) {
  var _babelHelpers$extends5;

  var inputNode = nodes[input.nodeId];
  var _inputNode$connection = inputNode.connections.inputs,
      removedInputPort = _inputNode$connection[input.portName],
      newInputNodeConnectionsInputs = objectWithoutProperties(_inputNode$connection, [input.portName]);

  var newInputNode = _extends({}, inputNode, {
    connections: _extends({}, inputNode.connections, {
      inputs: newInputNodeConnectionsInputs
    })
  });

  var outputNode = nodes[output.nodeId];
  var filteredOutputNodes = outputNode.connections.outputs[output.portName].filter(function (cnx) {
    return cnx.nodeId === input.nodeId ? cnx.portName !== input.portName : true;
  });
  var newOutputNode = _extends({}, outputNode, {
    connections: _extends({}, outputNode.connections, {
      outputs: _extends({}, outputNode.connections.outputs, defineProperty({}, output.portName, filteredOutputNodes))
    })
  });

  return _extends({}, nodes, (_babelHelpers$extends5 = {}, defineProperty(_babelHelpers$extends5, input.nodeId, newInputNode), defineProperty(_babelHelpers$extends5, output.nodeId, newOutputNode), _babelHelpers$extends5));
};

var getFilteredTransputs = function getFilteredTransputs(transputs, nodeId) {
  return Object.entries(transputs).reduce(function (obj, _ref) {
    var _ref2 = slicedToArray(_ref, 2),
        portName = _ref2[0],
        transput = _ref2[1];

    var newTransputs = transput.filter(function (t) {
      return t.nodeId !== nodeId;
    });
    if (newTransputs.length) {
      obj[portName] = newTransputs;
    }
    return obj;
  }, {});
};

var removeConnections = function removeConnections(connections, nodeId) {
  return {
    inputs: getFilteredTransputs(connections.inputs, nodeId),
    outputs: getFilteredTransputs(connections.outputs, nodeId)
  };
};

var removeNode = function removeNode(startNodes, nodeId) {
  var deletedNode = startNodes[nodeId],
      nodes = objectWithoutProperties(startNodes, [nodeId]);

  nodes = Object.values(nodes).reduce(function (obj, node) {
    obj[node.id] = _extends({}, node, {
      connections: removeConnections(node.connections, nodeId)
    });

    return obj;
  }, {});
  deleteConnectionsByNodeId(nodeId);
  return nodes;
};

var reconcileNodes = function reconcileNodes(initialNodes, nodeTypes, portTypes, context) {
  var nodes = _extends({}, initialNodes);

  // Delete extraneous nodes
  var nodesToDelete = Object.values(nodes).map(function (node) {
    return !nodeTypes[node.type] ? node.id : undefined;
  }).filter(function (x) {
    return x;
  });

  nodesToDelete.forEach(function (nodeId) {
    nodes = nodesReducer(nodes, {
      type: "REMOVE_NODE",
      nodeId: nodeId
    }, { nodeTypes: nodeTypes, portTypes: portTypes, context: context });
  });

  // Reconcile input data for each node
  var reconciledNodes = Object.values(nodes).reduce(function (nodesObj, node) {
    var nodeType = nodeTypes[node.type];
    var defaultInputData = getDefaultData({ node: node, nodeType: nodeType, portTypes: portTypes, context: context });
    var currentInputData = Object.entries(node.inputData).reduce(function (dataObj, _ref3) {
      var _ref4 = slicedToArray(_ref3, 2),
          key = _ref4[0],
          data = _ref4[1];

      if (defaultInputData[key] !== undefined) {
        dataObj[key] = data;
      }
      return dataObj;
    }, {});
    var newInputData = _extends({}, defaultInputData, currentInputData);
    nodesObj[node.id] = _extends({}, node, {
      inputData: newInputData
    });
    return nodesObj;
  }, {});

  // Reconcile node attributes for each node
  reconciledNodes = Object.values(reconciledNodes).reduce(function (nodesObj, node) {
    var newNode = _extends({}, node);
    var nodeType = nodeTypes[node.type];
    if (nodeType.root !== node.root) {
      if (nodeType.root && !node.root) {
        newNode.root = nodeType.root;
      } else if (!nodeType.root && node.root) {
        delete newNode.root;
      }
    }
    nodesObj[node.id] = newNode;
    return nodesObj;
  }, {});

  return reconciledNodes;
};

var getInitialNodes = function getInitialNodes() {
  var initialNodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaultNodes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var nodeTypes = arguments[2];
  var portTypes = arguments[3];
  var context = arguments[4];

  var reconciledNodes = reconcileNodes(initialNodes, nodeTypes, portTypes, context);

  return _extends({}, reconciledNodes, defaultNodes.reduce(function (nodes, dNode, i) {
    var nodeNotAdded = !Object.values(initialNodes).find(function (n) {
      return n.type === dNode.type;
    });
    if (nodeNotAdded) {
      nodes = nodesReducer(nodes, {
        type: "ADD_NODE",
        id: "default-" + i,
        defaultNode: true,
        x: dNode.x || 0,
        y: dNode.y || 0,
        nodeType: dNode.type
      }, { nodeTypes: nodeTypes, portTypes: portTypes, context: context });
    }
    return nodes;
  }, {}));
};

var getDefaultData = function getDefaultData(_ref5) {
  var node = _ref5.node,
      nodeType = _ref5.nodeType,
      portTypes = _ref5.portTypes,
      context = _ref5.context;

  var inputs = Array.isArray(nodeType.inputs) ? nodeType.inputs : nodeType.inputs(node.inputData, node.connections, context);
  return inputs.reduce(function (obj, input) {
    var inputType = portTypes[input.type];
    obj[input.name || inputType.name] = (input.controls || inputType.controls || []).reduce(function (obj2, control) {
      obj2[control.name] = control.defaultValue;
      return obj2;
    }, {});
    return obj;
  }, {});
};

var nodesReducer = function nodesReducer(nodes) {
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _ref6 = arguments[2];
  var nodeTypes = _ref6.nodeTypes,
      portTypes = _ref6.portTypes,
      cache = _ref6.cache,
      circularBehavior = _ref6.circularBehavior,
      context = _ref6.context;
  var dispatchToasts = arguments[3];

  switch (action.type) {
    case "ADD_CONNECTION":
      {
        var input = action.input,
            output = action.output;

        var inputIsNotConnected = !nodes[input.nodeId].connections.inputs[input.portName];
        if (inputIsNotConnected) {
          var allowCircular = circularBehavior === "warn" || circularBehavior === "allow";
          var newNodes = addConnection(nodes, input, output, portTypes);
          var isCircular = checkForCircularNodes(newNodes, output.nodeId);
          if (isCircular && !allowCircular) {
            dispatchToasts({
              type: "ADD_TOAST",
              title: "Unable to connect",
              message: "Connecting these nodes would result in an infinite loop.",
              toastType: "warning",
              duration: 5000
            });
            return nodes;
          } else {
            if (isCircular && circularBehavior === "warn") {
              dispatchToasts({
                type: "ADD_TOAST",
                title: "Circular Connection Detected",
                message: "Connecting these nodes has created an infinite loop.",
                toastType: "warning",
                duration: 5000
              });
            }
            return newNodes;
          }
        } else return nodes;
      }

    case "REMOVE_CONNECTION":
      {
        var _input = action.input,
            _output = action.output;

        var id = _output.nodeId + _output.portName + _input.nodeId + _input.portName;
        delete cache.current.connections[id];
        deleteConnection({ id: id });
        return removeConnection(nodes, _input, _output);
      }

    case "DESTROY_TRANSPUT":
      {
        var transput = action.transput,
            transputType = action.transputType;

        var portId = transput.nodeId + transput.portName + transputType;
        delete cache.current.ports[portId];

        var cnxType = transputType === 'input' ? 'inputs' : 'outputs';
        var connections = nodes[transput.nodeId].connections[cnxType][transput.portName];
        if (!connections || !connections.length) return nodes;

        return connections.reduce(function (nodes, cnx) {
          var _ref7 = transputType === 'input' ? [transput, cnx] : [cnx, transput],
              _ref8 = slicedToArray(_ref7, 2),
              input = _ref8[0],
              output = _ref8[1];

          var id = output.nodeId + output.portName + input.nodeId + input.portName;
          delete cache.current.connections[id];
          deleteConnection({ id: id });
          return removeConnection(nodes, input, output);
        }, nodes);
      }

    case "ADD_NODE":
      {
        var x = action.x,
            y = action.y,
            nodeType = action.nodeType,
            _id = action.id,
            defaultNode = action.defaultNode;

        var newNodeId = _id || nonSecure(10);
        var newNode = {
          id: newNodeId,
          x: x,
          y: y,
          type: nodeType,
          width: nodeTypes[nodeType].initialWidth || 200,
          connections: {
            inputs: {},
            outputs: {}
          },
          inputData: {}
        };
        newNode.inputData = getDefaultData({
          node: newNode,
          nodeType: nodeTypes[nodeType],
          portTypes: portTypes,
          context: context
        });
        if (defaultNode) {
          newNode.defaultNode = true;
        }
        if (nodeTypes[nodeType].root) {
          newNode.root = true;
        }
        return _extends({}, nodes, defineProperty({}, newNodeId, newNode));
      }

    case "REMOVE_NODE":
      {
        var nodeId = action.nodeId;

        return removeNode(nodes, nodeId);
      }

    case "HYDRATE_DEFAULT_NODES":
      {
        var _newNodes = _extends({}, nodes);
        for (var key in _newNodes) {
          if (_newNodes[key].defaultNode) {
            var _newNodeId = nonSecure(10);
            var _newNodes$key = _newNodes[key],
                _id2 = _newNodes$key.id,
                _defaultNode = _newNodes$key.defaultNode,
                node = objectWithoutProperties(_newNodes$key, ["id", "defaultNode"]);

            _newNodes[_newNodeId] = _extends({}, node, { id: _newNodeId });
            delete _newNodes[key];
          }
        }
        return _newNodes;
      }

    case "SET_PORT_DATA":
      {
        var _nodeId = action.nodeId,
            portName = action.portName,
            controlName = action.controlName,
            data = action.data,
            setValue = action.setValue;

        var newData = _extends({}, nodes[_nodeId].inputData, defineProperty({}, portName, _extends({}, nodes[_nodeId].inputData[portName], defineProperty({}, controlName, data))));
        if (setValue) {
          newData = setValue(newData, nodes[_nodeId].inputData);
        }
        return _extends({}, nodes, defineProperty({}, _nodeId, _extends({}, nodes[_nodeId], {
          inputData: newData
        })));
      }

    case "SET_NODE_COORDINATES":
      {
        var _x4 = action.x,
            _y = action.y,
            _nodeId2 = action.nodeId;

        return _extends({}, nodes, defineProperty({}, _nodeId2, _extends({}, nodes[_nodeId2], {
          x: _x4,
          y: _y
        })));
      }

    default:
      return nodes;
  }
};

var connectNodesReducer = function connectNodesReducer(reducer, environment, dispatchToasts) {
  return function (state, action) {
    return reducer(state, action, environment, dispatchToasts);
  };
};

var setComment = function setComment(comments, id, merge) {
  return _extends({}, comments, defineProperty({}, id, _extends({}, comments[id], merge)));
};

var commentsReducer = (function () {
  var comments = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case "ADD_COMMENT":
      {
        var _comment = {
          id: nonSecure(10),
          text: "",
          x: action.x,
          y: action.y,
          width: 200,
          height: 30,
          color: "blue",
          isNew: true
        };
        return _extends({}, comments, defineProperty({}, _comment.id, _comment));
      }
    case "REMOVE_COMMENT_NEW":
      var _comments$action$id = comments[action.id],
          toDelete = _comments$action$id.isNew,
          comment = objectWithoutProperties(_comments$action$id, ["isNew"]);

      return _extends({}, comments, defineProperty({}, action.id, comment));
    case "SET_COMMENT_COORDINATES":
      {
        return setComment(comments, action.id, { x: action.x, y: action.y });
      }
    case "SET_COMMENT_DIMENSIONS":
      {
        return setComment(comments, action.id, {
          width: action.width,
          height: action.height
        });
      }
    case "SET_COMMENT_TEXT":
      {
        return setComment(comments, action.id, { text: action.text });
      }
    case "SET_COMMENT_COLOR":
      {
        return setComment(comments, action.id, { color: action.color });
      }
    case "DELETE_COMMENT":
      {
        var _toDelete = comments[action.id],
            newComments = objectWithoutProperties(comments, [action.id]);

        return newComments;
      }
    default:
      return comments;
  }
});

var toastsReducer = (function () {
  var toasts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  switch (action.type) {
    case "ADD_TOAST":
      return [{
        id: nonSecure(5),
        title: action.title,
        message: action.message,
        type: action.toastType || 'info',
        duration: action.duration || 10000,
        height: 0,
        exiting: false
      }].concat(toConsumableArray(toasts));
    case "SET_HEIGHT":
      {
        var index = toasts.findIndex(function (t) {
          return t.id === action.id;
        });
        return [].concat(toConsumableArray(toasts.slice(0, index)), [_extends({}, toasts[index], {
          height: action.height
        })], toConsumableArray(toasts.slice(index + 1)));
      }
    case "SET_EXITING":
      {
        var _index = toasts.findIndex(function (t) {
          return t.id === action.id;
        });
        return [].concat(toConsumableArray(toasts.slice(0, _index)), [_extends({}, toasts[_index], {
          exiting: true
        })], toConsumableArray(toasts.slice(_index + 1)));
      }
    case "REMOVE_TOAST":
      {
        var _index2 = toasts.findIndex(function (t) {
          return t.id === action.id;
        });
        return [].concat(toConsumableArray(toasts.slice(0, _index2)), toConsumableArray(toasts.slice(_index2 + 1)));
      }
    default:
      return toasts;
  }
});

var stageReducer = (function (state, incomingAction) {
  var action = typeof incomingAction === 'function' ? incomingAction(state) : incomingAction;
  switch (action.type) {
    case 'SET_SCALE':
      return _extends({}, state, { scale: action.scale });
    case 'SET_TRANSLATE':
      return _extends({}, state, { translate: action.translate });
    default:
      return state;
  }
});

var Cache = function Cache() {
  classCallCheck(this, Cache);

  this.ports = {};
  this.connections = {};
};

var css$e = ".styles_dragWrapper__1P7RD{\r\n  z-index: 9999;\r\n  position: absolute;\r\n  left: 0px;\r\n  top: 0px;\r\n}\r\n.styles_debugWrapper__2OSbY{\r\n  display: flex;\r\n  position: absolute;\r\n  left: 10px;\r\n  bottom: 10px;\r\n  gap: 15px;\r\n}\r\n";
var styles$e = { "dragWrapper": "styles_dragWrapper__1P7RD", "debugWrapper": "styles_debugWrapper__2OSbY" };
styleInject(css$e);

var LoopError = function (_Error) {
  inherits(LoopError, _Error);

  function LoopError(message, code) {
    classCallCheck(this, LoopError);

    var _this = possibleConstructorReturn(this, (LoopError.__proto__ || Object.getPrototypeOf(LoopError)).call(this, message));

    _this.code = code;
    return _this;
  }

  return LoopError;
}(Error);

LoopError.maxLoopsExceeded = 1;


var RootEngine = function () {
  function RootEngine(config, resolveInputControls, fireNodeFunction) {
    var _this2 = this;

    classCallCheck(this, RootEngine);

    this.resetLoops = function (maxLoops) {
      _this2.maxLoops = maxLoops !== undefined ? maxLoops : 1000;
      _this2.loops = 0;
    };

    this.checkLoops = function () {
      if (_this2.maxLoops >= 0 && _this2.loops > _this2.maxLoops) {
        throw new LoopError("Max loop count exceeded.", LoopError.maxLoopsExceeded);
      } else {
        _this2.loops++;
      }
    };

    this.getRootNode = function (nodes) {
      var roots = Object.values(nodes).filter(function (n) {
        return n.root;
      });
      if (roots.length > 1) {
        throw new Error("The root engine must not be called with more than one root node.");
      }
      return roots[0];
    };

    this.reduceRootInputs = function (inputs, callback) {
      return Object.entries(inputs).reduce(function (obj, _ref) {
        var _ref2 = slicedToArray(_ref, 2),
            inputName = _ref2[0],
            connection = _ref2[1];

        var input = callback(inputName, connection);
        obj[input.name] = input.value;
        return obj;
      }, {});
    };

    this.resolveInputValues = function (node, nodeType, nodes, context) {
      var inputs = nodeType.inputs;
      if (typeof inputs === 'function') {
        inputs = inputs(node.inputData, node.connections, context);
      }
      return inputs.reduce(function (obj, input) {
        var inputConnections = node.connections.inputs[input.name] || [];
        if (inputConnections.length > 0) {
          obj[input.name] = _this2.getValueOfConnection(inputConnections[0], nodes, context);
        } else {
          obj[input.name] = _this2.resolveInputControls(input.type, node.inputData[input.name] || {}, context);
        }
        return obj;
      }, {});
    };

    this.getValueOfConnection = function (connection, nodes, context) {
      _this2.checkLoops();
      var outputNode = nodes[connection.nodeId];
      var outputNodeType = _this2.config.nodeTypes[outputNode.type];
      var inputValues = _this2.resolveInputValues(outputNode, outputNodeType, nodes, context);
      var outputResult = _this2.fireNodeFunction(outputNode, inputValues, outputNodeType, context)[connection.portName];
      return outputResult;
    };

    this.config = config;
    this.fireNodeFunction = fireNodeFunction;
    this.resolveInputControls = resolveInputControls;
    this.loops = 0;
    this.maxLoops = 1000;
  }

  createClass(RootEngine, [{
    key: "resolveRootNode",
    value: function resolveRootNode(nodes) {
      var _this3 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var rootNode = options.rootNodeId ? nodes[options.rootNodeId] : this.getRootNode(nodes);
      if (rootNode) {
        var inputs = this.config.nodeTypes[rootNode.type].inputs;
        if (typeof inputs === 'function') {
          inputs = inputs(rootNode.inputData, rootNode.connections, options.context);
        }
        var controlValues = inputs.reduce(function (obj, input) {
          obj[input.name] = _this3.resolveInputControls(input.type, rootNode.inputData[input.name] || {}, options.context);
          return obj;
        }, {});
        var inputValues = this.reduceRootInputs(rootNode.connections.inputs, function (inputName, connection) {
          _this3.resetLoops(options.maxLoops);
          var value = void 0;
          try {
            value = _this3.getValueOfConnection(connection[0], nodes, options.context);
          } catch (e) {
            if (e.code === LoopError.maxLoopsExceeded) {
              console.error(e.message + " Circular nodes detected in " + inputName + " port.");
            } else {
              console.error(e);
            }
          } finally {
            return {
              name: inputName,
              value: value
            };
          }
        });
        if (options.onlyResolveConnected) {
          return inputValues;
        } else {
          return _extends({}, controlValues, inputValues);
        }
      } else {
        console.error("A root node was not found. The Root Engine requires that exactly one node be marked as the root node.");
        return {};
      }
    }
  }]);
  return RootEngine;
}();

var _this = undefined;

var defaultContext = {};

exports.NodeEditor = function NodeEditor(_ref, ref) {
  var initialComments = _ref.comments,
      initialNodes = _ref.nodes,
      _ref$nodeTypes = _ref.nodeTypes,
      nodeTypes = _ref$nodeTypes === undefined ? {} : _ref$nodeTypes,
      _ref$portTypes = _ref.portTypes,
      portTypes = _ref$portTypes === undefined ? {} : _ref$portTypes,
      _ref$defaultNodes = _ref.defaultNodes,
      defaultNodes = _ref$defaultNodes === undefined ? [] : _ref$defaultNodes,
      _ref$context = _ref.context,
      context = _ref$context === undefined ? defaultContext : _ref$context,
      onChange = _ref.onChange,
      onCommentsChange = _ref.onCommentsChange,
      initialScale = _ref.initialScale,
      _ref$spaceToPan = _ref.spaceToPan,
      spaceToPan = _ref$spaceToPan === undefined ? false : _ref$spaceToPan,
      _ref$hideComments = _ref.hideComments,
      hideComments = _ref$hideComments === undefined ? false : _ref$hideComments,
      _ref$disableComments = _ref.disableComments,
      disableComments = _ref$disableComments === undefined ? false : _ref$disableComments,
      _ref$disableZoom = _ref.disableZoom,
      disableZoom = _ref$disableZoom === undefined ? false : _ref$disableZoom,
      _ref$disablePan = _ref.disablePan,
      disablePan = _ref$disablePan === undefined ? false : _ref$disablePan,
      circularBehavior = _ref.circularBehavior,
      debug = _ref.debug;

  var editorId = useId();
  var cache = React__default.useRef(new Cache());
  var stage = React__default.useRef();

  var _React$useState = React__default.useState(),
      _React$useState2 = slicedToArray(_React$useState, 2),
      sideEffectToasts = _React$useState2[0],
      setSideEffectToasts = _React$useState2[1];

  var _React$useReducer = React__default.useReducer(toastsReducer, []),
      _React$useReducer2 = slicedToArray(_React$useReducer, 2),
      toasts = _React$useReducer2[0],
      dispatchToasts = _React$useReducer2[1];

  var _React$useReducer3 = React__default.useReducer(connectNodesReducer(nodesReducer, { nodeTypes: nodeTypes, portTypes: portTypes, cache: cache, circularBehavior: circularBehavior, context: context }, setSideEffectToasts), {}, function () {
    return getInitialNodes(initialNodes, defaultNodes, nodeTypes, portTypes, context);
  }),
      _React$useReducer4 = slicedToArray(_React$useReducer3, 2),
      nodes = _React$useReducer4[0],
      dispatchNodes = _React$useReducer4[1];

  var _React$useReducer5 = React__default.useReducer(commentsReducer, initialComments || {}),
      _React$useReducer6 = slicedToArray(_React$useReducer5, 2),
      comments = _React$useReducer6[0],
      dispatchComments = _React$useReducer6[1];

  React__default.useEffect(function () {
    dispatchNodes({ type: "HYDRATE_DEFAULT_NODES" });
  }, []);

  var _React$useState3 = React__default.useState(true),
      _React$useState4 = slicedToArray(_React$useState3, 2),
      shouldRecalculateConnections = _React$useState4[0],
      setShouldRecalculateConnections = _React$useState4[1];

  var _React$useReducer7 = React__default.useReducer(stageReducer, {
    scale: typeof initialScale === "number" ? clamp_1(initialScale, 0.1, 7) : 1,
    translate: { x: 0, y: 0 }
  }),
      _React$useReducer8 = slicedToArray(_React$useReducer7, 2),
      stageState = _React$useReducer8[0],
      dispatchStageState = _React$useReducer8[1];

  var recalculateConnections = React__default.useCallback(function () {
    createConnections(nodes, stageState, editorId);
  }, [nodes, editorId, stageState]);

  var recalculateStageRect = function recalculateStageRect() {
    stage.current = document.getElementById("" + STAGE_ID + editorId).getBoundingClientRect();
  };

  React__default.useLayoutEffect(function () {
    if (shouldRecalculateConnections) {
      recalculateConnections();
      setShouldRecalculateConnections(false);
    }
  }, [shouldRecalculateConnections, recalculateConnections]);

  var triggerRecalculation = function triggerRecalculation() {
    setShouldRecalculateConnections(true);
  };

  React__default.useImperativeHandle(ref, function () {
    return {
      getNodes: function getNodes() {
        return nodes;
      },
      getComments: function getComments() {
        return comments;
      },
      addNode: function addNode(nodeType) {
        if (_this.stageRef.current) {
          console.log("I want to add node: " + nodeType);
        }
      }
    };
  });

  var previousNodes = usePrevious(nodes);

  React__default.useEffect(function () {
    if (previousNodes && onChange && nodes !== previousNodes) {
      onChange(nodes);
    }
  }, [nodes, previousNodes, onChange]);

  var previousComments = usePrevious(comments);

  React__default.useEffect(function () {
    if (previousComments && onCommentsChange && comments !== previousComments) {
      onCommentsChange(comments);
    }
  }, [comments, previousComments, onCommentsChange]);

  React__default.useEffect(function () {
    if (sideEffectToasts) {
      dispatchToasts(sideEffectToasts);
      setSideEffectToasts(null);
    }
  }, [sideEffectToasts]);

  return React__default.createElement(
    PortTypesContext.Provider,
    { value: portTypes },
    React__default.createElement(
      NodeTypesContext.Provider,
      { value: nodeTypes },
      React__default.createElement(
        NodeDispatchContext.Provider,
        { value: dispatchNodes },
        React__default.createElement(
          ConnectionRecalculateContext.Provider,
          { value: triggerRecalculation },
          React__default.createElement(
            ContextContext.Provider,
            { value: context },
            React__default.createElement(
              StageContext.Provider,
              { value: stageState },
              React__default.createElement(
                CacheContext.Provider,
                { value: cache },
                React__default.createElement(
                  EditorIdContext.Provider,
                  { value: editorId },
                  React__default.createElement(
                    RecalculateStageRectContext.Provider,
                    {
                      value: recalculateStageRect
                    },
                    React__default.createElement(
                      Stage,
                      {
                        editorId: editorId,
                        scale: stageState.scale,
                        translate: stageState.translate,
                        spaceToPan: spaceToPan,
                        disablePan: disablePan,
                        disableZoom: disableZoom,
                        dispatchStageState: dispatchStageState,
                        dispatchComments: dispatchComments,
                        disableComments: disableComments || hideComments,
                        stageRef: stage,
                        numNodes: Object.keys(nodes).length,
                        outerStageChildren: React__default.createElement(
                          React__default.Fragment,
                          null,
                          debug && React__default.createElement(
                            "div",
                            { className: styles$e.debugWrapper },
                            React__default.createElement(
                              "button",
                              {
                                className: styles$e.debugButton,
                                onClick: function onClick() {
                                  return console.log(nodes);
                                }
                              },
                              "Log Nodes"
                            ),
                            React__default.createElement(
                              "button",
                              {
                                className: styles$e.debugButton,
                                onClick: function onClick() {
                                  return console.log(JSON.stringify(nodes));
                                }
                              },
                              "Export Nodes"
                            ),
                            React__default.createElement(
                              "button",
                              {
                                className: styles$e.debugButton,
                                onClick: function onClick() {
                                  return console.log(comments);
                                }
                              },
                              "Log Comments"
                            )
                          ),
                          React__default.createElement(Toaster, {
                            toasts: toasts,
                            dispatchToasts: dispatchToasts
                          })
                        )
                      },
                      !hideComments && Object.values(comments).map(function (comment) {
                        return React__default.createElement(Comment, _extends({}, comment, {
                          stageRect: stage,
                          dispatch: dispatchComments,
                          onDragStart: recalculateStageRect,
                          key: comment.id
                        }));
                      }),
                      Object.values(nodes).map(function (node) {
                        return React__default.createElement(Node, _extends({}, node, {
                          stageRect: stage,
                          onDragEnd: triggerRecalculation,
                          onDragStart: recalculateStageRect,
                          key: node.id
                        }));
                      }),
                      React__default.createElement(Connections, { nodes: nodes, editorId: editorId }),
                      React__default.createElement("div", {
                        className: styles$e.dragWrapper,
                        id: "" + DRAG_CONNECTION_ID + editorId
                      })
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  );
};
exports.NodeEditor = React__default.forwardRef(exports.NodeEditor);
var useRootEngine = function useRootEngine(nodes, engine, context) {
  return Object.keys(nodes).length ? engine.resolveRootNode(nodes, { context: context }) : {};
};

exports.useRootEngine = useRootEngine;
exports.FlumeConfig = FlumeConfig;
exports.Controls = Controls;
exports.Colors = Colors;
exports.RootEngine = RootEngine;
//# sourceMappingURL=index.js.map
