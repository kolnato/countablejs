(function() {

const _closest = function(n, sel) {
  do {
    if ((n.matches || n.msMatchesSelector).call(n, sel)) {
      return n;
    }
    n = n.parentNode;
  } while (n !== null && n.nodeType === 1);
  return null;
}
const _html_to_element = function(html) {
  let template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstChild;
};
const _wrap_element_with_html = function(html, el) {
  let wrap = _html_to_element("<div style=\"margin: 0; padding: 0;\" class=\"text-countable-wrap text-right\"></div>");
  el.parentNode.appendChild(wrap)
  wrap.appendChild(el);
  return wrap;
};


function makeCountable(el) {
  let wrap = el.parentNode;
  if (!el.parentNode.classList.contains("text-countable")) {
    wrap = _wrap_element_with_html("<div style=\"margin: 0; padding: 0; width: 100%; text-align: right;\" class=\"text-countable-wrap\"></div>", el);
  }
  el.classList.forEach(function(x) {
    if (x.match(/col-.*/)) {
      wrap.classList.add(x);
      el.classList.remove(x);
    }
  });

  const _f = function(el) {
    const wrap = _closest(el, ".text-countable-wrap");
    const r = (el.dataset["maxlength"] || el.getAttribute("maxlength")) - (el.value || "").length;
    wrap.dataset["countRest"] = r
    wrap.dataset["countRestAlert"] = r < 10;
  };
  el.addEventListener("keyup", function(ev) {
    _f(this);
  });
  _f(el);
}

if (jQuery) {
  jQuery.fn.extend({
    countable: function() {
      return this.each(function() {
        makeCountable(this);
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", function(ev) {
  const node = document.createElement('style');
  document.body.appendChild(node);
  window.addStyleString = function(str) {
    node.innerHTML += str;
  }
  addStyleString(".text-countable-wrap::after { color: gray; content: attr(data-count-rest); }");
  addStyleString(".text-countable-wrap[data-count-rest-alert=true]::after { color: red; }");
});

}());
