// ==UserScript==
// @name             YouTube Chat Regex Mod Actions
// @description      Automatically hide messages based on regex
// @author           somestufforsomething
// @updateURL        https://github.com/somestufforsomething/pc-mod-tools/raw/main/YouTube%20Chat%20Regex%20Mod%20Actions.user.js
// @downloadURL      https://github.com/somestufforsomething/pc-mod-tools/raw/main/YouTube%20Chat%20Regex%20Mod%20Actions.user.js
// @supportURL       https://github.com/somestufforsomething/pc-mod-tools/issues
// @license          MIT
// @match            https://*.youtube.com/*
// @version          20220831.1
// ==/UserScript==

// ======================== Settings ============================
// Log all messages to the console (for debugging)
const SHOWALL = false;

// Specify patterns to automatically hide/ban a user from yt chat
// Name filters
const name_filter = [
    /\.\s*(com|fyi|life|ngo|nko|ong|red|rent|tech|today|uno|wtf|xyz)\b/i,
    /69mega\s*\.\s*fun/i,
    /bestcams\s*\.\s*fun/i,
    /bitcoin-in\s*\.\s*xyz/i,
    /bit-invest\s*\.\s*xyz/i,
    /casino-top1\s*\.\s*com/i,
    /likesex\s*\.\s*uno/i,
    /loveface\s*\.\s*xyz/i,
    /love-chat1?\s*\.\s*xyz/i,
    /(naked|nude)-(game|hd|sex)\s*\.\s*(fun|xyz)/i,
    /sexfind4\s*\.\s*com/i,
    /sexy-chat\s*\.\s*xyz/i,
    /tinder-x\s*\.\s*xyz/i,
    /webcam-cam\s*\.\s*xyz/i,
    /webcams-chat\s*\.\s*(com|xyz)/i,
    /xxgirls\s*\.\s*uno/i,
    /n(i|l)g{2}er/i,
    /richard ?simmons/i,
    /DumbDrum 1999 \(Dahir Behi\)/i,
    /thomas.*rillo/i,
    /earn money on the crypt!/i,
    /adu(i|l)t dat(i|l)ng s(i|l)te/i,
    /hot (boys|girls) and (boys|girls) (18\+ )?video chat/i,
    /best adult dating site!/i,
    /84% have already found love with us/i,
    /bro! cheapest tinder just for sex!/i,
    /bro! just go website and fuck girl/i,
    /cheap sex dating! just fuck girls!/i,
    /cheap sex! streamer recommends!/i,
    /cheaper tinder! even you can fuck!/i,
    /cheapest sex dating! find n fuck!/i,
    /enough watch stream! girls here!/i,
    /free girls from your city/i,
    /fill life with emotions - find love/i,
    /find girl even in the shithole!/i,
    /find love in your city today!/i,
    /fuck ad! wet girls are here! bro!/i,
    /fuck tinder! we are cheaper & fast/i,
    /future is here! dating ai match 84%/i,
    /have a good time - find love!/i,
    /here girls want everyone even you/i,
    /jerk off adv! wet girls are here!/i,
    /just try this cheapest sex tinder!/i,
    /looks like we found you a girl!/i,
    /love to cheap fuck? then we're in!/i,
    /new ai dating disrupt an industry!​/i,
    /new ai will find a girl for you/i,
    /no whores! real cheap fuck dates!/i,
    /omg! fuck ad! sex cheaper tinder!/i,
    /only putin didn't find girl with us/i,
    /our ai help you find perfect match!/i,
    /send dick pics to girls with us/i,
    /sex dates! fuck overpriced tinder/i,
    /stop jerking! find girl and fuck!/i,
    /stop watching the stream! find love/i,
    /the cheapest one time 18\+ dates!/i,
    /tinder overpriced shit! try us 18\+/i,
    /tired of being alone\? we'll help u/i,
    /ugh tinder? our girls write first!/i,
    /very cool anime adult game/i,
    /want to find help\? we will help!/i,
    /want to find love\? our ai will help!/i,
    /we have more cheap sex than tinder/i,
    /airbnb sexy super host 69/i,
    /dog butt licking services/i,
    /sex penetration pussy/i,
    /i love kids? p(o|0)rn/i,
    /my b(i|l)g d(i|l)ck in your m(o|0)uth/i
];

// Message filters
const msg_filter = [
    /niosnc\s*\.\s*site/i,
    /sister19lol\s*\.\s*online/i,
    /your-dreams\s*\.\s*online/i,
    /v.{2,3}\s*\(?\s*\.\s*\)?\s*(fyi|life|ngo|nko|ong|red|rent|tech|today|wtf)/i,
    /i will eliminate the middle class/i,
    /i love kids\s*:yt:/i,
    /:yt:\s*i love kids/i,
    /this bot is inmortal and unbannable thx to our patrons/i,
    /n(i|l)g{2}er/i
];

