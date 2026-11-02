function random(number) {
    return Math.floor(Math.random() * number);
}

export class Mover extends EventTarget {
    constructor(id, zBase = -400) {
        super();
        this.element = document.querySelector(id);
        if (!this.element) {
            throw new Error(`could not find ${id} to move with that id... fix spawn.`)
        }

        let x = random(random(2000));
        let y = random(random(850));
        let z = random(random(10));

        this.position = { x: x, y: y , z: z};

        this.element.style.transform = `translate3d(${x}px,${y}px,${zBase - z}px)`;

    }

}



export let olives = {
    netSmashed : 0,

    onload : function(){
        olives.netSmashed = 0
    },

    refillChance : function(value) {
        if ( 20 < random(random(value))  &&  100 > random(random(value)) ) {
            window.postMessage({type:"refill"})

        }

    },

    toothpickChance : function(value) {
        if ( 5 < random(random(value)) && 20 > random(random(value)) ) {
            const firsttime = toothpicks.toothpickNOOB;
            toothpicks.toothpickNOOB = false;

            let type;
            if (firsttime) {
                type = "toothpick unlocked";
            }
            window.postMessage({ type: type });

        }

    },

    oliveMood : function(value) {

    },

    JuniorMesaChance : function(value) {
        if (100 <= random(random(value)) ) {
            //olive dances to good time by junior mesa
        }
    },

    loveEndingChance : function(value) {
        //ending sequence unlocked for love ending
        // plays my one and only love by george cables
    },

    evilPathChance : function(value) {
        // centered around toothpicks and the tooth man?
        // refillpath --> evilpath?
        //evil path --> alone, just smashing olives. only pain. you are an olive smasher.
    },

    addSmash : function() {
        olives.netSmashed = ++olives.netSmashed;
        olives.refillChance(olives.netSmashed);
        olives.toothpickChance(olives.netSmashed);

    }

};

const MONEYSOUND_URL = new URL(
    './src/sounds/442064__chelseajoy207__register_short.mp3',
    import.meta.url).href;

export const Inventory = {
    items : {
        'olives': 0,
        'thoothpick': 0,
        'money': 0,
        'cart' : []
    },


    onload : function() {
        for (let item in Inventory.items) {
            Inventory.items[item] = Number(sessionStorage.getItem(item));


        }
        console.table(Inventory.items);

    },

    openRefillpath : function() {
        const godiv = document.createElement("div");
        godiv.id = "go-outside";
        const outanchor = document.createElement('a')
        outanchor.href = './src/environments/outside.html'
        outanchor.textContent = "GO OUTSIDE -->"
        outanchor.addEventListener('click', () => Inventory.saveProgress)
        godiv.appendChild(outanchor);

        document.body.appendChild(godiv);
        sessionStorage.setItem('firstRefill', JSON.stringify(false))


    },

    refill : function(item, quantity) {
        let currently = Number(Inventory.items[item] ?? 0)
        let newtotal = currently + quantity;
        Inventory.items[item] = newtotal;
        sessionStorage.setItem(item, newtotal)

    },

    reinstateCounts : function() {
        olives.netSmashed = JSON.parse(sessionStorage.getItem('smashtotal'))

        pierced.netPierced = JSON.parse(sessionStorage.getItem('stabtotal'))
        let pierceDOM=document.querySelector('#piercect')
        pierceDOM = document.createElement('p');
        pierceDOM.id = "piercect";
        pierceDOM.textContent = `olives stabbed: ${pierced.netPierced}`;
        pierceDOM.style.fontSize = '48px';
        pierceDOM.style.fontWeight = 'bold';
        pierceDOM.style.color = 'darkred';
        pierceDOM.style.fontStyle='italic';
        document.querySelector('#counter').appendChild(pierceDOM);


    },

    showWallet : function() {
        Inventory.items['money'] = Number(sessionStorage.getItem('money') ?? 0);
        document.querySelector('#money')?.remove()

        let moneystr;

        if (Inventory.items['money'] === 0) {
            moneystr = String(Inventory.items['money'])
        }
        else {
            let walletstr = String(Inventory.items['money'])
            if (walletstr.length > 3) {
                walletstr = String(Inventory.items['money'] / 1000)
                moneystr = walletstr + 'billion'

            }
            moneystr = walletstr + 'million'
        }
        let moneyDOM = document.createElement('div')
        moneyDOM.id = "money";
        moneyDOM.textContent = `MONEY: $${moneystr}`;
        moneyDOM.style.fontSize = '48px';
        moneyDOM.style.fontWeight = 'bold';
        moneyDOM.style.color = 'chartreuse';
        moneyDOM.style.fontStyle='italic';
        document.body.appendChild(moneyDOM);

    },

    payMoney : function(paying) {
        let currentWallet = Number(sessionStorage.getItem('money'));
        let newbalance = currentWallet - paying
        Inventory.items['money'] = newbalance
        sessionStorage.setItem('money', JSON.stringify(newbalance));

        const moneysound = document.createElement('audio');
        moneysound.src = MONEYSOUND_URL;
        moneysound.volume = 0.8;
        moneysound.play()

    },

    reinstateInv : function() {

        let oliveExists = true;
        for (let item in Inventory.items) {
            const itemState = Number(Inventory.items[item] ?? 0);

            if (item === 'thoothpick' && itemState > 0) {
                toothpicks.toothpickNOOB = false;
                toothpicks.deploy(itemState);

                new Mover('#toothpick', -250)

            }

            if (item === 'olives') {
                if (itemState <= 0) {
                    document.querySelector('#olive')?.remove();
                    showMessage('no olives');
                    oliveExists = false;

                }

            }
        }

        return oliveExists;

    },

    saveProgress : function() {
        sessionStorage.setItem('smashtotal', olives.netSmashed)
        sessionStorage.setItem('stabtotal', pierced.netPierced)

        Inventory.items['thoothpick'] = toothpicks.stock;
        for (let item in Inventory.items) {
            sessionStorage.setItem(item, Inventory.items[item])

        }

    }
}

