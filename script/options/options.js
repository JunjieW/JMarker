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
}
var Options = {
  optionPages: [],
  selectedMenuClass: "navbar-item navbar-item-selected",
  unselectedMenuClass: "navbar-item",
  clearContentView: function() {
    var a = document.getElementById("content_view");
    if (a == null) {} else {
      while (a.hasChildNodes()) {
        var b = a.childNodes[0];
        a.removeChild(b)
      }
    }
    return a
  },
  activatePage: function(g) {
    var a = 0;
    if (typeof g == undefined || g == null) {} else {
      for (var c = 0; c < this.optionPages.length; c++) {
        if (this.optionPages[c].menuId == g.target.id) {
          a = c;
          break
        }
      }
    }
    var d = document.getElementById("navbar");
    var f = d.getElementsByTagName("li");
    for (var c = 0; c < f.length; c++) {
      if (a != c) {
        f[c].className = this.unselectedMenuClass
      } else {
        f[c].className = this.selectedMenuClass
      }
    }
    var b = this.clearContentView();
    this.optionPages[a].initOptionPage(b)
  },
  register: function(d) {
    this.optionPages.push(d);
    var c = document.getElementById("navbar");
    var a = document.createElement("li");
    a.id = d.menuId;
    a.innerHTML = d.menuText;
    if (this.optionPages.length == 1) {
      a.className = this.selectedMenuClass;
      var b = this.clearContentView();
      d.initOptionPage(b)
    } else {
      a.className = this.unselectedMenuClass
    }
    c.appendChild(a);
    a.addEventListener("click", function(f) {
      Options.activatePage(f)
    })
  }
};
(function() {}());
var markerOptionPage = {
  menuId: "menu-marker-option-page",
  menuText: "Markers",
  initOptionPage: function(d) {
    var y = document.createElement("table");
    d.appendChild(y);
    var a = document.createElement("tr");
    var j = document.createElement("td");
    var k = document.createElement("div");
    var m = k.cloneNode(false);
    m.id = "pen_layout_div";
    var C = a.cloneNode(false);
    y.appendChild(C);
    var f = j.cloneNode(false);
    var z = k.cloneNode(false);
    z.className = "marker_pens_group";
    var l = document.createElement("u");
    l.innerHTML = "Markers for New Word";
    z.appendChild(l);
    f.appendChild(z);
    var E = k.cloneNode(false);
    E.className = "pen_radio";
    z.appendChild(E);
    var o = document.createElement("p");
    var B = document.createElement("input");
    var x = document.createElement("span");
    for (var w = 0; w < 10; w++) {
      var q = w + 1;
      var c = o.cloneNode(false);
      var h = B.cloneNode(false);
      h.type = "radio";
      h.id = "wordpen" + q;
      h.name = "word_pens";
      h.value = "markerpen" + q;
      var r = x.cloneNode(false);
      r.className = "markerpen" + q;
      r.innerHTML = "Word Pen " + q + "#";
      E.appendChild(c);
      E.appendChild(h);
      E.appendChild(r)
    }
    var e = f.cloneNode(true);
    C.appendChild(e);
    l.innerHTML = "Markers for scrapbook";
    var s = E.getElementsByTagName("input");
    var g = E.getElementsByTagName("span");
    for (var w = 0; w < s.length; w++) {
      var q = w + 1;
      s[w].id = "scrappen" + q;
      s[w].name = "scrap_pens";
      g[w].innerHTML = "Scrap Pen " + q + "# "
    }
    C.appendChild(f);
    y.appendChild(a);
    var A = a.cloneNode(false);
    y.appendChild(A);
    A.appendChild(j);
    j.setAttribute("colspan", "2");
    j.setAttribute("align", "center");
    var D = document.createElement("hr");
    j.appendChild(D);
    B.type = "button";
    B.value = "Save Marker Configurations";
    B.size = "25";
    B.id = "btn_save_marker_configuration";
    B.className = "lm_btn lm_bigrounded lm_rosy";
    j.appendChild(B);
    this.hookUpdateMarker()
  },
  init: function() {
    if (typeof Options == "undefined" || Options == null) {} else {
      Options.register({
        menuId: this.menuId,
        menuText: this.menuText,
        initOptionPage: function(a) {
          return markerOptionPage.initOptionPage(a)
        }
      })
    }
  },
  hookUpdateMarker: function() {
    var a = "markerpen1";
    var b = "markerpen5";
    if (localStorage.default_word_pen) {
      a = localStorage.default_word_pen
    } else {
      localStorage.default_word_pen = a
    } if (localStorage.default_scrap_pen) {
      b = localStorage.default_scrap_pen
    } else {
      localStorage.default_scrap_pen = b
    }
    var d = document.getElementsByName("word_pens");
    for (var c = 0; c < d.length; c++) {
      if (d[c].value == a) {
        d[c].checked = true;
        break
      }
    }
    var e = document.getElementsByName("scrap_pens");
    for (var c = 0; c < e.length; c++) {
      if (e[c].value == b) {
        e[c].checked = true;
        break
      }
    }
    document.getElementById("btn_save_marker_configuration").addEventListener("click", function() {
      var g = document.getElementsByName("word_pens");
      for (var f = 0; f < g.length; f++) {
        if (g[f].checked) {
          localStorage.default_word_pen = g[f].value;
          break
        }
      }
      var h = document.getElementsByName("scrap_pens");
      for (var f = 0; f < h.length; f++) {
        if (h[f].checked) {
          localStorage.default_scrap_pen = h[f].value;
          break
        }
      }
      chrome.extension.sendRequest({
        cmd: "updateMarker",
        from: "options",
        wpen: localStorage.default_word_pen,
        spen: localStorage.default_scrap_pen
      })
    })
  }
};
(function() {
  window.addEventListener("load", function() {
    markerOptionPage.init()
  })
}());
var dbOptionPage = {
  menuId: "menu-db-option-page",
  menuText: "DB Options",
  initOptionPage: function(d) {
    var k = document.createElement("div");
    var l = document.createElement("p");
    var s = document.createElement("br");
    var v = document.createElement("hr");
    var o = document.createElement("table");
    o.id = "lm_db_option_table";
    var a = document.createElement("tr");
    var f = document.createElement("td");
    k.id = "db_layout_div";
    d.appendChild(k);
    l.className = "db_title";
    l.innerHTML = "Database Management";
    k.appendChild(l);
    k.appendChild(s);
    k.appendChild(v);
    k.appendChild(o);
    var j = a.cloneNode(false);
    var c = f.cloneNode(false);
    c.innerHTML = "";
    j.appendChild(c);
    c = f.cloneNode(false);
    c.innerHTML = "Reset";
    j.appendChild(c);
    c = f.cloneNode(false);
    c.innerHTML = "Import DB";
    j.appendChild(c);
    c = f.cloneNode(false);
    c.innerHTML = "Export DB";
    j.appendChild(c);
    o.appendChild(j);
    var u = f.cloneNode(false);
    var b = f.cloneNode(false);
    var i = document.createElement("input");
    i.type = "button";
    i.value = "Reset Dictionary DB";
    i.setAttribute("size", "20");
    i.id = "btn_reset_db_dict";
    i.className = "lm_btn lm_medium lm_white lm_fix_size";
    b.appendChild(i);
    u.innerHTML = "Dictionary Database";
    var g = document.createElement("input");
    g.type = "file";
    g.id = "lm_dict_import_fn";
    g.className = "lm_fix_size";
    var h = b.cloneNode(false);
    h.appendChild(g);
    var n = i.cloneNode(false);
    n.id = "lm_dict_export_fn";
    n.value = "Export Dictionary";
    var q = b.cloneNode(false);
    q.appendChild(n);
    var m = q.cloneNode(false);
    m.id = "lm_dict_exported_file";
    a.appendChild(u);
    a.appendChild(b);
    a.appendChild(h);
    a.appendChild(q);
    a.appendChild(m);
    var r = a.cloneNode(true);
    o.appendChild(r);
    u.innerHTML = "Scrapbook Database";
    i.value = "Reset Scrapbook DB";
    i.id = "btn_reset_db_scrap";
    g.id = "lm_scrapbook_import_fn";
    n.id = "lm_scrapbook_export_fn";
    n.value = "Export Scrapbook";
    m.id = "lm_scrapbook_exported_file";
    r = a.cloneNode(true);
    o.appendChild(r);
    u.innerHTML = "Sentences Database";
    i.value = "Reset Sentences DB";
    i.id = "btn_reset_db_sentences";
    g.id = "lm_sentences_import_fn";
    n.id = "lm_sentences_export_fn";
    n.value = "Export Sentences";
    m.id = "lm_sentences_exported_file";
    o.appendChild(a);
    var e = v.cloneNode(false);
    k.appendChild(e);
    d.appendChild(k);
    this.hookResetDB()
  },
  hookResetDB: function() {
    document.getElementById("btn_reset_db_dict").addEventListener("click", function() {
      var a = confirm("All checked definitions including updated definitions will be purged, are you sure to reset dictionary? ");
      if (a) {
        chrome.extension.sendRequest({
          cmd: "resetWordBank",
          from: "options",
          db: "dictionary"
        })
      } else {}
    });
    document.getElementById("btn_reset_db_scrap").addEventListener("click", function() {
      var a = confirm("All marked scraps will be purged, are you sure to reset scrapbook? ");
      if (a) {
        chrome.extension.sendRequest({
          cmd: "resetWordBank",
          from: "options",
          db: "scrapbook"
        })
      } else {}
    });
    document.getElementById("btn_reset_db_sentences").addEventListener("click", function() {
      var a = confirm("All sentences will be purged, are you sure to reset sentences db? ");
      if (a) {
        chrome.extension.sendRequest({
          cmd: "resetWordBank",
          from: "options",
          db: "sentences"
        })
      } else {}
    });
    lmFileReader.initMsgHandler();
    document.getElementById("lm_dict_export_fn").addEventListener("click", function() {
      document.getElementById("lm_dict_exported_file").innerHTML = "exporting dictionary....";
      chrome.extension.sendRequest({
        cmd: "exportDictiory",
        from: "options"
      }, function(b) {
        var a = b;
        document.getElementById("lm_dict_exported_file").innerHTML = '<a href="' + a + '" target="_blank" title="to Download, Link Save As..." >dictionary exported</a>'
      })
    });
    document.getElementById("lm_scrapbook_export_fn").addEventListener("click", function() {
      document.getElementById("lm_scrapbook_exported_file").innerHTML = "exporting scrapbook....";
      chrome.extension.sendRequest({
        cmd: "exportScrapbook",
        from: "options"
      }, function(b) {
        var a = b;
        document.getElementById("lm_scrapbook_exported_file").innerHTML = '<a href="' + a + '" target="_blank" title="to Download, Link Save As..." >scrapbook exported</a>'
      })
    });
    document.getElementById("lm_sentences_export_fn").addEventListener("click", function() {
      document.getElementById("lm_sentences_exported_file").innerHTML = "exporting sentences....";
      chrome.extension.sendRequest({
        cmd: "exportSentence",
        from: "options"
      }, function(b) {
        var a = b;
        document.getElementById("lm_sentences_exported_file").innerHTML = '<a href="' + a + '" target="_blank" title="to Download, Link Save As..." >sentences exported</a>'
      })
    })
  },
  init: function() {
    if (typeof Options == "undefined" || Options == null) {} else {
      Options.register({
        menuId: this.menuId,
        menuText: this.menuText,
        initOptionPage: function(a) {
          return dbOptionPage.initOptionPage(a)
        }
      })
    }
  }
};
(function() {
  window.addEventListener("load", function() {
    dbOptionPage.init()
  })
}());
var pagedWordList = {
  totalWord: 0,
  pageSize: 10,
  curPage: 0,
  input_curpage: 0,
  totalPages: 0,
  filterKey: "",
  _WordList: null,
  _Sentences: null,
  _CurWord: null,
  _curDef: null,
  _curWordIdx: 0,
  _deletingNode: null,
  _deletingInterval: 20,
  _deletingCounter: 0,
  _deletingThreshold: 10,
  _deletingHeight: 0,
  _delTimer: null,
  regexDivBr: /\s*<div\s*>\s*<br\s*>\s*<\/div\s*>\s*/gi,
  regexBr: /\s*<br\s*>\s*/gi,
  regexRR: /\s*\n\s*\n\s*/gi,
  regexDiv: /\s*<div\s*>\s*<\/div\s*>\s*/gi,
  init: function() {
    this.curPage = 0;
    this.filterKey = "";
    document.getElementById("wordlist_search_box").value = "";
    console.log("init:" + this.totalPages + "|" + this.totalWord);
    chrome.extension.onRequest.addListener(function(b, c, a) {
      if (b.cmd == "get_word_def_response") {
        pagedWordList.updateWordDefinition(b.msg)
      }
    });
    chrome.extension.sendRequest({
      cmd: "init_lm_dict_instance",
      url: document.URL
    }, function(a) {
      pagedWordList.onInitialized(a)
    })
  },
  updatePage: function() {
    chrome.extension.sendRequest({
      cmd: "getPagedWordListOfUrl",
      from: "options",
      limit: {
        offset: (this.curPage * this.pageSize),
        size: this.pageSize,
        filter: this.filterKey
      }
    }, function(a) {
      pagedWordList.createWordListTable(a)
    });
    if (this.curPage == 0) {} else {
      if (this.curPage >= this.totalPages) {}
    } if (this.curPage > 0) {} else {} if (this.curPage < this.totalPage) {} else {}
  },
  nextPage: function() {
    if (this.curPage < this.totalPages) {
      this.curPage += 1;
      this.updatePage()
    }
  },
  prevPage: function() {
    if (this.curPage > 0) {
      this.curPage -= 1;
      this.updatePage()
    }
  },
  firstPage: function() {
    if (this.curPage != 0) {
      this.curPage = 0
    }
    chrome.extension.sendRequest({
      cmd: "getWordCounterOfUrl",
      from: "options",
      filter: this.filterKey
    }, function(a) {
      pagedWordList.updateWordListTitle(a);
      pagedWordList.updatePage()
    })
  },
  lastPage: function() {
    console.log("lastpage:" + this.totalPages + "/" + this.curPage);
    if (this.curPage != this.totalPages) {
      this.curPage = this.totalPages
    }
    console.log("lastpage:" + this.totalPages + "/" + this.curPage);
    this.updatePage()
  },
  gotoPage: function(a) {
    if (a >= 0 && a <= this.totalPages && this.curPage != a) {
      this.curPage = a;
      this.updatePage()
    }
  },
  hook: function() {
    document.getElementById("wordlist_first_page").addEventListener("click", function() {
      pagedWordList.firstPage()
    });
    document.getElementById("wordlist_prev_page").addEventListener("click", function() {
      pagedWordList.prevPage()
    });
    document.getElementById("wordlist_next_page").addEventListener("click", function() {
      pagedWordList.nextPage()
    });
    document.getElementById("wordlist_last_page").addEventListener("click", function() {
      pagedWordList.lastPage()
    });
    document.getElementById("wordlist_cur_page").addEventListener("keyup", function(b) {
      var a = b.target.value.replace(/[^0-9.]/g, "");
      if (a == "") {
        a = "0"
      }
      a = parseInt(a);
      if (a > pagedWordList.totalPages) {
        a = pagedWordList.input_curpage
      } else {
        pagedWordList.input_curpage = a
      }
      b.target.value = a;
      if (b.keyCode == 13) {
        pagedWordList.gotoPage(a)
      }
    });
    document.getElementById("wordlist_search_box").addEventListener("keyup", function(a) {
      return pagedWordList.onSearchBoxKeyup(a)
    })
  },
  onSearchBoxKeyup: function(b) {
    var a = document.getElementById("wordlist_search_box").value;
    if (a != this.filterKey) {
      this.filterKey = a;
      this.firstPage()
    }
  },
  updateWordListTitle: function(b) {
    this.totalWord = b;
    this.totalPages = Math.round(this.totalWord / this.pageSize - 0.5);
    var a = document.getElementById("word_list_title");
    a.innerHTML = "Word List [" + b + "]/<" + (this.totalPages + 1) + ">/(" + this.pageSize + ")"
  },
  modifyDef: function(a, b) {
    this._WordList[a].def = b;
    chrome.extension.sendRequest({
      cmd: "updateWordDefinition",
      word: this._WordList[a].word,
      def: b,
      dict: "user"
    })
  },
  delWordDef: function(c) {
    var a = this._WordList[this._curWordIdx];
    chrome.extension.sendRequest({
      cmd: "remove_word_def",
      word: a
    });
    pagedWordList.curEntry = null;
    pagedWordList._curDef = null;
    var b = document.getElementById("cur_word_def");
    b.innerHTML = "word definition removed. click word to recheck."
  },
  isDefEqual: function(a, b) {
    if (typeof this._WordList[a].def == "undefined" || this._WordList[a].def == null || this._WordList[a].def == "") {
      if (typeof b == "undefined" || b == null || b == "") {
        return true
      }
    } else {
      if (typeof b == "undefined" || b == null || b == "") {
        return false
      }
    }
    return this._WordList[a].def == b
  },
  formatContent: function(a) {
    if (typeof a == "undefined" || a == null || a == "null") {
      a = ""
    } else {
      a = a.replace(/\n/g, function(b) {
        return "<br>"
      });
      a = a.replace(/\s/g, function(b) {
        return "&nbsp;"
      })
    }
    return a
  },
  formatTitle: function(b) {
    if (typeof b == "undefined" || b == null || b == "") {
      return "UNTITLED"
    }
    var a = b;
    if (b.length > 30) {
      a = b.substring(0, 30) + "......"
    }
    return a
  },
  formatSentence: function(c, d) {
    var b = new RegExp(c, "gim");
    var a = d.replace(b, function(e) {
      return '<span class="word_in_sentence" >' + e + "</span>"
    });
    a = a.replace(/^\s*\n/g, "");
    return a
  },
  updateSentences: function(b) {
    console.log("updateSentences() =" + b);
    this._Sentences = b;
    var d = document.getElementById("word_sentences_table");
    while (d.hasChildNodes()) {
      d.removeChild(d.lastChild)
    }
    if (b) {
      for (var c = 0; c < b.length; c++) {
        var e = document.createElement("tr");
        var a = document.createElement("td");
        var f = document.createElement("td");
        e.className = "sentences_table";
        a.innerHTML = '<div class="sentence_head_div" ><p class="word_foot" ><a href="' + b[c].url + '" target="_blank">' + this.formatTitle(b[c].title) + '</a></p><p class="word_foot_date">' + b[c].date_added + '<input type="image" src="../../images/del.png" class="del_sentence_btn" id="del_sentence_' + b[c].id + '" /></p></div>';
        f.innerHTML = '<div class="td_sentences_div" >' + this.formatSentence(this._CurWord, b[c].sentence) + "</div> ";
        e.appendChild(f);
        e.appendChild(a);
        d.appendChild(e);
        document.getElementById("del_sentence_" + b[c].id).addEventListener("click", function(k) {
          var i = k.target.id.replace(/[^0-9.]/g, "");
          i = parseInt(i);
          console.log("delete sentence id=" + i);
          chrome.extension.sendRequest({
            cmd: "removeSentenceById",
            from: "options",
            id: i
          });
          var j = k.target.parentNode.parentNode.parentNode.parentNode;
          console.log("tr=" + j);
          var h = document.getElementById("word_sentences_table");
          var g = h.getElementsByTagName("tr");
          if (g.length == 1) {
            chrome.extension.sendRequest({
              cmd: "getWordCounterOfUrl",
              from: "options",
              filter: this.filterKey
            }, function(l) {
              pagedWordList.updateWordListTitle(l);
              pagedWordList.updatePage()
            })
          }
          pagedWordList.delNode(j)
        })
      }
    }
  },
  encodeContent: function(a) {
    return a
  },
  decodeContent: function(a) {
    return a;
    a = a.replace(this.regexDiv, function(b) {
      return ""
    });
    a = a.replace(this.regexDivBr, "\n");
    a = a.replace(this.regexBr, "\n");
    while ((a.lastIndexOf("\n") == a.length - 1) || (a.lastIndexOf(" ") == a.length - 1) || (a.lastIndexOf("\t") == a.length - 1) || (a.toLowerCase().lastIndexOf("<br>") == a.length - 1)) {
      a = a.substring(0, a.length - 1)
    }
    return a
  },
  onDefModified: function(a) {},
  delNode: function(d) {
    this._deletingNode = d;
    var c = this._deletingNode.getElementsByTagName("div");
    var b = 0;
    for (var a = 0; a < c.length; a++) {
      if (c[a].offsetHeight > b) {
        b = c[a].offsetHeight
      }
    }
    this._deletingHeight = b;
    console.log("here");
    try {
      this._delTimer = window.setInterval(function() {
        pagedWordList.deletingNode()
      }, this._deletingInterval)
    } catch (f) {
      console.log("e=" + f.message)
    }
  },
  deletingNode: function() {
    if (this._deletingNode == null) {
      window.clearInterval(this._delTimer)
    }
    if (this._deletingCounter < this._deletingThreshold) {
      this._deletingCounter++;
      var c = this._deletingNode.getElementsByTagName("div");
      var b = this._deletingHeight * (1 - this._deletingCounter / this._deletingThreshold);
      for (var a = 0; a < c.length; a++) {
        c[a].style.overflow = "hidden";
        console.log("deleting:" + this._deletingCounter + "|" + c[a].offsetHeight + "|" + c[a].style.height + "|h=" + b);
        if (c[a].offsetHeight > b) {
          c[a].style.height = b + "px"
        }
      }
    } else {
      window.clearInterval(this._delTimer);
      this._delTimer = null;
      var d = this._deletingNode;
      this._deletingNode = null;
      this._deletingCounter = 0;
      if (d && d.parentNode) {
        d.parentNode.removeChild(d)
      }
    }
  },
  trim: function(a) {
    if (typeof a == "undefined" || a == null) {
      return ""
    }
    a = this.decodeContent(a);
    return a.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
  },
  isDefChanged: function() {
    var b = document.getElementById("cur_word_def");
    if (typeof b == "undefined" || b == null) {
      console.log("nodeDef is :" + b);
      return false
    }
    this._curDef = this.trim(this._curDef);
    var a = this.trim(b.innerText);
    console.log("nodeDef text=" + b.innerText.length + "|" + b.innerText + "|value=" + b.value);
    console.log("curDef  text=" + this._curDef.length + "|" + this._curDef);
    return !(a == this._curDef)
  },
  dictInstanceId: -1,
  checkingId: -1,
  curEntry: null,
  definitionPanel: null,
  onInitialized: function(a) {
    this.dictInstanceId = a.instanceId;
    this.definitionPanel = new LM_DEFINITION();
    this.hook();
    this.firstPage()
  },
  updateWordDefinition: function(d) {
    if (typeof d == "undefined" || d == null) {
      return
    }
    if (d.instanceId != this.dictInstanceId || d.checkingId != this.checkingId) {
      return
    }
    if (d.status == 100) {
      this._curDef = null;
      var b = document.getElementById("cur_word_def");
      b.innerHTML = "checking word...."
    } else {
      if (d.status == 404) {
        this._curDef = null;
        var b = document.getElementById("cur_word_def");
        b.innerHTML = "word not found in dictionaries <br>or network error."
      } else {
        if (d.status == 200) {
          this.curEntry = d.entry;
          this._curDef = this.curEntry.shortMeaning;
          var a = document.getElementById("btn_del_word_def");
          a.addEventListener("click", function(f) {
            pagedWordList.delWordDef(f)
          });
          var b = document.getElementById("cur_word_def");
          b.innerHTML = this._curDef + ' <a href="#" id="lm_show_detail" >detail</a>';
          var c = document.getElementById("lm_show_detail");
          if (c) {
            c.addEventListener("click", function() {
              if (pagedWordList.definitionPanel) {
                pagedWordList.definitionPanel.show(pagedWordList.curEntry)
              }
            })
          }
        }
      }
    }
  },
  updateWordItem: function(c) {
    if (typeof c == "undefined" || c == null) {
      return
    }
    c = c.match(/\d/g);
    c = parseInt(c);
    this._curWordIdx = c;
    this._CurWord = this._WordList[c];
    var b = document.getElementById("word_sentences_table");
    while (b.hasChildNodes()) {
      b.removeChild(b.lastChild)
    }
    if (this._CurWord == null) {
      document.getElementById("cur_word_title").innerHTML = '<span class="td_word_div_word" >Word not found</span>';
      return
    }
    var a = (this.curPage * this.pageSize + this._curWordIdx + 1);
    document.getElementById("cur_word_title").innerHTML = '<span class="td_word_div_number" >  ' + a + '&nbsp;&nbsp;&nbsp;</span><span class="td_word_div_word" >' + this._WordList[this._curWordIdx] + '</span><input type="image" src="../../images/trash.png" class="del_word_def_btn" id="btn_del_word_def" /><hr/><div id="cur_word_def" class="td_word_def_div" contenteditable="false"></div>';
    chrome.extension.sendRequest({
      cmd: "get_word_def",
      checkingId: ++this.checkingId,
      instanceId: this.dictInstanceId,
      query: this._CurWord
    }, function(d) {
      pagedWordList.updateWordDefinition(d)
    });
    chrome.extension.sendRequest({
      cmd: "getSentencesOfWord",
      from: "options",
      word: this._WordList[c]
    }, function(d) {
      pagedWordList.updateSentences(d)
    })
  },
  createWordListTable: function(f) {
    console.log("createWordListTable:" + f.length);
    this._WordList = f;
    var e = document.getElementById("wordlist_cur_page");
    e.value = this.curPage;
    var c = document.getElementById("word_list_table");
    while (c.hasChildNodes()) {
      c.removeChild(c.lastChild)
    }
    if (f) {
      var h = null;
      for (var b = 0; b < f.length; b++) {
        var a = (this.curPage * this.pageSize + b + 1);
        var g = null;
        if (b % 5 == 0) {
          g = document.createElement("tr");
          h = g
        }
        var d = document.createElement("td");
        d.innerHTML = '<div class="word_in_list word_white" id="word_' + b + '" >' + this.formatTitle(f[b]) + "</div>";
        h.appendChild(d);
        if (g != null) {
          c.appendChild(h)
        }
        document.getElementById("word_" + b).addEventListener("click", function(i) {
          pagedWordList.updateWordItem(i.target.id)
        })
      }
    }
    this.updateWordItem("0")
  }
};

