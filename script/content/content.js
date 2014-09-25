var oakAnchor = {
  _anchor_protocol: "oak_anchor",
  _anchor_version: "1.3",
  xmlDecode: function(a) {
    return a.replace(/&nbsp;/mg, " ").replace(/&amp;/mg, "&").replace(/&lt;/mg, "<").replace(/&gt;/mg, ">").replace(/&quot;/mg, '"')
  },
  xmlEncode: function(a) {
    return a.replace(/&/mg, "&amp;").replace(/</mg, "&lt;").replace(/>/mg, "&gt;").replace(/\"/mg, "&quot;")
  },
  getURLStringFromDocument: function(a) {
    if (!a) {
      return ""
    }
    var b = a.location;
    try {
      return b.protocol + "//" + b.host + b.pathname + b.search
    } catch (c) {
      return b.href
    }
  },
  _isTextNode: function(a) {
    return a.nodeType == a.TEXT_NODE
  },
  _getContentsPrefix: function(f, a, g) {
    if (this._isTextNode(a)) {
      var e = g.length < 3 ? g.length : 3;
      if (f == "b") {
        return g.substring(0, e)
      } else {
        if (f == "e") {
          return g.substring(g.length - e)
        }
      }
    } else {
      var d = a.tagName.toUpperCase();
      if (d == "IMG") {
        var c = a.getAttribute("src");
        if (c.indexOf("#") > 0) {
          c = c.split("#", 1)[0]
        }
        return "src:" + c
      } else {
        if (d == "A") {
          var b = a.getAttribute("href");
          if (b.indexOf("#") > 0) {
            b = b.split("#", 1)[0]
          }
          return "href:" + b
        }
      }
    }
    return ""
  },
  encodeAnchor: function(e) {
    if (e.rangeCount > 0) {
      var b = e.getRangeAt(0);
      var a = e.getRangeAt(e.rangeCount - 1);
      var d = {
        node: b.startContainer,
        offset: b.startOffset,
        prefix: "b",
        contents: b.toString()
      };
      var c = {
        node: a.endContainer,
        offset: a.endOffset,
        prefix: "e",
        contents: a.toString()
      };
      return this.encodeAnchorUrl(d, c)
    }
    return "invliad anchor"
  },
  encodeAnchorUrl: function() {
    var b = null;
    var f = null;
    var d;
    var a = 0;
    try {
      for (d = 0; d < arguments.length; d++) {
        var g = arguments[d];
        if (g.node == undefined || g.offset == undefined) {
          continue
        }
        if (!f) {
          b = this.getURLStringFromDocument(g.node.ownerDocument);
          f = this._anchor_protocol + this._anchor_version + ":"
        }
        var h = this.createXPath(g.node, g.offset);
        var e = "";
        if (g.contents) {
          e = g.contents;
          e = this.xmlDecode(e);
          e = e.replace(/[\r\n\t ]+/mg, "");
          e = this._getContentsPrefix(g.prefix, g.node, e);
          e = this.xmlEncode(e)
        }
        if (a > 0) {
          f += "&"
        }
        f += this.xmlEncode(h) + "(" + e + ")";
        a++
      }
      if (a > 0) {
        for (d = 0; d < arguments.length; d++) {
          var g = arguments[d];
          if (g.style == undefined || g.style == "") {
            continue
          }
          g.style = g.style.replace(/:\s+rgb\(([0-9]+),\s+([0-9]+),\s+([0-9]+)\)/mg, ":rgb($1,$2,$3)").replace(/;\s+/mg, ";");
          f += "&" + this.xmlEncode(g.style);
          break
        }
      }
    } catch (c) {
      f = null
    }
    return b + "#" + encodeURIComponent(f)
  },
  getDocLocation: function(b) {
    var a = b.location;
    if (a.href == b.URL) {
      return a.href
    } else {
      return b.URL
    }
  },
  isAnchorInDoc: function(c, d) {
    if (typeof d == "undefined" || d == "null") {
      d = document
    }
    if (c.match(/^(.*)#(.*)$/)) {
      var a = decodeURIComponent(RegExp.$1);
      var b = this.getDocLocation(d);
      b = b.replace(/\#$/g, "");
      a = a.replace(/\#$/g, "");
      return b == a
    }
    return false
  },
  decodeAnchorUrl: function(a, f) {
    var j = {};
    if (typeof a == "undefined" || a == null) {
      a = document
    }
    if (typeof f == "undefined" || a == null) {
      return j
    }
    var h = "";
    var d = new RegExp("(#" + this._anchor_protocol + "[^#]+)#?");
    if (f.match(d)) {
      h = decodeURIComponent(RegExp.$1)
    } else {
      return null
    }
    var k = "1.3";
    var b = "";
    d = new RegExp("#" + this._anchor_protocol + "([0-9.]*):(.+)$");
    if (h.match(d)) {
      k = RegExp.$1;
      b = RegExp.$2
    } else {
      return null
    }
    var g = this.xmlDecode(b);
    var l = null;
    var i = null;
    var c = null;
    if (b.match(/^(.+\([0-9]+\)\([0-9]+\)\([\s\S]*\))&(.+\([0-9]+\)\([0-9]+\)\([\s\S]*\))&(.+)$/)) {
      l = unescape(RegExp.$1);
      i = unescape(RegExp.$2);
      c = unescape(RegExp.$3)
    } else {
      if (b.match(/^(.+\([0-9]+\)\([0-9]+\)\([\s\S]*\))&(.+\([0-9]+\)\([0-9]+\)\([\s\S]*\))$/)) {
        l = unescape(RegExp.$1);
        i = unescape(RegExp.$2)
      } else {
        if (b.match(/^(.+\([0-9]+\)\([0-9]+\)\([\s\S]*\))&&(.+)$/)) {
          l = unescape(RegExp.$1);
          c = unescape(RegExp.$2)
        } else {
          if (b.match(/^(.+\([0-9]+\)\([0-9]+\)\([\s\S]*\))$/)) {
            l = unescape(RegExp.$1)
          }
        }
      }
    } if (l) {
      l = this.xmlDecode(l);
      if (l.match(/(.+)\(([0-9]+)\)\(([0-9]+)\)\(([\s\S]*)\)/m)) {
        j.startPath = RegExp.$1;
        j.startOffset = RegExp.$2;
        j.startType = RegExp.$3;
        j.startContents = RegExp.$4
      } else {
        if (l.match(/(.+)\(([0-9]+)\)\(([0-9]+)\)/)) {
          j.startPath = RegExp.$1;
          j.startOffset = RegExp.$2;
          j.startType = RegExp.$3
        }
      }
      var e = this.getNodeFromXPath(a, j.startPath, j.startOffset, j.startType);
      j.startNode = e.node;
      j.startOffset = e.offset;
      if (!j.startNode) {
        return null
      }
    }
    if (i) {
      i = this.xmlDecode(i);
      if (i.match(/(.+)\(([0-9]+)\)\(([0-9]+)\)\(([\s\S]*)\)/)) {
        j.endPath = RegExp.$1;
        j.endOffset = RegExp.$2;
        j.endType = RegExp.$3;
        j.endContents = RegExp.$4
      } else {
        if (i.match(/(.+)\(([0-9]+)\)\(([0-9]+)\)/)) {
          j.endPath = RegExp.$1;
          j.endOffset = RegExp.$2;
          j.endType = RegExp.$3
        }
      }
      e = this.getNodeFromXPath(a, j.endPath, j.endOffset, j.endType);
      j.endNode = e.node;
      j.endOffset = e.offset
    }
    if (c) {
      c = this.xmlDecode(c);
      j.style = c
    } else {
      j.style = "outline:1px dotted invert;outline-offset:0;background-color:#ff9;"
    }
    return j
  },
  _acceptNode: function(a) {
    if (a.nodeType == a.TEXT_NODE && (/^[\t\n\r ]+$/.test(a.nodeValue))) {
      return NodeFilter.FILTER_REJECT
    }
    return NodeFilter.FILTER_ACCEPT
  },
  getNodeFromXPath: function(b, m, p, j) {
    var e = null;
    var q = p;
    var h = -1;
    var c = null;
    var i = null;
    try {
      e = this.evaluate(m, b).snapshotItem(0);
      if (e && j == 3) {
        var g = b.createTreeWalker(e, NodeFilter.SHOW_ALL, c, false);
        var f = g.nextNode();
        if (f) {
          var o = 0;
          var d = false;
          var n = false;
          var k = null;
          for (; f; f = g.nextNode()) {
            if (f.nodeType == f.ELEMENT_NODE) {
              if (f.nodeName == "BR") {
                d = true
              } else {
                if (d) {
                  d = false
                }
              } if (f.nodeName == "TEXTAREA") {
                n = true
              } else {
                if (n) {
                  n = false
                }
              }
              continue
            }
            if (f.nodeType != f.TEXT_NODE) {
              continue
            }
            if (n) {
              n = false;
              continue
            }
            var l = f.nodeValue;
            if (q - l.length < 0 || (q > 0 && (q - l.length) == 0)) {
              i = f;
              break
            }
            q -= l.length;
            k = f;
            g.currentNode = f;
            o++;
            if (d) {
              d = false
            }
          }
          if (i == null) {
            i = k
          } else {
            h = q
          }
        } else {
          i = e
        }
      } else {
        i = e
      }
    } catch (a) {}
    return {
      node: i,
      offset: h
    }
  },
  getDocument: function(a) {
    return (a.ownerDocument == null ? a : a.ownerDocument)
  },
  evaluate: function(b, a) {
    return this.getDocument(a).evaluate(b, a, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
  },
  isIdNode: function(a) {
    if (typeof a.id == "undefined" || a.id == null || a.id == "") {
      return false
    }
    if (a.id) {
      var b = this.evaluate('//*[@id="' + a.id + '"]', a);
      if (b.snapshotLength > 1) {
        return false
      }
    }
    return true
  },
  getDocumentElement: function(a) {
    return (a.ownerDocument == null ? a.documentElement : a.ownerDocument.documentElement)
  },
  getOffsetFromParentNode: function(a, g) {
    var e = g;
    var h = a;
    if (this._isTextNode(a)) {
      h = a.parentNode
    }
    var d = h.ownerDocument.createTreeWalker(h, NodeFilter.SHOW_ALL, null, false);
    var f = d.nextNode();
    if (f) {
      var c = 0;
      for (; f && f != a; f = d.nextNode()) {
        if (f.nodeType != f.TEXT_NODE) {
          continue
        }
        var b = f.nodeValue;
        e += b.length;
        c++
      }
    }
    return e
  },
  createXPath: function(b, d) {
    if (typeof b == "undefined" || b == null) {
      return ""
    }
    d = this.getOffsetFromParentNode(b, d);
    var g = b;
    if (b.nodeType == 3) {
      b = b.parentNode
    }
    var o = b.nodeName.toLowerCase();
    if (this.isIdNode(b)) {
      return "//" + o + '[@id="' + b.id + '"](' + d + ")(" + g.nodeType + ")"
    }
    var q = [];
    var e = b;
    var l;
    var h;
    var k = null;
    var f;
    var p = [];
    var a = this.evaluate("ancestor-or-self::*", e);
    var m = a.snapshotLength;
    for (l = 0; l < m; l++) {
      p.push(a.snapshotItem(l))
    }
    for (l = p.length - 1; l >= 0; l--) {
      k = p[l];
      if (this.isIdNode(k)) {
        break
      }
      a = this.evaluate("preceding-sibling::*[@id]", k);
      k = null;
      m = a.snapshotLength;
      for (h = m - 1; h >= 0; h--) {
        k = a.snapshotItem(h);
        if (this.isIdNode(k)) {
          break
        }
        k = null
      }
      if (k) {
        break
      }
    }
    if (k) {
      f = "//" + k.nodeName.toLowerCase() + '[@id="' + k.id + '"]'
    } else {
      k = this.getDocumentElement(e);
      f = "/" + k.nodeName.toLowerCase() + "[1]"
    }
    while (k.parentNode != e.parentNode) {
      a = this.evaluate("preceding-sibling::" + o, e);
      q.unshift(o + "[" + (a.snapshotLength + 1) + "]");
      e = e.parentNode;
      o = e.nodeName.toLowerCase()
    }
    if (k != e) {
      var c = "following-sibling::";
      a = this.evaluate(c + o, k);
      m = a.snapshotLength;
      for (l = 0; l < m && a.snapshotItem(l) != e; l++) {}
      q.unshift(c + o + "[" + (l + 1) + "]")
    }
    q.unshift(f);
    var n = q.join("/");
    n += "(" + d + ")(" + g.nodeType + ")";
    return n
  }
};
var wordMarker = {
  trim: function(a) {
    return a.replace(/^\s+|\s+$/g, "")
  },
  FUNC: function(d, c) {
    return function() {
      return c.apply(d, arguments)
    }
  },
  trimSentence: function(a) {
    return a.replace(/^[\s\d]+|\s+$/g, "")
  },
  add2WordList: function(b) {
    if (typeof b == "undefined" || b == null) {
      return -1
    }
    b = this.trim(b);
    if (b == "") {
      return -1
    }
    for (var a = 0; a < this.wordList.length; a++) {
      if (this.wordList[a].toLowerCase() == b.toLowerCase()) {
        return a
      }
    }
    this.wordList.push(b);
    return this.wordList.length
  },
  removeFromWordList: function(b) {
    if (typeof b == "undefined" || b == null) {
      return false
    }
    b = this.trim(b);
    if (b == "") {
      return false
    }
    for (var a = 0; a < this.wordList.length; a++) {
      if (this.wordList[a].toLowerCase() == b.toLowerCase()) {
        this.wordList.splice(a, 1);
        return true
      }
    }
    return false
  },
  push: function(a, f, d) {
    if (typeof a == "undefined" || a == null || typeof f == "undefined" || f == null) {
      return a
    }
    try {
      f = this.trim(f);
      for (var b = 0; b < a.length; b++) {
        if (typeof d !== "undefined" && d != null) {
          if (d(a[b], f)) {
            return a
          }
        } else {
          if (a[b].toLowerCase() == f.toLowerCase()) {
            return a
          }
        }
      }
      a.push(f)
    } catch (c) {}
    return a
  },
  inited: false,
  activated: false,
  doctype: null,
  doctypeNew: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">',
  checkingId: -1,
  dictInstanceId: -1,
  wordList: [],
  wordEntry: null,
  audio: null,
  initMsgHandler: function() {
    chrome.extension.onRequest.addListener(function(b, c, a) {
      if (b.cmd == "get_word_def_response") {
        wordMarker.onWordDefResponse(b, c, a)
      } else {
        if (b.cmd == "toggleWordMarkerEnable") {
          wordMarker.onActivate(b, c, a)
        } else {
          if (b.cmd == "modifyMarker") {
            wordMarker.onChangeMarkerStyle(b.wpen)
          } else {
            if (b.cmd == "markWordBroadcast") {
              wordMarker.onMarkWord(b.word)
            } else {
              if (b.cmd == "unmarkWordBroadcast") {
                wordMarker.onUnMarkWord(b.word)
              } else {
                if (b.cmd == "query_marker_status") {
                  wordMarker.onStatusQuery(b, c, a)
                } else {
                  wordMarker.a(b, c, a)
                }
              }
            }
          }
        }
      }
    });
    this.initialize()
  },
  hookMouseUp: function(a) {
    if (typeof a == "undefined" || a) {
      window.addEventListener("mouseup", onWordMarkerMouseUp)
    } else {
      window.removeEventListener("mouseup", onWordMarkerMouseUp)
    }
  },
  initialize: function() {
    this.hookMouseUp(true);
    chrome.extension.sendRequest({
      cmd: "initializeWordMarker",
      url: document.URL
    }, function(a) {
      wordMarker.onInitialized(a)
    })
  },
  onInitialized: function(b) {
    this.penStyle = b.wordPen;
    this.activated = b.state;
    this.dictInstanceId = b.instanceId;
    this.wordList = b.wordList;
    for (var a = 0; a < this.wordList.length; a++) {
      this.markWordInWholeDocument(this.wordList[a], true)
    }
  },
  onWordDefResponse: function(b, c, a) {
    if (!this.activated || !this.bubbleShowing) {
      return
    }
    this.updateBubbleContent(b.msg)
  },
  onOptionChanged: function(b, c, a) {},
  onActivate: function(b, d, a) {
    this.activated = !this.activated;
    if (this.activated) {
      for (var c = 0; c < this.wordList.length; c++) {
        this.markWordInWholeDocument(this.wordList[c], true)
      }
    } else {
      for (var c = 0; c < this.wordList.length; c++) {
        this.unMarkWordInWholeDocument(this.wordList[c], true)
      }
    }
    this.onStatusQuery(b, d, a)
  },
  onChangeMarkerStyle: function(a) {
    if (typeof a == "undefined" || a == null) {} else {
      this.penStyle = a
    }
  },
  onStatusQuery: function(b, c, a) {
    this.reportStatus()
  },
  reportStatus: function() {
    chrome.extension.sendRequest({
      cmd: "report_word_marker_status",
      url: document.URL,
      activated: this.activated,
      wordCount: this.wordList.length
    })
  },
  a: function(b, c, a) {},
  markerType: "learner_marker_word",
  word_title: "lm_title",
  penStyle: "markerpen1",
  markedNode: function(a) {
    if (a.nodeType == a.TEXT_NODE && !(/[^\t\n\r ]/.test(a.nodeValue))) {
      return NodeFilter.FILTER_REJECT
    }
    return NodeFilter.FILTER_ACCEPT
  },
  acceptNode: function(a) {
    if (a.nodeType == a.TEXT_NODE && !(/[^\t\n\r ]/.test(a.nodeValue))) {
      return NodeFilter.FILTER_REJECT
    }
    return NodeFilter.FILTER_ACCEPT
  },
  isMarkedWord: function(a) {
    if (typeof a == "undefined" || a == null) {
      return false
    }
    var b = a;
    if (a.nodeType == a.TEXT_NODE) {
      b = b.parentNode
    }
    while (b) {
      if (b.nodeName == "SPAN" && b.getAttribute("type") == this.markerType) {
        return true
      }
      if (b.id == "lm-bubble-container") {
        return true
      }
      b = b.parentNode
    }
    return false
  },
  wrapTextNodeWithSpan: function(d, b) {
    var c = d.cloneNode(false);
    var a = d.parentNode;
    b.appendChild(c);
    a.replaceChild(b, d);
    b.addEventListener("mouseover", function(e) {
      wordMarker.startHoverPopup(e.target)
    });
    b.addEventListener("mouseout", function(e) {
      wordMarker.stopHoverPopu();
      wordMarker.startHide(1000)
    });
    return c
  },
  createWordMarkerNode: function(b) {
    var a = document.createElement("span");
    a.className = this.penStyle;
    a.setAttribute("type", this.markerType);
    a.setAttribute(this.word_title, b);
    return a
  },
  isEventInBubble: function(b) {
    var a = b.target;
    while (a) {
      if (a.id = "lm-bubble-container") {
        return true
      }
      a = a.parentNode
    }
    return false
  },
  isWordMarked: function(b) {
    if (typeof b == "undefined" || b == null || b == "") {} else {
      for (var a = 0; a < this.wordList.length; a++) {
        if (this.wordList[a].toLowerCase() == b.toLowerCase()) {
          return true
        }
      }
    }
    return false
  },
  unMarkWordInWholeDocument: function(f, a) {
    if (typeof a == "undefined" || a == null) {
      this.removeFromWordList(f)
    }
    var d = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, this.acceptNode, false);
    var e = null;
    while (d.nextNode()) {
      if (e) {
        var h = e.cloneNode(false);
        var b = e.parentNode.parentNode;
        b.replaceChild(h, e.parentNode);
        e = null
      }
      var g = d.currentNode;
      var c = g.parentNode.getAttribute(this.word_title);
      if (c && c.toLowerCase() == f.toLowerCase()) {
        e = g
      } else {
        e = null
      }
    }
    if (e) {
      var h = e.cloneNode(false);
      var b = e.parentNode.parentNode;
      b.replaceChild(h, e.parentNode);
      e = null
    }
  },
  markWordInWholeDocument: function(j, k) {
    if (typeof k == "undefined" || k == null) {
      this.add2WordList(j)
    }
    var f = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, this.acceptNode, false);
    while (f.nextNode()) {
      var e = f.currentNode;
      if (this.isMarkedWord(e)) {} else {
        var g = e.nodeValue;
        g = g.toLowerCase();
        var b = -1;
        var a = /^[\u4e00-\u9fa5]+$/i;
        if (a.test(j)) {
          b = g.indexOf(j.toLowerCase())
        } else {
          var d = new RegExp("\\b" + j + "\\b", "gim");
          b = g.search(d)
        } if (b >= 0) {
          try {
            var c = e.splitText(b)
          } catch (i) {
            console.error("e1=" + i);
            break
          }
          if (!c) {
            console.error("no rest");
            break
          }
          try {
            c.splitText(j.length)
          } catch (h) {
            console.error("e2" + h);
            break
          }
          f.currentNode = this.wrapTextNodeWithSpan(c, this.createWordMarkerNode(j))
        }
      }
    }
  },
  wordUnderChecking: null,
  mouseDbClickTimer: null,
  onMouseUp: function(a) {
    if (!this.activated || a.altKey || a.ctrlKey || a.shiftKey) {
      return
    }
    if (this.bubbleShowing) {
      this.stopHide();
      this.hideBubble()
    }
    if (this.mouseDbClickTimer) {
      this.onMouseUpTimeout()
    } else {
      this.mouseDbClickTimer = window.setTimeout(function() {
        wordMarker.onMouseUpTimeout()
      }, 800)
    }
  },
  onMouseUpTimeout: function() {
    if (this.mouseDbClickTimer) {
      window.clearTimeout(this.mouseDbClickTimer);
      this.mouseDbClickTimer = null
    }
    if (!this.bubbleShowing) {
      this.checkWord()
    } else {
      this.stopHide();
      this.hideBubble()
    }
  },
  broadcastMarkWord: function(a) {
    if (this.isMarkedWord(a)) {
      return
    }
    chrome.extension.sendRequest({
      cmd: "markWordNotify",
      word: a,
      url: document.URL,
      title: document.title,
      wordCount: this.wordList.length + 1
    })
  },
  broadcastUnmarkWord: function(a) {
    if (this.isWordMarked(a)) {
      chrome.extension.sendRequest({
        cmd: "unmarkWordNotify",
        word: a,
        url: document.URL,
        title: document.title,
        wordCount: this.wordList.length - 1
      })
    } else {}
  },
  onMarkWord: function(b) {
    if (typeof b == "undefined" || b == null) {
      return
    }
    if (this.add2WordList(b) < this.wordList.length) {
      return
    }
    this.markWordInWholeDocument(b, true);
    var a = this.getSentences(b);
    this.addSentences2db(b, a)
  },
  onUnMarkWord: function(b) {
    if (typeof b == "undefined" || b == null) {
      return
    }
    if (this.isWordMarked(b)) {
      this.unMarkWordInWholeDocument(b);
      var a = this.getSentences(b);
      wordMarker.removeSentencesFromdb(b, a)
    }
  },
  popupTimeout: null,
  curNode: null,
  startHoverPopup: function(a) {
    if (!this.activated) {
      return
    }
    if (this.bubbleShowing) {
      return
    }
    if (typeof a == "undefined" || a == null) {
      return
    }
    var b = this.trim(a.getAttribute(this.word_title));
    if (b == null || b == "") {
      return
    }
    if (this.popuTimeout) {
      return
    }
    this.curNode = a;
    this.popupTimeout = window.setTimeout(this.FUNC(this, function(c) {
      this.hoverPopup(c)
    }), 800)
  },
  stopHoverPopu: function() {
    if (this.popupTimeout) {
      window.clearTimeout(this.popupTimeout);
      this.popupTimeout = null
    }
  },
  hoverPopup: function(a) {
    a = this.curNode;
    this.stopHoverPopu();
    this.lmNode = true;
    var b = this.trim(a.getAttribute(this.word_title));
    this.wordUnderChecking = b;
    this.targetRect = a.getBoundingClientRect();
    chrome.extension.sendRequest({
      cmd: "get_word_def",
      checkingId: ++this.checkingId,
      instanceId: this.dictInstanceId,
      query: b
    }, function(c) {
      wordMarker.updateBubbleContent(c)
    })
  },
  checkWord: function(c) {
    if (typeof c == "undefined" || c == null) {
      var a = window.getSelection();
      var d = this.trim(String(a));
      if (typeof d == "undefined" || d == null || d == "") {} else {
        var b = a.getRangeAt(0);
        if (b != null) {
          c = this.trim(String(b));
          if (c == null || c == "") {
            this.hideBubble();
            return
          }
          this.lmNode = this.isMarkedWord();
          this.targetRect = b.getBoundingClientRect();
          this.wordUnderChecking = c;
          this.popupBubble();
          chrome.extension.sendRequest({
            cmd: "get_word_def",
            checkingId: ++this.checkingId,
            instanceId: this.dictInstanceId,
            query: c
          }, function(e) {
            wordMarker.updateBubbleContent(e)
          })
        }
      }
    }
  },
  bubbleShowing: false,
  targetRect: null,
  hideTimer: null,
  lmNode: false,
  startHide: function(a) {
    if (typeof a == "undefined" || a == null || a == 0) {
      a = 1000
    }
    this.stopHide();
    this.bubbleShowing = false;
    this.hideTimer = window.setTimeout(function() {
      wordMarker.stopHide();
      wordMarker.hideBubble()
    }, a)
  },
  stopHide: function() {
    if (this.hideTimer) {
      window.clearTimeout(this.hideTimer)
    }
    this.bubbleShowing = true
  },
  playAudio: function(a, b) {
    if (this.audio == null) {
      this.audio = document.createElement("audio")
    }
    this.audio.src = a.target.src;
    this.audio.play()
  },
  clearBubble: function() {
    var a = document.getElementById("lm-bubble-container");
    if (a) {
      while (a.hasChildNodes()) {
        var c = a.childNodes[0];
        a.removeChild(c)
      }
      a.parentNode.removeChild(a)
    }
    this.bubbleShowing = false
  },
  createBubble: function() {
    var i = document.getElementById("lm-bubble-container");
    if (i) {
      this.clearBubble()
    }
    if (this.audio == null) {
      this.audio = document.createElement("audio")
    }
    i = document.createElement("div");
    i.id = "lm-bubble-container";
    document.body.appendChild(i);
    i.addEventListener("mouseover", function() {
      wordMarker.hookMouseUp(false);
      wordMarker.stopHide()
    });
    i.addEventListener("mouseout", function() {
      wordMarker.hookMouseUp(true);
      wordMarker.startHide()
    });
    var c = document.createElement("div");
    c.id = "lm-bubble-main";
    var j = document.createElement("div");
    if (this.lmNode) {
      j.id = "lm-bubble-unmark";
      j.className = "lm-img-btn";
      j.title = "unmark the word";
      j.addEventListener("click", function(b) {
        wordMarker.stopHide();
        wordMarker.hideBubble();
        wordMarker.broadcastUnmarkWord(wordMarker.wordUnderChecking)
      })
    } else {
      j.id = "lm-bubble-marker";
      j.className = "lm-img-btn";
      j.title = "mark the word";
      j.addEventListener("click", function(b) {
        wordMarker.stopHide();
        wordMarker.hideBubble();
        if (wordMarker.wordUnderChecking) {
          wordMarker.broadcastMarkWord(wordMarker.wordUnderChecking)
        }
      })
    }
    c.appendChild(j);
    var l = document.createElement("div");
    l.id = "lm-bubble-query-container";
    l.className = "lm-display-block";
    c.appendChild(l);
    var h = document.createElement("div");
    h.id = "lm-bubble-meaning";
    c.appendChild(h);
    var k = document.createElement("div");
    k.id = "lm-arrow-container";
    var g = document.createElement("div");
    g.id = "lm-arrow-main";
    var d = document.createElement("div");
    d.id = "lm-bubble-arrow-inner-down";
    d.className = "lm-display-none";
    var a = document.createElement("div");
    a.id = "lm-bubble-arrow-outer-down";
    a.className = "lm-display-none";
    var f = document.createElement("div");
    f.id = "lm-bubble-arrow-inner-up";
    f.className = "lm-display-none";
    var e = document.createElement("div");
    e.id = "lm-bubble-arrow-outer-up";
    e.className = "lm-display-none";
    g.appendChild(d);
    g.appendChild(a);
    g.appendChild(f);
    g.appendChild(e);
    k.appendChild(g);
    i.appendChild(c);
    i.appendChild(k);
    this.bubbleShowing = true
  },
  curEntry: null,
  updateBubbleContent: function(d) {
    this.curEntry = null;
    if (typeof d == "undefined" || d == null) {
      return
    }
    if (d.instanceId != this.dictInstanceId || d.checkingId != this.checkingId) {
      return
    }
    var h = document.getElementById("lm-bubble-query-container");
    if (!this.bubbleShowing || h == null) {
      this.createBubble();
      h = document.getElementById("lm-bubble-query-container");
      if (h == null) {
        return
      }
    }
    while (h.hasChildNodes()) {
      var e = h.childNodes[0];
      h.removeChild(e)
    }
    var b = document.createElement("div");
    b.id = "lm-bubble-query";
    var f = document.getElementById("lm-bubble-meaning");
    if (f == null) {
      f = document.createElement("div");
      f.id = "lm-bubble-meaning"
    }
    if (d.status == 100) {
      f.innerHTML = "checking word....";
      this.startHide(3500)
    } else {
      if (d.status == 404) {
        f.innerHTML = "word not found in dictionaries <br>or network error.";
        this.startHide(2500)
      } else {
        if (d.status == 200) {
          this.startHide(3500);
          var n = d.entry;
          this.curEntry = n;
          if (n == null) {
            b.innerHTML = "internal error: null dictionary entry";
            h.appendChild(b)
          } else {
            b.innerHTML = n.sanitizedQuery ? n.sanitizedQuery : n.query;
            h.appendChild(b);
            for (var j = 0; j < n.audio.length; j++) {
              var l = document.createElement("div");
              l.id = "lm-bubble-audio-icon";
              l.className = "lm-img-btn";
              l.src = n.audio[j];
              l.title = n.audio[j];
              l.addEventListener("click", function(a) {
                wordMarker.playAudio(a, l.src)
              });
              h.appendChild(l);
              if (j >= 0) {
                break
              }
            }
            for (var j = 0; j < n.phoneticSymbol.length; j++) {
              var l = document.createElement("div");
              l.id = "lm-bubble-phonetic";
              l.innerHTML = n.phoneticSymbol[j];
              h.appendChild(l);
              if (j >= 0) {
                break
              }
            }
            f.innerHTML = n.shortMeaning + ' <a href="#" id="lm_show_detail" >detail</a>'
          }
        }
      }
    }
    var c = document.getElementById("lm-bubble-main");
    c.appendChild(f);
    var k = document.getElementById("lm_show_detail");
    if (k) {
      k.addEventListener("click", function() {
        if (wordMarker.definitionPanel) {
          wordMarker.definitionPanel.show(wordMarker.curEntry)
        }
      })
    }
    var g = document.createElement("div");
    g.id = "lm-bubble-query-container-end";
    h.appendChild(g);
    this.setBubblePos()
  },
  setBubblePos: function() {
    if (this.targetRect == null) {
      return
    }
    var c = document.getElementById("lm-bubble-arrow-inner-down");
    var a = document.getElementById("lm-bubble-arrow-outer-down");
    var f = document.getElementById("lm-bubble-arrow-inner-up");
    var d = document.getElementById("lm-bubble-arrow-outer-up");
    var b = document.getElementById("lm-bubble-main");
    b.className = "lm-display-block";
    var g = document.getElementById("lm-arrow-main");
    g.className = "lm-display-block";
    var e = true;
    var h = this.targetRect.top;
    var i = this.targetRect.left + this.targetRect.width / 2;
    if (h < b.offsetHeight + 20) {
      e = false;
      h = this.targetRect.bottom
    }
    h += document.body.scrollTop;
    i += document.body.scrollLeft;
    if (e) {
      h -= 3;
      c.className = "lm-display-block";
      a.className = "lm-display-block";
      f.className = "lm-display-none";
      d.className = "lm-display-none";
      g.style.left = i - 11 + "px";
      g.style.top = h - 22 + "px";
      b.style.left = i - b.offsetWidth / 2 + "px";
      b.style.top = h - 15 - b.offsetHeight + "px"
    } else {
      c.className = "lm-display-none";
      a.className = "lm-display-none";
      f.className = "lm-display-block";
      d.className = "lm-display-block";
      g.style.left = i - 11 + "px";
      g.style.top = h + "px";
      b.style.left = i - b.offsetWidth / 2 + "px";
      b.style.top = h + 17 + "px"
    }
  },
  popupBubble: function() {
    this.createBubble();
    this.setBubblePos();
    var b = document.getElementById("lm-bubble-main");
    b.className = "lm-display-block";
    var a = document.getElementById("lm-arrow-main");
    a.className = "lm-display-block";
    this.startHide(3500)
  },
  hideBubble: function() {
    this.clearBubble();
    wordMarker.hookMouseUp(true)
  },
  getSentences: function(f) {
    var b = document.body.innerText;
    var g = '([^\\n\\r\\.\\!\\?\\"]*?' + f + '[^\\n\\r\\.\\!\\?\\"]*[\\.\\!\\?\\"])';
    var e = new RegExp(g, "gmi");
    var a = b.match(e);
    var c = [];
    if (a) {
      for (var d = 0; d < a.length; d++) {
        if (a[d].length < f.length + 5) {} else {
          c.push(this.trimSentence(a[d]))
        }
      }
    }
    return c
  },
  addSentences2db: function(c, a) {
    if (typeof c == "undefined" || c == null || typeof a == "undefined" || a == null) {
      return
    }
    for (var b = 0; b < a.length; b++) {
      chrome.extension.sendRequest({
        cmd: "addSentence",
        word: c,
        url: document.URL,
        title: document.title,
        sentence: a[b]
      })
    }
  },
  removeSentencesFromdb: function(c, a) {
    if (typeof c == "undefined" || c == null || typeof a == "undefined" || a == null) {
      return
    }
    for (var b = 0; b < a.length; b++) {
      chrome.extension.sendRequest({
        cmd: "removeSentence",
        word: c,
        url: document.URL,
        title: document.title,
        sentence: a[b]
      })
    }
  },
  definitionPanel: new LM_DEFINITION()
};

function onWordMarkerMouseUp(a) {
  return wordMarker.onMouseUp(a)
}(function() {
  wordMarker.initMsgHandler()
}());
var scrapMarker = {
  trim: function(a) {
    if (typeof a == "undefined" || a == null) {
      return ""
    }
    return a.replace(/^\s+|\s+$/g, "")
  },
  initMsgHandler: function() {
    chrome.extension.onRequest.addListener(function(b, c, a) {
      if (b.cmd == "TODO") {
        scrapMarker.a(b, c, a)
      } else {
        if (b.cmd == "toggleWordMarkerEnable") {
          scrapMarker.onActivate(b, c, a)
        } else {
          if (b.cmd == "modifyMarker") {
            scrapMarker.onChangeMarkerStyle(b.spen)
          } else {
            scrapMarker.a(b, c, a)
          }
        }
      }
    });
    this.initialize()
  },
  onActivate: function(b, c, a) {
    this.activated = !this.activated;
    if (this.activated) {
      this.markScrapList(this.scrapList)
    } else {
      this.unmarkScrapList(this.scrapList)
    }
  },
  onStatusQuery: function(b, c, a) {},
  a: function(b, c, a) {},
  hookMouseUp: function(a) {
    if (typeof a == "undefined" || a) {
      window.addEventListener("mouseup", onMouseUp)
    } else {
      window.removeEventListener("mouseup", onMouseUp)
    }
  },
  initialize: function() {
    this.hookMouseUp(true);
    chrome.extension.sendRequest({
      cmd: "initializeScrapMarker",
      url: document.URL
    }, function(a) {
      scrapMarker.onInitialized(a)
    })
  },
  onInitialized: function(a) {
    this.penStyle = a.scrapPen;
    this.activated = a.state;
    this.scrapList = a.scrapList;
    this.markScrapList(this.scrapList)
  },
  activated: true,
  markerType: "learner_marker_scrap",
  lm_title: "lm_title",
  lm_anchor: "lm_anchor",
  penStyle: "markerpen6",
  onChangeMarkerStyle: function(a) {
    if (typeof a == "undefined" || a == null) {} else {
      this.penStyle = a
    }
  },
  acceptNode: function(a) {
    if (a.nodeType == a.TEXT_NODE && !(/[^\t\n\r ]/.test(a.nodeValue))) {
      return NodeFilter.FILTER_REJECT
    }
    return NodeFilter.FILTER_ACCEPT
  },
  unMarkScrap: function(g, i) {
    if (typeof i == "undefined" || i == null || i == "") {
      i = false
    }
    if (typeof g == "undefined" || g == null || g == "") {
      g = false
    }
    var c = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, this.acceptNode, false);
    var d = null;
    while (c.nextNode()) {
      if (d) {
        var e = d.cloneNode(false);
        var a = d.parentNode.parentNode;
        a.replaceChild(e, d.parentNode);
        d = null
      }
      var b = c.currentNode;
      if (i) {
        var h = b.parentNode.getAttribute("lm_anchor");
        if (i == h) {
          d = b
        } else {
          d = null
        }
      } else {
        if (g) {
          var f = b.parentNode.getAttribute("lm_title");
          if (f == g) {
            d = b
          } else {
            d = null
          }
        }
      }
    }
    if (d) {
      var e = d.cloneNode(false);
      var a = d.parentNode.parentNode;
      a.replaceChild(e, d.parentNode);
      d = null
    }
  },
  isTextNode: function(a) {
    return a.nodeType == a.TEXT_NODE
  },
  createScrapMarkerNode: function(a, c) {
    var b = document.createElement("span");
    b.className = this.penStyle;
    b.setAttribute("type", this.markerType);
    b.setAttribute(this.lm_title, a);
    if (typeof c != "undefined" && c != null && c != "") {
      b.setAttribute(this.lm_anchor, c)
    }
    return b
  },
  markSelection: function() {
    var c = window.getSelection();
    var b = this.trim(String(c));
    if (b == "") {
      return
    }
    var e = oakAnchor.encodeAnchor(c);
    this.add2Scrapbook(b, e);
    for (var d = 0; d < c.rangeCount; ++d) {
      var a = c.getRangeAt(d);
      this.markRange(a, e, b)
    }
  },
  markScrapByAnchor: function(b, e) {
    if (!oakAnchor.isAnchorInDoc(e)) {
      return
    }
    var c = oakAnchor.decodeAnchorUrl(document, e);
    if (c) {
      var a = document.createRange();
      try {
        a.setStart(c.startNode, c.startOffset);
        a.setEnd(c.endNode, c.endOffset)
      } catch (d) {
        return null
      }
      this.markRange(a, e, b)
    }
  },
  markScrapList: function(b) {
    for (var a = 0; a < b.length; a++) {
      this.markScrapByAnchor(b[a].scrap, b[a].pos)
    }
  },
  unmarkScrapList: function(b) {
    for (var a = 0; a < b.length; a++) {
      this.unMarkScrap(b[a].scrap, b[a].pos)
    }
  },
  wrapTextNodeWithSpan: function(b, c) {
    var d = b.cloneNode(false);
    var a = b.parentNode;
    c.appendChild(d);
    a.replaceChild(c, b);
    c.addEventListener("mouseover", function(e) {
      scrapMarker.hoverPopup(e.target)
    });
    c.addEventListener("mouseout", function(e) {
      scrapMarker.startHide(1000)
    });
    return d
  },
  markRange: function(g, k, f) {
    var i = document;
    var e = g.startContainer;
    var j = g.endContainer;
    var l = g.startOffset;
    var d = g.endOffset;
    var a = (e == j);
    if (!a) {}
    if (!a || !this.isTextNode(e)) {
      var c = i.createTreeWalker(g.commonAncestorContainer, NodeFilter.SHOW_TEXT, this.acceptNode, false);
      c.currentNode = e;
      for (var b = c.nextNode(); b && b != j; b = c.nextNode()) {
        c.currentNode = this.wrapTextNodeWithSpan(b, this.createScrapMarkerNode(f, k))
      }
    }
    if (this.isTextNode(j)) {
      j.splitText(d)
    }
    if (!a) {
      this.wrapTextNodeWithSpan(j, this.createScrapMarkerNode(f, k))
    }
    if (this.isTextNode(e)) {
      var h = e.splitText(l);
      if (a) {
        this.wrapTextNodeWithSpan(h, this.createScrapMarkerNode(f, k))
      } else {
        this.wrapTextNodeWithSpan(h, this.createScrapMarkerNode(f, k))
      }
    }
    g.collapse(true)
  },
  removeFromScrapbook: function(b, a) {
    chrome.extension.sendRequest({
      cmd: "removeScrapUrl",
      scrap: String(b),
      url: document.URL,
      title: document.title,
      pos: a
    })
  },
  add2Scrapbook: function(b, a, c) {
    if (typeof c == "undefined" || !c) {
      c = ""
    }
    chrome.extension.sendRequest({
      cmd: "addScrapUrl",
      txt: String(b),
      pos: a,
      note: c,
      url: document.URL,
      title: document.title
    })
  },
  onMouseUp: function(a) {
    if (!this.activated || !a.ctrlKey) {
      return
    }
    if (!this.bubbleShowing) {
      this.markSelection()
    } else {
      this.stopHide();
      this.hideBubble()
    }
  },
  hoverPopup: function(a) {
    if (!this.activated) {
      return
    }
    if (typeof a == "undefined" || a == null) {
      return
    }
  },
  startHide: function(a) {}
};

function onMouseUp(a) {
  return scrapMarker.onMouseUp(a)
}(function() {
  scrapMarker.initMsgHandler()
}());

function LM_DEFINITION(a) {
  this.FUNC = function(d, c) {
    return function() {
      return c.apply(d, arguments)
    }
  };
  this.trim = function(b) {
    if (typeof b == "string") {
      return b.replace(/^\s+|\s+$/g, "")
    } else {
      return b
    }
  };
  this.entry = a;
  this.container = null;
  this.board = null;
  this.scrollTop = 0;
  this.scrollLeft = 0;
  this.boardId = "lm_definition_container";
  this.show = function(b, c) {
    if (typeof b == "undefined" || b == null) {
      return
    }
    this.entry = b;
    if (typeof c == "undefined" || c == null) {}
    this.createBoard(c);
    this.cover(document, "lm_definition_covered", true)
  };
  this.getClass = function(b) {
    if (typeof b == "undefined" || b == null) {
      return []
    }
    var c = b.className.split(/\s/);
    return c
  };
  this.isClassExist = function(d, e) {
    for (var b = 0; b < d.length; b++) {
      if (d[b] == e) {
        return b
      }
    }
    return -1
  };
  this.removeClass = function(g, h) {
    var f = this.getClass(g);
    var b = this.isClassExist(f, h);
    if (b < 0) {} else {
      f.splice(b, 1);
      var d = f.join(" ");
      d = d.replace(/^\s+|\s+$/g, "");
      g.className = d
    }
  };
  this.addClass = function(g, h) {
    var f = this.getClass(g);
    var b = this.isClassExist(f, h);
    if (b < 0) {
      f.push(h);
      var d = f.join(" ");
      d = d.replace(/^\s+|\s+$/g, "");
      g.className = d
    } else {}
  };
  this.cover = function(g, k, j) {
    var f = g.getElementsByTagName("html");
    var d = g.getElementsByTagName("body");
    for (var e = 0; e < f.length; e++) {
      if (typeof j == "undefined" || !j) {
        this.removeClass(f[e], k)
      } else {
        this.addClass(f[e], k)
      }
    }
    for (var e = 0; e < d.length; e++) {
      if (typeof j == "undefined" || !j) {
        this.removeClass(d[e], k)
      } else {
        this.addClass(d[e], k)
      }
    }
  };
  this.hide = function() {
    this.clearBoard();
    this.cover(document, "lm_definition_covered", false)
  };
  this.createBoard = function(k) {
    this.clearBoard();
    var B = document;
    this.scrollLeft = window.scrollX;
    this.scrollTop = window.scrollY;
    window.scrollTo(0, 0);
    if (typeof k == "undefined" || k == null) {
      var x = document.getElementById("lm_definition_iframe");
      if (!x) {
        x = document.createElement("iframe");
        x.id = "lm_definition_iframe";
        document.body.appendChild(x);
        B = x.contentDocument;
        var h = B.getElementsByTagName("head")[0];
        var n = B.createElement("meta");
        n.setAttribute("http-equiv", "pragma");
        n.setAttribute("content", "no-cache");
        h.appendChild(n);
        n = n.cloneNode(false);
        n.setAttribute("http-equiv", "Cache-Control");
        n.setAttribute("content", "no-cache, must-revalidate");
        h.appendChild(n);
        B.body.className = "lm-body-main";
        var j = B.createElement("base");
        j.setAttribute("target", "_self");
        h.appendChild(j);
        var e = B.createElement("link");
        e.type = "text/css";
        e.rel = "stylesheet";
        e.href = chrome.extension.getURL("css/lm_definition.css");
        h.appendChild(e)
      } else {
        B = x.contentDocument
      }
      var g = x.contentWindow;
      x.addEventListener("keyup", this.FUNC(this, function(b) {
        this.hide()
      }));
      if (g) {
        g.addEventListener("keyup", this.FUNC(this, function(b) {
          this.hide()
        }))
      }
      B = x.contentDocument;
      x.setAttribute("style", "top:0px; left:0px;");
      this.container = B.body
    }
    var o = B.createElement("div");
    var d = o.cloneNode(false);
    d.id = "lm_definition_main";
    this.container.appendChild(d);
    var c = o.cloneNode(false);
    c.id = "lm_definition_title";
    d.appendChild(c);
    t = o.cloneNode(false);
    t.id = "lm_title_box";
    c.appendChild(t);
    var m = o.cloneNode(false);
    m.id = "lm_definition_query";
    m.innerHTML = this.entry.query;
    t.appendChild(m);
    var y = B.createElement("div");
    y.id = "lm-definition-close";
    y.className = "lm-img-btn";
    y.title = "close definition panel ";
    y.addEventListener("click", this.FUNC(this, function(b) {
      this.hide()
    }));
    t.appendChild(y);
    var z = o.cloneNode(false);
    z.id = "lm_definition_body";
    d.appendChild(z);
    if (this.entry.sanitizedQuery) {
      var s = this.trim(this.entry.sanitizedQuery);
      if (s != "") {
        m = o.cloneNode(false);
        m.id = "lm_definition_sanitized_query";
        m.innerText = this.entry.sanitizedQuery;
        z.appendChild(m)
      }
    }
    if (this.entry.wordStem && this.entry.wordStem.length > 0) {
      m = o.cloneNode(false);
      m.id = "lm_definition_word_stem";
      m.innerHTML = this.entry.wordStem.join(", ");
      z.appendChild(m)
    }
    if (this.entry.phoneticSymbol && this.entry.phoneticSymbol.length > 0) {
      m = o.cloneNode(false);
      m.id = "lm_definition_phonetic_symbol";
      m.innerHTML = this.entry.phoneticSymbol.join(", ");
      z.appendChild(m)
    }
    if (this.entry.audio && this.entry.audio.length > 0) {
      z.appendChild(m);
      for (var v = 0; v <= this.entry.audio.length; v++) {
        var A = o.cloneNode(false);
        if (v < this.entry.audio.length) {
          A.id = "lm-bubble-audio-icon";
          A.src = this.entry.audio[v];
          A.title = this.entry.audio[v];
          A.addEventListener("click", this.FUNC(this, function(b) {
            this.playAudio(b)
          }))
        } else {
          A.id = "lm-bubble-audio-space"
        }
        A.className = "lm-img-btn";
        m.appendChild(A)
      }
    }
    if (this.entry.morphs && this.entry.morphs.length > 0) {
      m = o.cloneNode(false);
      m.id = "lm_definition_morphs";
      var q = "";
      for (var v = 0; v < this.entry.morphs.length; v++) {
        var u = this.entry.morphs[v];
        q += u.type + ":" + u.text + "; "
      }
      m.innerHTML = q;
      z.appendChild(m)
    }
    if (this.entry.antonym && this.entry.antonym.length > 0) {
      m = o.cloneNode(false);
      m.id = "lm_definition_antonym";
      m.innerHTML = this.entry.antonym.join(", ");
      z.appendChild(m)
    }
    if (this.entry.homoionym && this.entry.homoionym.length > 0) {
      m = o.cloneNode(false);
      m.id = "lm_definition_homonionym";
      m.innerHTML = this.entry.homoionym.join(", ");
      z.appendChild(m)
    }
    if (this.entry.synonym && this.entry.synonym.length > 0) {
      m = o.cloneNode(false);
      m.id = "lm_definition_synonym";
      var q = "synonym: ";
      for (var v = 0; v < this.entry.synonym.length; v++) {
        var l = this.entry.synonym[v];
        q += l.orig;
        if (typeof l.trans == "undefined" || l.trans == null) {} else {
          q += "(" + l.trans + ")"
        }
        q += "; "
      }
      m.innerHTML = q;
      z.appendChild(m)
    }
    if (this.entry.pinyin && this.entry.pinyin.length > 0) {
      m = o.cloneNode(false);
      m.id = "lm_definition_pinyin";
      m.innerHTML = this.entry.pinyin.join(", ");
      z.appendChild(m)
    }
    if (this.entry.shortMeaning && this.entry.shortMeaning.length > 0) {
      m = o.cloneNode(false);
      m.id = "lm_definition_short_meaning";
      m.innerHTML = this.entry.shortMeaning;
      z.appendChild(m)
    }
    if (this.entry.meaningTerms && this.entry.meaningTerms.length > 0) {
      m = o.cloneNode(false);
      m.id = "lm_definition_meaning_terms";
      var q = "Meaning Terms:<br>";
      for (var v = 0; v < this.entry.meaningTerms.length; v++) {
        var p = this.entry.meaningTerms[v];
        q += "<li >" + p + "</li>"
      }
      m.innerHTML = q;
      z.appendChild(m)
    }
    if (this.entry.sampleSentences && this.entry.sampleSentences.length > 0) {
      m = o.cloneNode(false);
      m.id = "lm_definition_sample_sentenses";
      var q = "Sample Sentences:<br>";
      for (var v = 0; v < this.entry.sampleSentences.length; v++) {
        var r = this.entry.sampleSentences[v];
        q += "<li >" + r.orig;
        if (typeof r.trans == "undefined" || r.trans == null) {} else {
          q += "<br>" + r.trans
        }
        q += "</li>"
      }
      m.innerHTML = q;
      z.appendChild(m)
    }
  };
  this.audio = null;
  this.playAudio = function(d, g) {
    if (this.audio == null) {
      var b = document.getElementById("lm_definition_iframe");
      if (b) {
        var c = b.contentDocument;
        this.audio = c.createElement("audio")
      }
    }
    this.audio.src = d.target.src;
    this.audio.play()
  };
  this.clearBoard = function() {
    var c = document.getElementById("lm_definition_iframe");
    if (c) {
      var d = c.contentDocument;
      if (this.container) {
        var b = d.getElementById("lm_definition_main");
        if (b) {
          this.container.removeChild(b)
        }
      }
      c.setAttribute("style", "top:-100%; left:-100%;");
      window.scrollTo(this.scrollLeft, this.scrollTop)
    }
  }
};