const del_filter = [
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

    // mod check
    if (!root.querySelector('yt-live-chat-message-input-renderer #author-name')
        .className.match(/\b(owner|moderator)\b/)) {
        return;
    }

    // switch to Live view
    switchToLiveView(root);

    let count = 0;
    console.log("Ready to bonk!");
    new MutationObserver((mutationsList) => {
        mutationsList.forEach(function(mutation) {
            let target = mutation.target;
            if (target.tagName === 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER' ||
                target.tagName === 'YT-LIVE-CHAT-PAID-MESSAGE-RENDERER') {
                let author = target.querySelector('#author-name').innerText;
                let message = target.querySelector('#message');
                let deleted = target.querySelector('#deleted-state').innerText;

                const varchars = {
                    // Cyrillic
                    'а':'a', 'в':'b', 'с':'c', 'е':'e',
                    'н':'h', 'к':'k', 'м':'m', 'о':'o',
                    'р':'p', 'т':'t', 'х':'x',

                    // Math bold
                    '𝑨':'a', '𝑩':'b', '𝑪':'c', '𝑫':'d',
                    '𝑬':'e', '𝑭':'f', '𝑮':'g', '𝑯':'h',
                    '𝑰':'i', '𝑱':'j', '𝑲':'k', '𝑳':'l',
                    '𝑴':'m', '𝑵':'n', '𝑶':'o', '𝑷':'p',
                    '𝑸':'q', '𝑹':'r', '𝑺':'s', '𝑻':'t',
                    '𝑼':'u', '𝑽':'v', '𝑾':'w', '𝑿':'x',
                    '𝒀':'y', '𝒁':'z',

                    '𝒂':'a', '𝒃':'b', '𝒄':'c', '𝒅':'d',
                    '𝒆':'e', '𝒇':'f', '𝒈':'g', '𝒉':'h',
                    '𝒊':'i', '𝒋':'j', '𝒌':'k', '𝒍':'l',
                    '𝒎':'m', '𝒏':'n', '𝒐':'o', '𝒑':'p',
                    '𝒒':'q', '𝒓':'r', '𝒔':'s', '𝒕':'t',
                    '𝒖':'u', '𝒗':'v', '𝒘':'w', '𝒙':'x',
                    '𝒚':'y', '𝒛':'z',

                    // Math bold script
                    '𝓐':'a', '𝓑':'b', '𝓒':'c', '𝓓':'d',
                    '𝓔':'e', '𝓕':'f', '𝓖':'g', '𝓗':'h',
                    '𝓘':'i', '𝓙':'j', '𝓚':'k', '𝓛':'l',
                    '𝓜':'m', '𝓝':'n', '𝓞':'o', '𝓟':'p',
                    '𝓠':'q', '𝓡':'r', '𝓢':'s', '𝓣':'t',
                    '𝓤':'u', '𝓥':'v', '𝓦':'w', '𝓧':'x',
                    '𝓨':'y', '𝓩':'z',

                    '𝓪':'a', '𝓫':'b', '𝓬':'c', '𝓭':'d',
                    '𝓮':'e', '𝓯':'f', '𝓰':'g', '𝓱':'h',
                    '𝓲':'i', '𝓳':'j', '𝓴':'k', '𝓵':'l',
                    '𝓶':'m', '𝓷':'n', '𝓸':'o', '𝓹':'p',
                    '𝓺':'q', '𝓻':'r', '𝓼':'s', '𝓽':'t',
                    '𝓾':'u', '𝓿':'v', '𝔀':'w', '𝔁':'x',
                    '𝔂':'y', '𝔃':'z',
                };

                let normalize = new RegExp(`[${Object.keys(varchars).join('')}]`, 'gi');
                author = author.replaceAll(normalize, m => varchars[m.toLowerCase()]);

                message = Array.from(message.childNodes)
                    .map(function (node) {
                        if (node.tagName === 'IMG') {
                            if (/[a-zA-Z]/.test(node.alt)) {
                                return `:${node.alt}:`;
                            } else {
                                return node.alt;
                            }
                        }
                        return node.data;
                    })
                    .join(' ');

                if (SHOWALL) { console.log(author + ": " + message); }

                // Hide
                if (name_filter.some((re) => re.test(author)) ||
                    msg_filter.some((re) => re.test(message))) {
                    count++;
                    console.log("CAUGHT " + count + ":  " + author + ": " + message);
                    if (!deleted) {
                        let buttons = target.querySelectorAll('#inline-action-buttons button');
                        let del_btn = buttons[0];
                        let hide_btn = buttons[2];
                        del_btn.click();
                        hide_btn.click();
                    }
                }

                // Delete
                if (del_filter.some((re) => re.test(message))) {
                    console.log("DELETED:  " + author + ": " + message);
                    if (!deleted) {
                        let buttons = target.querySelectorAll('#inline-action-buttons button');
                        let del_btn = buttons[0];
                        del_btn.click();
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
    if (url.match(/watch\?v=/) || url.match(/live/)) {
        console.log("waiting for chat to load...");
        let chat = await new Promise((resolve) => {
            new MutationObserver((mutationsList, observer) => {
                let chatframe = document.querySelector('#chatframe');
                if(chatframe && chatframe.contentDocument.querySelector('#chat-messages')) {
                  resolve(chatframe);
                  observer.disconnect();
                }
            }).observe(document.body, {childList: true, subtree: true});
        });
        console.log("chat finished loading");

        if (chat.src.match(/live_chat\?/)) {
            return chat.contentDocument;
        }
    }
    return null;
}

function switchToLiveView(root) {
    root.querySelector('#view-selector #menu a:last-of-type').click();
}
