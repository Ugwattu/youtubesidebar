(function() {
var myswitcher    = document.getElementById('toggleswitcher');
var STYLE_TIGHT   = '11';
var STYLE_RECOVER = '10';
console.log(myswitcher);

var current_style = null;
function getCurrentStyle(callbk)
{
	chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
		let tab = tabs[0];
		chrome.tabs.sendMessage(tab.id, { cmd: 'getsid' }, function(response) {
			if (response == undefined)
				return;
			current_style = response.settings.style;
            createSettingsUI(response.settings);
			if (callbk != null)
			{
				callbk();
			}
		});
	});
}

getCurrentStyle(function() {
	if (current_style == STYLE_RECOVER)
	{
		myswitcher.checked = false;
	}
	else
	//if( current_style == 'style_tight')
	{
		myswitcher.checked = true;
	}
});

myswitcher.addEventListener('click', function(e) {
	var isEnabled = myswitcher.checked;
	var msg       = isEnabled ? 'style_tight' : 'style_recover';
	//chrome.runtime.sendMessage({cmd:msg});
	chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
		let tab = tabs[0];
		chrome.tabs.sendMessage(tab.id, { cmd: msg });
		window.close();
	});
});

function createSettingsUI(settings) {
    var settingsDom = $('#youtubestyle_settings_popup');

      if (true) {
        var defaulttabDom = $(`
	    <div id='ystyle_defaulttab_popup' class="setting_item ">
	    <div>Default tab of the right side bar</div>
	    <input type='radio' class='ystyle_default_tab' name='ystyle_default_tab_popup' id='ystyle_default_tab_meta_popup' value='0'> <label for='ystyle_default_tab_meta_popup'>Meta</label>
	    <br>
	    <input type='radio' class='ystyle_default_tab' name='ystyle_default_tab_popup' id='ystyle_default_tab_comments_popup' value='1'> <label for='ystyle_default_tab_comments_popup'>Comments</label>
	    <br>
	    <input type='radio' class='ystyle_default_tab' name='ystyle_default_tab_popup' id='ystle_default_tab_related_popup' value='2'> <label for='ystle_default_tab_related_popup'>Related</label>
	    <br>
	    <input type='radio' class='ystyle_default_tab' name='ystyle_default_tab_popup' id='ystle_default_tab_list_popup' value='3'> <label for='ystle_default_tab_list_popup'>List</label>
	    </div>
	    `);
        settingsDom.append(defaulttabDom);
        defaulttabDom.find("input.ystyle_default_tab").change(function () {
            let value = this.value;
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { cmd: 'update_setting', key: 'default_tab', value: value });
            });
        });
        var default_tab = settings.default_tab;
        if (default_tab == "0") {
          defaulttabDom.find("input#ystyle_default_tab_meta_popup").prop('checked', true);
        } else if (default_tab == "1") {
          defaulttabDom.find("input#ystyle_default_tab_comments_popup").prop('checked', true);
        } else if (default_tab == "2") {
          defaulttabDom.find("input#ystle_default_tab_related_popup").prop('checked', true);
        } else if (default_tab == "3") {
          defaulttabDom.find("input#ystle_default_tab_list_popup").prop('checked', true);
        }
      }

      if (true) {
        var btnStyleDom = $(`
	    <div id='ystyle_btn_style_popup' class="setting_item ">
	    <div>Button Style(refresh to effect)</div>
	    <input type='radio' class='ystyle_btn_style' name='ystyle_btn_style_popup' id='ystyle_btn_style_google_popup' value='0'> <label for='ystyle_btn_style_google_popup'>google</label>
	    <br>
	    <input type='radio' class='ystyle_btn_style' name='ystyle_btn_style_popup' id='ystyle_btn_style_you_popup' value='1'> <label for='ystyle_btn_style_you_popup'>simple</label>
	    </div>
	    `);
        settingsDom.append(btnStyleDom);
        btnStyleDom.find("input.ystyle_btn_style").change(function () {
            let value = this.value;
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { cmd: 'update_setting', key: 'menu_btn_style', value: value });
            });
        });
        let btn_style = settings.menu_btn_style;
        if (btn_style == "0") {
          btnStyleDom.find("input#ystyle_btn_style_google_popup").prop('checked', true);
        } else if (btn_style == "1") {
          btnStyleDom.find("input#ystyle_btn_style_you_popup").prop('checked', true);
        }
      }

}
})();
