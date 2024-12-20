// ==UserScript==
// @name             YouTube Chat Regex Mod Actions
// @description      Automatically hide messages based on regex
// @author           somestufforsomething
// @updateURL        https://github.com/somestufforsomething/pc-mod-tools/raw/main/YouTube%20Chat%20Regex%20Mod%20Actions.user.js
// @downloadURL      https://github.com/somestufforsomething/pc-mod-tools/raw/main/YouTube%20Chat%20Regex%20Mod%20Actions.user.js
// @supportURL       https://github.com/somestufforsomething/pc-mod-tools/issues
// @license          MIT
// @match            https://youtube.com/*
// @match            https://*.youtube.com/*
// @version          20240904.1
// ==/UserScript==

// ======================== Settings ============================
// Log all messages to the console (for debugging)
const SHOWALL = false;

// Specify patterns to automatically hide/ban a user from yt chat
// Name filters
const name_filter = [
    // /\.\s*(biz|com|fyi|fun|info|life|ngo|nko|ong|online|pro|rent|site|tech|today|uno|wtf|xyz)\b/i,
    /18sex\s*\.\s*xyz/i,
    /69xxx\s*\.\s*(site|xyz)/i,
    /69girls\s*\.\s*xyz/i,
    /69mega\s*\.\s*fun/i,
    /bestcams\s*\.\s*fun/i,
    /bitcoin-in\s*\.\s*xyz/i,
    /bit-invest\s*\.\s*xyz/i,
    /casino-top1\s*\.\s*com/i,
    /girls(4|18)\s*\.\s*online/i,
    /likesex\s*\.\s*uno/i,
    /loveface\s*\.\s*xyz/i,
    /love-chat1?\s*\.\s*xyz/i,
    /(naked|nude)-(game|hd|sex)\s*\.\s*(fun|xyz)/i,
    /pas36\s*\.\s*fun/i,
    /sexchat69\s*\.\s*site/i,
    /sexfind/i,
    /sexy-chat\s*\.\s*xyz/i,
    /sex-69\s*\.\s*fun/i,
    /tinder-x\s*\.\s*xyz/i,
    /tinder-hot\s*\.\s*xyz/i,
    /webcam-cam\s*\.\s*xyz/i,
    /webcams-chat\s*\.\s*(com|xyz)/i,
    /xxgirls\s*\.\s*uno/i,
    /xxx(18|20)\s*\.\s*(fun|in|site)/i,
    /x-girls\s*\.\s*xyz/i,
    /A RAIDER -fallout 4 you clown-/i,
    /richard ?simmons/i,
    /DumbDrum 1999 \(Dahir Behi\)/i,
    /exoverse/i,
    /Ikari Henri - 碇ヘンリー/i,
    /Pudge007/i,
    // /thomas.*rillo/i,
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
    /find love in your (city|town) today!/i,
    /fuck ad! wet girls are here! bro!/i,
    /fuck tinder! we are cheaper & fast/i,
    /future is here! dating ai match 84%/i,
    /have a good time - find (your )?love!/i,
    /here girls want everyone even you/i,
    /jerk off adv! wet girls are here!/i,
    /just try this cheapest sex tinder!/i,
    /looks like we found a girl for you!/i,
    /looks like we found you a girl!/i,
    /love to cheap fuck? then we're in!/i,
    /new ai dating disrupt an industry!/i,
    /new ai dating for all tastes & ages/i,
    /new ai (\d+% )?will find a girl for you/i,
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
    /i love beautiful innocent little girl feet/i,
    /my b(i|l)g d(i|l)ck in your m(o|0)uth/i,
    /humbert the hummer/i,
    /h(a|e)il hitler/i,
    /\bnazi\b/i,
    /total train derailment/i,
    // /💯(\s*🚂)?\s*(💀|☠)(\s*🚂)?/i,
    /38 year old cloutchasing virtual gay man/i,
    /master8\s*gundam/i,
    /Michael Annanack/i,
];

// Message filters
const msg_filter = [
    /niosnc\s*\.\s*site/i,
    /sister19lol\s*\.\s*online/i,
    /your-dreams\s*\.\s*online/i,
    // /\bv.{2,3}\s*\(?\s*\.\s*\)?\s*(fyi|life|ngo|nko|ong|red|rent|tech|today|wtf)/i,
    /i will eliminate the middle class/i,
    /i love kids\s*:yt:/i,
    /:yt:\s*i love kids/i,
    /this bot is inmortal and unbannable thx to our patrons/i,
    // /\bnymphet\b/i,
    // /please support production kawaii/i,
    /i love beautiful innocent little girl feet/i,
    /humbert the hummer/i,
    /total train derailment/i,
    // /💯(\s*🚂)?\s*(💀|☠)(\s*🚂)?/i,
];

const combined_filter = [
    /n(i|l)g{2}er/i,
    /\btro{2}ns?\b/i,
];

const timeout_filter = [
];

const del_filter = [
    /exoverse/i,
    /It's only the cold wind I feelIt's me that I spite as I stand up and fightThe only thing I know for realThere will be blood \(blood\) shed \(shed\)The man in the mirror nods his head/i,
    /\br(4|@)p(e|3)\b/i,
    // /\bttd\b/i,
    /zogbot/i,
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
                    // Diacritics
                    'ï':'i',

                    // Burmese
                    'ဌ':'g',

                    // Canadian Syllabics
                    'ᕦ':'e',

                    // Cyrillic
                    'а':'a', 'в':'b', 'с':'c', 'е':'e',
                    'ё':'e', 'є':'e', 'н':'h', 'ћ':'h',
                    'і':'i', 'ї':'i', 'ӏ':'i', 'ỉ':'i',
                    'ј':'j', 'к':'k', 'ќ':'k', 'м':'m',
                    'и':'n', 'о':'o', 'р':'p', 'я':'r',
                    'ѓ':'r', 'ѕ':'s', 'т':'t', 'х':'x',

                    // Latin
                    'ƞ':'n',

                    // Punctuation
                    '｡':'.',

                    // Small caps
                    'ᴀ':'a', 'ʙ':'b', 'ᴄ':'c', 'ᴅ':'d',
                    'ᴇ':'e', 'ꜰ':'f', 'ɢ':'g', 'ʜ':'h',
                    'ɪ':'i', 'ᴊ':'j', 'ᴋ':'k', 'ʟ':'l',
                    'ᴍ':'m', 'ɴ':'n', 'ᴏ':'o', 'ᴘ':'p',
                    'ꞯ':'q', 'ʀ':'r', 'ꜱ':'s', 'ᴛ':'t',
                    'ᴜ':'u', 'ᴠ':'v', 'ᴡ':'w',
                    'ʏ':'y', 'ᴢ':'z',
                };

                let replacements = new RegExp(`[${Object.keys(varchars).join('')}]`, 'gi');
                author = author.normalize("NFKD").replaceAll(replacements, m => varchars[m.toLowerCase()]);

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
                    msg_filter.some((re) => re.test(message)) ||
                    combined_filter.some((re) => re.test(author + message))) {
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

                // Timeout
                if (timeout_filter.some((re) => re.test(message))) {
                    console.log("TIMED OUT:  " + author + ": " + message);
                    if (!deleted) {
                        let buttons = target.querySelectorAll('#inline-action-buttons button');
                        let del_btn = buttons[0];
                        let timeout_btn = buttons[1];
                        del_btn.click();
                        timeout_btn.click();
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
    root.querySelector('#view-selector #menu a:nth-child(2)').click();
}
