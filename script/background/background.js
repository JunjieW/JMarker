var lm_release_version = true;
var wordBank = {
  DB: null,
  DB_VERSION: "3.0",
  dbReq: null,
  _dbName: "Learner_marker_db",
  _dbDescript: "database for learner's marker",
  _osWordUrl: "wordsdb",
  _SQLtbWordUrl: "CREATE TABLE IF NOT EXISTS wordsdb (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT, url TEXT, title TEXT, sentence TEXT, date_added TIMESTAMP DEFAULT (datetime('now','localtime')))",
  _osScrap: "scrapbook",
  _SQLtbScrap: "CREATE TABLE IF NOT EXISTS scrapbook (id INTEGER PRIMARY KEY AUTOINCREMENT, scrap TEXT, pos TEXT, note TEXT, url TEXT, title TEXT, date_added TIMESTAMP DEFAULT (datetime('now','localtime')))",
  _osDict: "dictionary",
  _SQLtbDict: "CREATE TABLE IF NOT EXISTS dictionary (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT, dict TEXT, def TEXT, date_added TIMESTAMP DEFAULT (datetime('now','localtime')))",
  _osSentence: "sentences",
  _SQLtbSentence: "CREATE TABLE IF NOT EXISTS sentences (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT, sentence TEXT, url TEXT, title TEXT, date_added TIMESTAMP DEFAULT (datetime('now','localtime')))",
  _DBsize: 1024 * 1024 * 5,
  _E: function(a) {
    console.error("wordBank:" + a)
  },
  openDB: function() {
    this.DB = openDatabase(this._dbName, "", this._dbDescript, this._DBsize);
    this.migrate(this.DB)
  },
  migrate: function(a) {
    if (typeof a == "undefined" || a == null) {
      this._E("migrate failed, _db is undefined or null;");
      return
    }
    if (a.version == this.DB_VERSION) {
      return
    } else {
      if (a.version == "") {
        a.changeVersion("", this.DB_VERSION, function(b) {
          b.executeSql(wordBank._SQLtbScrap, [], function(c, d) {}, function(c, d) {
            wordBank._E("migrate() create table tbScrap failed." + d.message)
          });
          b.executeSql(wordBank._SQLtbDict, [], function(c, d) {}, function(c, d) {
            wordBank._E("migrate() create table tbDict failed." + d.message)
          });
          b.executeSql(wordBank._SQLtbSentence, [], function(c, d) {}, function(c, d) {
            wordBank._E("migrate() create table tbSentence failed." + d.message)
          })
        }, function(b) {}, function(b) {})
      } else {
        if (a.version == "1.0") {
          a.changeVersion(a.version, wordBank.DB_VERSION, function(b) {
            b.executeSql("ALTER TABLE wordsdb DROP COLUMN sentence  ", [], function(c, d) {}, function(c, d) {
              wordBank._E("migrate() alter table tbWordUrl failed." + d.message)
            });
            b.executeSql(wordBank._SQLtbSentence, [], function(c, d) {}, function(c, d) {
              wordBank._E("migrate() create table tbSentence failed." + d.message)
            })
          }, function(b) {}, function(b) {})
        } else {
          if (a.version == "2.0") {
            a.changeVersion(a.version, wordBank.DB_VERSION, function(b) {
              b.executeSql("ALTER TABLE sentences ADD COLUMN url TEXT, title TEXT ", [], function(c, d) {}, function(c, d) {
                wordBank._E("migrate() alter table sentences failed." + d.message)
              })
            }, function(b) {}, function(b) {})
          } else {
            if (a.version == a.version) {
              a.changeVersion(a.version, wordBank.DB_VERSION, function(b) {
                b.executeSql("ALTER TABLE sentences ADD COLUMN title TEXT  ", [], function(c, d) {}, function(c, d) {
                  wordBank._E("migrate() alter table sentences failed." + d.message)
                })
              }, function(b) {}, function(b) {})
            }
          }
        }
      }
    }
  },
  createTable: function(a, b) {
    this.DB.transaction(function(c) {
      c.executeSql(b, [], function(d, e) {}, function(d, f) {
        wordBank._E(" create table [" + a + "] failed." + f.message)
      })
    })
  },
  dropTable: function(a, b) {
    this.DB.transaction(function(c) {
      c.executeSql(b, [], function(d, e) {}, function(d, f) {
        wordBank._E(" drop table [" + a + "] failed." + f.message)
      })
    })
  },
  reset: function(a) {
    if (typeof a == "undefined" || a == null || a == "") {
      return
    }
    this.openDB();
    if (a == "all") {
      this.dropTable(this._osWordUrl, "DROP TABLE IF EXISTS wordsdb");
      this.dropTable(this._osScrap, "DROP TABLE IF EXISTS scrapbook");
      this.dropTable(this._osDict, "DROP TABLE IF EXISTS dictionary");
      this.dropTable(this._osSentence, "DROP TABLE  IF EXISTS sentences")
    } else {
      this.dropTable("", "DROP TABLE  IF EXISTS " + a)
    }
    this.initTables()
  },
  init: function() {
    this.openDB()
  },
  initTables: function() {
    this.createTable(this._osScrap, this._SQLtbScrap);
    this.createTable(this._osDict, this._SQLtbDict);
    this.createTable(this._osSentence, this._SQLtbSentence)
  },
  getScrapCountofUrl: function(e, a, d) {
    var c = "SELECT COUNT(scrap) AS scrapCounters FROM scrapbook ";
    var b = new Array();
    if (typeof a != "undefined" && a != null) {
      c += " WHERE url= ? ";
      b.push(a);
      if (typeof d != "undefined" && d != null) {
        c += " AND scrap like '%" + d + "%' "
      }
    } else {
      if (typeof d != "undefined" && d != null) {
        c += " WHERE scrap like '%" + d + "%' "
      }
    }
    this.DB.transaction(function(f) {
      f.executeSql(c, b, function(h, i) {
        var g = i.rows.item(0).scrapCounters;
        if (typeof e == "undefined") {} else {
          e(g)
        }
      }, function(g, h) {
        wordBank._E(" getScrapCountofUrl [" + a + "] failed." + h.message)
      })
    })
  },
  getScrapsOfUrl: function(c, b, a, d) {
    if (!c || !b) {}
    this.DB.transaction(function(e) {
      e.executeSql("SELECT * FROM scrapbook WHERE url=? AND title=? ", [c, b], function(f, j) {
        var h = [];
        for (var g = 0; g < j.rows.length; g++) {
          h.push({
            scrap: j.rows.item(g).scrap,
            pos: j.rows.item(g).pos,
            note: j.rows.item(g).note
          })
        }
        if (typeof d == "undefined") {} else {
          if (typeof a == "undefined") {
            d(null, h)
          } else {
            d(a, h)
          }
        }
      }, function(f, g) {
        wordBank._E(" getScrapsOfUrl [" + c + "] failed." + g.message)
      })
    })
  },
  getAllScraps: function(a, b) {
    var c = "SELECT * FROM scrapbook ORDER BY date_added DESC ";
    if (typeof b != "undefined" && b != null) {
      if (b.filter != null && b.filter != "") {
        c = "SELECT * FROM scrapbook WHERE scrap LIKE '%" + b.filter + "%' ORDER BY date_added DESC "
      }
      c += " LIMIT " + b.offset + ", " + b.size + " "
    }
    this.DB.transaction(function(d) {
      d.executeSql(c, [], function(e, h) {
        var g = [];
        for (var f = 0; f < h.rows.length; f++) {
          g.push({
            scrap: h.rows.item(f).scrap,
            note: h.rows.item(f).note,
            title: h.rows.item(f).title,
            date_added: h.rows.item(f).date_added,
            url: h.rows.item(f).url,
            pos: h.rows.item(f).pos
          })
        }
        if (typeof a == "undefined") {} else {
          a(g)
        }
      }, function(f, g) {
        wordBank._E(" getAllScraps failed." + g.message)
      })
    })
  },
  addScrapOfUrl: function(c, a, d, f, e, b, g) {
    if (!f || !c) {
      return
    }
    this.DB.transaction(function(h) {
      h.executeSql("SELECT COUNT(scrap) AS scrapCounters FROM scrapbook WHERE scrap=? AND url=? AND pos=? AND title=? ", [c, f, a, e], function(k, i) {
        var j = i.rows.item(0).scrapCounters;
        var l = "INSERT INTO scrapbook (scrap, pos, note, url, title) VALUES (?, ?, ?, ?, ?) ";
        if (j > 0) {
          l = "UPDATE scrapbook set date_added = (datetime('now','localtime')), note=? WHERE scrap=? AND pos=? AND url=? AND title =? "
        }
        wordBank.DB.transaction(function(m) {
          m.executeSql(l, [c, a, d, f, e], function(n, o) {}, function(n, o) {
            wordBank._E(" addScrapOfUrl [" + c + "] failed. " + o.message)
          })
        })
      }, function(i, j) {
        wordBank._E(" addScrapOfUrl [" + c + "] failed. check::" + j.message)
      })
    })
  },
  addScrapRecord: function(c, b, d, f, e, a) {
    if (!f || !c) {
      return
    }
    this.DB.transaction(function(g) {
      g.executeSql("SELECT COUNT(scrap) AS scrapCounters FROM scrapbook WHERE scrap=? AND url=? AND pos=? AND title=? ", [c, f, b, e], function(k, h) {
        var i = h.rows.item(0).scrapCounters;
        if (i > 0) {} else {
          var l = "INSERT INTO scrapbook (scrap, pos, note, url, title, date_added) VALUES (?, ?, ?, ?, ?, ?) ";
          var j = [c, b, d, f, e, a];
          wordBank.DB.transaction(function(m) {
            m.executeSql(l, j, function(n, o) {}, function(n, o) {
              wordBank._E(" addScrapRecord [" + c + "] failed. " + o.message)
            })
          })
        }
      }, function(h, i) {
        wordBank._E(" addScrapRecord [" + c + "] failed. check::" + i.message)
      })
    })
  },
  updateScrapNote: function(a, b) {
    if (!a || !b) {
      return
    }
    this.DB.transaction(function(c) {
      c.executeSql("SELECT * FROM scrapbook WHERE pos=? ", [a], function(f, d) {
        var e = d.rows.length;
        var g;
        if (e > 0) {
          g = "UPDATE scrapbook set date_added = (datetime('now','localtime')), note=? WHERE pos=? "
        } else {
          wordBank._E("updateScrapNote: anchor not found in table.|" + a + "|" + b);
          return
        }
        wordBank.DB.transaction(function(h) {
          h.executeSql(g, [b, a], function(i, j) {}, function(i, j) {
            wordBank._E(" updateScrapNote [" + a + "] failed. " + j.message)
          })
        })
      }, function(d, f) {
        wordBank._E(" updateScrapNote [" + a + "] failed. check::" + f.message)
      })
    })
  },
  getScrapNote: function(a, b, c) {
    if (!a) {
      return
    }
    this.DB.transaction(function(d) {
      d.executeSql("SELECT * FROM scrapbook WHERE pos=? ", [a], function(h, e) {
        var g = "";
        for (var f = 0; f < e.rows.length; f++) {
          g += e.rows.item(f).note + "\n"
        }
        if (typeof c == "undefined" || c == null) {} else {
          c(b, a, g)
        }
      }, function(f, g) {
        wordBank._E(" getScrapNote [" + a + "] failed. check::" + g.message)
      })
    })
  },
  removeScrapOfUrl: function(a, c, b, d) {
    if (!a || !c) {}
    this.DB.transaction(function(e) {
      e.executeSql("DELETE FROM scrapbook WHERE pos=? AND scrap=? ", [a, c], function(g, f) {
        if (typeof d == "undefined") {} else {
          d(b)
        }
      }, function(f, g) {
        wordBank._E(" removeScrapOfUrl [" + a + "] failed::" + g.message)
      })
    })
  },
  getWordDefinition: function(c, a, b) {
    if (!c) {
      return
    }
    this.DB.transaction(function(d) {
      d.executeSql("SELECT * FROM dictionary WHERE word LIKE ? ", [c], function(h, e) {
        var g = [];
        if (e.rows.length > 0) {
          for (var f = 0; f < e.rows.length; f++) {
            g.push({
              dict: e.rows.item(f).dict,
              def: e.rows.item(f).def
            })
          }
          if (typeof b == "undefined" || b == null) {} else {
            b(a, c, g)
          }
        } else {
          OAKDICT.checkWordRemotely(c, function(i, k, j) {
            wordBank.updateWordDefinition(i, k, j);
            if (typeof b == "undefined" || b == null) {} else {
              b(a, i, [{
                def: k,
                dict: j
              }])
            }
          })
        }
      }, function(f, g) {
        wordBank._E(" getWordDefinition [" + _pos + "] failed. check::" + g.message)
      })
    })
  },
  updateWordDefinition: function(a, c, b) {
    if (typeof a == "undefined" || !a) {
      return
    }
    if (typeof c == "undefined" || c == null) {
      c = ""
    }
    this.DB.transaction(function(d) {
      d.executeSql("SELECT COUNT(word) AS wordCounter FROM dictionary WHERE word LIKE ? AND dict LIKE ? ", [a, b], function(g, e) {
        var f = e.rows.item(0).wordCounter;
        var h = "INSERT INTO dictionary (def, word, dict) VALUES (?, ?, ?) ";
        if (f > 0) {
          h = "UPDATE dictionary set date_added = (datetime('now','localtime')), def=? WHERE word LIKE ? AND dict LIKE ? "
        } else {}
        wordBank.DB.transaction(function(i) {
          i.executeSql(h, [c, a, b], function(j, k) {}, function(j, k) {
            wordBank._E(" updateWordDefinition [" + a + "] failed. " + k.message)
          })
        })
      }, function(f, g) {
        wordBank._E(" updateWordDefinition [" + a + "] failed. check::" + g.message)
      })
    })
  },
  addSentence: function(e, d, c, b, a) {
    this.getSentencesOfWordUrl(e, d, c, function(f) {
      if (f.length > 0) {} else {
        wordBank.addSentenceAnyway(e, d, c, b, a)
      }
    })
  },
  addSentenceAnyway: function(g, e, d, c, a) {
    if (!g || !e) {
      return
    }
    var b = [g, e, d, c];
    var f = "INSERT INTO sentences (sentence, word, url, title) VALUES (?, ?, ?, ?) ";
    if (typeof a == "undefined" || a == null || a == "") {} else {
      f = "INSERT INTO sentences (sentence, word, url, title, date_added) VALUES (?, ?, ?, ?, ?) ";
      b.push(a)
    }
    wordBank.DB.transaction(function(h) {
      h.executeSql(f, b, function(i, j) {}, function(i, j) {
        wordBank._E(" addSentences [" + g + "] failed. " + j.message)
      })
    })
  },
  getSentencesOfWordUrl: function(d, c, a, b) {
    if (!c) {
      return
    }
    this.DB.transaction(function(e) {
      e.executeSql("SELECT * FROM sentences WHERE sentence LIKE ? AND word LIKE ? AND url LIKE ? ", [d, c, a], function(j, f) {
        var h = [];
        if (f.rows.length > 0) {
          for (var g = 0; g < f.rows.length; g++) {
            h.push({
              sentence: f.rows.item(g).sentence,
              word: f.rows.item(g).word,
              id: f.rows.item(g).id,
              url: f.rows.item(g).url,
              title: f.rows.item(g).title,
              date_added: f.rows.item(g).date_added
            })
          }
        } else {} if (typeof b == "undefined" || b == null) {} else {
          b(h)
        }
      }, function(f, g) {
        wordBank._E(" getSentencesOfWordUrl [" + _pos + "] failed. check::" + g.message)
      })
    })
  },
  getSentencesOfWord: function(c, a, b) {
    if (!c) {
      return
    }
    this.DB.transaction(function(d) {
      d.executeSql("SELECT * FROM sentences WHERE word LIKE ? ", [c], function(h, e) {
        var g = [];
        if (e.rows.length > 0) {
          for (var f = 0; f < e.rows.length; f++) {
            g.push({
              sentence: e.rows.item(f).sentence,
              word: e.rows.item(f).word,
              id: e.rows.item(f).id,
              url: e.rows.item(f).url,
              title: e.rows.item(f).title,
              date_added: e.rows.item(f).date_added
            })
          }
          if (typeof b == "undefined" || b == null) {} else {
            b(g)
          }
        } else {}
      }, function(f, g) {
        wordBank._E(" getSentencesOfWord [" + _pos + "] failed. check::" + g.message)
      })
    })
  },
  removeSentenceById: function(a, b) {
    if (!a) {}
    this.DB.transaction(function(c) {
      c.executeSql("DELETE FROM sentences WHERE id=? ", [a], function(e, d) {
        if (typeof b == "undefined") {} else {
          b()
        }
      }, function(d, f) {
        wordBank._E(" removeSentence [" + _word + "] failed::" + f.message)
      })
    })
  },
  removeSentence: function(e, d, c, b, a) {
    if (!e) {}
    this.DB.transaction(function(f) {
      f.executeSql("DELETE FROM sentences WHERE sentence=? AND word=? AND url=?", [e, d, c], function(h, g) {
        if (typeof a == "undefined") {} else {
          a()
        }
      }, function(g, h) {
        wordBank._E(" removeSentence [" + d + "] failed::" + h.message)
      })
    })
  }
};
(function() {
  wordBank.init()
}());
var bgScrapMarker = {
  initMsgHandler: function() {
    this.initPen(localStorage.default_scrap_pen, "markerpen9");
    chrome.extension.onRequest.addListener(function(b, c, a) {
      if (typeof b.from != "undefined" && b.from != null && b.from == "options") {} else {
        b.url = bgScrapMarker.getTabUrl(c, b.url)
      } if (b.cmd == "initializeScrapMarker") {
        bgScrapMarker.onInitialize(b, c, a)
      } else {
        if (b.cmd == "") {
          bgScrapMarker.a(b, c, a)
        } else {
          if (b.cmd == "modifyMarker") {} else {
            if (b.cmd == "updateWordList") {
              bgScrapMarker.updateWordList(b.wordlist)
            } else {
              if (b.cmd == "addScrapUrl") {
                bgScrapMarker.onAddScrap(b, c, a)
              } else {
                if (b.cmd == "addScrapRecord") {
                  bgScrapMarker.onAddScrapRecord(b, c, a)
                } else {
                  if (b.cmd == "removeScrapUrl") {
                    bgScrapMarker.onRemoveScrap(b, c, a)
                  } else {
                    if (b.cmd == "updateScrapNote") {
                      wordBank.updateScrapNote(b.pos, b.note)
                    } else {
                      if (b.cmd == "getScrapCountofUrl") {
                        wordBank.getScrapCountofUrl(function(d) {
                          a(d)
                        }, b.url, b.filter)
                      } else {
                        if (b.cmd == "getScrapNote") {} else {
                          if (b.cmd == "getAllScraps") {
                            wordBank.getAllScraps(function(d) {
                              a(d)
                            }, b.limit)
                          } else {
                            if (b.cmd == "exportScrapbook") {
                              bgScrapMarker.onExportScrapbook(b, c, a)
                            } else {
                              if (b.cmd == "getScrapsOfUrl") {} else {
                                bgScrapMarker.a(b, c, a)
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
  },
  onInitialize: function(c, e, b) {
    var d = true;
    var a = "markerpen9";
    try {
      a = localStorage.default_scrap_pen
    } catch (f) {
      a = "markerpen9";
      localStorage.default_scrap_pen = a
    }
    if (typeof a == "undefined" || a == null || a == "") {
      a = "markerpen9";
      localStorage.default_scrap_pen = a
    }
    this.getScrapListOfUrl(c.url, function(g) {
      if (g) {
        d = true
      } else {}
      b({
        state: d,
        scrapPen: a,
        scrapList: g
      })
    })
  },
  onChangeMarkerStyle: function() {
    chrome.tabs.query({}, function(b) {
      for (var a = 0; a < b.length; a++) {
        chrome.tabs.sendRequest(b[a].id, {
          cmd: "modifyMarker",
          from: "options",
          wpen: localStorage.default_word_pen,
          spen: localStorage.default_scrap_pen
        })
      }
    })
  },
  onAddScrap: function(b, c, a) {
    b.url = b.url.replace(/\#$/g, "");
    wordBank.addScrapOfUrl(b.txt, b.pos, b.note, b.url, b.title, c.tab.id)
  },
  onAddScrapRecord: function(b, c, a) {
    b.url = b.url.replace(/\#$/g, "");
    wordBank.addScrapRecord(b.scrap, b.pos, b.note, b.url, b.title, c.tab.id)
  },
  onExportScrapbook: function(c, d, b) {
    var a = wordBank.DB;
    a.transaction(function(e) {
      e.executeSql("SELECT * FROM scrapbook ", [], function(j, f) {
        var h = [];
        if (f.rows.length > 0) {
          for (var g = 0; g < f.rows.length; g++) {
            h.push(encodeURIComponent(f.rows.item(g).scrap));
            h.push(",");
            h.push(encodeURIComponent(f.rows.item(g).pos));
            h.push(",");
            h.push(encodeURIComponent(f.rows.item(g).note));
            h.push(",");
            h.push(encodeURIComponent(f.rows.item(g).url));
            h.push(",");
            h.push(encodeURIComponent(f.rows.item(g).title));
            h.push(",");
            h.push(f.rows.item(g).date_added);
            h.push("\n")
          }
          lmFileWriter.writeFile("scrapbook.csv", h, b)
        }
      }, function(f, g) {})
    })
  },
  onRemoveScrap: function(b, c, a) {
    wordBank.removeScrapOfUrl(b.pos, b.scrap, c.tab.id, function(d) {
      a(d)
    })
  },
  a: function(b, c, a) {},
  getScrapListOfUrl: function(c, a) {
    if (typeof c == "undefined" || !c) {
      return
    }
    c = c.replace(/\#$/g, "");
    var b = wordBank.DB;
    b.transaction(function(d) {
      d.executeSql("SELECT * FROM scrapbook WHERE url=? OR url=?", [c, c + "#"], function(e, h) {
        var g = [];
        for (var f = 0; f < h.rows.length; f++) {
          g.push({
            scrap: h.rows.item(f).scrap,
            pos: h.rows.item(f).pos,
            note: h.rows.item(f).note,
            url: h.rows.item(f).url
          })
        }
        if (typeof a == "undefined") {} else {
          a(g)
        }
      }, function(f, g) {})
    })
  },
  getTabUrl: function(c, b) {
    var a = b;
    if (typeof c.tab == "undefined" || c.tab == null) {} else {
      if (c.tab.url) {
        a = c.tab.url
      }
    }
    a = a.replace(/\#$/g, "");
    return a
  },
  initPen: function(a, b) {
    if (typeof a == "undefined" || a == null || a == "") {
      a = b
    }
  }
};
(function() {
  bgScrapMarker.initMsgHandler()
})();
var bgWordMarker = {
  initMsgHandler: function() {
    this.initPen(localStorage.default_word_pen, "markerpen10");
    chrome.extension.onRequest.addListener(function(b, c, a) {
      if (typeof b.from != "undefined" && b.from != null && b.from == "options") {
        b.taburl = null
      } else {
        b.taburl = bgWordMarker.getTabUrl(c, b.url)
      } if (b.cmd == "initializeWordMarker") {
        bgWordMarker.onInitialize(b, c, a)
      } else {
        if (b.cmd == "updateMarker") {
          bgWordMarker.onChangeMarkerStyle(b)
        } else {
          if (b.cmd == "addSentence") {
            bgWordMarker.onAddSentence(b, c, a)
          } else {
            if (b.cmd == "removeSentence") {
              bgWordMarker.onRemoveSentence(b, c, a)
            } else {
              if (b.cmd == "markWordNotify") {
                bgWordMarker.onMarkWordNotify(b, c, a)
              } else {
                if (b.cmd == "unmarkWordNotify") {
                  bgWordMarker.onUnmarkWordNotify(b, c, a)
                } else {
                  if (b.cmd == "removeSentenceById") {
                    bgWordMarker.onRemoveSentenceById(b, c, a)
                  } else {
                    if (b.cmd == "getWordCounterOfUrl") {
                      bgWordMarker.getWordCounterOfUrl(b, c, a)
                    } else {
                      if (b.cmd == "getSentencesOfWord") {
                        bgWordMarker.getSentencesOfWord(b, c, a)
                      } else {
                        if (b.cmd == "getPagedWordListOfUrl") {
                          bgWordMarker.getPagedWordListOfUrl(b, c, a)
                        } else {
                          if (b.cmd == "resetWordBank") {
                            wordBank.reset(b.db);
                            wordBank.init()
                          } else {
                            if (b.cmd == "addDictRecord") {
                              LMDICT.addDictRecord(b.word, b.def, b.dict)
                            } else {
                              if (b.cmd == "addSentenceRecord") {
                                bgWordMarker.onAddSentenceRecord(b.sentence, b.word, b.url, b.title, b.date_added)
                              } else {
                                if (b.cmd == "exportSentence") {
                                  bgWordMarker.onExportSentences(b, c, a)
                                } else {
                                  if (b.cmd == "report_word_marker_status") {
                                    bgWordMarker.onUpdateStatus(b)
                                  } else {
                                    if (b.cmd == "TODO") {} else {
                                      bgWordMarker.a(b, c, a)
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    chrome.tabs.onActiveChanged.addListener(function(a, b) {
      chrome.tabs.get(a, function(c) {
        if (!c) {
          return
        }
        if (c.url.indexOf("chrome") == 0) {
          bgWordMarker.updateWordCounter(0);
          bgWordMarker.updateActionIcon(false);
          return
        }
        bgWordMarker.queryStatus(c.id)
      })
    });
    chrome.browserAction.onClicked.addListener(function(a) {
      bgWordMarker.toggleEnable(a)
    })
  },
  onInitialize: function(c, g, b) {
    var f = false;
    var e = LMDICT.getInstanceId();
    if (c.taburl == null || typeof c.url == "undefined" || c.url == null || c.url.indexOf("chrome") == 0) {
      b({
        instanceId: e
      });
      return
    }
    var a = "markerpen10";
    try {
      a = localStorage.default_word_pen
    } catch (h) {
      a = "markerpen10";
      localStorage.default_word_pen = a
    }
    if (typeof a == "undefined" || a == null || a == "") {
      a = "markerpen10";
      localStorage.default_word_pen = a
    }
    var d = c.taburl.replace(/\#$/g, "");
    this.getWordListOfUrl(d, function(i) {
      if (i) {
        bgWordMarker.updateWordCounter(i.length);
        f = true
      } else {
        bgWordMarker.updateWordCounter(0)
      }
      bgWordMarker.updateActionIcon(f);
      b({
        state: f,
        wordPen: a,
        instanceId: e,
        wordList: i
      })
    })
  },
  onChangeMarkerStyle: function(a) {
    chrome.tabs.query({}, function(d) {
      for (var c = 0; c < d.length; c++) {
        var b = d[c].url;
        if (typeof b == "undefined" || b == null || b == "" || b.indexOf("chrome") == 0) {
          continue
        }
        chrome.tabs.sendRequest(d[c].id, {
          cmd: "modifyMarker",
          from: "options",
          wpen: localStorage.default_word_pen,
          spen: localStorage.default_scrap_pen
        })
      }
    })
  },
  onAddSentence: function(b, d, a) {
    var c = b.taburl.replace(/\#$/g, "");
    wordBank.addSentence(b.sentence, b.word, c, b.title)
  },
  onRemoveSentence: function(b, d, a) {
    var c = b.taburl;
    if (typeof c == "undefined" || c == null || c == "" || c.indexOf("chrome") == 0) {
      c = b.url
    }
    c = c.replace(/\#$/g, "");
    wordBank.removeSentence(b.sentence, b.word, c, b.title)
  },
  onRemoveSentenceById: function(b, d, a) {
    var c = b.id;
    if (typeof c == "undefined" || c == null || c == "") {
      return
    }
    wordBank.removeSentenceById(b.id, function(e) {
      a(e)
    })
  },
  getSentencesOfWord: function(b, d, a) {
    var c = b.word;
    if (!b.word) {
      return
    }
    wordBank.DB.transaction(function(e) {
      e.executeSql("SELECT * FROM sentences WHERE word LIKE ? ", [c], function(j, f) {
        var h = [];
        if (f.rows.length > 0) {
          for (var g = 0; g < f.rows.length; g++) {
            h.push({
              sentence: f.rows.item(g).sentence,
              word: f.rows.item(g).word,
              id: f.rows.item(g).id,
              url: f.rows.item(g).url,
              title: f.rows.item(g).title,
              date_added: f.rows.item(g).date_added
            })
          }
        }
        a(h)
      }, function(f, g) {
        a([])
      })
    })
  },
  getWordCounterOfUrl: function(c, g, d) {
    var b = c.url;
    if (c.taburl) {
      b = c.taburl
    }
    var a = "SELECT COUNT(DISTINCT word) AS WCOUNTER FROM sentences WHERE (url=? OR url=?) ";
    var i = [];
    var f = " AND ";
    if (typeof b == "undefined" || b == null || b == "") {
      a = "SELECT  COUNT(DISTINCT word) AS WCOUNTER FROM sentences ";
      b = null;
      f = ""
    } else {
      b = b.replace(/\#$/g, "");
      i = [b, b + "#"]
    }
    var e = c.filter;
    if (typeof e == "undefined" || e == null || e == "") {} else {
      a += f + " word LIKE '%" + e + "%' "
    }
    var h = wordBank.DB;
    h.transaction(function(j) {
      j.executeSql(a, i, function(k, l) {
        var m = l.rows.item(0).WCOUNTER;
        d(m)
      }, function(k, l) {
        d(0)
      })
    })
  },
  getPagedWordListOfUrl: function(c, g, d) {
    var b = c.url;
    if (c.taburl) {
      b = c.taburl
    }
    var e = c.limit;
    var a = "SELECT word FROM sentences  GROUP BY word ORDER BY date_added DESC ";
    var i = [];
    var f = 0;
    if (typeof b == "undefined" || b) {} else {
      f += 1
    } if (typeof e != "undefined" && e != null) {
      f += 2
    }
    switch (f) {
      case 1:
        b = b.replace(/\#$/g, "");
        i = [b, b + "#"];
        a = "SELECT word FROM sentences WHERE url=? OR url=? GROUP BY word ORDER BY date_added DESC ";
        break;
      case 2:
        if (typeof e.filter != "undefined" && e.filter != null && e.filter != "") {
          a = "SELECT word FROM sentences WHERE word LIKE '%" + e.filter + "%' GROUP BY word ORDER BY date_added DESC "
        }
        a += " LIMIT " + e.offset + ", " + e.size + " ";
        break;
      case 3:
        if (typeof e.filter != "undefined" && e.filter != null && e.filter != "") {
          a = "SELECT word FROM sentences WHERE word LIKE '%" + e.filter + "%' AND (url=? OR url=?) GROUP BY word ORDER BY date_added DESC ";
          i = [b, b + "#"]
        }
        a += " LIMIT " + e.offset + ", " + e.size + " ";
        break;
      default:
        break
    }
    var h = wordBank.DB;
    h.transaction(function(j) {
      j.executeSql(a, i, function(k, n) {
        var m = [];
        for (var l = 0; l < n.rows.length; l++) {
          m.push(n.rows.item(l).word)
        }
        d(m)
      }, function(k, l) {
        d([])
      })
    })
  },
  onAddSentenceRecord: function(e, d, c, b, a) {
    wordBank.addSentence(e, d, c, b, a)
  },
  onExportSentences: function(c, d, b) {
    var a = wordBank.DB;
    a.transaction(function(e) {
      e.executeSql("SELECT * FROM sentences ", [], function(j, f) {
        var h = [];
        if (f.rows.length > 0) {
          for (var g = 0; g < f.rows.length; g++) {
            h.push(encodeURIComponent(f.rows.item(g).word));
            h.push(",");
            h.push(encodeURIComponent(f.rows.item(g).sentence));
            h.push(",");
            h.push(encodeURIComponent(f.rows.item(g).url));
            h.push(",");
            h.push(encodeURIComponent(f.rows.item(g).title));
            h.push(",");
            h.push(f.rows.item(g).date_added);
            h.push("\n")
          }
          lmFileWriter.writeFile("sentences.csv", h, b)
        }
      }, function(f, g) {})
    })
  },
  onMarkWordNotify: function(b, c, a) {
    this.updateWordCounter(b.wordCount);
    chrome.tabs.sendRequest(c.tab.id, {
      cmd: "markWordBroadcast",
      word: b.word
    })
  },
  onUnmarkWordNotify: function(b, c, a) {
    this.updateWordCounter(b.wordCount);
    chrome.tabs.sendRequest(c.tab.id, {
      cmd: "unmarkWordBroadcast",
      word: b.word
    })
  },
  a: function(b, c, a) {},
  toggleEnable: function(a) {
    var b = null;
    if (a) {
      b = a.id
    }
    chrome.tabs.sendRequest(b, {
      cmd: "toggleWordMarkerEnable"
    }, function(c) {
      bgWordMarker.onUpdateStatus(c)
    })
  },
  queryStatus: function(a) {
    chrome.tabs.sendRequest(a, {
      cmd: "query_marker_status"
    })
  },
  onUpdateStatus: function(a) {
    if (typeof a == "undefined" || a == null) {
      return
    }
    this.updateWordCounter(a.wordCount);
    this.updateActionIcon(a.activated)
  },
  updateWordCounter: function(a) {
    if (a == 0) {
      a = ""
    }
    chrome.browserAction.setBadgeText({
      text: String(a)
    })
  },
  updateActionIcon: function(a) {
    if (a) {
      chrome.browserAction.setIcon({
        path: "../../images/marker_pen_32.png"
      })
    } else {
      chrome.browserAction.setIcon({
        path: "../../images/marker_pen_inactive32.png"
      })
    }
  },
  getWordListOfUrl: function(c, a) {
    if (typeof c == "undefined" || c == null || c == "") {
      return
    }
    c = c.replace(/\#$/g, "");
    var b = wordBank.DB;
    b.transaction(function(d) {
      d.executeSql("SELECT word FROM sentences WHERE url=? OR url=? GROUP BY word ", [c, c + "#"], function(e, h) {
        var g = [];
        for (var f = 0; f < h.rows.length; f++) {
          g.push(h.rows.item(f).word)
        }
        if (typeof a == "undefined") {} else {
          a(g)
        }
      }, function(f, g) {})
    })
  },
  getTabUrl: function(c, b) {
    var a = b;
    if (typeof c.tab == "undefined" || c.tab == null) {} else {
      if (c.tab.url) {
        a = c.tab.url
      }
    }
    a = a.replace(/\#$/g, "");
    return a
  },
  initPen: function(a, b) {
    if (typeof a == "undefined" || a == null || a == "") {
      a = b
    }
  }
};
(function() {
  bgWordMarker.initMsgHandler()
})();

function LM_ENTRY(a) {
  this.overwrite = false;
  this.NOT_FOUND = "definition not found.";
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
  this.entry = {
    query: a,
    sanitizedQuery: null,
    wordStem: [],
    phoneticSymbol: [],
    pinyin: [],
    shortMeaning: null,
    meaningTerms: [],
    sampleSentences: [],
    homoionym: [],
    antonym: [],
    synonym: [],
    audio: [],
    morphs: []
  };
  this.push = function(b, g, f) {
    if (typeof b == "undefined" || b == null || typeof g == "undefined" || g == null) {
      return
    }
    try {
      g = this.trim(g);
      for (var c = 0; c < b.length; c++) {
        if (typeof f !== "undefined" && f != null) {
          if (f(b[c], g)) {
            return b
          }
        } else {
          if (b[c].toLowerCase() == g.toLowerCase()) {
            return b
          }
        }
      }
      b.push(g)
    } catch (d) {}
    return b
  };
  this.isSentenceEqual = function(d, c) {
    if (typeof d == "undefined" || typeof c == "undefined" || d == null) {
      return false
    }
    if (c == null) {
      return true
    }
    if (d.orig == c.orig && d.trans == c.trans) {
      return true
    }
    return false
  };
  this.isSynonymExist = function(d, c) {
    if (typeof d == "undefined" || typeof c == "undefined" || d == null) {
      return false
    }
    if (c == null) {
      return true
    }
    if (d.orig == c.orig && d.trans == c.trans) {
      return true
    }
    return false
  };
  this.toString = function() {
    return this.stringify()
  };
  this.stringify = function() {
    return JSON.stringify(this.entry, null, "  ")
  };
  this.decodeXmlTag = function(b) {
    return b.replace(/&nbsp;/mg, " ").replace(/&amp;/mg, "&").replace(/&lt;/mg, "<").replace(/&gt;/mg, ">").replace(/&quot;/mg, '"')
  };
  this.decodeUnicode = function(c) {
    var b = c;
    b = c.replace(/(\&\#\d+\;)/gim, function(f) {
      var d = f;
      var e = /(\d+)/.exec(f);
      if (e) {
        d = String.fromCharCode(Number(e[1]))
      } else {}
      return d
    });
    return b
  };
  this.addPhoneticSymbol = function(b) {
    if (typeof b == "undefined" || b == null || this.trim(b) == "") {
      return false
    }
    b = this.trim(b);
    b = this.decodeUnicode(b);
    b = this.decodeXmlTag(b);
    return this.push(this.entry.phoneticSymbol, b)
  };
  this.addPinyin = function(b) {
    if (typeof b == "undefined" || b == null || this.trim(b) == "") {
      return false
    }
    b = this.trim(b);
    b = this.decodeUnicode(b);
    b = this.decodeXmlTag(b);
    return this.push(this.entry.pinyin, b)
  };
  this.addWordStem = function(b) {
    this.push(this.entry.wordStem, b)
  };
  this.addMeaningTerms = function(b) {
    this.push(this.entry.meaningTerms, b)
  };
  this.addHomoionym = function(b) {
    this.push(this.entry.homoionym, b)
  };
  this.addSynonym = function(b) {
    if (typeof b == "undefined" || b == null) {
      return
    }
    if (b.orig.toLowerCase() == this.entry.query.toLowerCase()) {
      return
    }
    this.push(this.entry.synonym, b, this.FUNC(this, this.isSynonymExist))
  };
  this.addAntonym = function(b) {
    this.push(this.entry.antonym, b)
  };
  this.addAudio = function(b) {
    this.push(this.entry.audio, b)
  };
  this.addMorph = function(b) {
    this.push(this.entry.morphs, b)
  };
  this.addSentence = function(b) {
    this.push(this.entry.sampleSentences, b, this.FUNC(this, this.isSentenceEqual))
  };
  this.setShortMeaning = function(b) {
    if (typeof b == "undefined" || b == null) {
      return
    }
    if (this.entry.shortMeaning == this.NOT_FOUND || this.entry.shortMeaning == null || this.entry.shortMeaning == "") {
      this.entry.shortMeaning = b
    } else {
      if (this.overwrite) {
        this.entry.shortMeaning = b
      }
    }
  };
  this.setSanitizedQuery = function(b) {
    if (typeof b == "undefined" || b == null) {
      return
    }
    b = this.decodeUnicode(b);
    b = this.decodeXmlTag(b);
    if (this.entry.sanitizedQuery == null || this.entry.sanitizedQuery == "") {
      this.entry.sanitizedQuery = b
    } else {
      if (this.overwrite) {
        this.entry.sanitizedQuery = b
      }
    }
  }
}
var LMDICT = {
  dictionaries: [],
  instanceId: -1,
  inited: false,
  dictName: "lm_dict",
  trim: function(a) {
    if (typeof a == "string") {
      return a.replace(/^\s+|\s+$/g, "")
    } else {
      return a
    }
  },
  FUNC: function(d, c) {
    return function() {
      return c.apply(d, arguments)
    }
  },
  contains: function(a, f) {
    if (typeof a == "undefined" || a == null || typeof f == "undefined" || f == null) {
      return false
    }
    for (var g = 0, b = a.length; g < b; g++) {
      if (f == a[g]) {
        return true
      } else {
        if (String(f) != "") {
          if (String(f).toLowerCase() == String(a[g]).toLowerCase()) {
            return true
          }
        }
      }
    }
    return false
  },
  loadOptions: function() {
    this.options = null;
    try {
      this.options = JSON.parse(localStorage.options)
    } catch (a) {}
    if (this.options == null) {
      this.options = {
        dicts: [],
        save_word_entry_local: true
      }
    }
  },
  saveOptions: function() {
    localStorage.options = JSON.stringify(this.options)
  },
  prepareQuery: function(c) {
    if (typeof c == "undefined" || c == null) {
      return null
    }
    var b = RegExp("<[^>]*>", "g");
    var a = RegExp("[<>]", "g");
    c = c.replace(b, "");
    c = c.replace(a, "");
    c = this.trim(c);
    return c = c.substring(0, 100).toLowerCase()
  },
  register: function(e) {
    var c = -1;
    for (var d = 0; d < this.options.dicts.length; d++) {
      var b = this.options.dicts[d];
      if (b.name == e.name) {
        b.enabled = e.enabled;
        this.dictionaries[b.name] = e.dict;
        c = d
      }
    }
    if (c < 0) {
      c = this.options.dicts.length;
      this.options.dicts.push({
        name: e.name,
        enabled: e.enabled
      });
      this.dictionaries[e.name] = e.dict
    }
    return c
  },
  enableDict: function(b, e) {
    for (var d = 0; d < this.options.dicts.length; d++) {
      var c = this.options.dicts[d];
      if (c.name = b) {
        c.enabled = e;
        return d
      }
    }
    return -1
  },
  updateDictionaries: function(a) {
    this.options.dicts = a;
    this.saveOptions()
  },
  checkWord: function(e, d, b, f, a) {
    var c = wordBank.DB;
    if (c == null) {
      console.error("lm_dict checkword, db is null");
      return
    }
    c.transaction(function(g) {
      g.executeSql("SELECT * FROM dictionary WHERE word LIKE ? AND dict LIKE ? ", [e, LMDICT.dictName], function(j, m) {
        var i = null;
        if (m.rows.length > 0) {
          i = m.rows.item(0).def
        }
        var l = null;
        var h = 100;
        try {
          l = JSON.parse(i)
        } catch (k) {
          l = null
        }
        if (l != null) {
          h = 200
        } else {
          LMDICT.fetchWeb(e, d, b, f, function(o, n, r, q, p) {
            LMDICT.responseGetWordDef(o, n, r, q, p)
          })
        }
        a({
          entry: l,
          checkingId: b,
          instanceId: d,
          status: h
        })
      }, function(h, i) {
        console.error(" lm_dict checkword [" + e + "] failed. check::" + i.message)
      })
    })
  },
  fetchWeb: function(j, h, c, f, l) {
    var a = this.prepareQuery(j);
    if (a == null || a == "") {
      return null
    }
    var k = {
      cb: l,
      query: a,
      instanceId: h,
      checkingId: c,
      tabId: f,
      numResponses: 0,
      responses: [],
      numDicts: 0
    };
    var b = [];
    for (var g = 0; g < this.options.dicts.length; g++) {
      var d = this.options.dicts[g];
      if (d.enabled) {
        var e = this.dictionaries[d.name];
        if (e && e.fetch) {
          k.numDicts++;
          b.push(e)
        }
      }
    }
    for (var g = 0; g < b.length; g++) {
      b[g].fetch(k, function(m, i) {
        LMDICT.finalize(m, i)
      })
    }
  },
  finalize: function(b, f) {
    if (typeof b == "undefined" || b == null) {
      console.error("LMDICT error: finalize, _p is not defined or null");
      return
    }
    if (b.numDicts > b.numResponses) {
      return
    }
    try {
      var h = new LM_ENTRY(b.query);
      for (var g in b.responses) {
        var a = b.responses[g];
        var c = this.dictionaries[g];
        if (a != null && c != null) {
          h = c.getEntry(b, h)
        }
      }
      var i = false;
      if (h.entry.shortMeaning == null) {} else {
        i = true;
        this.saveWordEntry(h.entry)
      }
      var j = b.cb;
      if (typeof j == "undefined" || j == null) {} else {
        if (i) {
          j(h.entry, 200, b.instanceId, b.checkingId, b.tabId)
        } else {
          j(null, 404, b.instanceId, b.checkingId, b.tabId)
        }
      }
    } catch (e) {}
  },
  queryEntryFromLocalDB: function(b, a) {},
  responseGetWordDef: function(b, d, c, a, e) {
    var f = {
      entry: b,
      checkingId: a,
      instanceId: c,
      status: d
    };
    chrome.tabs.get(e, this.FUNC(this, function(g) {}));
    chrome.tabs.sendRequest(e, {
      cmd: "get_word_def_response",
      msg: f
    })
  },
  removeWordDef: function(c, d, f) {
    var b = [];
    var e = "";
    if (typeof c == "undefined" || c == null || c == "") {
      if (typeof d == "undefined" || d == null || d == "") {
        return
      } else {
        e = "DELETE FROM dictionary WHERE word=? ";
        b = [d]
      }
    } else {
      e = "DELETE FROM dictionary WHERE id=? ";
      b = [c]
    } if (typeof f == "undefined" || f == null || f == "") {} else {
      if (e != "") {
        e += " AND dict=? ";
        b.push(f)
      }
    } if (e == "") {
      return
    }
    var a = wordBank.DB;
    a.transaction(function(g) {
      g.executeSql(e, b, function(i, h) {}, function(h, i) {
        console.error(" removeWordDef failed: state=" + e + "\nmessage:" + i.message)
      })
    })
  },
  saveWordEntry: function(a) {
    if (typeof a == "undefined" || a == null) {
      return
    }
    if (this.options.save_word_entry_local) {
      var b = JSON.stringify(a);
      wordBank.updateWordDefinition(a.query, b, this.dictName)
    }
  },
  addDictRecord: function(a, c, b) {
    wordBank.updateWordDefinition(a, c, b)
  },
  onExportDict: function(c, d, b) {
    var a = wordBank.DB;
    a.transaction(function(e) {
      e.executeSql("SELECT * FROM dictionary ", [], function(j, f) {
        var h = [];
        if (f.rows.length > 0) {
          for (var g = 0; g < f.rows.length; g++) {
            h.push(encodeURIComponent(f.rows.item(g).word));
            h.push(",");
            h.push(encodeURIComponent(f.rows.item(g).def));
            h.push(",");
            h.push(f.rows.item(g).dict);
            h.push(",");
            h.push(f.rows.item(g).date_added);
            h.push("\n")
          }
          lmFileWriter.writeFile("dict.csv", h, b)
        }
      }, function(f, g) {})
    })
  },
  getInstanceId: function(a) {
    this.init();
    this.instanceId++;
    if (typeof a != "undefined" || a != null) {
      a({
        instanceId: this.instanceId
      })
    }
    return this.instanceId
  },
  init: function() {
    if (this.inited) {
      return
    }
    this.loadOptions();
    this.inited = true
  }
};
(function() {
  chrome.extension.onRequest.addListener(function(c, b, a) {
    if (c.cmd == "lm_dict_query") {
      LMDICT.fetchWeb(c.query, c.instanceId, c.checkingId, b.tab.id, a)
    }
  });
  chrome.extension.onRequest.addListener(function(c, b, a) {
    if (c.cmd == "get_word_def") {
      LMDICT.checkWord(c.query, c.instanceId, c.checkingId, b.tab.id, a)
    }
  });
  chrome.extension.onRequest.addListener(function(c, b, a) {
    if (c.cmd == "remove_word_def") {
      LMDICT.removeWordDef(c.id, c.word, c.dict, a)
    }
  });
  chrome.extension.onRequest.addListener(function(b, c, a) {
    if (b.cmd == "init_lm_dict_instance") {
      LMDICT.getInstanceId(a)
    }
  });
  chrome.extension.onRequest.addListener(function(b, c, a) {
    if (b.cmd == "register_lm_dict") {
      a(LMDICT.register(b))
    }
  });
  chrome.extension.onRequest.addListener(function(b, c, a) {
    if (b.cmd == "exportDictiory") {
      LMDICT.onExportDict(b, c, a)
    }
  });
  LMDICT.init()
})();
var g_en_dict = {
  inited: false,
  name: "g_en_dict",
  dictName: "dict-chrome-ex",
  options: {
    language: "zh-CN"
  },
  enabled: true,
  order: -1,
  loadOptions: function() {
    var b = null;
    try {
      b = JSON.parse(localStorage.options.dicts);
      this.options.language = JSON.parse(localStorage.options.language)
    } catch (c) {
      this.options.language = "zh-CN"
    }
    if (b != null) {
      for (var a = 0; a < b.length; a++) {
        if (b[a].name == this.name) {
          this.order = a;
          this.enabled = dict[a].enabled
        }
      }
    }
  },
  fetch: function(c, a) {
    var d = c.query;
    var b = "pr,de";
    google.language.define(d, "en", "en", function(e) {
      g_en_dict.handleResponse(e, c, a)
    }, {
      restricts: b
    })
  },
  handleResponse: function(c, e, a) {
    if (typeof e == "undefined") {
      console.error("g_en_dict handleResponse error, _parcel is undefined");
      if (typeof a == "undefined" || a == null) {} else {
        a(null, this.name + " - _parcel is undefined;")
      }
      return
    }
    if (e == null) {
      console.error("g_en_dict handleResponse error, _parcel is null");
      a(null, this.name + "null parcel");
      return
    }
    try {
      var b = null;
      b = c;
      e.numResponses++;
      e.responses[this.name] = b;
      if (typeof a == "undefined" || a == null) {} else {
        a(e, this.name + " pared.")
      }
    } catch (d) {
      console.error("g_en_dict handleResponse:" + d.message);
      e.numResponses++;
      e.responses[this.name] = null;
      if (typeof a == "undefined" || a == null) {} else {
        a(e, this.name + "- parse error")
      }
    }
  },
  getMeaning: function(g, a) {
    if (typeof g == "undefined" || g == null || g.length == 0) {
      return a
    }
    for (var e = 0; e < g.length; e++) {
      var h = g[e];
      if (h != null) {
        var f = h.type;
        if (h.terms != null && h.terms.length > 0) {
          for (var b = 0; b < h.terms.length; b++) {
            var d = h.terms[b];
            if (d.type == "text") {
              if (f == "headword" || f == "meaning") {
                a.addMeaningTerms(d.text)
              } else {
                if (f == "example") {
                  a.addSentence({
                    orig: d.text
                  })
                }
              }
            } else {
              if (d.type == "phonetic") {
                a.addPhoneticSymbol(d.text)
              } else {
                if (d.type == "sound") {
                  a.addAudio(d.text.replace("http://", "https://"))
                }
              }
            }
          }
        }
      }
      a = this.getMeaning(h.entries, a)
    }
    return a
  },
  getEntry: function(c, a) {
    if (typeof a == "undefined" || a == null) {
      a = new LM_ENTRY(c.query)
    }
    var b = c.responses[this.name];
    if (typeof b == "undefined" || b == null) {
      return a
    }
    if (typeof b.status == "undefined" || b.status == null || typeof b.status.code == "undefined" || b.status.code != 200) {
      return a
    }
    a = this.getMeaning(b.primaries, a);
    a = this.getMeaning(b.webDefinitions, a);
    return a
  },
  register: function() {
    if (typeof LMDICT != "undefined" && LMDICT != "null") {
      LMDICT.register({
        name: this.name,
        enabled: this.enabled,
        dict: this
      })
    }
  },
  init: function() {
    if (this.inited) {
      return
    }
    this.loadOptions();
    this.register();
    if (typeof google == "undefined" || google == null) {
      try {
        dict_api.load("https://clients5.google.com?client=" + this.dictName, "1", "en")
      } catch (a) {
        console.error(this.name + " init error dict_api.load failed: " + a.message)
      }
    }
    this.inited = true
  }
};
(function() {
  g_en_dict.init()
})();
var g_translate = {
  inited: false,
  name: "g_translate",
  dictName: "dict-chrome-ex",
  options: {
    language: "zh-CN"
  },
  enabled: true,
  order: -1,
  loadOptions: function() {
    var b = null;
    try {
      b = JSON.parse(localStorage.options.dicts)
    } catch (c) {}
    if (b != null) {
      for (var a = 0; a < b.length; a++) {
        if (b[a].name == this.name) {
          this.order = a;
          this.enabled = dict[a].enabled
        }
      }
    }
  },
  checkGoogleTranlate: function(b, a) {
    var c = new XMLHttpRequest;
    c.open("GET", "https://clients5.google.com/translate_a/t?client=" + this.dictName + "&sl=auto&tl=" + this.options.language + "&q=" + b, true);
    c.onreadystatechange = function() {
      if (c.readyState == 4) {
        var d = c.responseText;
        try {
          var f = JSON.parse(d);
          a(f)
        } catch (e) {
          a(null)
        }
      }
    };
    c.send()
  },
  fetch: function(b, a) {
    this.checkGoogleTranlate(b.query, function(c) {
      g_translate.handleResponse(c, b, a)
    })
  },
  getShortMeaning: function(e) {
    var l = true;
    if (!e || e.sentences[0].orig.toLowerCase() == e.sentences[0].trans.toLowerCase()) {
      return null
    }
    var j = e.sentences[0].orig.toLowerCase();
    var k = e.sentences[0].trans.toLowerCase();
    var c = k;
    if (l && e.dict && e.dict.length > 0) {
      for (var i = 0; i < e.dict.length; i++) {
        var f = e.dict[i];
        for (var b = 0, d = 0; d < f.terms.length && b < 2; d++) {
          var a = f.terms[d].toLowerCase();
          if (a.length > 0 && a != j && a != k) {
            c = c + (", " + a);
            b++
          }
        }
      }
    }
    return c
  },
  getEntry: function(c, a) {
    if (typeof a == "undefined" || a == null) {
      a = new LM_ENTRY(c.query)
    }
    var b = c.responses[this.name];
    a.setShortMeaning(this.getShortMeaning(b));
    a = this.getMeaningTerms(b, a);
    return a
  },
  getMeaningTerms: function(i, x) {
    var v = true;
    if (!i || i.sentences[0].orig.toLowerCase() == i.sentences[0].trans.toLowerCase()) {
      return null
    }
    var s = i.sentences[0].orig.toLowerCase();
    var t = i.sentences[0].trans.toLowerCase();
    var p = i.sentences[0].translit;
    x.addMeaningTerms(t);
    x.addPinyin(p);
    if (v && i.dict && i.dict.length > 0) {
      for (var k = 0; k < i.dict.length; k++) {
        var j = i.dict[k];
        for (var d = 0; d < j.terms.length; d++) {
          var b = j.terms[d].toLowerCase();
          if (b.length > 0 && b != s && b != t) {
            x.addMeaningTerms(b)
          }
        }
        if (j.entry && j.entry.length > 0) {
          for (var f = 0; f < j.entry.length; f++) {
            var q = j.entry[f];
            var u = q.word;
            for (var c = 0; c < q.reverse_translation.length; c++) {
              var a = q.reverse_translation[c];
              x.addSynonym({
                orig: a,
                trans: u
              })
            }
          }
        }
      }
    }
    return x
  },
  handleResponse: function(c, e, a) {
    if (typeof e == "undefined") {
      console.error("g_translate handleResponse error, _parcel is undefined");
      if (typeof a == "undefined" || a == null) {} else {
        a(null, this.name + " - _parcel is undefined;")
      }
      return
    }
    if (e == null) {
      console.error("g_translate handleResponse error, _parcel is null");
      a(null, this.name + "null parcel");
      return
    }
    try {
      var b = null;
      b = c;
      e.numResponses++;
      e.responses[this.name] = b;
      if (typeof a == "undefined" || a == null) {} else {
        a(e, this.name + " pared.")
      }
    } catch (d) {
      console.error("g_translate handleResponse:" + d.message);
      e.numResponses++;
      e.responses[this.name] = null;
      if (typeof a == "undefined" || a == null) {} else {
        a(e, this.name + "- parse error")
      }
    }
  },
  getTranslation: function(e, l) {
    if (!e || e.sentences[0].orig.toLowerCase() == e.sentences[0].trans.toLowerCase()) {
      return null
    }
    var j = e.sentences[0].orig.toLowerCase();
    var k = e.sentences[0].trans.toLowerCase();
    var c = k;
    if (l && e.dict && e.dict.length > 0) {
      for (var i = 0; i < e.dict.length; i++) {
        var f = e.dict[i];
        for (var b = 0, d = 0; d < f.terms.length && b < 2; d++) {
          var a = f.terms[d].toLowerCase();
          if (a.length > 0 && a != j && a != k) {
            c = c + (", " + a);
            b++
          }
        }
      }
    }(j = window["gdx.LANG_MAP"][e.src.toLowerCase()]) || (j = e.src);
    return {
      type: "translation",
      meaningText: c,
      attribution: "Translated from " + j,
      srcLang: e.src
    }
  },
  register: function() {
    if (typeof LMDICT != "undefined" && LMDICT != "null") {
      LMDICT.register({
        name: this.name,
        enabled: this.enabled,
        dict: this
      })
    }
  },
  init: function() {
    if (this.inited) {
      return
    }
    this.loadOptions();
    this.register();
    this.inited = true
  }
};
(function() {
  g_translate.init()
})();
var g_dict = {
  inited: false,
  name: "g_dict",
  dictName: "dict-chrome-ex",
  options: {
    language: "zh-CN"
  },
  enabled: true,
  order: -1,
  loadOptions: function() {
    var b = null;
    try {
      b = JSON.parse(localStorage.options.dicts);
      this.options.language = JSON.parse(localStorage.options.language)
    } catch (c) {
      this.options.language = "zh-CN"
    }
    if (b != null) {
      for (var a = 0; a < b.length; a++) {
        if (b[a].name == this.name) {
          this.order = a;
          this.enabled = dict[a].enabled
        }
      }
    }
  },
  fetch: function(c, a) {
    var d = c.query;
    var b = "pr,de";
    google.language.define(d, "en", this.options.language, function(e) {
      g_dict.handleResponse(e, c, a)
    }, {
      restricts: b
    })
  },
  handleResponse: function(c, e, a) {
    if (typeof e == "undefined") {
      console.error("g_dict handleResponse error, _parcel is undefined");
      if (typeof a == "undefined" || a == null) {} else {
        a(null, this.name + " - _parcel is undefined;")
      }
      return
    }
    if (e == null) {
      console.error("g_dict handleResponse error, _parcel is null");
      a(null, this.name + "null parcel");
      return
    }
    try {
      var b = null;
      b = c;
      e.numResponses++;
      e.responses[this.name] = b;
      if (typeof a == "undefined" || a == null) {} else {
        a(e, this.name + " pared.")
      }
    } catch (d) {
      console.error("g_dict handleResponse:" + d.message);
      e.numResponses++;
      e.responses[this.name] = null;
      if (typeof a == "undefined" || a == null) {} else {
        a(e, this.name + "- parse error")
      }
    }
  },
  getMeaning: function(g, a) {
    if (typeof g == "undefined" || g == null || g.length == 0) {
      return a
    }
    for (var e = 0; e < g.length; e++) {
      var h = g[e];
      if (h != null) {
        var f = h.type;
        if (h.terms != null && h.terms.length > 0) {
          for (var b = 0; b < h.terms.length; b++) {
            var d = h.terms[b];
            if (d.type == "text") {
              if (f == "headword" || f == "meaning") {
                a.addMeaningTerms(d.text)
              } else {
                if (f == "example") {
                  a.addSentence({
                    orig: d.text
                  })
                }
              }
            } else {
              if (d.type == "phonetic") {
                a.addPhoneticSymbol(d.text)
              } else {
                if (d.type == "sound") {
                  a.addAudio(d.text.replace("http://", "https://"))
                }
              }
            }
          }
        }
      }
      a = this.getMeaning(h.entries, a)
    }
    return a
  },
  getEntry: function(c, a) {
    if (typeof a == "undefined" || a == null) {
      a = new LM_ENTRY(c.query)
    }
    var b = c.responses[this.name];
    if (typeof b == "undefined" || b == null) {
      return a
    }
    if (typeof b.status == "undefined" || b.status == null || typeof b.status.code == "undefined" || b.status.code != 200) {
      return a
    }
    a = this.getMeaning(b.primaries, a);
    a = this.getMeaning(b.webDefinitions, a);
    return a
  },
  register: function() {
    if (typeof LMDICT != "undefined" && LMDICT != "null") {
      LMDICT.register({
        name: this.name,
        enabled: this.enabled,
        dict: this
      })
    }
  },
  init: function() {
    if (this.inited) {
      return
    }
    this.loadOptions();
    this.register();
    if (typeof google == "undefined" || google == null) {
      try {
        dict_api.load("https://clients5.google.com?client=" + this.dictName, "1", "en")
      } catch (a) {
        console.error(this.name + " init error dict_api.load failed: " + a.message)
      }
    }
    this.inited = true
  }
};
(function() {
  g_dict.init()
})();
var dict_iciba = {
  inited: false,
  name: "dict_iciba",
  dictName: "dict.cn",
  options: {
    language: "zh-CN"
  },
  enabled: true,
  order: -1,
  push: function(d, c) {},
  loadOptions: function() {
    var b = null;
    try {
      b = JSON.parse(localStorage.options.dicts);
      this.options.language = JSON.parse(localStorage.options.language)
    } catch (c) {
      this.options.language = "zh-CN"
    }
    if (b != null) {
      for (var a = 0; a < b.length; a++) {
        if (b[a].name == this.name) {
          this.order = a;
          this.enabled = dict[a].enabled
        }
      }
    }
  },
  fetch: function(d, a) {
    var b = d.query;
    var c = new XMLHttpRequest;
    c.open("GET", "http://dict-co.iciba.com/api/dictionary.php?w=" + b, true);
    c.onreadystatechange = function() {
      if (c.readyState == 4) {
        var e = c.responseText;
        var f = c.responseXML;
        try {
          dict_iciba.handleResponse(f, d, a)
        } catch (g) {
          dict_iciba.handleResponse(null, d, a)
        }
      }
    };
    c.send()
  },
  handleResponse: function(c, e, a) {
    if (typeof e == "undefined") {
      console.error("dict_iciba handleResponse error, _parcel is undefined");
      if (typeof a == "undefined" || a == null) {} else {
        a(null, this.name + " - _parcel is undefined;")
      }
      return
    }
    if (e == null) {
      console.error("dict_iciba handleResponse error, _parcel is null");
      a(null, this.name + "null parcel");
      return
    }
    try {
      var b = null;
      b = c;
      e.numResponses++;
      e.responses[this.name] = b;
      if (typeof a == "undefined" || a == null) {} else {
        a(e, this.name + " pared.")
      }
    } catch (d) {
      console.error("dict_iciba handleResponse:" + d.message);
      e.numResponses++;
      e.responses[this.name] = null;
      if (typeof a == "undefined" || a == null) {} else {
        a(e, this.name + "- parse error")
      }
    }
  },
  trim: function(a) {
    if (typeof a == "string") {
      return a.replace(/^\s+|\s+$/g, "")
    } else {
      return a
    }
  },
  nodeValue: function(b) {
    if (typeof b == "undefined" || b == null) {
      return null
    }
    if (b.childNodes.length > 0) {
      var a = b.childNodes[0];
      if (a) {
        var c = a.nodeValue;
        if (c) {
          c = this.trim(c);
          if (c != "") {
            return c
          }
        }
      }
    }
    return null
  },
  getEntry: function(d, n) {
    if (typeof n == "undefined" || n == null) {
      n = new LM_ENTRY(d.query)
    }
    var c = d.responses[this.name];
    if (typeof c == "undefined" || c == null) {
      return n
    }
    var l = c.getElementsByTagName("key");
    if (l.length <= 0) {} else {
      n.setSanitizedQuery(this.nodeValue(l[0]))
    }
    var h = c.getElementsByTagName("ps");
    for (var g = 0; g < h.length; g++) {
      n.addPhoneticSymbol(this.nodeValue(h[g]))
    }
    var f = c.getElementsByTagName("pron");
    for (var g = 0; g < f.length; g++) {
      var b = this.nodeValue(f[g]);
      if (b) {
        if (b.indexOf("http://res-tts.iciba.com") >= 0) {} else {
          n.addAudio(b)
        }
      }
    }
    var a = c.getElementsByTagName("pos");
    var e = c.getElementsByTagName("acceptation");
    for (var g = 0; g < a.length; g++) {
      n.addMeaningTerms(this.nodeValue(a[g]) + ", " + this.nodeValue(e[g]))
    }
    var k = c.getElementsByTagName("sent");
    for (var g = 0; g < k.length; g++) {
      var j = k[g].getElementsByTagName("orig")[0];
      var m = k[g].getElementsByTagName("trans")[0];
      n.addSentence({
        orig: this.nodeValue(j),
        trans: this.nodeValue(m)
      })
    }
    return n
  },
  register: function() {
    if (typeof LMDICT != "undefined" && LMDICT != "null") {
      LMDICT.register({
        name: this.name,
        enabled: this.enabled,
        dict: this
      })
    }
  },
  init: function() {
    if (this.inited) {
      return
    }
    this.loadOptions();
    this.register();
    if (typeof google == "undefined" || google == null) {
      try {
        dict_api.load("https://clients5.google.com?client=" + this.dictName, "1", "en")
      } catch (a) {
        console.error(this.name + " init error dict_api.load failed: " + a.message)
      }
    }
    this.inited = true
  }
};
(function() {
  dict_iciba.init()
})();
var qq_dict = {
  inited: false,
  name: "qq_dict",
  dictName: "dict.qq.com",
  options: {
    language: "zh-CN"
  },
  enabled: true,
  order: -1,
  loadOptions: function() {
    var b = null;
    try {
      b = JSON.parse(localStorage.options.dicts);
      this.options.language = JSON.parse(localStorage.options.language)
    } catch (c) {
      this.options.language = "zh-CN"
    }
    if (b != null) {
      for (var a = 0; a < b.length; a++) {
        if (b[a].name == this.name) {
          this.order = a;
          this.enabled = dict[a].enabled
        }
      }
    }
  },
  fetch: function(d, a) {
    var b = d.query;
    var c = new XMLHttpRequest;
    c.open("GET", "http://dict.qq.com/dict?q=" + b, true);
    c.onreadystatechange = function() {
      if (c.readyState == 4) {
        var e = c.responseText;
        try {
          var g = JSON.parse(e);
          qq_dict.handleResponse(g, d, a)
        } catch (f) {
          a(null, d, a)
        }
      }
    };
    c.send()
  },
  getSentenses: function(b, a) {
    if (typeof b == "undefined" || b == null || b.length == 0) {
      return a
    }
    for (var c = 0; c < b.length; c++) {
      var d = b[c];
      a.addSentence({
        orig: d.es,
        trans: d.cs
      })
    }
    return a
  },
  getDef: function(h, c, g) {
    if (typeof h == "undefined" || h == null) {
      return c
    }
    if (typeof g != "undefined" && g && h.word && c.trim(h.word) != "") {
      c.setSanitizedQuery(h.word)
    }
    if (h.pho) {
      for (var d = 0; d < h.pho.length; d++) {
        c.addPhoneticSymbol(h.pho[d])
      }
    }
    if (h.des != null && h.des.length > 0) {
      for (var d = 0; d < h.des.length; d++) {
        var f = h.des[d];
        var a = "";
        if (f.p) {
          a = f.p + " "
        }
        if (f.d) {
          a += f.d
        }
        c.addMeaningTerms(a);
        if (f.s) {
          c.addMeaningTerms(f.s)
        }
      }
    }
    if (h.sen != null && h.sen.length > 0) {
      for (var d = 0; d < h.sen.length; d++) {
        var e = h.sen[d];
        if (e.s != null && e.s.length > 0) {
          c = this.getSentenses(e.s, c)
        }
      }
    }
    if (h.mor != null && h.mor.length > 0) {
      for (var d = 0; d < h.mor.length; d++) {
        var b = h.mor[d];
        c.addMorph({
          type: b.c,
          text: b.m
        })
      }
    }
    return c
  },
  handleResponse: function(c, e, a) {
    if (typeof e == "undefined") {
      console.error("qq_dict handleResponse error, _parcel is undefined");
      if (typeof a == "undefined" || a == null) {} else {
        a(null, this.name + " - _parcel is undefined;")
      }
      return
    }
    if (e == null) {
      console.error("qq_dict handleResponse error, _parcel is null");
      a(null, this.name + "null parcel");
      return
    }
    try {
      var b = null;
      b = c;
      e.numResponses++;
      e.responses[this.name] = b;
      if (typeof a == "undefined" || a == null) {} else {
        a(e, this.name + " pared.")
      }
    } catch (d) {
      console.error("qq_dict handleResponse:" + d.message);
      e.numResponses++;
      e.responses[this.name] = null;
      if (typeof a == "undefined" || a == null) {} else {
        a(e, this.name + "- parse error")
      }
    }
  },
  getEntry: function(d, a) {
    if (typeof a == "undefined" || a == null) {
      a = new LM_ENTRY(d.query)
    }
    var c = d.responses[this.name];
    if (typeof c.local == "undefined" || c.local == null) {} else {
      for (var b = 0; b < c.local.length; b++) {
        a = this.getDef(c.local[b], a, true)
      }
    } if (typeof c.netdes == "undefined" || c.netdes == null) {} else {
      for (var b = 0; b < c.netdes.length; b++) {
        a = this.getDef(c.netdes[b], a, false)
      }
    } if (typeof c.netsen == "undefined" || c.netsen == null) {} else {
      for (var b = 0; b < c.netsen.length; b++) {
        a = this.getDef(c.netsen[b], a, false)
      }
    }
    return a
  },
  register: function() {
    if (typeof LMDICT != "undefined" && LMDICT != "null") {
      LMDICT.register({
        name: this.name,
        enabled: this.enabled,
        dict: this
      })
    }
  },
  init: function() {
    if (this.inited) {
      return
    }
    this.loadOptions();
    this.register();
    if (typeof google == "undefined" || google == null) {
      try {
        dict_api.load("https://clients5.google.com?client=" + this.dictName, "1", "en")
      } catch (a) {
        console.error(this.name + " init error dict_api.load failed: " + a.message)
      }
    }
    this.inited = true
  }
};
(function() {
  qq_dict.init()
})();
var lmFileWriter = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  FUNC: function(a, b) {
    return function() {
      return b.apply(a, arguments)
    }
  },
  exportTable: function(a, b) {},
  onInitFs: function(a, b, c, d) {
    a.root.getFile(b, {
      create: true
    }, function(e) {
      e.createWriter(function(g) {
        g.onwriteend = function(h) {};
        g.onerror = function(h) {};
        var f = new Blob(c, {
          type: "text/plain;charset=UTF-8"
        });
        g.write(f);
        d(e.toURL())
      }, lmFileWriter.FUNC(lmFileWriter, function(f) {
        return lmFileWriter.onError(f)
      }))
    }, this.FUNC(this, function(f) {
      return this.onError(f)
    }))
  },
  onError: function(a) {
    var b = "";
    switch (a.code) {
      case FileError.QUOTA_EXCEEDED_ERR:
        b = "QUOTA_EXCEEDED_ERR";
        break;
      case FileError.NOT_FOUND_ERR:
        b = "NOT_FOUND_ERR";
        break;
      case FileError.SECURITY_ERR:
        b = "SECURITY_ERR";
        break;
      case FileError.INVALID_MODIFICATION_ERR:
        b = "INVALID_MODIFICATION_ERR";
        break;
      case FileError.INVALID_STATE_ERR:
        b = "INVALID_STATE_ERR";
        break;
      default:
        b = "Unknown Error";
        break
    }
  },
  initMsgHandler: function() {},
  writeFile: function(a, b, c) {
    window.webkitRequestFileSystem(window.TEMPORARY, this.MAX_FILE_SIZE, this.FUNC(this, function(d) {
      return this.onInitFs(d, a, b, c)
    }), this.FUNC(this, function(d) {
      return this.onError(d)
    }))
  }
};
(function() {
  lmFileWriter.initMsgHandler()
}());