var getMessage = function (name, defaultv) {
  return chrome.i18n.getMessage(name, defaultv);
};

chrome.runtime.sendMessage({ cmd: "ShowAppIcon" });

(function () {
  var current_style = null;
  var STYLE_TIGHT = 11;
  var STYLE_ORIG = 10;
  var playlist_left_old;
  var movie_player = null;
  var enable_tab_desc_menu = false;
  var enable_tab_meta_menu = true;
  var enable_tab_chat_menu = true;
  var mastheader = null;
  var commentsdiv = null;
  var sidebardiv = null;
  var recommendsdiv = null;
  var playlistdiv = null;
  var desdiv = null;
  var metadiv = null;
  var chatdiv = null;
  var playlistholder = $("#placeholder-playlist");
  var html5video = null;
  //var desdiv_selecotr             = '#primary-inner>#info';
  var YOUTUBE_VERSION = "3";
  var columnSecondary = null;
  var columnPrimary = null;
  var settingsDom = null;
  var isYoutube = true;
  var DEFAULT_TAB_META = "0";
  var DEFAULT_TAB_COMMENTS = "1";
  var DEFAULT_TAB_RELATED = "2";
  var DEFAULT_TAB_LIST = "3";
  var BUTTON_STYLE_GOOGLE = "0";
  var BUTTON_STYLE_YOU = "1";
  var button_style = localStorage.getItem("menu_btn_style") || "0";
  var lastProgressbarWidth = 0;
  var menu_titles = {
    comments: "Comments",
    related: "Related",
    meta: "Meta",
    settings: "Settings",
    comments_hint:
      "The block of <strong> comments </strong>is moved into right sidebar.",
    chat: "Chat",
  };
  var tab_divs = {};
  // function info(a){console.log(a);}
  function info(a) {}

  function load_ready() {
    return (
      movie_player != null &&
      commentsdiv != null &&
      desdiv != null &&
      commentsdiv.length > 0 &&
      desdiv.length > 0
    );
  }
  function ismaxwindow() {
    return screen.availWidth - window.innerWidth === 0;
  }
  function initAnchorsYoutube() {
    isYoutube = true;
    movie_player = $("#movie_player");
    html5video = movie_player.find("video")[0];
    if (undefined == getVideoId()) return;
    if (YOUTUBE_VERSION == "3") {
      sidebardiv = $("#related");
      recommendsdiv = $("<div id='watch7-sidebar-contents'></div>");
      mastheader = $("#masthead");
      commentsdiv = $("#comments");
      let columns = $("#columns:first");
      columnPrimary = columns.find("#primary:first");
      columnSecondary = columns.find("#secondary:first");
      playlistdiv = columns.find("#playlist");
      chatdiv = columnSecondary.find("#chat-container");

      let _desdiv = columnPrimary.find("#below");
      let aa = _desdiv.find("#top-row:first");
      let bb = _desdiv.find("#bottom-row:first");
      desdiv = aa;
      metadiv = bb;

      if (0) {
        let cc = _desdiv.find("#info:first");
        let dd = _desdiv.find("#meta:first");
        desdiv = cc;
        metadiv = dd;
      }

      var l = desdiv.text().trim();
      if (l.length < 10) {
        desdiv = null;
        metadiv = null;
      }
    }

    if (YOUTUBE_VERSION == "2") {
      sidebardiv = $("#related");
      recommendsdiv = $("<div id='watch7-sidebar-contents'></div>");
      mastheader = $("#masthead");
      commentsdiv = $("#comments");
      playlistdiv = $("#playlist");
      desdiv = $("#main").find("#info");
      metadiv = $("#main").find("#meta");
      desdiv = columnPrimary.find("ytd-watch-metadata");
    }
    if (YOUTUBE_VERSION == "1") {
      sidebardiv = $("#related");
      recommendsdiv = $("<div id='watch7-sidebar-contents'></div>");
      mastheader = $("#masthead-positioner");
      commentsdiv = $("#comments");
      playlistdiv = $("#playlist");
      desdiv = $("#info");
      metadiv = $("#main").find("#meta");
      desdiv = columnPrimary.find("ytd-watch-metadata");
    }
    if (YOUTUBE_VERSION == "0") {
      mastheader = $("#masthead-positioner");
      commentsdiv = $("#watch-discussion");
      sidebardiv = $("#watch7-sidebar");
      recommendsdiv = $("#watch7-sidebar-contents");
      playlistdiv = $("#player-playlist");
      desdiv = $("#action-panel-details");
      metadiv = $("#watch7-content");
      desdiv = columnPrimary.find("ytd-watch-metadata");
    }
  }

  function initAnchors() {
    if (load_ready()) return;
    initAnchorsYoutube();
  }

  initAnchors();

  function enableWindowScrollY() {
    $("body").css("overflow-y", "auto");
  }
  function disableWindowScrollY() {
    $("body").css("overflow-y", "hidden");
  }
  var initCount = 0;
  var updateMenu = null;
  function tightStyle() {
    if (undefined == getVideoId()) return;
    initCount++;
    var cur_tab = localStorage.getItem("default_tab");
    $("#footer-container").css("display", "none");
    var comments_menu = $("#comments_menu");
    disableWindowScrollY();
    if (comments_menu.length > 0) {
      return;
    }

    initAnchors();

    if (!load_ready() && initCount < 5) {
      setTimeout(tightStyle, 1000);
      return;
    }
    initCount = 0;

    if (YOUTUBE_VERSION != "0") {
      sidebardiv.children().each(function () {
        var that = $(this);
        that.detach().appendTo(recommendsdiv);
      });
      recommendsdiv.appendTo(sidebardiv);
    }

    playlistdiv.hide();

    /*
   // playlistdiv = playlistdiv.clone();
   if (playlistholder.hasClass('player-height') && playlistdiv.length == 0)
   {
      //   setTimeout(tightStyle, 10000);
      //   return;
   }
   else
   {
   }

   playlistholder.removeClass('player-height');
   playlistholder.css('margin-bottom', '0px');
    */
    var menu = $(
      '<div id="youtubestyle_menu_bar" class="ystyle-menu ystyle-theme-a000 title style-cope yt-simple-endpoint flex"></div>',
    );
    sidebardiv.prepend(menu);
    $("<br>").insertAfter(menu);

    updateMenu = function () {
      // show chat/list ?
      if (chatdiv.children().length > 1) {
        menu.find("#chat_menu").parent().parent().css("display", "");
      } else {
        menu.find("#chat_menu").parent().parent().css("display", "none");
      }
      if (playlistdiv.find("#items").children().length > 0) {
        menu.find("#list_menu").parent().parent().css("display", "");
      } else {
        menu.find("#list_menu").parent().parent().css("display", "none");
      }
    };

    var showOnly = function (menuid) {
      // the menuid is target div's id
      sidebardiv.children().each(function () {
        var that = $(this);
        if (!that.hasClass("ystyle_tab")) return;
        if (this.id == menuid) {
          if ("hidden" != that.css("overflow-x")) {
            that.css("overflow-x", "hidden");
          }
          that.show();
        } else {
          that.hide();
        }
      });
      Object.entries(tab_divs).forEach(function ([key, tabdiv]) {
        // tab_divs[menuid] = { 'div':thediv, "placeholder":placeholder, 'menuid':menuid} // this menuid is not that menuid
        let thediv = tabdiv.div;
        if (thediv[0].id == menuid) {
          thediv.detach().appendTo(sidebardiv);
          thediv.show();
        } else {
          thediv.hide();
          thediv.detach().insertBefore(tabdiv.placeholder);
        }
      });
      cur_tab = menuid;

      updateMenu();
    };

    var tablizeDiv = function (thediv, placeholder, menuid, menutitle) {
      if (placeholder != undefined) {
        placeholder.insertBefore(thediv);
      }
      if (menuid == "meta_menu" || "chat_menu" == menuid) {
        tab_divs[menuid] = {
          div: thediv,
          placeholder: placeholder,
          menuid: menuid,
        };
      } else {
        thediv.detach().appendTo(sidebardiv);
      }
      thediv.hide();
      thediv.addClass("ystyle_tab");
      let mymenu = $(
        `<div  class='ys_menu title nobr ${menuid}'><div class='nobr menutxt flex ${
          menuid
        }'><span href='javascript:;' id='${menuid}'>${menutitle}</span></div></div>`,
      );
      menu.append(mymenu);
      var the_menu = menu.find("#" + menuid);
      /*
      the_menu.click(function() {
         if (thediv.length == 0)
            return;
         showOnly(thediv.get(0).id);
         menu.find('.ys_menu').removeClass('focused');
         the_menu.parent().parent().addClass('focused');
      });
      */
      mymenu.click(function () {
        if (thediv.length == 0) return;
        showOnly(thediv.get(0).id);
        //menu.find('.ys_menu').removeClass('focused');
        //mymenu.addClass('focused');
        menu
          .find(".focused")
          .removeClass("focused")
          .find(".menutxt")
          .removeClass("ytSpecButtonShapeNextFilled")
          .addClass("ytSpecButtonShapeNextTonal");
        mymenu
          .addClass("focused")
          .find(".menutxt")
          .removeClass("ytSpecButtonShapeNextTonal")
          .addClass("ytSpecButtonShapeNextFilled");
        if (ismaxwindow()) {
          disableWindowScrollY();
        }
      });
    };

    var tablizeDivOptional = function (
      thediv_selector,
      placeholder,
      menuid,
      menutitle,
      storagekey,
      defaultvalue,
    ) {
      var thediv = $(thediv_selector);

      if (thediv.length == 0) {
        setTimeout(function () {
          tablizeDivOptional(
            thediv_selector,
            placeholder,
            menuid,
            menutitle,
            storagekey,
            defaultvalue,
          );
        }, 1000);
        return;
      }

      var enabled = localStorage.getItem(storagekey);
      if (enabled == null) {
        localStorage.setItem(storagekey, defaultvalue);
        enabled = defaultvalue;
      }

      if (placeholder != undefined) {
        placeholder.insertBefore(thediv);
      }
      var tabDiv_id = menuid + "_div";
      var tabDiv = $("<div id='" + tabDiv_id + "'><div>");
      //tabDiv.addClass('ystyle_tab');
      tabDiv.appendTo(sidebardiv);
      tabDiv.addClass("ystyle_tab");

      if (enabled == 1 || enabled == "1") {
        thediv.detach().appendTo(tabDiv);
        // thediv.addClass('ystyle_tab');
      }
      var mymenu = $(`
          <div  class="ys_menu title nobr ">
              <div class="menutxt nobr flex">
                <span href="javascript:;" id="${menuid}">${menutitle} </span>
              <div  class="close rbutton button" title="Restore ${menutitle}">X</div>
              <div class="open rotate90 rbutton button" title="Tablize ${menutitle}">&gt;&gt;</div> 
              <div class="reset hide"></div>
              </div>
          </div>
        `);
      menu.append(mymenu);
      var the_menu = menu.find("#" + menuid);
      var closebtn = the_menu.parent().parent().find(".close");
      var openbtn = the_menu.parent().parent().find(".open");
      var resetbtn = the_menu.parent().parent().find(".reset");

      /*
      the_menu.click(function() {
         showOnly(tabDiv.get(0).id);
         menu.find('.ys_menu').removeClass('focused');
         the_menu.parent().parent().addClass('focused');
      });
      */
      mymenu.click(function () {
        showOnly(tabDiv.get(0).id);
        menu
          .find(".focused")
          .removeClass("focused")
          .find(".menutxt")
          .removeClass("ytSpecButtonShapeNextFilled")
          .addClass("ytSpecButtonShapeNextTonal");
        mymenu
          .addClass("focused")
          .find(".menutxt")
          .removeClass("ytSpecButtonShapeNextTonal")
          .addClass("ytSpecButtonShapeNextFilled");
      });

      if (!(enabled == 1 || enabled == "1")) {
        closebtn.hide();
      } else {
        openbtn.hide();
      }
      closebtn.click(function () {
        localStorage.setItem(storagekey, 0);
        enabled = 0;
        closebtn.hide();
        openbtn.show();
        thediv.detach().insertAfter(placeholder);
      });
      openbtn.click(function () {
        localStorage.setItem(storagekey, 1);
        enabled = 1;
        closebtn.show();
        openbtn.hide();
        //the_menu.click();
        thediv.detach().appendTo(tabDiv);
        thediv.show();
      });
    };

    // tablizeDiv(metadiv, $("<div id='introduction_holder_old'></div>"), "intro_menu", "Introduction");

    // tablize desc
    if (enable_tab_desc_menu) {
      tablizeDivOptional(
        desdiv,
        $("<div id='desciption_holder_old'></div>"),
        "des_menu",
        "Info",
        "enable_tab_desc_key",
        0,
      );
    }
    if (enable_tab_meta_menu) {
      tablizeDiv(
        metadiv,
        $("<div id='meta_holder_old'></div>"),
        "meta_menu",
        menu_titles.meta,
        "enable_tab_meta_key",
        0,
      );

      menu.find("#meta_menu").click(function () {
        let myexpand = metadiv.find("#expand");
        myexpand.css("right", 0);
        myexpand.click();
      });
      metadiv.append(
        columnPrimary
          .find("#below")
          .find("div#contents.style-scope.ytd-rich-metadata-row-renderer"),
      ); //.css("display", "none");
    }

    // tablize comments
    tablizeDiv(
      commentsdiv,
      $(
        "<div id='comments_holder_old' class='action-panel-content yt-uix-expander yt-uix-expander-collapsed yt-card yt-card-has-padding'>" +
          menu_titles.comments_hint +
          "</div>",
      ),
      "comments_menu",
      menu_titles.comments,
      "enable_tab_commetns_key",
      1,
    );
    commentsdiv.removeClass("ytd-watch");

    // tablize related
    tablizeDiv(recommendsdiv, undefined, "recommend_menu", menu_titles.related);

    // tablize list_menu
    //menu.append('<div class=\'ys_menu nobr\'><span href=\'javascript:;\' id=\'list_menu\'>List</span></div>');

    if (enable_tab_chat_menu) {
      tablizeDiv(
        chatdiv,
        $("<div id='chat_holder_old'></div>"),
        "chat_menu",
        menu_titles.chat,
        "enable_tab_chat_key",
        0,
      );
    }

    if (playlistdiv.length == 1) {
      //playlistdiv.detach().appendTo(sidebardiv);
      //playlistdiv.hide();
      //playlistdiv.css('min-width', '0px');
      //playlistdiv.find('#watch-appbar-playlist').css('left', '10px');

      tablizeDiv(
        playlistdiv,
        $("<div id='playlist_holder_old'></div>"),
        "list_menu",
        "List",
        "enable_tab_list_key",
        0,
      );
    }

    //menu.append('<div>&nbsp;</div>');
    menu.find("#comments_menu").click(function () {
      let cms = commentsdiv.find("#comment").length;
      if (cms == 0) {
        window.scrollTo(
          0,
          document.body.scrollHeight || document.documentElement.scrollHeight,
        );
        setTimeout(function () {
          window.scrollTo(0, 0);
        }, 10);
      }
    });

    recommendsdiv.addClass("ystyle_tab");
    playlistdiv.addClass("ystyle_tab");

    var sidebarHeight = window.innerHeight - 80;
    if (mastheader.length > 0) {
      let pad = columnSecondary.innerHeight() - columnSecondary.height();
      sidebarHeight = window.innerHeight - mastheader.height() - 140 - pad;
    }
    if (button_style == BUTTON_STYLE_GOOGLE) {
      menu
        .find(".menutxt")
        .removeClass("flex")
        .addClass(
          "ytSpecButtonShapeNextHost ytSpecButtonShapeNextTonal ytSpecButtonShapeNextMono ytSpecButtonShapeNextSizeM",
        );
    } else {
      menu.find(".ys_menu").addClass("btnstyle_a");
    }
    /*
            sidebardiv.css('height', sidebarHeight);
            sidebardiv.css('overflow-y', 'scroll');
            sidebardiv.scroll(function(){
                            window.scrollBy(0,1);
                            window.scrollBy(0,-1);
            });
    */

    playlistdiv.css("--ytd-watch-flexy-panel-max-height", sidebarHeight);
    sidebardiv.children().each(function (index) {
      if (index == 0) return;
      var I = $(this);
      I.css("height", sidebarHeight);
      I.css("overflow-y", "auto");
    });
    Object.entries(tab_divs).forEach(function ([key, tabdiv]) {
      // tab_divs[menuid] = { 'div':thediv, "placeholder":placeholder, 'menuid':menuid} // this menuid is not that menuid
      var I = tabdiv.div;
      I.css("height", sidebarHeight);
      I.css("overflow-y", "auto");
    });

    $("video.video-stream.html5-main-video").each(function () {
      $(this).one("play", function () {
        var menu = $("#comments_menu");
        if (menu.length == 0) {
          if (current_style == STYLE_TIGHT) {
            tightStyle();
          }
        }
      });
    });

    current_style = STYLE_TIGHT;
    if (cur_tab == null) {
      $("#recommend_menu").click();
    }
    if (cur_tab == "watch-discussion" || cur_tab == DEFAULT_TAB_COMMENTS) {
      $("#comments_menu").click();
    } else if (
      cur_tab == "watch7-sidebar-content" ||
      cur_tab == DEFAULT_TAB_RELATED
    ) {
      $("#recommend_menu").click();
    } else if (cur_tab == "action-panel-details") {
      $("#des_menu").click();
    } else if (cur_tab == "player-playlist" || cur_tab == DEFAULT_TAB_LIST) {
      $("#list_menu").click();
    } else if (cur_tab == DEFAULT_TAB_META) {
      $("#meta_menu").click();
    }

    function createSettingsUI() {
      if (true) {
        var sidebarWidthDom = $(`
            <div id='ystyle_width' class="setting_item style-scope yt-simple-endpoint ">
            <div>Width of right side bar</div>
            <input type='radio' class='ystyle_side_width' name='ystyle_side_width' id='ystle_side_width_default' value=0 checked> <label for='ystle_side_width_default'>Default</label>
            <br>
            <input type='radio' class='ystyle_side_width' name='ystyle_side_width' id='ystle_side_width_xl' value='xl'> <label for='ystle_side_width_xl'>Extra Wide</label>
            <br>
            <input type='radio' class='ystyle_side_width' name='ystyle_side_width' id='ystle_side_width_xxl' value='xxl'> <label for='ystle_side_width_xxl'>Super Extra Wide </label>
            </div>
            `);
        //<input type='radio' class='ystyle_side_width' name='ystyle_side_width' id='ystle_side_width_xl2' value='xl2'> <label for='ystle_side_width_xl2'>Extra Wide on Video</label>
        //<br>
        settingsDom.append(sidebarWidthDom);
        sidebarWidthDom.find("input.ystyle_side_width").change(function () {
          let value = this.value;
          let columns = columnSecondary.parent();
          function restoreWidth() {
            columnSecondary.css("width", "");
            columnSecondary.css("padding-right", "");
            columns.css("max-width", "");
            columns.css("margin-right", "");
            columns.css("margin", "");
          }
          restoreWidth();

          localStorage.setItem("side_width", value);

          {
            if (value == 0) {
              // restore to default
            } else if (value === "xxl") {
              // fit to window
              let newWidth =
                columns.parent().width() -
                (columnPrimary.outerWidth(true) +
                  (columnPrimary.outerWidth(true) -
                    columnPrimary.outerWidth()));
              columns.css("max-width", "3000px");
              columns.css("margin", "0px");
              columnSecondary.css("width", `${newWidth}px`);
              columnSecondary.css("padding-right", "0");
            } else if (value === "xl2") {
              // fit to window
              let oldMarginRight =
                (columns.parent().width() - columns.width()) / 2;
              let oldMarginLeft = oldMarginRight;
              let newSecondaryWidth =
                columnSecondary.outerWidth(true) + oldMarginRight;
              let thevideo = columnPrimary.find("video");
              let w = thevideo.width();
              let h = thevideo.height();
              let ratio = w / h;
              let newWidth = columns.parent().width() - columnSecondary.width();
              let newHeight = (h * newWidth) / w;
              thevideo.css("width", `${newWidth}px`);
              thevideo.css("height", `${newHeight}px`);
              columns.css("max-width", "4000px");
              columns.css("margin", "0px");
              columnPrimary
                .find("div.ytp-chrome-bottom")
                .css("width", `${newWidth}px`);
              columnPrimary
                .find("div.ytp-chapter-hover-container")
                .css("width", `${newWidth}px`);
              columnSecondary.css("width", `${newSecondaryWidth}px`);
              columnSecondary.css("padding-right", "0px");
            } else if (value === "xl") {
              // fit to window
              let oldMarginRight =
                (columns.parent().width() - columns.width()) / 2;
              let oldMarginLeft = oldMarginRight;
              let newWidth = columnSecondary.outerWidth(true) + oldMarginRight;
              let w000 = columnPrimary.width();
              let w001 = columnPrimary.outerWidth(true);
              let maxWidthColumns = w001 + newWidth;
              columns.css("max-width", `${maxWidthColumns}px`);
              columns.css("margin-left", `${oldMarginLeft}px`);
              columnSecondary.css("width", `${newWidth}px`);
              columnSecondary.css("padding-right", "0px");
            }
          }
        });

        side_width = localStorage.getItem("side_width");
        if (side_width == "xl") {
          sidebarWidthDom.find("#ystle_side_width_xl").click();
        } else if (side_width == "xxl") {
          sidebarWidthDom.find("#ystle_side_width_xxl").click();
        }
      }

      if (true) {
        var defaulttabDom = $(`
	    <div id='ystyle_defaulttab' class="setting_item style-scope yt-simple-endpoint ">
	    <div>Default tab of the right side bar</div>
	    <input type='radio' class='ystyle_default_tab' name='ystyle_default_tab' id='ystyle_default_tab_meta' value='0'> <label for='ystyle_default_tab_meta'>Meta</label>
	    <br>
	    <input type='radio' class='ystyle_default_tab' name='ystyle_default_tab' id='ystyle_default_tab_comments' value='1'> <label for='ystyle_default_tab_comments'>Comments</label>
	    <br>
	    <input type='radio' class='ystyle_default_tab' name='ystyle_default_tab' id='ystle_default_tab_related' value='2' checked> <label for='ystle_default_tab_related'>Related</label>
	    <br>
	    <input type='radio' class='ystyle_default_tab' name='ystyle_default_tab' id='ystle_default_tab_list' value='3'> <label for='ystle_default_tab_list'>List</label>
	    </div>
	    `);
        settingsDom.append(defaulttabDom);
        defaulttabDom.find("input.ystyle_default_tab").change(function () {
          let value = this.value;
          localStorage.setItem("default_tab", value);
        });
        default_tab = localStorage.getItem("default_tab");
        if (default_tab == "0") {
          defaulttabDom.find("input#ystyle_default_tab_comments").click();
        } else if (default_tab == "1") {
        } else if (default_tab == "2") {
          defaulttabDom.find("input#ystyle_default_tab_list").click();
        } else if (default_tab == "3") {
          defaulttabDom.find("input#ystyle_default_tab_meta").click();
        }
      }

      if (true) {
        var btnStyleDom = $(`
	    <div id='ystyle_btn_style' class="setting_item style-scope yt-simple-endpoint ">
	    <div>Button Style(refresh this page to take effect when changing style)</div>
	    <input type='radio' class='ystyle_btn_style' name='ystyle_btn_style' id='ystyle_btn_style_google' value='0' checked> <label for='ystyle_btn_style_google'>google</label>
	    <br>
	    <input type='radio' class='ystyle_btn_style' name='ystyle_btn_style' id='ystyle_btn_style_you' value='1'> <label for='ystyle_btn_style_you'>simple</label>
	    </div>
	    `);
        settingsDom.append(btnStyleDom);
        btnStyleDom.find("input.ystyle_btn_style").change(function () {
          let value = this.value;
          localStorage.setItem("menu_btn_style", value);
        });
        let btn_style = localStorage.getItem("menu_btn_style");
        if (btn_style == "0") {
          btnStyleDom.find("input#ystyle_btn_style_google").click();
        } else if (btn_style == "1") {
          btnStyleDom.find("input#ystyle_btn_style_you").click();
        }
      }

      if (true) {
        var ystyleThemeDom = $(`
            <div id='ystyle_theme' class="setting_item ">
            <div class="style-scope yt-simple-endpoint ">
            <div>Theme(under developing ....)</div>
            <input type='radio' class='ystyle_side_theme' name='ystyle_side_theme' id='ystle_side_theme_default' value=0 checked> <label for='ystle_side_theme_default'>Default</label>
            <br>
            <input type='radio' class='ystyle_side_theme' name='ystyle_side_theme' id='ystle_side_theme_spring' value='spring' disabled> <label for='ystle_side_theme_spring'>spring</label>
            <br>
            <input type='radio' class='ystyle_side_theme' name='ystyle_side_theme' id='ystle_side_theme_summer' value='summer' disabled> <label for='ystle_side_theme_summber'>summer</label>
            <br>
            </div>
            </div>
            `);
        settingsDom.append(ystyleThemeDom);
        ystyleThemeDom.find("input.ystyle_side_theme").change(function () {
          let value = this.value;
          if (value == 0) {
          } else if (value === "spring") {
          }
        });
      }
    }
  }

  // <video class="video-stream html5-main-video" style="width: 640px; height:
  // 360px; left: 0px; top: 0px; transform: none;"
  // src="blob:https%3A//www.youtube.com/a0841780-dd65-4825-bccf-46a921db42cc"></video>

  function recover() {
    enableWindowScrollY();
    $("#footer-container").css("display", "");
    var menu = $("#youtubestyle_menu_bar");

    var playlist_undersidebar = sidebardiv.find("#player-playlist");

    if (menu.length == 0) {
      return;
    }

    menu.remove();

    current_style = STYLE_ORIG;

    if (true) {
      $("#comments_holder_old").replaceWith(commentsdiv);
      commentsdiv.addClass("ytd-watch");
      commentsdiv.css("height", "");
      commentsdiv.css("overflow-y", "");
      commentsdiv.show();
    }

    var des_holder = $("#desciption_holder_old");
    if (des_holder.length > 0) {
      $("#desciption_holder_old").replaceWith(desdiv);
      desdiv.show();
    }

    var meta_holder = $("#meta_holder_old");
    if (meta_holder.length > 0) {
      $("#meta_holder_old").replaceWith(metadiv);
      metadiv.show();
    }

    if (playlistdiv.length == 1) {
      //playlist_undersidebar.remove();
      //var playlistholder = $('#placeholder-playlist');
      //playlistholder.addClass('player-height');
      //playlistholder.css('margin-bottom', '');
      //$('#player-playlist').show();

      $("#playlist_holder_old").replaceWith(playlistdiv);
      playlistdiv.css("--ytd-watch-flexy-panel-max-height", "");
      playlistdiv.show();
    }

    if (true) {
      sidebardiv.children().each(function () {
        var that = $(this);
        that.detach();
      });
      recommendsdiv.children().each(function () {
        var that = $(this);
        that.detach().appendTo(sidebardiv);
      });
    }
    sidebardiv.css("height", "100%");
    sidebardiv.css("overflow-y", "");
    //recommendsdiv = $('#items');
    //recommendsdiv.show();
    //recommendsdiv = $('#watch7-sidebar-contents');
    //recommendsdiv.show();

    // restore the width of side bar
    let columns = columnSecondary.parent();
    columnSecondary.css("width", "");
    columns.css("max-width", "");
    columns.css("margin", "");
  }

  function getVideoId() {
    var query = location.search
      .slice(1)
      .split("&")
      .map((p) => p.split("="))
      .reduce((obj, pair) => {
        const [key, value] = pair.map(decodeURIComponent);
        return { ...obj, [key]: value };
      }, {});
    var vid;
    if (query.hasOwnProperty("v")) {
      vid = query.v;
    }

    return vid;
  }
  var html5video = movie_player.find("video")[0];

  var looper = { startPos: 0, ednPos: -1 };
  var autoReplayListener = {
    status: 0,
    onend: function () {
      var vp = this;
      vp.currentTime = 0;
      vp.pause();
      vp.play();
    },
    onpause: function () {
      var vp = this;
      var ct = vp.currentTime;
      var tt = vp.duration;
      if (tt <= ct + 0.01) {
        vp.currentTime = 0;
        vp.pause();
        vp.play();
      }
    },
    onplay: function () {
      var vp = this;
      vp.loop = true;
    },
    start: function () {
      html5video.loop = true;
      html5video.addEventListener("ended", this.onend, false);
      html5video.addEventListener("pause", this.onpause);
      html5video.addEventListener("play", this.onplay);
      this.status = 1;
    },
    stop: function () {
      html5video.loop = false;
      html5video.removeEventListener("ended", this.onend, false);
      html5video.removeEventListener("pause", this.onpause, false);
      html5video.removeEventListener("play", this.onplay, false);
      this.status = 0;
    },
    toggle: function () {
      if (this.status === 0) {
        this.start();
      } else {
        this.stop();
      }
    },
  };

  var autoReplayWorker = {
    status: 0,
    autoReplyTimer: null,
    start: function () {
      // html5video.loop = true;
      //var movie_player    = $('#movie_player');
      this.autoReplyTimer = setInterval(function () {
        var ct = html5video.currentTime;
        var tt = html5video.duration;
        if (
          tt.toFixed() <= ct + 0.5 ||
          html5video.ended === true ||
          (looper.endPos > 0 && ct > looper.endPos) ||
          (looper.startPos > 0 && ct < looper.startPos)
        ) {
          html5video.currentTime = looper.startPos;
          html5video.pause();
          html5video.play();
        }
      }, 500);
      this.status = 1;
    },
    stop: function () {
      // html5video.loop = false;
      if (this.autoReplyTimer != null) {
        clearInterval(this.autoReplyTimer);
      }
      this.status = 0;
    },
    toggle: function () {
      if (this.status === 0) {
        this.start();
      } else {
        this.stop();
      }
    },
  };

  function removeLoopChooser() {
    $("#loop_left").remove();
    $("#loop_right").remove();
  }

  function reAddLoopChooser() {
    removeLoopChooser();
    addLoopChooser();
  }

  function addLoopChooser() {
    looper.startPos = 0;
    looper.endPos = -1;
    var chooserLeft = $("#loop_left");
    var chooserRight = $("#loop_right");
    var progressbar = null; // movie_player.find('.ytp-progress-bar')[0];
    var progressbarContainer = null;
    var fullScreenBtn = null;

    progressbar = movie_player.find(".ytp-progress-bar")[0];
    progressbarContainer = movie_player.find(".ytp-progress-bar-container");
    fullScreenBtn = movie_player.find(".ytp-fullscreen-button");

    var chooser = null;

    chooser = $(
      '<div id="loop_left" class="" style="display:none"></div>' +
        '<div id="loop_right" class="" style="display:none"></div>',
    );

    progressbarContainer.append(chooser);
    chooserLeft = progressbarContainer.find("#loop_left"); // $(chooser[0]); // chooser.find('#loop_left');
    chooserRight = progressbarContainer.find("#loop_right"); // $(chooser[1]); // chooser.find('#loop_right');
    chooserstyle = "b";
    chooserLeft.addClass("loop_left_" + chooserstyle);
    chooserRight.addClass("loop_right_" + chooserstyle);
    if (progressbar != undefined && "clientWidth" in progressbar) {
      chooserLeft.css("left", "0px");
      chooserRight.css("left", $(progressbar).width() + "px");
      lastProgressbarWidth = $(progressbar).width();
    }

    function addListeners() {
      if (chooserLeft.length > 0) {
        chooserLeft[0].addEventListener("mousedown", mouseDown, false);
      }
      if (chooserRight.length > 0) {
        chooserRight[0].addEventListener("mousedown", mouseDown, false);
      }
      window.addEventListener("mouseup", mouseUp, false);
    }
    addListeners();

    function relocatechooser() {
      setTimeout(function () {
        // relayout chooser
        var dur = html5video.duration;
        var totalW = progressbar.clientWidth;
        var newxL = (looper.startPos * totalW) / dur;
        var newxR =
          looper.endPos > 0 ? (looper.endPos * totalW) / dur - 8 : totalW - 8;
        chooserLeft.css("left", newxL + "px");
        chooserRight.css("left", newxR + "px");
      }, 500);
    }
    fullScreenBtn.click(relocatechooser);
    movie_player.find(".ytp-size-button").click(relocatechooser);

    var pX;
    var target;
    var leftX, rightX;
    var offsetX;

    function mouseUp(e) {
      window.removeEventListener("mousemove", divMove, true);
      var new_event = new MouseEvent("mouseout", e);
      if (progressbar) progressbar.dispatchEvent(new_event);
      event.stopPropagation();
    }

    function mouseDown(e) {
      window.addEventListener("mousemove", divMove, true);
      target = e.target;
      pX = e.clientX;
      leftX = parseFloat(chooserLeft.css("left"));
      rightX = parseFloat(chooserRight.css("left"));
      offsetX = e.pageX - $(target).offset().left;
      event.stopPropagation();
    }

    function postoTime(pos) {
      var totalwidth = progressbar.clientWidth;
      var totalduration = html5video.duration;
      var curTime = (pos * totalduration) / totalwidth;
      return curTime;
    }

    function divMove(e) {
      if (e.button == 3) {
        return;
      }
      if (e.target == progressbar) {
        return;
      }
      var div = target;
      var curX = parseFloat(div.style.left);
      if (isNaN(curX)) {
        curX = 0.0;
      }
      var eattr = {
        screenX: e.screenX,
        screenY: e.screenY,
        clientX: e.clientX - offsetX,
        clientY: e.clientY,
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        button: 3,
        buttonid: 3,
        buttons: 0,
      };
      var new_event = new MouseEvent("mousemove", eattr);
      if (progressbar) progressbar.dispatchEvent(new_event);
      var new_over = new MouseEvent("mouseover", eattr);
      if (progressbar) progressbar.dispatchEvent(new_over);
      // div.style.left = (e.clientX ) + 'px';
      var nextX = curX + e.clientX - pX;
      // right must > left

      if (div == chooserLeft[0]) {
        if (nextX > rightX - 5 || nextX < 0) {
          return;
        }
        looper.startPos = postoTime(nextX);
      } else {
        if (nextX < leftX + 5 || nextX > progressbar.clientWidth) {
          return;
        }
        // update looper.endPos
        looper.endPos = postoTime(nextX);
      }
      div.style.left = nextX + "px";
      pX = e.clientX;
    }
  }

  function addLoopButton() {
    //var ret = addLoopChooser();
    //if (ret === false)
    //{
    //	setTimeout(addLoopButton, 1000);
    var playcontroldiv = null;
    playcontroldiv = movie_player.find(".ytp-chrome-controls");

    if (playcontroldiv.length == 0) {
      return;
    }

    //movie_player = $('#movie_player');

    html5video = movie_player.find("video")[0];
    if (playcontroldiv.find("#autoloopone").length != 0) {
      return;
    }
    var loopsvgon = $(
      '<svg id="svg_loop_on" width="100%" height="100%" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
        " <defs>" +
        '  <path id="ytpaloop-10" d="M26.466,21.04 L30.966,16 L27.8,16 C26.873,11.435 22.841,8 18.001,8 C12.474,8 8,12.477 8,18 C8,23.523 12.474,28 18.001,28 C21.181,28 24.009,26.511 25.841,24.197 L24.005,22.361 C22.652,24.217 20.471,25.427 18.001,25.427 C13.899,25.427 10.569,22.101 10.569,18 C10.569,13.898 13.899,10.572 18.001,10.572 C21.407,10.572 24.268,12.871 25.142,16 L21.966,16 L26.466,21.04">' +
        " <animate></animate></path></defs>" +
        " <g>" +
        "  <title>Layer 1</title>" +
        '  <use xlink:href="#ytpaloop-10" class="ytp-svg-shadow" id="svg_2"/>' +
        '  <use xlink:href="#ytpaloop-10" class="ytp-svg-fill" id="svg_3"/>' +
        '  <text transform="rotate(-90.0,17.499988555908192,18.16667175292969)" font-style="italic" font-weight="bold" xml:space="preserve" text-anchor="middle" font-family="serif" font-size="14" id="svg_4" y="22.63334" x="17.79999" stroke-width="0" class="ytp-svg-fill hidden">8</text>' +
        " </g>" +
        " </svg>",
    );
    // stroke="#ffffff"
    var loopsvgoff = $(
      '<svg id="svg_loop_off" width="100%" height="100%" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
        " <defs>" +
        '  <path id="ytpaloop-10" d="M26.466,21.04 L30.966,16 L27.8,16 C26.873,11.435 22.841,8 18.001,8 C12.474,8 8,12.477 8,18 C8,23.523 12.474,28 18.001,28 C21.181,28 24.009,26.511 25.841,24.197 L24.005,22.361 C22.652,24.217 20.471,25.427 18.001,25.427 C13.899,25.427 10.569,22.101 10.569,18 C10.569,13.898 13.899,10.572 18.001,10.572 C21.407,10.572 24.268,12.871 25.142,16 L21.966,16 L26.466,21.04" fill="#cccccc" fill-opacity="0.5"> ' +
        " <animate></animate></path></defs>" +
        " <g>" +
        "  <title>Layer 1</title>" +
        '  <use xlink:href="#ytpaloop-10" class="ytp-svg-shadow" id="svg_2"/>' +
        '  <use xlink:href="#ytpaloop-10" class="ytp-svg-fill" id="svg_3"/>' +
        '  <text font-style="italic" font-weight="bold" xml:space="preserve" text-anchor="middle" font-family="serif" font-size="14" id="svg_4" y="22.63334" x="17.79999" stroke-width="0" class="ytp-svg-fill hidden" >0</text>' +
        " </g>" +
        " </svg>",
    );
    /*
        ' <g> ' +
        '  <title>Layer 2</title>' +
        '  <rect transform="rotate(31.328693389892578 17.499988555908192,18.16667175292969) " id="svg_1" height="2.81155" width="28.10591" y="16.7609" x="3.44703" stroke-linecap="null" stroke-linejoin="null" stroke-width="0" fill="#ff0000"/>' +
        ' </g>' +
        */
    var autoloopBtn = $(
      '<button class="ytp-button" id="autoloopone"> </button>',
    );

    autoloopBtn.append(loopsvgoff);
    playcontroldiv.prepend(autoloopBtn);

    playcontroldiv.find("#autoloopone").click(function () {
      if ($("#loop_left").length == 0) {
        var ret = addLoopChooser();
      }

      var l = autoReplayWorker;
      var l2 = autoReplayListener;
      l.toggle();
      l2.toggle();
      let thisbtn = $(this);
      thisbtn.find("svg").remove();
      if (l.status === 0) {
        thisbtn.append(loopsvgoff);
        thisbtn[0].title = "Loop is Off";
        $("#loop_left").css("display", "none");
        $("#loop_right").css("display", "none");
      } else {
        if (movie_player.find("#loop_left").length == 0) {
          addLoopChooser();
        }
        thisbtn.append(loopsvgon);
        thisbtn[0].title = "Loop is On";
        $("#loop_left").css("display", "");
        $("#loop_right").css("display", "");
      }
    });
  }

  function getCurrentStyle() {
    if (current_style == null) {
      current_style = localStorage.getItem("style");
    }
    return current_style;
  }

  function setCurrentStyle(_style) {
    localStorage.setItem("style", _style);
    current_style = _style;
  }

  var onTitleChange = function () {
    getCurrentStyle();
    if (current_style == STYLE_TIGHT) {
      tightStyle();
    }
    addLoopButton();
    if (updateMenu) {
      updateMenu();
    }
  };
  //$('title').bind('DOMSubtreeModified', onTitleChange);
  new MutationObserver(function (mutations) {
    onTitleChange();
  }).observe(document.querySelector("title"), {
    subtree: true,
    characterData: true,
    childList: true,
  });

  getCurrentStyle();
  if (current_style == STYLE_TIGHT) {
    setTimeout(tightStyle, 1000);
  }
  addLoopButton();

  chrome.runtime.onMessage.addListener(function (msg, _, sendResponse) {
    if (msg.hasOwnProperty("cmd")) {
      if (msg.cmd === "style_tight") {
        setCurrentStyle(STYLE_TIGHT);
        tightStyle();
      } else if (msg.cmd === "style_recover") {
        setCurrentStyle(STYLE_ORIG);
        recover();
      } else if (msg.cmd === "getsid") {
        sendResponse({ 
            settings: {
                style: current_style,
                side_width: localStorage.getItem("side_width") || "0",
                default_tab: localStorage.getItem("default_tab") || "2",
                menu_btn_style: localStorage.getItem("menu_btn_style") || "0"
            }
        });
      } else if (msg.cmd === "hashchange") {
        initAnchors();

        onTitleChange();
      }
      else if (msg.cmd === "update_setting") {
          localStorage.setItem(msg.key, msg.value);
          
          // Find the corresponding setting element in the on-page settings UI and trigger it
          let $selector = null;
          if (msg.key === "side_width") {
              $selector = $(`#ystyle_width input[value="${msg.value}"]`);
          } else if (msg.key === "default_tab") {
              $selector = $(`#ystyle_defaulttab input[value="${msg.value}"]`);
          } else if (msg.key === "menu_btn_style") {
              $selector = $(`#ystyle_btn_style input[value="${msg.value}"]`);
          }
          
          if ($selector && $selector.length) {
              $selector.prop('checked', true).trigger('change');
          } else {
              // If the on-page UI is not present, the logic will be applied 
              // when tightStyle runs next time as it reads from localStorage.
          }
      }
    }
  });
})();
