// ==UserScript==
// @name             YouTube Chat Regex Mod Actions
// @description      Automatically hide messages based on regex
// @author           somestufforsomething
// @updateURL        https://github.com/somestufforsomething/pc-mod-tools/raw/main/YouTube%20Chat%20Regex%20Mod%20Actions.user.js
// @downloadURL      https://github.com/somestufforsomething/pc-mod-tools/raw/main/YouTube%20Chat%20Regex%20Mod%20Actions.user.js
// @supportURL       https://github.com/somestufforsomething/pc-mod-tools/issues
// @license          MIT
// @match            https://www.youtube.com/*
// @version          20220507.2
// ==/UserScript==

// ======================== Settings ============================
// Number of seconds to wait for the chat frame to load
const IDLE = 10;    // HACK :(

// Log all messages to the console (for debugging)
const SHOWALL = false;

// Specify patterns to automatically hide/ban a user from yt chat
// Name filters
const name_filter = [
    /bestcams\s*\.\s*fun/i,
    /likesex\s*\.\s*uno/i,
    /loveface\s*\.\s*xyz/i,
    /naked-hd\s*\.\s*xyz/i,
    /tinder-x\s*\.\s*xyz/i,
    /webcam-cam\s*\.\s*xyz/i,
    /webcams-chat\s*\.\s*(com|xyz)/i,
    /xxgirls\s*\.\s*uno/i,
    /nlg{2}er/i,
    /richard ?simmons/i,
    /DumbDrum 1999 \(Dahir Behi\)/i,
    /adult dating site/i,
    /hot (boys|girls) and (boys|girls) (18\+ )?video chat/i
];

// Message filters
const msg_filter = [
    /niosnc\s*\.\s*site/i,
    /sister19lol\s*\.\s*online/i,
    /your-dreams\s*\.\s*online/i,
    /v.{2,3}\s*\(?\s*\.\s*\)?\s*(fyi|life|ngo|nko|ong|red|rent|tech|today|wtf)/i,
    /i will eliminate the middle class/i
];

const del_filter = [
    /\bvee\b/i,
    /\bgunt\b/i,
    /\bralph((a|amale)\b)?/i
];

// TODO: add which action {del, time, hide} to perform:
//      { pat: <pat>, act: <act> }
// const remove_msg = "Remove";
// const timeout_user = "Put user in timeout";
// const hide_user = "Hide user on this channel";
// ==============================================================
(async function () {
    const root = await getRootNode(window.location.href);
    if (!root) { return; }

    let isMod = false;

    let badges = root.querySelector('yt-live-chat-message-input-renderer')
        .getElementsByTagName('yt-live-chat-author-badge-renderer');

    for (let b of badges) {
        if (b.getAttribute('type') === 'moderator') {
            isMod = true;
            break;
        }
    }

    if (!isMod) { return; }

    let count = 0;
    console.log("Ready to bonk!");
    new MutationObserver((mutationsList) => {
        mutationsList.forEach(function(mutation) {
            let target = mutation.target;
            if (target.tagName === 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER') {
                let author = target.querySelector('#author-name').innerText;
                let message = target.querySelector('#message').innerHTML;
                let deleted = target.querySelector('#deleted-state').innerText;

                let yt_emote_re = /<img[^>]+data-emoji-id[^>]+shared-tooltip-text="([^"]+)"[^>]+>/gi;
                let emoji_re = /<img[^>]+alt="([^"]+)"[^>]+>/gi;
                message = message.replaceAll(yt_emote_re, "$1");
                message = message.replaceAll(emoji_re, "$1");

                if (SHOWALL) { console.log(author + ": " + message); }

                // Hide
                if (name_filter.some((re) => re.test(author)) ||
                    msg_filter.some((re) => re.test(message))) {
                    count++;
                    console.log("CAUGHT " + count + ":  " + author + ": " + message);
                    if (!deleted) {
                        let buttons = target.querySelector('#inline-action-buttons')
                            .getElementsByTagName('button');
                        let del_btn, hide_btn;
                        for (let btn of buttons) {
                            let label = btn.getAttribute('aria-label');
                            if (label === "Remove" || label === "削除") {
                                del_btn = btn;
                                continue;
                            }
                            if (label.match(/Hide/) || label === "このチャンネルのユーザーを表示しない") {
                                hide_btn = btn;
                            }
                        }
                        if (del_btn) { del_btn.click(); }
                        if (hide_btn) { hide_btn.click(); }
                    }
                }

                // Delete
                if (del_filter.some((re) => re.test(message))) {
                    console.log("DELETED:  " + author + ": " + message);
                    if (!deleted) {
                        let buttons = target.querySelector('#inline-action-buttons')
                            .getElementsByTagName('button');
                        let del_btn;
                        for (let btn of buttons) {
                            let label = btn.getAttribute('aria-label');
                            if (label === "Remove" || label === "削除") {
                                del_btn = btn;
                                continue;
                            }
                        }
                        if (del_btn) { del_btn.click(); }
                    }
                }
            }
        });
    }).observe(
        //root.getElementById('chat'),
        root.querySelector('#item-list.yt-live-chat-renderer'),
        { childList: true, subtree: true }
    );
})();

async function getRootNode(url) {
    if (url.match(/live_chat/)) {
        return document;
    }
    if (url.match(/watch/)) {
        // HACK :(
        console.log("waiting for chat to load...");
        await new Promise(res => setTimeout(res, IDLE * 1000));
        console.log("hopefully chat has loaded by now");
    }
    let chat = document.querySelector('#chatframe');
    if (chat.src.match(/live_chat\?/)) {
        return chat.contentDocument;
    }
    return null;
}
