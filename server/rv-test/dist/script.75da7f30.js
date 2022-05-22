// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"service.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Service = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/* 
    That service export functions to get elements in front side,
    get elemtens in the server that will be drawer and others helpers used to drawer the items. 
*/
var Service =
/*#__PURE__*/
function () {
  function Service() {
    _classCallCheck(this, Service);
  }

  _createClass(Service, [{
    key: "getGreenThumb",
    value: // service to get information from server and return a json list.
    function getGreenThumb(sun, water, pet) {
      return fetch("https://front-br-challenges.web.app/api/v2/green-thumb/?sun=" + sun + "&water=" + water + "&pets=" + pet).then(function (response) {
        return response.json();
      });
    } // create item that will be insert in the produst list

  }, {
    key: "createItem",
    value: function createItem(id, name, sun, water, url, price, toxicity, staff_favorite) {
      // create the father item
      var item = document.createElement("div");
      item.setAttribute("id", id);
      item.setAttribute("class", "item"); // create staff favorite with  star icon and text

      if (staff_favorite) {
        item.setAttribute("class", "item staff_favorite"); // star

        var star = document.createElement("img");
        star.setAttribute("class", "img");
        star.setAttribute("src", url); // green brand staff

        var itemStaff = document.createElement("div");
        itemStaff.setAttribute("class", "staff_favorite");
        itemStaff.innerHTML = "✨Staff favorite";
        item.appendChild(itemStaff);
      }

      var image = document.createElement("img");
      image.setAttribute("class", "img");
      image.setAttribute("src", url);
      var itemName = document.createElement("div");
      itemName.setAttribute("class", "name");
      itemName.innerHTML = name; // create info div that contains price and details that contains in the same contex, more easy to use display flex

      var itemInfo = document.createElement("div");
      itemInfo.setAttribute("class", "info");
      var itemPrice = document.createElement("div");
      itemPrice.setAttribute("class", "price");
      itemPrice.innerHTML = "$" + price;
      itemInfo.appendChild(itemPrice);
      var details = document.createElement("div");
      details.setAttribute("class", "details");
      itemInfo.appendChild(details); // draw pet icon

      if (toxicity) {
        var itemToxicity = this.cloneIcon("toxic");
        details.appendChild(itemToxicity);
      } // draw pet icon


      if (this.option3 === "true") {
        var itemPet = this.cloneIcon("pet");
        details.appendChild(itemPet);
      } // draw sun icon


      var itemSun;

      if (this.option1 === "no") {
        itemSun = this.cloneIcon("no-sun");
      } else if (this.option1 === "low") {
        itemSun = this.cloneIcon("low-sun");
      } else if (this.option1 === "high") {
        itemSun = this.cloneIcon("high-sun");
      }

      details.appendChild(itemSun); // draw water icon

      var itemWater;

      if (this.option2 === "rarely") {
        itemWater = this.cloneIcon("drop-1");
      } else if (this.option2 === "regularly") {
        itemWater = this.cloneIcon("drop-2");
      } else if (this.option2 === "daily") {
        itemWater = this.cloneIcon("drop-3");
      }

      details.appendChild(itemWater);
      item.appendChild(image);
      item.appendChild(itemName);
      item.appendChild(itemInfo);
      return item;
    } // clone element pre loaded

  }, {
    key: "cloneIcon",
    value: function cloneIcon(iconName) {
      return document.querySelector("div.pre-load > img." + iconName).cloneNode();
    }
  }, {
    key: "getResultstext",
    value: function getResultstext() {
      return document.querySelectorAll("div.products > .no-result-container");
    }
  }, {
    key: "showTextResults",
    value: function showTextResults() {
      this.getResultstext().forEach(function (noResult) {
        noResult.style.display = "flex";
      });
    }
  }, {
    key: "hideTextResults",
    value: function hideTextResults() {
      this.getResultstext().forEach(function (noResult) {
        noResult.style.display = "none";
      });
    }
  }, {
    key: "getLoader",
    value: function getLoader() {
      return document.querySelector("div.products > .loader");
    }
  }, {
    key: "showLoader",
    value: function showLoader() {
      this.getLoader().style.display = "flex";
    }
  }, {
    key: "hideLoader",
    value: function hideLoader() {
      this.getLoader().style.display = "none";
    }
  }, {
    key: "getItems",
    value: function getItems() {
      return document.querySelector("div.products > .items");
    }
  }, {
    key: "showItems",
    value: function showItems() {
      this.getItems().style.display = "contents";
    }
  }, {
    key: "hideItems",
    value: function hideItems() {
      this.getItems().style.display = "none";
    }
  }, {
    key: "scrollToUp",
    value: function scrollToUp() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, {
    key: "scrollToDown",
    value: function scrollToDown() {
      window.scrollTo({
        top: window.screen.height,
        behavior: 'smooth'
      });
    }
  }]);

  return Service;
}();

exports.Service = Service;
},{}],"script.js":[function(require,module,exports) {
"use strict";

var _service = require("./service");

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App =
/*#__PURE__*/
_createClass(function App() {
  _classCallCheck(this, App);

  var service = new _service.Service(); // listenner go to top page

  document.getElementById("go-up").onclick = function () {
    service.scrollToUp();
  };

  var selectors = document.getElementsByName("selector");
  selectors.forEach(function (selector) {
    selector.addEventListener("change", function () {
      switch (selector.id) {
        case "option-1":
          service.option1 = selector.value;
          break;

        case "option-2":
          service.option2 = selector.value;
          break;

        case "option-3":
          service.option3 = selector.value;
          break;
      }

      if (service.option1 && service.option2 && service.option3) {
        var itemsOutput = document.getElementsByClassName("items-output")[0];
        service.showLoader();
        service.scrollToDown();
        service.hideTextResults();
        service.hideItems();

        while (itemsOutput.firstChild) {
          itemsOutput.firstChild.remove();
        }

        service.getGreenThumb(service.option1, service.option2, service.option3).then(function (items) {
          // sort to staff true
          items.sort(function (a, b) {
            return a.staff_favorite ? -1 : 1;
          });
          items.forEach(function (item) {
            var newItem = service.createItem(item.id, item.name, item.sun, item.water, item.url, item.price, item.toxicity, item.staff_favorite);
            itemsOutput.appendChild(newItem);
          });
          service.hideLoader();
          service.hideTextResults();
          service.showItems();
          service.scrollToDown();
        }).catch(function (e) {
          // some request gime us 404.. not found..
          service.scrollToUp();
          service.showTextResults();
          service.hideLoader();
          service.hideItems();
        });
      }
    });
  });
}); // call application when document is complete


var loaderInvterval = setInterval(function () {
  if (document.readyState === "complete") {
    clearInterval(loaderInvterval);
    new App();
  }
}, 100);
},{"./service":"service.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53576" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map