const MASSAGE_URL = new URL('./src/message.html', import.meta.url).href
const massages = {
    "toothpick unlocked": { head: "toothpick unlock", body: "you've unlocked a toothpick" },
    "out of toothpicks": {head: "no more toothpicks", body: "you're out of toothpicks" },
    "refill unlocked": {head: "refill unlocked", body: "you're out of olives."},
    "no olives" : { head: "no more olives", body : "no more olives."},

    "purchased" : (input) => ({
        head: "you bought stuff",
        body: `bought ${input.olives} olives and ${input.toothpicks} toothpicks`
    })

};

export function showMessage(massageType, details = {}) {
    document.getElementById("msgdiv")?.remove();

    const msgdiv = document.createElement("div");
    msgdiv.id = "msgdiv";

    const msgiframe = document.createElement("iframe");
    msgiframe.src = MASSAGE_URL;
    msgdiv.appendChild(msgiframe);
    document.body.appendChild(msgdiv);

    msgiframe.addEventListener("load", () => {
        const massageEvent = massages[massageType] ?? { head: "massage", body: massageType };
        const massageData = typeof massageEvent === "function" ? massageEvent(details) : massageEvent;
        msgiframe.contentWindow.postMessage(
            {
                type: "render-massage",
                title: massageData.head,
                body: massageData.body
            },

            window.location.origin
        );
    });
}

export function dismissMessage() {
    document.getElementById("msgdiv")?.remove();
}

const TOOTHPICK_CURSOR = 'url("./src/toothpick-cursor.png") 10 4, auto';

export let toothpicks = {
    stock : 0,
    armed : false,
    toothpickNOOB : true,

    onload : function() {
        toothpicks.stock = 0;
        toothpicks.armed = false;
        toothpicks.toothpickNOOB = true;
    },

    deploy : function(amount) {
        if ( amount<= 0 ) return;
        document.getElementById("toothpick")?.remove();  // in case of re-unlock
        toothpicks.stock = amount;

        const toothpick = document.createElement("div");
        toothpick.id = "toothpick";

        const tootpickelem = document.createElement("img");
        tootpickelem.src = "./src/toothpick.png";
        tootpickelem.height = 300;
        tootpickelem.width = 300;
        tootpickelem.alt = "a toothpick";

        toothpick.appendChild(tootpickelem);
        toothpick.addEventListener("click", toothpicks.arm);
        document.body.appendChild(toothpick);
    },

    arm : function() {
        if (toothpicks.armed || toothpicks.stock <= 0) return;

        event?.stopPropagation();
        toothpicks.armed = true;
        toothpicks.stock--;

        //hide elem while toothpick is armed
        const pickup = document.getElementById('toothpick');
        if (pickup) pickup.style.visibility = "hidden"

        if (toothpicks.stock === 0) {
            document.getElementById("toothpick")?.remove();
            showMessage("out of toothpicks")
        }

        document.body.style.cursor = TOOTHPICK_CURSOR;
        document.getElementById("olive")?.contentWindow?.postMessage(
            { type: "arm-toothpick" }, window.location.origin
        );
    },

    unwield : function() {
        toothpicks.armed = false;
        document.body.style.cursor = "";

        const pickup = document.getElementById('toothpick'); //pseudo toothpick stock check
        if (!pickup) return;
        if (toothpicks.stock > 0) {
            pickup.style.visibility = "";
        } else {
            pickup.remove();
        }
    },

    consume : function() { toothpicks.unwield(); },
    drop : function() { toothpicks.unwield(); }
};

