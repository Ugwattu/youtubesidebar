(function() {
    var myswitcher = document.getElementById('toggleswitcher');
    var STYLE_TIGHT = '11';
    var STYLE_RECOVER = '10';

    var current_style = null;

    function getCurrentStyle(callbk) {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
            let tab = tabs[0];
            chrome.tabs.sendMessage(tab.id, { cmd: 'getsid' }, function(response) {
                if (response == undefined)
                    return;
                current_style = response.settings.style;
                createSettingsUI(response.settings);
                if (callbk != null) {
                    callbk();
                }
            });
        });
    }

    getCurrentStyle(function() {
        if (current_style == STYLE_RECOVER) {
            myswitcher.checked = false;
        } else {
            myswitcher.checked = true;
        }
    });

    myswitcher.addEventListener('click', function(e) {
        var isEnabled = myswitcher.checked;
        var msg = isEnabled ? 'style_tight' : 'style_recover';
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
            let tab = tabs[0];
            chrome.tabs.sendMessage(tab.id, { cmd: msg });
            window.close();
        });
    });

    function createSettingsUI(settings) {
        var container = document.getElementById('settings-container');

        var defaultTabCard = document.createElement('div');
        defaultTabCard.className = 'card';
        defaultTabCard.innerHTML = `
            <div class="section-title">Default Tab</div>
            <div class="radio-grid">
                <label class="option">
                    <input type="radio" name="default_tab" value="0" id="default_tab_meta">
                    <span>Info</span>
                </label>
                <label class="option">
                    <input type="radio" name="default_tab" value="1" id="default_tab_comments">
                    <span>Comments</span>
                </label>
                <label class="option">
                    <input type="radio" name="default_tab" value="2" id="default_tab_related">
                    <span>Related</span>
                </label>
                <label class="option">
                    <input type="radio" name="default_tab" value="3" id="default_tab_list">
                    <span>List</span>
                </label>
            </div>
        `;
        container.appendChild(defaultTabCard);

        var defaultTab = settings.default_tab;
        if (defaultTab == "0") {
            document.getElementById('default_tab_meta').checked = true;
        } else if (defaultTab == "1") {
            document.getElementById('default_tab_comments').checked = true;
        } else if (defaultTab == "2") {
            document.getElementById('default_tab_related').checked = true;
        } else if (defaultTab == "3") {
            document.getElementById('default_tab_list').checked = true;
        }

        defaultTabCard.querySelectorAll('input[name="default_tab"]').forEach(function(input) {
            input.addEventListener('change', function() {
                var value = this.value;
                chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { cmd: 'update_setting', key: 'default_tab', value: value });
                });
            });
        });

        var buttonStyleCard = document.createElement('div');
        buttonStyleCard.className = 'card';
        buttonStyleCard.innerHTML = `
            <div class="section-title">Button Style</div>
            <div class="radio-grid">
                <label class="option">
                    <input type="radio" name="btn_style" value="0" id="btn_style_google">
                    <span>Google</span>
                </label>
                <label class="option">
                    <input type="radio" name="btn_style" value="1" id="btn_style_simple">
                    <span>Simple</span>
                </label>
            </div>
        `;
        container.appendChild(buttonStyleCard);

        var btnStyle = settings.menu_btn_style;
        if (btnStyle == "0") {
            document.getElementById('btn_style_google').checked = true;
        } else if (btnStyle == "1") {
            document.getElementById('btn_style_simple').checked = true;
        }

        buttonStyleCard.querySelectorAll('input[name="btn_style"]').forEach(function(input) {
            input.addEventListener('change', function() {
                var value = this.value;
                chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { cmd: 'update_setting', key: 'menu_btn_style', value: value });
                });
            });
        });
    }
})();