function onDefClick(g) {
  var d = document.getElementById("lm_editor_def");
  if (typeof d == "undefined" || d == null) {} else {
    var a = d.parentNode;
    onDefEditorClose(d, a)
  }
  var b = g.target.id;
  var f = g.target;
  f.removeEventListener("click", onDefClick);
  b = b.match(/\d/g);
  b = parseInt(b);
  console.log("definition click _id=" + b);
  console.log("definition node=" + f);
  f.innerHTML = '<textarea id="lm_editor_def" class="lm_editor" rows="6" cols="50" ></textarea>';
  var c = document.getElementById("lm_editor_def");
  c.value = pagedWordList._WordList[b].def;
  c.addEventListener("mouseout", onDefMouseOut)
}

function onDefMouseOut(c) {
  var a = c.target;
  var b = a.parentNode;
  onDefEditorClose(a, b)
}

function onDefEditorClose(b, c) {
  var a = c.id;
  b.removeEventListener("mouseout", onDefMouseOut);
  a = a.match(/\d/g);
  a = parseInt(a);
  console.log("mouseout _id=" + a);
  console.log("mouseout editor=" + b);
  if (typeof b == "undefined" || b == null) {
    return
  }
  console.log("editor.value=" + b.value);
  if (pagedWordList.isDefEqual(a, b.value)) {} else {
    var d = confirm("Definition changed, Do you want to save the modification? ");
    if (d) {
      pagedWordList.modifyDef(a, b.value)
    } else {}
  }
  c.innerHTML = pagedWordList.formatContent(pagedWordList._WordList[a].def);
  c.addEventListener("click", onDefClick)
}
var wordsOptionPage = {
  menuId: "menu-words-option-page",
  menuText: "Words",
  initOptionPage: function(a) {
    this.createPageFrame(a);
    pagedWordList.init()
  },
  init: function() {
    if (typeof Options == "undefined" || Options == null) {} else {
      Options.register({
        menuId: this.menuId,
        menuText: this.menuText,
        initOptionPage: function(a) {
          return wordsOptionPage.initOptionPage(a)
        }
      })
    }
  },
  createPageFrame: function(g) {
    var b = document.createElement("div");
    var c = b.cloneNode(false);
    c.className = "lm_list_title_div h_orient_box";
    g.appendChild(c);
    var a = b.cloneNode(false);
    a.id = "word_list_title";
    a.className = "lm_list_title_text";
    a.innerHTML = "Word List (Loading)";
    c.appendChild(a);
    var a = b.cloneNode(false);
    a.className = "page_btn_bar";
    c.appendChild(a);
    var f = document.createElement("input");
    f.type = "text";
    f.className = "lm_list_search_box";
    f.id = "wordlist_search_box";
    a.appendChild(f);
    var e = f.cloneNode(false);
    e.type = "image";
    e.className = "page_btns";
    e.id = "wordlist_first_page";
    e.src = chrome.extension.getURL("images/first_page.png");
    e.alt = "first Page";
    a.appendChild(e);
    var e = f.cloneNode(false);
    e.type = "image";
    e.className = "page_btns";
    e.id = "wordlist_prev_page";
    e.src = chrome.extension.getURL("images/prev_page.png");
    e.alt = "previous Page";
    a.appendChild(e);
    var e = f.cloneNode(false);
    e.type = "text";
    e.className = "lmlist_cur_page";
    e.id = "wordlist_cur_page";
    a.appendChild(e);
    var e = f.cloneNode(false);
    e.type = "image";
    e.className = "page_btns";
    e.id = "wordlist_next_page";
    e.src = chrome.extension.getURL("images/next_page.png");
    e.alt = "next Page";
    a.appendChild(e);
    var e = f.cloneNode(false);
    e.type = "image";
    e.className = "page_btns";
    e.id = "wordlist_last_page";
    e.src = chrome.extension.getURL("images/last_page.png");
    e.alt = "last Page";
    a.appendChild(e);
    var a = b.cloneNode(false);
    a.className = "";
    a.id = "word_list_container";
    g.appendChild(a);
    var i = document.createElement("table");
    i.id = "word_list_table";
    a.appendChild(i);
    var h = i.cloneNode(false);
    h.id = "";
    a.appendChild(h);
    var j = document.createElement("tr");
    h.appendChild(j);
    var d = document.createElement("td");
    j.appendChild(d);
    var k = b.cloneNode(false);
    k.id = "cur_word_title";
    k.className = "td_word_div";
    d.appendChild(k);
    var k = b.cloneNode(false);
    k.className = "";
    k.id = "sentence_list_container";
    g.appendChild(k);
    var h = i.cloneNode(false);
    h.id = "word_sentences_table";
    k.appendChild(h)
  }
};
(function() {
  window.addEventListener("load", function() {
    wordsOptionPage.init()
  })
}());
var pagedScrapList = {
  totalScrap: 0,
  pageSize: 10,
  curPage: 0,
  input_curpage: 0,
  totalPages: 0,
  ScrapList: null,
  filterKey: "",
  init: function() {
    console.log("pagedScrapList init it:");
    this.hook();
    this.curPage = 0;
    this.filterKey = "";
    this.firstPage()
  },
  updatePage: function() {
    console.log("updatepage:" + this.curPage);
    chrome.extension.sendRequest({
      cmd: "getAllScraps",
      from: "options",
      limit: {
        offset: (this.curPage * this.pageSize),
        size: this.pageSize,
        filter: this.filterKey
      }
    }, function(a) {
      pagedScrapList.createScrapListTable(a)
    });
    if (this.curPage == 0) {} else {
      if (this.curPage >= this.totalPages) {}
    } if (this.curPage > 0) {} else {} if (this.curPage < this.totalPage) {} else {}
  },
  nextPage: function() {
    if (this.curPage < this.totalPages) {
      this.curPage += 1;
      this.updatePage()
    }
  },
  prevPage: function() {
    if (this.curPage > 0) {
      this.curPage -= 1;
      this.updatePage()
    }
  },
  firstPage: function() {
    if (this.curPage != 0) {
      this.curPage = 0
    }
    this.curPage = 0;
    chrome.extension.sendRequest({
      cmd: "getScrapCountofUrl",
      from: "options",
      filter: this.filterKey
    }, function(a) {
      pagedScrapList.updateScrapListTitle(a);
      pagedScrapList.updatePage()
    })
  },
  lastPage: function() {
    console.log("lastpage:" + this.totalPages + "/" + this.curPage);
    if (this.curPage != this.totalPages) {
      this.curPage = this.totalPages
    }
    console.log("lastpage:" + this.totalPages + "/" + this.curPage);
    this.updatePage()
  },
  gotoPage: function(a) {
    if (a >= 0 && a <= this.totalPages && this.curPage != a) {
      this.curPage = a;
      this.updatePage()
    }
  },
  hook: function() {
    document.getElementById("scraplist_first_page").addEventListener("click", function() {
      pagedScrapList.firstPage()
    });
    document.getElementById("scraplist_prev_page").addEventListener("click", function() {
      pagedScrapList.prevPage()
    });
    document.getElementById("scraplist_next_page").addEventListener("click", function() {
      pagedScrapList.nextPage()
    });
    document.getElementById("scraplist_last_page").addEventListener("click", function() {
      pagedScrapList.lastPage()
    });
    document.getElementById("scraplist_cur_page").addEventListener("keyup", function(b) {
      var a = b.target.value.replace(/[^0-9.]/g, "");
      if (a == "") {
        a = "0"
      }
      a = parseInt(a);
      if (a > pagedScrapList.totalPages) {
        a = pagedScrapList.input_curpage
      } else {
        pagedScrapList.input_curpage = a
      }
      b.target.value = a;
      if (b.keyCode == 13) {
        pagedScrapList.gotoPage(a)
      }
    });
    document.getElementById("scraplist_search_box").addEventListener("keyup", function(a) {
      return pagedScrapList.onSearchBoxKeyup(a)
    })
  },
  onSearchBoxKeyup: function(b) {
    var a = document.getElementById("scraplist_search_box").value;
    if (a != this.filterKey) {
      this.filterKey = a;
      this.firstPage()
    }
  },
  updateScrapListTitle: function(b) {
    this.totalScrap = b;
    this.totalPages = Math.round(this.totalScrap / this.pageSize - 0.5);
    var a = document.getElementById("scrapbook_title");
    a.innerHTML = "Scrap List [" + b + "]/<" + this.totalPages + ">/(" + this.pageSize + ")"
  },
  modifyNote: function(b, a) {
    this.ScrapList[b].note = a;
    chrome.extension.sendRequest({
      cmd: "updateScrapNote",
      pos: this.ScrapList[b].pos,
      note: a
    })
  },
  isNoteEqual: function(b, a) {
    if (typeof this.ScrapList[b].note == "undefined" || this.ScrapList[b].note == null || this.ScrapList[b].note == "") {
      if (typeof a == "undefined" || a == null || a == "") {
        return true
      }
    } else {
      if (typeof a == "undefined" || a == null || a == "") {
        return false
      }
    }
    return this.ScrapList[b].note == a
  },
  formatContent: function(a) {
    if (typeof a == "undefined" || a == null || a == "null") {
      a = ""
    } else {
      a = a.replace(/\n/g, function(b) {
        return "<br>"
      });
      a = a.replace(/\s/g, function(b) {
        return "&nbsp;"
      })
    }
    return a
  },
  formatTitle: function(b) {
    if (typeof b == "undefined" || b == null || b == "") {
      return "UNTITLED"
    }
    var a = b;
    if (b.length > 30) {
      a = b.substring(0, 30) + "......"
    }
    return a
  },
  createScrapListTable: function(e) {
    this.ScrapList = e;
    var f = document.getElementById("scraplist_cur_page");
    f.value = this.curPage;
    var d = document.getElementById("scrapbook_table");
    while (d.hasChildNodes()) {
      d.removeChild(d.lastChild)
    }
    if (e) {
      for (var c = 0; c < e.length; c++) {
        var b = (this.curPage * this.pageSize + c + 1);
        var g = document.createElement("tr");
        var h = document.createElement("td");
        if (e[c].scrap == "" || e[c].scrap == null || e[c].scrap == "null") {}
        h.innerHTML = '<div class="td_scrap" > <span class="td_word_div_number" >  ' + b + '&nbsp;&nbsp;&nbsp;</span><span class="td_scrap_text" >' + this.formatContent(e[c].scrap) + '</span><hr/><p class="scrap_foot"><a href="' + e[c].url + '" target="_blank" >' + this.formatTitle(e[c].title) + '</a> </p><p class="word_foot_date" >' + e[c].date_added + '<input type="image" src="../../images/trash.png" class="trash_btn trash_scrap_btn" id="del_scrap_' + c + '" /></p></div>';
        var a = document.createElement("td");
        a.innerHTML = '<div class="td_note" id="lm_note_' + c + '" >' + this.formatContent(e[c].note) + "</div>";
        g.appendChild(h);
        g.appendChild(a);
        d.appendChild(g);
        document.getElementById("del_scrap_" + c).addEventListener("click", function(j) {
          var i = j.target.id;
          i = i.match(/\d/g);
          i = parseInt(i);
          console.log("_id=" + i);
          chrome.extension.sendRequest({
            cmd: "removeScrapUrl",
            from: "options",
            scrap: pagedScrapList.ScrapList[i].scrap,
            pos: pagedScrapList.ScrapList[i].pos
          }, function() {
            chrome.extension.sendRequest({
              cmd: "getScrapCountofUrl",
              from: "options",
              filter: pagedScrapList.filterKey
            }, function(k) {
              pagedScrapList.updateScrapListTitle(k);
              pagedScrapList.updatePage()
            })
          })
        });
        document.getElementById("lm_note_" + c).addEventListener("click", onNoteClick)
      }
    }
  }
};