//click to drop toothpick event listener
document.addEventListener("click", (event) => {
    if (!toothpicks.armed) return;
    if (event.target.closest?.("#msgdiv")) return;
    if (event.target.closest?.("#dialogdiv")) return;

    toothpicks.drop();
})

export let pierced = {
    netPierced : 0,
    piercedNOOB : true,

    onload : function() { pierced.netPierced = 0; pierced.piercedNOOB = true; },

    addPierce : function() {
        pierced.netPierced = ++pierced.netPierced;
        if (pierced.piercedNOOB) {
            pierced.piercedNOOB = false;
            window.postMessage({ type: "first pierce" });
        }
    }
};


let oliveMoods = {
    "zendaya response" : {
        neutral1: "olives.",
        neutral2: "hi, im zendaya.",

        customer: "money please.",

        good_start: "why do you kill olives?",

        junior_start: "i don't like olives that much either.",

        evil: "u seem really weird.",

        empty_hands: "you should buy stuff."


    },
/*
    "mental state" : {
        evil: evil,
        good: good,
        neutral: neutral,
    },

    "olive state" : {
        neutral: neutral,
        good: hopeful,
        evil: fearful,

    }

 */

}

function zendayaRandomN() {
    const responses = [
        oliveMoods['zendaya response'].neutral1,
        oliveMoods['zendaya response'].neutral2
    ];

    const choose = random(10)
    if (choose > 5) {
        return responses[0]

    }
    else if (choose <= 5) {
        return responses[1]

    }

}

const dialog_URL = new URL("./src/dialog.html", import.meta.url).href;

const dialogues = {
    "first pierce": {
        img: "piercedolive.png",
        img2: "piercedolive_wface2.png",
        p1: "ｉｍ ɢ𝕠oԀ וｍ ɢoo dɪ 𝕒ᴍ 𝕘oｏ𝕕 ɪ ам ց𝕠𝕠ᑯ",
        p2: "і αм ɡｏoᑯ ᴀm i ցｏｏԁ 𝕒𝕞 ｉ ɡo𝕠d ᴀｍі ɢｏ",
        p3: "а𝕞 ｉ 𝕘𝕠oᑯ"

    },

    "toothman intro": {
        img: "./characters/toothman.png",

    },

    "empty hands": {
        p1: oliveMoods['zendaya response'].empty_hands

    },

    'neutral': {
        p1: zendayaRandomN()
    },

    'customer' : {
        p1: oliveMoods['zendaya response'].customer
    }

};


export function showDialog(dialogtype) {
    document.getElementById("dialogdiv")?.remove();

    const dialogdiv = document.createElement("div");
    dialogdiv.id = "dialogdiv";

    const dialogiframe = document.createElement("iframe")
    dialogiframe.src = dialog_URL;
    dialogdiv.appendChild(dialogiframe);
    document.body.appendChild(dialogdiv);

    dialogiframe.addEventListener("load", () => {
        const data = dialogues[dialogtype] ?? { p1: "dialog", p2: dialogtype }
        dialogiframe.contentWindow.postMessage(
            {
                type: "render-dialog",
                p1: data.p1 ?? "",
                p2: data.p2 ?? "",
                p3: data.p3 ?? "",
                img: data.img,
                img2: data.img2,

            },

            window.location.origin
        );
    });

}

export function dismissDialog() {
    document.getElementById("dialogdiv")?.remove();
}
