// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
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

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
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
  return newRequire;
})({"static/js/templates.js":[function(require,module,exports) {
/*
Load template for page layout
Author: Victor Dibia <victor.dibia@gmail.com>
*/
$(function () {
  $("#sidebar").load("sidebar.html", function () {
    var selectedtab = "masks";
    selectedtab = getHash() || selectedtab; // alert (  selectedtab + $("a.sidelink").html())

    $(".sidebarlinks").removeClass("sidebarselected");
    $("a.sidelink#" + selectedtab).parent().addClass("sidebarselected");
  });
  $("#header").load("header.html");
  $("#footer").load("footer.html");
  $("#disqusbox").load("disqus.html");
  $("div.pagesection").each(function (index) {
    // console.log("hey", $(this).attr("id"))
    $(this).load($(this).attr("id") + ".html");
  }); // Sidebar clicks to show/hide page sections

  $.getScript("static/js/masks.js", function (data, textStatus, jqxhr) {
    $(".pagesection").hide();
    selectedtab = "masks";
    selectedtab = getHash() || selectedtab;
    $(".pagesection#" + selectedtab).show();
    $(".sidelink").click(function () {
      $(".sidebarlinks").removeClass("sidebarselected");
      $("a#" + $(this).attr("id")).parent().addClass("sidebarselected");
      clickedSection = $(".pagesection#" + $(this).attr("id"));
      $(".pagesection").hide();
      clickedSection.show(); // $(".pagesection").fadeOut("slow", function(){
      //     // $(".pagesection").hide()
      //     clickedSection.fadeIn("fast")
      // })
    });
  });
  $.getScript("static/js/dataset.js", function (data, textStatus, jqxhr) {// loadSampleDataset()
  });

  function getHash() {
    var hash = null;

    if (window.location.hash) {
      hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
    }

    return hash;
  }
}); // Show Loading Spinner

function showLoading(element) {
  $(element).fadeIn("slow");
} // Hide Loading Spinner


function hideLoading(element) {
  $(element).fadeOut("slow");
} // show Notification


function showNotification(title, subtitle, caption) {
  $(".toasttemplate").find(".bx--toast-notification__title").text(title);
  $(".toasttemplate").find(".bx--toast-notification__subtitle").text(subtitle);
  $(".toasttemplate").find(".bx--toast-notification__caption").text(caption);
  toastInstance = $(".toasttemplate").clone();
  toastInstance.removeClass("toasttemplate");
  toastInstance.hide().appendTo(".toastDivBox");
  toastInstance.fadeIn("slow");
  toastInstance.find(".bx--toast-notification__close-button").click(function () {
    $(this).parent().fadeOut("slow", function () {
      $(this).remove();
    });
  });
}
},{}]},{},["static/js/templates.js"], null)
//# sourceMappingURL=/templates.c353fe98.map