function onNoteClick(g) {
  var d = document.getElementById("lm_editor_note");
  if (typeof d == "undefined" || d == null) {} else {
    var a = d.parentNode;
    onNoteEditorClose(d, a)
  }
  var b = g.target.id;
  var f = g.target;
  f.removeEventListener("click", onNoteClick);
  b = b.match(/\d/g);
  b = parseInt(b);
  console.log("note click _id=" + b);
  console.log("note node=" + f);
  f.innerHTML = '<textarea id="lm_editor_note" class="lm_editor" rows="6" cols="50" ></textarea>';
  var c = document.getElementById("lm_editor_note");
  c.value = pagedScrapList.ScrapList[b].note;
  c.addEventListener("mouseout", onNoteMouseOut)
}

function onNoteMouseOut(c) {
  var a = c.target;
  var b = a.parentNode;
  onNoteEditorClose(a, b)
}

function onNoteEditorClose(b, c) {
  var a = c.id;
  b.removeEventListener("mouseout", onNoteMouseOut);
  a = a.match(/\d/g);
  a = parseInt(a);
  console.log("mouseout _id=" + a);
  console.log("mouseout editor=" + b);
  if (typeof b == "undefined" || b == null) {
    return
  }
  console.log("editor.value=" + b.value);
  if (pagedScrapList.isNoteEqual(a, b.value)) {} else {
    var d = confirm("Note changed, Do you want to save the modification? ");
    if (d) {
      pagedScrapList.modifyNote(a, b.value)
    } else {}
  }
  c.innerHTML = pagedScrapList.formatContent(pagedScrapList.ScrapList[a].note);
  c.addEventListener("click", onNoteClick)
}
var scrapbookOptionPage = {
  menuId: "menu-scrapbook-option-page",
  menuText: "Scrapbook",
  initOptionPage: function(a) {
    this.createPageFrame(a);
    pagedScrapList.init()
  },
  init: function() {
    if (typeof Options == "undefined" || Options == null) {} else {
      Options.register({
        menuId: this.menuId,
        menuText: this.menuText,
        initOptionPage: function(a) {
          return scrapbookOptionPage.initOptionPage(a)
        }
      })
    }
  },
  createPageFrame: function(g) {
    var f = document.createElement("div");
    var e = f.cloneNode(false);
    e.className = "lm_list_title_div h_orient_box";
    g.appendChild(e);
    var d = f.cloneNode(false);
    d.id = "scrapbook_title";
    d.className = "lm_list_title_text";
    d.innerHTML = "Scrapbook List (Loading)";
    e.appendChild(d);
    var d = f.cloneNode(false);
    d.className = "page_btn_bar";
    e.appendChild(d);
    var c = document.createElement("input");
    c.type = "text";
    c.className = "lm_list_search_box";
    c.id = "scraplist_search_box";
    d.appendChild(c);
    var a = c.cloneNode(false);
    a.type = "image";
    a.className = "page_btns";
    a.id = "scraplist_first_page";
    a.src = chrome.extension.getURL("images/first_page.png");
    a.alt = "first Page";
    d.appendChild(a);
    var a = c.cloneNode(false);
    a.type = "image";
    a.className = "page_btns";
    a.id = "scraplist_prev_page";
    a.src = chrome.extension.getURL("images/prev_page.png");
    a.alt = "previous Page";
    d.appendChild(a);
    var a = c.cloneNode(false);
    a.type = "text";
    a.className = "lmlist_cur_page";
    a.id = "scraplist_cur_page";
    d.appendChild(a);
    var a = c.cloneNode(false);
    a.type = "image";
    a.className = "page_btns";
    a.id = "scraplist_next_page";
    a.src = chrome.extension.getURL("images/next_page.png");
    a.alt = "next Page";
    d.appendChild(a);
    var a = c.cloneNode(false);
    a.type = "image";
    a.className = "page_btns";
    a.id = "scraplist_last_page";
    a.src = chrome.extension.getURL("images/last_page.png");
    a.alt = "last Page";
    d.appendChild(a);
    var d = f.cloneNode(false);
    d.className = "";
    d.id = "scrapbook_container";
    g.appendChild(d);
    var b = document.createElement("table");
    b.id = "scrapbook_table";
    d.appendChild(b)
  }
};
(function() {
  window.addEventListener("load", function() {
    scrapbookOptionPage.init()
  })
}());
var lmFileReader = {
  FUNC: function(a, b) {
    return function() {
      return b.apply(a, arguments)
    }
  },
  curFile: null,
  working: false,
  startRead: function(b, d) {
    if (this.wordking) {
      alert("working now. please try later");
      return
    }
    var c = b.target.files;
    if (typeof c[0] == "undefined" || c[0] == null) {
      return
    }
    this.working = true;
    var a = new FileReader();
    a.readAsText(c[0], "UTF-8");
    a.onprogress = this.FUNC(this, function(f) {
      return this.updateProgress(f)
    });
    a.onload = this.FUNC(this, function(f) {
      return this.loaded(f, d)
    });
    a.onerror = this.FUNC(this, function(f) {
      return this.onError(f)
    })
  },
  updateProgress: function(a) {
    if (a.lengthComputable) {
      var b = (a.loaded / a.total);
      if (b < 1) {}
    }
  },
  loaded: function(a, c) {
    this.working = false;
    var b = a.target.result;
    if (c == "dict") {
      this.importDict(b)
    } else {
      if (c == "scrapbook") {
        this.importScrapbook(b)
      } else {
        if (c == "sentences") {
          this.importSentences(b)
        }
      }
    }
  },
  onError: function(a) {
    this.working = false;
    if (a.target.error.name == "NotReadableErr") {}
  },
  exportTable: function(a, b) {},
  importDict: function(d) {
    if (typeof d == "undefined" || d == null) {
      return
    }
    var b = d.split(/[\r\n]+/);
    for (var c = 0; c < b.length; c++) {
      var a = b[c].split(/\s*,\s*/);
      chrome.extension.sendRequest({
        cmd: "addDictRecord",
        from: "options",
        word: decodeURIComponent(a[0]),
        def: decodeURIComponent(a[1]),
        dict: a[2]
      })
    }
    alert("Import dictionary successfully. " + b.length + " items imported;")
  },
  importScrapbook: function(d) {
    if (typeof d == "undefined" || d == null) {
      return
    }
    var b = d.split(/[\r\n]+/);
    for (var c = 0; c < b.length; c++) {
      var a = b[c].split(/\s*,\s*/);
      chrome.extension.sendRequest({
        cmd: "addScrapRecord",
        from: "options",
        scrap: decodeURIComponent(a[0]),
        pos: decodeURIComponent(a[1]),
        note: decodeURIComponent(a[2]),
        url: decodeURIComponent(a[3]),
        title: decodeURIComponent(a[4]),
        date_added: a[5]
      })
    }
    alert("Import scrapbook successfully. " + b.length + " items imported;")
  },
  importSentences: function(d) {
    if (typeof d == "undefined" || d == null) {
      return
    }
    var b = d.split(/[\r\n]+/);
    for (var c = 0; c < b.length; c++) {
      var a = b[c].split(/\s*,\s*/);
      chrome.extension.sendRequest({
        cmd: "addSentenceRecord",
        from: "options",
        word: decodeURIComponent(a[0]),
        sentence: decodeURIComponent(a[1]),
        url: decodeURIComponent(a[2]),
        title: decodeURIComponent(a[3]),
        date_added: a[4]
      })
    }
    alert("Import sentences successfully. " + b.length + " items imported;")
  },
  initMsgHandler: function() {
    var b = document.getElementById("lm_dict_import_fn");
    b.addEventListener("change", this.FUNC(this, function(d) {
      return this.startRead(d, "dict")
    }));
    var a = document.getElementById("lm_scrapbook_import_fn");
    a.addEventListener("change", this.FUNC(this, function(d) {
      return this.startRead(d, "scrapbook")
    }));
    var c = document.getElementById("lm_sentences_import_fn");
    c.addEventListener("change", this.FUNC(this, function(d) {
      return this.startRead(d, "sentences")
    }))
  }
};
(function() {}());