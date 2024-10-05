let bigSoups = BigInt("0");
let totalSoups = BigInt("0");
let remSoups = 0;
let soupsPerSecond = 0;
let clicks = 0;
let counters = [];
let backgroundSoups = [];
let soupPosition = [-50, Math.max(window.innerHeight*0.05,50)];
let frames = 0;
let SPSMult = 1;
let frenzy = 0;

let pitpanda = {
    rocks: "A Hypixel Pit stats viewer.\nIt can be used to see the stats of players,\nto search for mystics that people have,\nor to view your place on the leaderboards.\nDeveloped by McPqndq."
};
let event = {
    time: 0,
    eventswithout: 0,
    minors: [
        {name:"KOTL",                   image: "assets/images/events/ladder-128.png",     description: "Keep your mouse over the ladder for free soups!"},
        {name:"Dragon Egg",             image: "assets/images/events/dragon-egg-300.png", description: "Click the dragon egg as fast as possible! Every 8 clicks it switches spots."},
        {name:"2x Rewards",                                                               description: "Clicks give you 2x as many soups!"},
        {name:"Care Package",           image: "assets/images/events/chest-102.png",      description: "Click the care package 100 times for 5 to 20 of a random shop item!"},
        {name:"Giant Cake",             image: "assets/images/events/cake-128.png",       description: "Click the cake 200 times! The cake switches spots every time you click it."},
    ],
    majors: [
        {name:"Rage Pit", description: "Get at least 600 clicks during the event to win!"},
        {name:"Raffle",   description: "During the event, every 100 clicks gives 250x as many soups!"},
        {name:"Beast",    description: "The first click each second rewards five times as many soups!"},
        {name:"Robbery",  description: "Every click adds anywhere from 10g to 40g to your stash, but you lose 50g + 50g per 1000g in your stash per second!"},
        {name:"TDM",      description: "Click exactly {click_requirement} times to win the event!"}
    ],
    current_type: "",
    current_event: "",
    event_time: 0,
    event_display_time: 0,
    itemclicks: 0,
    hover: false,
    stash: 0,
    needed_clicks: 0,
};
let hopper = {
    clicks: 0,
    paysoups: 0,
    time: 0,
    choice: "none",
    timer: 0,
};

function getEnchantment(name){
    for (let i = 0; i < renown.upgrades.length; i++){
        if (renown.upgrades[i].name === name){
            return renown.upgrades[i];
        }
    }
    return {bought: false};
};
let clyet = false;
let goldenSoupRush = [];
let saveTime = 0;
let allSoupsEver = 0n;
function getRenown(){
    return totalSoups / BigInt("1000000000000");
};
function getRomanNumeral(num){
    let nums = [
        {value: 1,    symbol: "I"   },
        {value: 2,    symbol: "II"  },
        {value: 3,    symbol: "III" },
        {value: 4,    symbol: "IV"  },
        {value: 5,    symbol: "V"   },
        {value: 6,    symbol: "VI"  },
        {value: 7,    symbol: "VII" },
        {value: 8,    symbol: "VIII"},
        {value: 9,    symbol: "IX"  },
        {value: 10,   symbol: "X"   },
        {value: 50,   symbol: "L"   },
        {value: 100,  symbol: "C"   },
        {value: 500,  symbol: "D"   },
        {value: 1000, symbol: "M"   },
    ];
    let r = Math.floor(parseFloat(num+0));
    let ret = "";
    while (r > 0){
        lop:
        for (let i = nums.length-1; i >= 0; i--){
            if (r >= nums[i].value){
                r -= nums[i].value;
                ret += nums[i].symbol;
                break lop;
            }
        }
    }
    return ret;
};
// THE FOLLOWING TWO (2) FUNCTIONS ARE FROM THE WEBSITE 'https://www.w3schools.com/js/js_cookies.asp' AND ARE NOT MY ORIGINAL CREATION
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

function beautifyNumber(num){
    if (num < 1000000){
        let ntxt = "";
        let r = num+"";            
        let st = r.length+"";
        while (st > 3){
            st -= 3;
        }

        ntxt += r.substring(0, st);
        for (let i = st; i < r.length; i+=3){
            ntxt += ","+r.substring(i, i+3);
        }
        return ntxt;
    }
    else{
        return beautify(num);
    }
}
function beautify(num){
    let tos = num+"";       
    let st = tos.length+"";
    while (st > 3){ st -= 3; }
    let numTier = Math.floor((tos.length-(st))/3);
    
    if (num < 1000){
        return num;
    }
    if (numTier === 100){
        return tos.substring(0, st)+"."+tos.substring(st, st+3)+" centillion";
    }
    if (numTier > 101){
        return tos.substring(0, st)+"."+tos.substring(st, st+3)+" "+(numTier-1)+"-illion";
    }
    return tos.substring(0, st)+"."+tos.substring(st, st+3)+" "+getSuffix(numTier-1);
}
function getSuffix(num){
    if (num >= 10){
        let ones = ['','un','duo','tre','quattuor','quin','sex','septen','octo','novem'];
        var tens= ['decillion','vigintillion','trigintillion','quadragintillion','quinquagintillion','sexagintillion','septuagintillion','octogintillion','nonagintillion'];
        return ones[num%10]+tens[(num-num%10)/10-1];
    }
    else {
        let txs = ["","thousand","million","billion","trillion","quadrillion","quintillion","sextillion","septillion","octillion","nonillion"];
        return txs[num+1];
    }
}
function setSoups(num){
    document.getElementById("soups").innerHTML = beautifyNumber(num);
};
function clickSoup(){
    if (getHopper()){
        addCounter("You can't click this as there is a hopper!", document.getElementById("soup"));
        return;
    }
    if (Math.random() < 0.001){
        let co = document.getElementById("cooper");
        co.style.marginLeft = ((Math.random()-0.5)*0.8+0.5)*window.innerWidth+"px";
        co.style.marginTop  = ((Math.random()-0.5)*0.8+0.5)*window.innerHeight+"px";
        co.style.visibility = "visible";
    }
    doneYet = false;
    let r = 1;
    for (let i = 0; i < upgrades.length; i++){
        if (upgrades[i].bought){
            r *= upgrades[i].click;
        }
    }
    if (goldensoup.clickmult.time > 0){
        r *= goldensoup.clickmult.multi;
        frenzy+= (goldensoup.clickmult.multi-1);
    }
    if (getEnchantment("Tenacity").bought){
        r *= 2;
    }
    if (getEnchantment("Tenacity II").bought){
        r *= 1.5;
    }
    if (getEnchantment("Yummy").bought){
        r += soupsPerSecond/10;
    }
    if (!clyet){
        if (getEvent("Beast")){
            r *= 5;
        }
        if (getEnchantment("First Strike").bought){
            r *= 2;
        }
    }
    if (getEnchantment("Mysticism").bought && Math.random() < 0.01){
        r += Math.floor(soupsPerSecond*100);
    }
    r = Math.floor(r);
    bigSoups += BigInt(r);
    totalSoups += BigInt(r);
    clicks++;
    addBackgroundSoup(r);
    addCounter("+"+beautifyNumber(r)+" soup" + ((r !== 1) ? "s" : ""), document.getElementById("soup"));
    setSoups(bigSoups);
    goldenfeather.takenthisone = false;
    frenzy++;
    checkMilestone();
    clyet = true;
    eventTrigger("click_main_soup", {clickValue: r});
};
function addBackgroundSoup(r){
    let maxBackgroundSoups = 350;
    let maxBackgroundSoupsPer = 16;
    if (Number.parseInt(document.getElementById("mbgs").value)){
        maxBackgroundSoups = Number.parseInt(document.getElementById("mbgs").value);
    }
    if (Number.parseInt(document.getElementById("mbgsp").value)){
        maxBackgroundSoupsPer = Number.parseInt(document.getElementById("mbgsp").value);
    }
    for (let i = 0; i < Math.min(maxBackgroundSoupsPer, r); i++){
        backgroundSoups.push(new BackgroundSoup());
        var soupRect = document.getElementById("soup").getBoundingClientRect();
        let startingX = soupRect.x + soupRect.width/2;

        let r = document.createElement("soup32");
        r.style.position = "absolute";
        r.style.left = (startingX+backgroundSoups[backgroundSoups.length-1].x)+"px";
        r.style.top  = backgroundSoups[backgroundSoups.length-1].y+"px";
        r.style.color = "#000000";
        r.id = "backgroundsoup"+(backgroundSoups.length-1);
        document.getElementById("backgroundsoups").appendChild(r);
    }
    for (let i = Math.max(backgroundSoups.length-maxBackgroundSoups, 0); i > 0; i--){
        document.getElementById("backgroundsoups").removeChild(document.getElementById("backgroundsoups").childNodes[i]);
        backgroundSoups.splice(i, 1);
    }
};
class BackgroundSoup {
    constructor(){
        this.x = (Math.random()-0.5)*window.innerWidth*0.95;
        this.y = Math.random()*-64-32;
        this.speed = 10;
    }
    update(){
        this.y += this.speed;
    };
}
class Counter {
    constructor(num, elm){
        let e = elm.getBoundingClientRect();
        let sx = e.x + e.width/2;
        let sy = e.y + e.height/2;

        this.value = num;
        this.ox = sx + (Math.random()*2-1)*112;
        this.oy = sy + (Math.random()-0.5)*112;
        this.opacity = 1;
        this.vel = -20;
    };
    update(){
        this.oy += this.vel;
        this.vel /= 1.25;
        this.opacity -= 0.05;
    };
}
function md(newWidth){
    document.getElementById("soup").style.width = newWidth+"px";
    document.getElementById("soup").style.height = newWidth+"px";
    document.getElementById("soup").style.left = "-"+newWidth/2+"px";
    document.getElementById("soup").style.top = "-"+newWidth/2+"px";
};
function addCounter(num, element){
    counters.push(new Counter(num, element));
    let r = document.createElement("text");
    r.style.position = "absolute";
    r.style.zIndex = 12250;
    r.style.left = (counters[counters.length-1].ox)+"px";
    r.style.top  = (counters[counters.length-1].oy)+"px";
    r.style.color = "#000000";
    r.innerHTML = num;
    r.style.opacity = counters[counters.length-1].opacity;
    r.style.transform = "translate(-50%, 0%)";
    r.style.textAlign = "center";
    document.getElementById("counters").appendChild(r);
};
function counterDraw(){
    var soupRect = document.getElementById("soup").getBoundingClientRect();
    let startingX = soupRect.x + soupRect.width/2;
    let startingY = soupRect.y + soupRect.height/2;
    for (let i = counters.length-1; i >= 0; i--){
        counters[i].update();
        document.getElementById("counters").childNodes[i].style.left     = (counters[i].ox)+"px";
        document.getElementById("counters").childNodes[i].style.top      = (counters[i].oy)+"px";
        document.getElementById("counters").childNodes[i].style.opacity  = counters[i].opacity;
        if (counters[i].opacity <= 0){
            counters.splice(i, 1);
            document.getElementById("counters").removeChild(document.getElementById("counters").childNodes[i]);
        }
    }
};
function backgroundDraw(){
    var soupRect = document.getElementById("soup").getBoundingClientRect();
    let startingX = soupRect.x + soupRect.width/2;
    for (let i = backgroundSoups.length-1; i >= 0; i--){
        backgroundSoups[i].update();
        document.getElementById("backgroundsoups").childNodes[i].style.left     = (startingX+backgroundSoups[i].x)+"px";
        document.getElementById("backgroundsoups").childNodes[i].style.top      = backgroundSoups[i].y+"px";
        if (backgroundSoups[i].y > window.innerHeight*0.95){
            backgroundSoups.splice(i, 1);
            document.getElementById("backgroundsoups").removeChild(document.getElementById("backgroundsoups").childNodes[i]);
        }
    }
};
function buyItem(name){
    if (getHopper()){
        addCounter("You can't buy this<br>because there is a<br>hopper!", document.getElementById(name));
        return;
    }
    let item = null;
    for (let i = 0; i < items.length; i++){
        if (name === items[i].name){
            item = items[i];
        }
    }
    let ic = item.cost*getReduce()/100n;
    if (bigSoups >= ic){
        bigSoups -= BigInt(ic);
        let r = ic*115n;
        item.cost = BigInt(r/100n);
        item.amount++;
    }
}
function updateItems(){
    for (let i = 0; i < items.length; i++){
        let x = document.getElementById(items[i].name+"Price");
        x.innerHTML = beautifyNumber(items[i].cost*getReduce()/100n);

        let y = document.getElementById(items[i].name+"Amount");
        y.style.top = 27+69.5*i+"px";
        y.style.right = "15px";
        y.innerHTML = items[i].amount;

        let z = document.getElementById(items[i].name);
        if (bigSoups >= BigInt(items[i].cost)){
            z.style.backgroundColor = "#ffffff";
        }
        else{
            z.style.backgroundColor = "#aaaaaa";
        }
    }
};
function updateSPS(){
    soupsPerSecond = 0;
    for (let i = 0; i < items.length; i++){
        soupsPerSecond += items[i].amount * items[i].value;
    }
    for (let i = 0; i < upgrades.length; i++){
        if (upgrades[i].bought){
            soupsPerSecond *= upgrades[i].sps;
        }
    }
    if (getEnchantment("Overheal").bought){
        soupsPerSecond *= 2;
    }
    soupsPerSecond *= SPSMult;
    if (goldensoup.spsmult.time > 0){
        soupsPerSecond *= goldensoup.spsmult.multi;
    }
    let xx = beautifyNumber(Math.floor(soupsPerSecond));
    if (soupsPerSecond < 1000000){
        xx = Math.floor(soupsPerSecond*100)/100;
    }
    document.getElementById("sps").innerHTML = xx;
};
function addSoups(){
    let rd = BigInt(Math.floor(soupsPerSecond));
    if (getHopper()){
        rd = rd/4n;
        addCounter("-75% soups per second because there is a hopper!", document.getElementById("soup"));
    }
    bigSoups += rd;
    totalSoups += rd;
    remSoups += parseFloat(document.getElementById("sps").innerHTML)%1;
    clyet = false;
};
function updateClicks(){
    document.getElementById("clicks").innerHTML = clicks;
};
function addRemainingSoups(){
    while (remSoups >= 1){
        bigSoups += BigInt(1);
        totalSoups += BigInt(1);
        remSoups--;
    }
};
function updateTotal(){
    document.getElementById("total").innerHTML = beautifyNumber(totalSoups);
};
function buyUpgrade(num){
    if (getHopper()){
        addCounter("You can't buy this<br>because there is a<br>hopper!", document.getElementById(upgrades[num].name));
        return;
    }
    if (bigSoups >= upgrades[num].cost && !upgrades[num].bought){
        upgrades[num].bought = true;
        bigSoups -= BigInt(upgrades[num].cost);
        document.getElementById(upgrades[num].name).parentElement.removeChild(document.getElementById(upgrades[num].name));
    }
    ridOfUpgrades();
}
function updateUpgrades(){
    for (let i = 0; i < upgrades.length; i++){
        if (!upgrades[i].bought){
            let z = document.getElementById(upgrades[i].name);
            if (z){
                if (bigSoups >= BigInt(upgrades[i].cost)){
                    z.style.backgroundColor = "#ffffff";
                }
                else{
                    z.style.backgroundColor = "#aaaaaa";
                }   
            }
        }
    }
};
function saveGame(){
    saveTime = 90;
    let game = {};
    game.upgrades = [];
    for (let i = 0; i < upgrades.length; i++){
        game.upgrades.push({
            name: upgrades[i].name,
            bought: upgrades[i].bought,
        });
    }
    let ren = {
        count: renown.count+"",
        prestiges: renown.prestiges+0,
        inMenu: false,
        coverTime: 0,
        upgrades: [],
    };
    for (let i = 0; i < renown.upgrades.length; i++){
        ren.upgrades.push({bought: renown.upgrades[i].bought});
    }
    game.items = [];
    for (let i = 0; i < items.length; i++){
        let r = {
            name: items[i].name+"",
            cost: items[i].cost+"",
            amount: items[i].amount,
        };
        game.items.push(r);
    }
    game.totalSoups = BigInt(totalSoups+0n).toString();
    game.soups = BigInt(bigSoups+0n).toString();
    game.clicks = clicks;
    game.renown = ren;
    game.allSoupsEver = BigInt(allSoupsEver+0n).toString();
    game.hopper = {
        paysoups: (hopper.paysoups || "0").toString(),
        appeared: (document.getElementById("hopper").style.visibility !== "hidden"),
        timer: hopper.timer,
    };
    setCookie("soupClickerSave",JSON.stringify(game),36500);
};
function loadGame(){
    if (getCookie("soupClickerSave")){
        let r = JSON.parse(getCookie("soupClickerSave"));
        clicks = r.clicks;
        bigSoups = BigInt(r.soups);
        totalSoups = BigInt(r.totalSoups);
        if (r.allSoupsEver){
            allSoupsEver = BigInt(r.allSoupsEver);
        }
        if (r.renown){
            renown.count = BigInt(r.renown.count) || 0n;
            renown.prestiges = r.renown.prestiges || 0;
            renown.inMenu = r.renown.inMenu || false;
            renown.coverTime = r.renown.coverTime || 0;
            for (let i = 0; i < Math.min(r.renown.upgrades.length,renown.upgrades.length); i++){
                renown.upgrades[i].bought = r.renown.upgrades[i].bought || false;
            }
        }
        for (let i = 0; i < r.upgrades.length; i++){
            upgrades[i] = {
                name: r.upgrades[i].name,
                proper_name: upgrades[i].proper_name,
                description: upgrades[i].description,
                bought: r.upgrades[i].bought,
                click: upgrades[i].click,
                sps: upgrades[i].sps,
                cost: upgrades[i].cost,
            };
        }
        for (let i = 0; i < r.items.length; i++){
            items[i].name = r.items[i].name;
            items[i].cost = BigInt(r.items[i].cost);
            items[i].amount = r.items[i].amount;
        }
        for (let i = 0; i < upgrades.length; i++){
            if (upgrades[i].bought){
                document.getElementById(upgrades[i].name).parentElement.removeChild(document.getElementById(upgrades[i].name));
            }
        }
        if (r.hopper && r.hopper.appeared && r.hopper.paysoups !== "0"){
            document.getElementById("hopper").style.opacity = 1;
            document.getElementById("hopperhealth").style.backgroundSize = "100% 100%";
            document.getElementById("hopperhealth").style.visibility = "visible";
            hopper.time = 0;
            hopper.timer = r.hopper.timer;
            hopper.paysoups = BigInt(r.hopper.paysoups);
            document.getElementById("hopper").style.visibility = "visible";
            document.getElementById("hoppertext").style.visibility = "visible";
            document.getElementById("hoppertext").childNodes[1].innerHTML = "[ BHOPPER ]<br>Pay for Truce:<br>"+beautifyNumber(hopper.paysoups)+" soups";
            saveGame();
        }
    }
    updateUpgrades();
};
function updateSoup(){
    let r = document.getElementById("soupbottom");
    
    soupPosition[0] = Math.sin(frames/100)*150-200;

    if (frenzy > 0){
        soupPosition[1] += frenzy*10;
        frenzy*=0.5;
    }
    soupPosition[1] = Math.min(700, soupPosition[1]);

    r.style.left = soupPosition[0]+"px";
    r.style.top  = (window.innerHeight-soupPosition[1])+"px";
    r.style.maxWidth = (window.innerWidth - soupPosition[0])+"px";
    r.style.maxHeight = soupPosition[1]+"px";

    if (soupPosition[1] > 50){
        soupPosition[1] *= 0.98;
    }
    if (soupPosition[1] > window.innerHeight/2){
        soupPosition[1] *= 0.97;
    }
    SPSMult = Math.min(Math.max((soupPosition[1]+50)/150,1),5);
    document.getElementById("spsmult").innerHTML = Math.floor(SPSMult*100)/100;
};
function updateGoldenSoup(){
    let gs = document.getElementById("goldensoup");
    goldensoup.timeWithout++;
    if (Math.random() < 0.0000025*goldensoup.timeWithout && !goldensoup.appeared){
        goldensoup.timeWithout = 0;
        goldensoup.appeared = true;
        goldensoup.x = constrain(Math.random()*window.innerWidth,256,window.innerWidth-256);
        goldensoup.y = -256;
        gs.style.marginLeft = goldensoup.x+"px";
        gs.style.marginTop = goldensoup.y+"px";
    }
    if (goldensoup.appeared){
        gs.style.opacity = 1;
        goldensoup.y+=5;
        gs.style.marginTop = goldensoup.y+"px";
        if (goldensoup.y > window.innerHeight){
            goldensoup.appeared = false;
            gs.style.opacity = 0;
        }
    }
    else{
        gs.style.opacity = 0;
    }

    if (goldensoup.spsmult.time > 0){
        goldensoup.spsmult.time--;
        if (goldensoup.spsmult.time === 0){
            setMessage();
        }
        else{
            setMessage("Golden Soup Buff: <br> "+goldensoup.spsmult.multi+"x SPS for "+Math.floor(goldensoup.spsmult.time/30)+" seconds");
        }
    }
    if (goldensoup.clickmult.time > 0){
        goldensoup.clickmult.time--;
        if (goldensoup.clickmult.time === 0){
            setMessage();
        }
        else{
            setMessage("Golden Soup Buff: <br> "+goldensoup.clickmult.multi+"x soups from click for "+Math.floor(goldensoup.clickmult.time/30)+" seconds");
        }
    }
    if (goldensoup.soups.time > 0){
        goldensoup.soups.time--;
        if (goldensoup.soups.time === 0){
            setMessage();
        }
        else{
            setMessage("+"+goldensoup.soups.amount+" soups!");
        }
    }
};
function collectGoldenSoup(){
    let rxx = 0;
    if (getEnchantment("Dirty").bought){
        rxx = 30 * 5;
    }
    if (!goldensoup.appeared){
        return;
    }
    let possibilities = [
        function(){
            let xx = BigInt(Math.floor(soupsPerSecond * Math.floor(Math.random()*120) + 13));
            bigSoups += xx;
            totalSoups += xx;
            goldensoup.spsmult.time = 0;
            goldensoup.clickmult.time = 0;
            goldensoup.soups.time = 90;
            goldensoup.soups.amount = xx;
            return "+"+xx+" soups!";
        },
        function(){
            goldensoup.clickmult.time = Math.floor(Math.random()*600+100+rxx);
            goldensoup.spsmult.time = 0;
            goldensoup.soups.time = 0;
            return "Golden Soup Buff: <br> "+goldensoup.clickmult.multi+"x soups from click for "+Math.floor(goldensoup.clickmult.time/30)+" seconds";
        },
        function(){
            goldensoup.spsmult.time = Math.floor(Math.random()*600+100+rxx);
            goldensoup.clickmult.time = 0;
            goldensoup.soups.time = 0;
            return "Golden Soup Buff: <br> "+goldensoup.spsmult.multi+"x SPS for "+Math.floor(goldensoup.spsmult.time/30)+" seconds";
        },
    ];
    let message = possibilities[Math.floor(Math.random()*possibilities.length)]();
    goldensoup.appeared = false;
    goldensoup.x = 0;
    goldensoup.y = 0;
    setMessage(message);
};
function setMessage(msg){
    let aler = document.getElementById("alerts");
    aler.innerHTML = msg;
    if (msg === "" || msg === null || msg === undefined){
        aler.style.visibility = "hidden";
    }
    else{
        aler.style.visibility = "visible";
    }
};
function constrain(num, min, max){
    return Math.max(Math.min(num, max),min);
}
function updateGoldenFeather(){
    let gf = document.getElementById("goldenfeather");
    let ye = 99999999;
    if (upgrades[4].bought){
        ye = 1000;
    }
    if (upgrades[8].bought){
        ye = 750;
    }
    if (clicks % ye === 0 && !goldenfeather.appeared && upgrades[4].bought && !goldenfeather.takenthisone && clicks !== 0){
        goldenfeather.x = constrain(Math.random()*window.innerWidth,256,window.innerWidth-256);
        goldenfeather.y = -256;
        gf.style.marginLeft = goldenfeather.x+"px";
        gf.style.marginTop = goldenfeather.y+"px";
        goldenfeather.appeared = true;
    }
    if (goldenfeather.appeared){
        gf.style.opacity = 1;
        goldenfeather.y+=5;
        gf.style.marginTop = goldenfeather.y+"px";
        if (goldenfeather.y > window.innerHeight){
            goldenfeather.appeared = false;
            gf.style.opacity = 0;
        }
    }
    else{
        gf.style.opacity = 0;
    }
};
function collectGoldenFeather(){
    if (!goldenfeather.appeared){
        return;
    }
    let xx = BigInt(Math.floor(soupsPerSecond * 900));
    bigSoups += xx;
    totalSoups += xx;
    goldenfeather.appeared = false;
    goldenfeather.takenthisone = true;
    goldenfeather.x = 0;
    goldenfeather.y = 0;
};
function ridOfUpgrades(){
    let x = document.getElementById("upgrades");
    let newNodes = [];
    for (let i = 0; i < x.childNodes.length; i++){
        if (x.childNodes[i].tagName !== undefined){
            newNodes.push(x.childNodes[i]);
        }
    }
    let unbought = [];
    for (let i = 0; i < upgrades.length; i++){
        if (!upgrades[i].bought){
            unbought.push(upgrades[i]);
            unbought[unbought.length-1].INDEX = i;
        }
    }
    let up = unbought[newNodes.length-1];

    if (up === undefined) return;
    let elm = document.createElement("div");
    elm.id = up.name;
    elm.className = "upgrade";
    elm.addEventListener("click", function(){buyUpgrade(up.INDEX);});
    let b = document.createElement("b");
    b.innerHTML = up.proper_name;
    elm.appendChild(b);
    let br1 = document.createElement("br");
    elm.appendChild(br1);
    let h1 = document.createElement("h");
    h1.innerHTML = up.description;
    elm.appendChild(h1);
    let br2 = document.createElement("br");
    elm.appendChild(br2);
    let h2 = document.createElement("h");
    h2.innerHTML = "Cost: "+((up.cost > 1000000n) ? "<br>" : "")+beautifyNumber(up.cost)+" ";
    elm.appendChild(h2);
    let smsp = document.createElement("smallsoup");
    elm.appendChild(smsp);
    x.appendChild(elm);
};
function updatePebbles(){
    pebblePants.time++;
    if (pebblePants.time > 750 + Math.random() * 250 && !pebblePants.appeared){
        pebblePants.time = 0;
        pebblePants.appeared = true;
        pebblePants.y = (Math.random()-0.5)*window.innerHeight/1.5+window.innerHeight/2;
        pebblePants.x = -256;
        pebblePants.velo = 12;
        if (Math.random() > 0.5){
            pebblePants.x = window.innerWidth + 256;
            pebblePants.velo = -pebblePants.velo;
        }
    }
    pebblePants.x += pebblePants.velo;
    let pp = document.getElementById("pebble");
    pp.style.marginLeft = pebblePants.x+"px";
    pp.style.marginTop = pebblePants.y+"px";
    if (pebblePants.appeared){
        pp.style.opacity = 1;
        if (pebblePants.x < -260 || pebblePants.y > window.innerWidth+260){
            pp.style.opacity = 0;
            pebblePants = {
                appeared: false,
                x: 0,
                y: 0,
                clicks: 0,
                time: 0,
            };
        }
    }
    else{
        pp.style.opacity = 0;
    }
};
function clickPebble(){
    if (pebblePants.appeared){
        pebblePants.clicks++;
        items[4].amount++;
        let r = items[4].cost*115n;
        items[4].cost = BigInt(r/100n);
        if (getEnchantment("Fishing Club").bought){
            items[4].amount++;
            let r = items[4].cost*115n;
            items[4].cost = BigInt(r/100n);
            addCounter("+1 Pebble III Pants", document.getElementById("pebble"));
        }
        addCounter("+1 Pebble III Pants", document.getElementById("pebble"));
    }
    if (pebblePants.clicks >= 5){
        document.getElementById("pebble").style.opacity = 0;
        pebblePants = {
            appeared: false,
            x: 0,
            y: 0,
            clicks: 0,
            time: 0,
        };
    }
};
function updateSave(){
    if (saveTime > 0){
        saveTime--;
        document.getElementById("save").innerHTML = "saved!";
    }
    else{
        document.getElementById("save").innerHTML = "save game";
    }
};
function checkMilestone(){
    if (clicks % 10000 === 0 && goldenSoupRush.length < 5){
        goldenSoupRush = [];
        for (let i = 0; i < 200; i++){
            goldenSoupRush.push({x: ((Math.random()-0.5)*0.95+0.5)*window.innerWidth,y: -Math.random()*window.innerHeight});
            let dd = document.createElement("goldensouprush");
            dd.class = "goldensouprush";
            dd.onclick=function() {addManySoups(this);}
            dd.style.marginLeft = goldenSoupRush[goldenSoupRush.length-1].x+"px";
            dd.style.marginTop = goldenSoupRush[goldenSoupRush.length-1].y+"px";
            dd.index = goldenSoupRush.length-1;
            document.getElementById("goldensouprushbody").appendChild(dd);
        }
    }
};
function updateRush(){
    for (let i = goldenSoupRush.length-1; i > 0; i--){
        goldenSoupRush[i].y += 15;
        document.getElementById("goldensouprushbody").childNodes[i].style.marginTop = goldenSoupRush[i].y+"px";
        document.getElementById("goldensouprushbody").childNodes[i].style.marginLeft = goldenSoupRush[i].x+"px";
        if (goldenSoupRush[i].y > window.innerHeight*0.975){
            goldenSoupRush.splice(i, 1);
            document.getElementById("goldensouprushbody").removeChild(document.getElementById("goldensouprushbody").childNodes[i]);
        }
    }
};
function addManySoups(ye){
    let xx = BigInt(Math.floor(soupsPerSecond * 2000));
    bigSoups += xx;
    totalSoups += xx;
    ye.style.visibility = "hidden";
};
function getHelp(){
    return "SOUP CLICKER CHEATS\n\n\nHow to use Soup Clicker cheat menu:\n\nThe first command is 'giveSoups(number)'.\nYou can change that number to whatever you want.\nIf you want to make the number there larger than about 150 trillion,\nyou should put quotation marks around it, like this:\ngiveSoups(\"1000000000000000000000000000000000000000000000\");\n\n\nThe next command is giveItem(name, amount, increase).\nThe first option in it is the 'name' option.\nThat can be changed to any of the names of the shop items,\nsuch as \"Ultimate Soup God\".\nWhen putting the name into the function,\nremember to put quotation marks around it.\n\nThe second option is the number of the item.\nIt's really simple to understand;\njust type 5 to get 5 of it, or 50 to get 50 of it.\n\nThe final option is if you want to increase the price.\nIf you put in 'true', it increases the price by 15% per item,\nlike normal.\nIf you put in 'false', the price stays the same.\n\nEXAMPLE COMMAND: giveItem(\"Ultimate Soup God\", 50, true);";
};
function giveSoups(num2){
    let num = (num2 + "");
    bigSoups += BigInt(num);
    totalSoups += BigInt(num);
    return "Successfully given "+num+" soup(s)!";
};
function giveItem(name,amount, increase){
    for (let i = 0; i < items.length; i++){
        if (items[i].proper_name === name){
            items[i].amount+=amount;
            if (increase){
                for (let j = 0; j < amount; j++){
                    let r = items[i].cost*115n;
                    items[i].cost = BigInt(r/100n);
                }
            }
            return "Successfully given "+amount+" of '"+name+"' with price increasing: "+increase+".";
        }
    }
    console.log("Name not found.");
};
function setPrestige(boo){
    let starbg = document.getElementById("starbg");
    let shadedBorders = document.getElementById("shadedBorders");
    let prestige = document.getElementById("prestige");
    let sb = document.getElementById("prestigecover");
    let pu = document.getElementById("prestigeupgrades");
    let pb = document.getElementById("prestigebox");
    if (boo){
        starbg.style.zIndex = 15000;
        starbg.style.visibility = "visible";
        shadedBorders.style.zIndex = 15250;
        shadedBorders.style.visibility = "visible";
        prestige.style.zIndex = 14750;
        prestige.style.visibility = "visible";
        sb.style.zIndex = 16000;
        sb.style.visibility = "visible";
        pu.style.zIndex = 16250;
        pu.style.visibility = "visible";
        pb.style.zIndex = 16500;
        pb.style.visibility = "visible";
        renown.inMenu = true;
        event.event_display_time = 0;
        renown.coverTime = 400;
    }
    else{
        starbg.style.zIndex = -15000;
        starbg.style.visibility = "hidden";
        shadedBorders.style.zIndex = -15250;
        shadedBorders.style.visibility = "hidden";
        prestige.style.zIndex = -14750;
        prestige.style.visibility = "hidden";
        sb.style.zIndex = -16000;
        sb.style.visibility = "hidden";
        pu.style.zIndex = -16250;
        pu.style.visibility = "hidden";
        pb.style.zIndex = -16500;
        pb.style.visibility = "hidden";
        renown.inMenu = false;
        while(document.getElementById("prestigeupgrades").firstChild){
            document.getElementById("prestigeupgrades").removeChild(document.getElementById("prestigeupgrades").firstChild);
        }
    }
};
function updatePrestige(){
    document.getElementById("renownearned").innerHTML = getRenown()+"";
    document.getElementById("prestiges").innerHTML = renown.prestiges+"";
    document.getElementById("renowndisp").innerHTML = renown.count;
    if (renown.inMenu){
        document.getElementById("totalrenown").innerHTML = renown.count+" renown";
        if (renown.coverTime > 0){
            renown.coverTime-=4;
            document.getElementById("prestigecover").style.opacity = renown.coverTime/200;
        }
        else{
            document.getElementById("prestigecover").style.visibility = "hidden";
            document.getElementById("prestigecover").style.zIndex = -16000;
        }
    }
};
function handlePrestige(){
    if (renown.inMenu) return;
    if (getRenown() <= 0n && !getEnchantment("The Way").bought){
        alert("You have to get 1 renown when you prestige! You get your first renown at 1 trillion total soups.");
        return;
    }
    let r = window.confirm("Are you absolutely sure that you want to prestige? You will earn "+getRenown()+" renown but your soups and all of your upgrades will be reset!");
    if (r){

        while (document.getElementById("prestigeupgrades").firstChild){
            document.getElementById("prestigeupgrades").removeChild(document.getElementById("prestigeupgrades").firstChild);
        }
        renown.prestiges++;
        for (let i = 0; i < renown.upgrades.length; i++){
            renown.upgrades[i].visible = false;
            let up = renown.upgrades[i];

            let rd = ["0","0.4","1"];

            let nd = document.createElement("div");
            nd.style.background = "url("+renown.upgrades[i].background+") no-repeat";
            nd.style.width  = up.width  + "px";
            nd.style.height = up.height + "px";
            nd.style.position = "absolute";
            nd.style.marginTop  = (up.y + window.innerHeight/2 - up.height/2)+"px";
            nd.style.marginLeft = (up.x + window.innerWidth /2 - up.width/2 )+"px";
            nd.className = "RenownUpgrade"+i;
            nd.style.backgroundSize = nd.style.width+" "+nd.style.height;
            nd.style.visibility = "hidden";
            erdaa:
            for (let k = 0; k < up.needed.length; k++){
                for (let j = 0; j < renown.upgrades.length; j++){
                    if (renown.upgrades[j].name === up.needed[k] && renown.upgrades[j].bought){
                        nd.style.opacity = rd[1];
                        nd.style.visibility = "visible";
                        renown.upgrades[i].visible = true;
                        break erdaa;
                    }
                }
            }
            if (up.needed.length === 0){
                nd.style.opacity = rd[1];
                nd.style.visibility = "visible";
                renown.upgrades[i].visible = true;
            }
            if (renown.prestiges < up.prestige){
                nd.style.opacity = rd[0];
                nd.style.visibility = "hidden";
                renown.upgrades[i].visible = false;
            }
            if (up.bought){
                nd.style.opacity = rd[2];
                nd.style.visibility = "visible";
                
                renown.upgrades[i].visible = true;
            }

                let dv = document.createElement("div");
                dv.className = "boxRenownUpgrade"+i;
                dv.style.backgroundColor = "rgb(0, 0, 0, 1)";
                dv.style.width  = "300px";
                dv.style.height = "100px";
                dv.style.border = "1px solid rgba(255, 255, 255, 0.5)";
                dv.style.padding = "20px";
                dv.style.position = "fixed";
                dv.style.transform = "translate(-50%, -40%)";
                dv.style.visibility = "hidden";
                dv.style.zIndex = 17000;
                dv.style.backgroundSize = dv.style.width+" "+dv.style.height;
                dv.style.marginTop  = (-143+renown.upgrades[i].y+window.innerHeight/2)+"px";
                dv.style.marginLeft = (renown.upgrades[i].x+window.innerWidth/2)+"px";
                dv.style.opacity = 1;

                    let im = document.createElement("div");
                    im.style.background = "url("+renown.upgrades[i].background+") no-repeat";
                    im.style.width  = up.width/2  + "px";
                    im.style.height = up.height/2 + "px";
                    im.style.position = "absolute";
                    im.style.left = "8px";
                    im.style.top = "8px";
                    im.style.backgroundSize = im.style.width+" "+im.style.height;
                    dv.appendChild(im);

                    let na = document.createElement("text");
                    na.innerHTML = renown.upgrades[i].name;
                    na.style.color = "#ffffff";
                    na.style.position = "absolute";
                    na.style.left = "56px";
                    na.style.top = "20px";
                    na.style.textAlign = "center";
                    na.style.backgroundSize = na.style.width+" "+na.style.height;
                    dv.appendChild(na);

                    let de = document.createElement("text");
                    de.innerHTML = renown.upgrades[i].description;
                    de.style.color = "#ffffff";
                    de.style.width  = "90%";
                    de.style.height = "75%";
                    de.style.position = "absolute";
                    de.style.left = "16px";
                    de.style.top = "56px";
                    de.style.textAlign = "left";
                    de.style.backgroundSize = de.style.width+" "+de.style.height;
                    dv.appendChild(de);

                    let ctr = document.createElement("text");
                    ctr.innerHTML = "Cost: "+renown.upgrades[i].cost+" renown";
                    ctr.style.color = "#ffffff";
                    ctr.style.position = "absolute";
                    ctr.style.left = "16px";
                    ctr.style.top = "80%";
                    ctr.style.textAlign = "left";
                    ctr.style.backgroundSize = ctr.style.width+" "+ctr.style.height;
                    dv.appendChild(ctr);

                    document.getElementById("prestigeboxes").appendChild(dv);

            nd.onmouseover = function(){document.getElementsByClassName("box"+this.className)[0].style.visibility = "visible";};
            nd.onmouseleave = function(){document.getElementsByClassName("box"+this.className)[0].style.visibility = "hidden";};
            nd.onclick = function(){buyRenown(this.className);};
            nd.style.zIndex = "16250";
            document.getElementById("prestigeupgrades").appendChild(nd);
        }
        updateLines();
        setPrestige(true);
        renown.count += getRenown();
        if (getEnchantment("Divine Intervention").bought && Math.random() < 0.1){
            renown.count += getRenown();
        }
        bigSoups = 0n;
        allSoupsEver += totalSoups;
        totalSoups = 0n;
        clicks = 0;
        document.getElementById("earned").innerHTML = getRomanNumeral(renown.prestiges)+"";
        upgrades = [ { name: "overheal", proper_name: "Overheal", description: "x2 soups from clicks", bought: false, click: 2, sps: 1, cost: 100 }, { name: "2xrewards", proper_name: "2x Rewards", description: "x2 soups from clicks and SPS", bought: false, click: 2, sps: 2, cost: 2500, }, { name: "TastySoup", proper_name: "Tasty Soup", description: "x2 soups from clicks", bought: false, click: 4, sps: 1, cost: 50000, }, { name: "SoupsBuff", proper_name: "Soups Buff", description: "x2 soups from clicks and SPS", bought: false, click: 1, sps: 2, cost: 100000, }, { name: "GoldenFeather", proper_name: "Golden Feather", description: "Every 1000 clicks, spawn a feather", bought: false, click: 1, sps: 1, cost: 10000000, }, { name: "OverhealBuff", proper_name: "Overheal Buff", description: "x2 soups from clicks and SPS", bought: false, click: 2, sps: 2, cost: 50000000, }, { name: "AdminBlessing", proper_name: "Admin Blessing", description: "x2 soups from SPS", bought: false, click: 1, sps: 2, cost: 250000000, }, { name: "SoupsBuff2", proper_name: "Soups Buff", description: "x2 soups from clicks and SPS", bought: false, click: 2, sps: 2, cost: 1000000000, }, { name: "GoldenFeather2", proper_name: "Golden Feather II", description: "Every 750 clicks, spawn a feather", bought: false, click: 1, sps: 1, cost: 5000000000, }, { name: "FinalUpgrade", proper_name: "Pit Update", description: "x4 soups from clicks and SPS", bought: false, click: 4, sps: 4, cost: 25000000000, }, ];
        items = [ { name: "SoupCollector", proper_name: "Soup Collector", cost: BigInt(15), value: 0.2, amount: 0, }, { name: "SoupFarmer", proper_name: "Soup Farmer", cost: BigInt(100), value: 1, amount: 0, }, { name: "SoupMiner", proper_name: "Soup Miner", cost: BigInt(500), value: 5, amount: 0, }, { name: "SoupFactory", proper_name: "Soup Factory", cost: BigInt(2500), value: 10, amount: 0, }, { name: "SoupPebble", proper_name: "Pebble III Pants", cost: BigInt(7500), value: 50, amount: 0, }, { name: "SoupXV", proper_name: "Prestige XV Soup User", cost: BigInt(50000), value: 100, amount: 0, }, { name: "SoupXXX", proper_name: "Prestige XXX Soup User", cost: BigInt(1000000), value: 1500, amount: 0, }, { name: "UltimateSoupGod", proper_name: "Ultimate Soup God", cost: BigInt(100000000), value: 25000, amount: 0, }, ];
        let ntx = document.createElement("h");
        ntx.innerHTML = "Upgrades";
        resetUpgrades();
    }
};
function buyRenown(nam){
    let name = nam.substring(13,nam.length);
    let upg = renown.upgrades[name];
    let tob = true;
    rd:
    for (let i = 0; i < upg.needed.length; i++){
        for (let j = 0; j < renown.upgrades.length; j++){
            if (upg.needed[i] === renown.upgrades[j].name && !renown.upgrades[j].bought){
                tob = false;
                break rd;
            }
        }
    }
    if (BigInt(upg.cost) <= renown.count && !renown.upgrades[name].bought && tob){
        renown.count -= BigInt(upg.cost);
        renown.upgrades[name].bought = true;
        document.getElementsByClassName("RenownUpgrade"+name)[0].style.opacity = "1";
        for (let i = 0; i < renown.upgrades.length; i++){
            for (let j = 0; j < renown.upgrades[i].needed.length; j++){
                if (upg.name === renown.upgrades[i].needed[j]){
                    document.getElementsByClassName("RenownUpgrade"+i)[0].style.visibility = "visible";
                    document.getElementsByClassName("RenownUpgrade"+i)[0].style.opacity = "0.75";
                    if (renown.prestiges < renown.upgrades[i].prestige){
                        document.getElementsByClassName("RenownUpgrade"+i)[0].style.visibility = "hidden";
                        document.getElementsByClassName("RenownUpgrade"+i)[0].style.opacity = "0";
                    }
                }
            }
        }
    }
  updateLines();
  saveGame();
};
function updateLines(){
    for (let i = 0; i < renown.upgrades.length; i++){
        let op = 0;
        renown.upgrades[i].visible = false;
        op = 0;
        if (renown.upgrades[i].needed.length === 0){
            renown.upgrades[i].visible = true;
            op = 0.5;
        }
        if (renown.prestiges < renown.upgrades[i].prestige){
            renown.upgrades[i].visible = false;
            op = 0;
        }
        if (renown.upgrades[i].bought){
            renown.upgrades[i].visible = true;
            op = 1;
        }
        erdaa:
        for (let j = 0; j < renown.upgrades[i].needed.length; j++){
            if (getEnchantment(renown.upgrades[i].needed[j]).bought && renown.upgrades[j].visible){
                renown.upgrades[i].visible = true;
                op = 0.5;
                break erdaa;
            }
        }
    }
};
function clipUpgrades(){
    let x = document.getElementById("upgrades");
    let newNodes = [];
    for (let i = 0; i < x.childNodes.length; i++){
        if (x.childNodes[i].tagName !== "h" && x.childNodes[i].tagName !== undefined){
            newNodes.push(x.childNodes[i]);
        }
    }
    for (let i = 4; i < newNodes.length; i++){
        x.removeChild(newNodes[i]);
    }
};
function resetUpgrades(){
    let upg = document.getElementById("upgrades");
    while (upg.firstChild){
        upg.removeChild(upg.firstChild);
    }
    let tx = document.createElement("h");
    tx.innerHTML = "Upgrades";
    upg.appendChild(tx);
    for (let i = 0; i < upgrades.length; i++){
        if (!upgrades[i].bought){
            let up = upgrades[i];
            let elm = document.createElement("div");
            elm.id = up.name;
            elm.className = "upgrade";
            elm.addEventListener("click", function(){buyUpgrade(i);});
            let b = document.createElement("b");
            b.innerHTML = up.proper_name;
            elm.appendChild(b);
            let br1 = document.createElement("br");
            elm.appendChild(br1);
            let h1 = document.createElement("h");
            h1.innerHTML = up.description;
            elm.appendChild(h1);
            let br2 = document.createElement("br");
            elm.appendChild(br2);
            let h2 = document.createElement("h");
            h2.innerHTML = "Cost: "+((up.cost > 1000000000n) ? "<br>" : "")+up.cost+" ";
            elm.appendChild(h2);
            let smsp = document.createElement("smallsoup");
            elm.appendChild(smsp);
            upg.appendChild(elm);
        }
    }
};
function getStringSave(){
    let game = {};
    game.upgrades = [];
    for (let i = 0; i < upgrades.length; i++){
        game.upgrades.push({
            name: upgrades[i].name,
            bought: upgrades[i].bought,
        });
    }
    let ren = {
        count: renown.count+"",
        prestiges: renown.prestiges+0,
        inMenu: false,
        coverTime: 0,
        upgrades: [],
    };
    for (let i = 0; i < renown.upgrades.length; i++){
        ren.upgrades.push({bought: renown.upgrades[i].bought});
    }
    game.items = [];
    for (let i = 0; i < items.length; i++){
        let r = {
            name: items[i].name+"",
            cost: items[i].cost+"",
            amount: items[i].amount,
        };
        game.items.push(r);
    }
    game.totalSoups = BigInt(totalSoups+0n).toString();
    game.soups = BigInt(bigSoups+0n).toString();
    game.clicks = clicks;
    game.renown = ren;
    game.allSoupsEver = BigInt(allSoupsEver+0n).toString();
    return JSON.stringify(game);
};
function getSave(){
    let r = prompt("Here's your save!",CryptoJS.AES.encrypt(getStringSave(), "GoWDreVu41fQGL22icVP"));
};
function loadSave(){
    let re = prompt("Insert your save here!");
    let r = {};
    try{
        r = JSON.parse(CryptoJS.AES.decrypt(re,"GoWDreVu41fQGL22icVP").toString(CryptoJS.enc.Utf8) || {}) || false;
    }
    catch(e){
        console.log("Error in parsing your save.");
    };
    if (!r){
        return;
    }
    clicks = r.clicks;
    bigSoups = BigInt(r.soups);
    totalSoups = BigInt(r.totalSoups);
    if (r.allSoupsEver){
        allSoupsEver = BigInt(r.allSoupsEver);
    }
    if (r.renown){
        renown.count = BigInt(r.renown.count) || 0n;
        renown.prestiges = r.renown.prestiges || 0;
        renown.inMenu = r.renown.inMenu || false;
        renown.coverTime = r.renown.coverTime || 0;
        for (let i = 0; i < Math.min(r.renown.upgrades.length,renown.upgrades.length); i++){
            renown.upgrades[i].bought = r.renown.upgrades[i].bought || false;
        }
    }
    for (let i = 0; i < r.upgrades.length; i++){
        upgrades[i] = {
            name: r.upgrades[i].name,
            proper_name: upgrades[i].proper_name,
            description: upgrades[i].description,
            bought: r.upgrades[i].bought,
            click: upgrades[i].click,
            sps: upgrades[i].sps,
            cost: upgrades[i].cost,
        };
    }
    for (let i = 0; i < r.items.length; i++){
        items[i].name = r.items[i].name;
        items[i].cost = BigInt(r.items[i].cost);
        items[i].amount = r.items[i].amount;
    }
    resetUpgrades();
};
function getReduce(){
    let r = 100n;
    if (getEnchantment("Scam Artist").bought){
        r -= 5n;
    }
    if (getEnchantment("Scam Artist II").bought){
        r -= 5n;
    }
    return r;
};
function reincarnate(){
    if (getEnchantment("Extra Hearts").bought){
        for (let i = 0; i < 10; i++){
            giveItem("Soup Collector",1,true);
        }
    }
    if (getEnchantment("Extra Hearts II").bought){
        for (let i = 0; i < 10; i++){
            giveItem("Soup Collector",1,true);
        }
    }
    if (getEnchantment("Fast Pass").bought){
        giveSoups("1000000");
    }
    setPrestige(false);
    saveGame();
};
function openOptions(){
    document.getElementById("options").style.visibility = "visible";
};
function closeOptions(){
    document.getElementById("options").style.visibility = "hidden";
};
function minutes(n){
    return (n*30*60);
};
function updateEvent(){
    event.time++;
    event.event_display_time-=2/3;
    document.getElementById("eventalert").style.opacity = event.event_display_time/100;
    if (event.event_display_time <= 0){
        document.getElementById("eventalert").style.visibility = "hidden";
    }
    if (event.time >= minutes(10)){
        if (renown.inMenu){
            document.getElementById("eventalert").style.visibility = "hidden";
            return;
        }
        event.time = 0;
        event.eventswithout++;
        event.hover = false;
        let eventType = "minor";
        if (event.eventswithout === 3){
            event.eventswithout = 0;
            eventType = "major";
        }
        event.current_type = eventType;
        switch(eventType){
            case "minor": event.current_event = event.minors[Math.floor(Math.random()*event.minors.length)]; break;
            case "major": event.current_event = event.majors[Math.floor(Math.random()*event.majors.length)]; break;
        };
        setI("");
        event.needed_clicks = Math.floor(450+Math.random()*450);
        event.stash = 0;
        document.getElementById("eventtime").childNodes[9].style.color = "#000000";
        document.getElementById("eventtime").childNodes[1].innerHTML = event.current_type.toUpperCase()+" EVENT! "+event.current_event.name;
        document.getElementById("eventtext").innerHTML = event.current_event.name;
        document.getElementById("eventtype").innerHTML = (event.current_type+" event!").toUpperCase();
        document.getElementById("eventdesc").innerHTML = event.current_event.description.replace("{click_requirement}",event.needed_clicks);
        event.event_display_time = 150;
        document.getElementById("eventalert").style.opacity = event.event_display_time/100;
        document.getElementById("eventalert").style.visibility = "visible";
        event.event_time = minutes(3);
        event.itemclicks = 0;
        if (event.current_event.image){
            document.getElementById("eventclick").style.visibility = "visible";
            document.getElementById("eventclick").style.backgroundImage = "url("+event.current_event.image+")";
            document.getElementById("eventclick").style.marginLeft = ((Math.random()-0.5)*0.8+0.5)*window.innerWidth+"px";
            document.getElementById("eventclick").style.marginTop  = ((Math.random()-0.5)*0.8+0.5)*window.innerHeight+"px";
        }
        else{
            document.getElementById("eventclick").style.visibility = "hidden";
            document.getElementById("eventclick").style.backgroundImage = "";
        }
    }
    if (event.event_time > 0){
        if (getEvent("KOTL") && (event.event_time/30)%1 === 0 && event.hover){
            let r = Math.floor(soupsPerSecond * 5);
            giveSoups(r);
            addCounter("+"+beautifyNumber(r)+" soup" + ((r !== 1) ? "s" : ""), document.getElementById("eventclick"));
        }
        if (getEvent("KOTL") && (event.event_time/30)%10 === 0){
            document.getElementById("eventclick").style.marginLeft = ((Math.random()-0.5)*0.8+0.5)*window.innerWidth+"px";
            document.getElementById("eventclick").style.marginTop  = ((Math.random()-0.5)*0.8+0.5)*window.innerHeight+"px";
        }
        if (getEvent("Robbery") && (event.event_time/30)%1 === 0){
            event.stash -= (50 + Math.floor(event.stash/1000)*50);
            // event.stash *= (0.95-Math.random()/10);
            event.stash = Math.floor(Math.max(0, event.stash));
            setI("Stash: "+event.stash+"g");
        }
        event.event_time--;
        let count = event.event_time/30;
        document.getElementById("eventtime").childNodes[5].innerHTML = Math.floor(count/60)+":" + (((Math.floor(count%60)+"").length !== 2) ? "0" : "")+Math.floor(count%60);
        document.getElementById("eventtime").style.visibility = "visible";
        if (event.event_time <= 0){
            eventTrigger("time-out", {clicks: event.itemclicks, event: event.current_event.name, stash: event.stash, needed_clicks: event.needed_clicks});
        }
    }
    else{
        document.getElementById("eventtime").style.visibility = "hidden";
        document.getElementById("eventclick").style.visibility = "hidden";
        document.getElementById("eventclick").style.backgroundImage = "";
    }
};
function getEvent(vnt){
    if (vnt === "" || vnt === null || vnt === undefined){
        return (event.event_time > 0);
    }
    return (event.current_event.name === vnt && event.event_time > 0);
};
function endEvent(){
    event.current_type = "";
    event.current_event = "";
    event.event_time = 0;
    event.event_display_time = 0;
    event.itemclicks = 0;
    event.hover = false;
    event.stash = 0;
    setI("");
    document.getElementById("eventtime").childNodes[9].style.color = "#000000";
    document.getElementById("eventtime").style.visibility = "hidden";
    document.getElementById("eventclick").style.visibility = "hidden";
    document.getElementById("eventclick").style.backgroundImage = "";
};
function setI(tex){
    document.getElementById("eventtime").childNodes[9].innerHTML = tex;
}
function eventTrigger(input, parameters){
    if (input === "event-hover"){
        event.hover = parameters.hover;
    }
    if (input === "click_main_soup"){
        if (getEvent("Rage Pit")){
            event.itemclicks++;
            setI("Clicks: "+event.itemclicks+" / 600");
        }
        if (getEvent("Raffle")){
            event.itemclicks++;
            setI("Clicks: "+event.itemclicks);
            document.getElementById("eventtime").childNodes[9].style.color = "#000000";
            if (event.itemclicks % 100 === 0){
                giveSoups(parameters.clickValue*100);
                document.getElementById("eventtime").childNodes[9].style.color = "rgb(0, 125, 0)";
            }
        }
        if (getEvent("2x Rewards") && parameters.clickValue){
            giveSoups(parameters.clickValue);
        }
        if (getEvent("Robbery")){
            event.stash += Math.floor(Math.random()*30+10);
            setI("Stash: "+event.stash+"g");
        }
        if (getEvent("TDM")){
            event.itemclicks++;
            if (event.itemclicks === event.needed_clicks){
                document.getElementById("eventtime").childNodes[9].style.color = "rgb(0, 125, 0)";
            }
            else{
                document.getElementById("eventtime").childNodes[9].style.color = "#000000";
            }
            setI("Clicks: "+event.itemclicks+" / "+event.needed_clicks);
        }
    }
    if (input === "click-event"){
        event.itemclicks++;
        if (getEvent("Dragon Egg")){
            let r = Math.floor(soupsPerSecond * Math.floor(event.itemclicks / 8 + 8));
            giveSoups(r);
            addCounter("+"+beautifyNumber(r)+" soup" + ((r !== 1) ? "s" : ""), document.getElementById("eventclick"));
            if (event.itemclicks % 8 === 0){
                document.getElementById("eventclick").style.marginLeft = ((Math.random()-0.5)*0.8+0.5)*window.innerWidth+"px";
                document.getElementById("eventclick").style.marginTop  = ((Math.random()-0.5)*0.8+0.5)*window.innerHeight+"px";
            }
            setI("Clicks: "+event.itemclicks+" / 64");
            if (event.itemclicks >= 64){
                endEvent();
            }
        }
        if (getEvent("Giant Cake")){
            let r = Math.floor(soupsPerSecond * 2);
            giveSoups(r);
            addCounter("+"+beautifyNumber(r)+" soup" + ((r !== 1) ? "s" : ""), document.getElementById("eventclick"));
            document.getElementById("eventclick").style.marginLeft = ((Math.random()-0.5)*0.8+0.5)*window.innerWidth+"px";
            document.getElementById("eventclick").style.marginTop  = ((Math.random()-0.5)*0.8+0.5)*window.innerHeight+"px";
            if (event.itemclicks >= 200){
                endEvent();
            }
            setI("Clicks: "+event.itemclicks+" / 200");
        }
        if (getEvent("Care Package")){
            if (event.itemclicks >= 100){
                let parm = [items[Math.floor(Math.random()*items.length)], Math.floor(Math.random()*15 + 5)];
                giveItem(parm[0].proper_name, parm[1], true);
                addCounter("+"+parm[1]+" "+parm[0].proper_name+"s", document.getElementById("eventclick"));
                endEvent();
            }
            setI("Clicks: "+event.itemclicks+" / 100");
            document.getElementById("eventclick").style.marginLeft = ((Math.random()-0.5)*0.8+0.5)*window.innerWidth+"px";
            document.getElementById("eventclick").style.marginTop  = ((Math.random()-0.5)*0.8+0.5)*window.innerHeight+"px";
        }
    }
    if (input === "time-out"){
        if (parameters.event === "Rage Pit"){
            let rewards = {
                renown: 0n,
                soups: 50,
            };
            if (parameters.clicks >= 600){
                rewards.renown = 1n;
                rewards.soups = 100;
            }
            rewards.soups = BigInt(Math.floor(rewards.soups * soupsPerSecond))
            setRewards(rewards);
        }
        if (parameters.event === "Robbery"){
            let rewards = {
                renown: 0n,
                soups: parameters.stash/2,
            };
            if (parameters.stash >= 1000){
                rewards.renown = 1n;
                rewards.soups = parameters.stash;
            }
            rewards.soups = BigInt(Math.floor(rewards.soups * soupsPerSecond));
            setRewards(rewards);
        }
        if (parameters.event === "TDM"){
            let rewards = {
                renown: 0n,
                soups: 10,
            };
            if (parameters.clicks === parameters.needed_clicks){
                rewards.renown = 1n;
                rewards.soups = 20;
            }
            rewards.soups = BigInt(Math.floor(rewards.soups * soupsPerSecond));
            setRewards(rewards);
        }
    }
};
function startEvent(){
    event.time = minutes(1500);
};
function setRewards(params){
    let r = params.renown;
    let s = params.soups;
    if (getEnchantment("Tasty Soup").bought){
        if (typeof r === "bigint"){ r += 1n; }
        else{ r++; }
    }
    giveSoups(s);
    renown.count += r;
    saveGame();
    document.getElementById("eventtext").innerHTML = r+" renown<br>"+beautifyNumber(s)+" soups";
    document.getElementById("eventtype").innerHTML = "Event Rewards";
    document.getElementById("eventdesc").innerHTML = "";
    event.event_display_time = 100;
    document.getElementById("eventalert").style.opacity = event.event_display_time/100;
    document.getElementById("eventalert").style.visibility = "visible";
}
function hopperEvent(ev){
    if (ev === "click"){
        if (hopper.choice !== "fight"){
            return;
        }
        hopper.clicks++;
        document.getElementById("hopperhealth").style.backgroundSize = (100-(hopper.clicks*2))+"% 100%";
    }
    if (ev === "pay"){
        document.getElementById("hopper").style.visibility = "hidden";
        document.getElementById("hoppertext").style.visibility = "hidden";
        document.getElementById("hopperhealth").style.visibility = "hidden";
        giveSoups(hopper.paysoups*-1n);
        hopper.choice = "pay";
        hopper.timer = minutes(40);
        addCounter("-"+beautifyNumber(hopper.paysoups), document.getElementById("hoppertext"));
    }
    if (ev === "fight"){
        hopper.choice = "fight";
        document.getElementById("hoppertext").style.visibility = "hidden";
    }
    if (ev === "ok"){
        document.getElementById("hopperinfo").style.visibility = "hidden";
    }
    saveGame();
};
function getHopper(){
    return !(document.getElementById("hopper").style.visibility !== "visible");
};
function updateHopper(){
    let hopperel = document.getElementById("hopper");
    let hoppertext = document.getElementById("hoppertext");
    hopper.timer = Math.max(0, hopper.timer-1);
    if (bigSoups >= BigInt(Math.floor(soupsPerSecond * Math.random()*300+2000)) && 
        frames%30 === 0 && 
        Math.random() < 0.01 && 
        hopperel.style.visibility !== "visible" && 
        totalSoups > BigInt("1000000000") && 
        hopper.timer <= 0){
    // if (frames === 1){
        document.getElementById("hopper").style.opacity = 1;
        document.getElementById("hopperhealth").style.backgroundSize = "100% 100%";
        document.getElementById("hopperhealth").style.visibility = "visible";
        hopper.time = 0;
        hopper.paysoups = bigSoups/4n;
        hopperel.style.visibility = "visible";
        hoppertext.style.visibility = "visible";
        hoppertext.childNodes[1].innerHTML = "[ BHOPPER ]<br>Pay for Truce:<br>"+beautifyNumber(hopper.paysoups)+" soups";
        saveGame();
    }
    if (hopperel.style.visibility !== "hidden"){
        if (hopper.choice !== "none"){
            hopper.time += 1+hopper.clicks/25;
        }
        let rd = 24;
        hopperel.style.left = (Math.cos((hopper.time-rd)/15)*150)+"px";
        hopperel.style.top  = (Math.sin((hopper.time-rd)/15)*150)+"px";
        document.getElementById("hopperhealth").style.left = (Math.cos((hopper.time-rd)/15)*150)+"px";
        document.getElementById("hopperhealth").style.top  = (Math.sin((hopper.time-rd)/15)*150)+"px";
        if (hopper.time > 1500){
            document.getElementById("hopper").style.visibility = "hidden";
            let ps = BigInt((bigSoups*5n)/10n);
            giveSoups(ps*-1n);
            addCounter("-"+beautifyNumber(ps), document.getElementById("hoppertext"));
            hopperel.style.visibility = "hidden";
            document.getElementById("hoppertext").style.visibility = "hidden";
            document.getElementById("hopperinfo").childNodes[1].innerHTML = "You didn't kill the hopper!<br>You lost "+beautifyNumber(ps)+" soups.";
            document.getElementById("hopperinfo").style.visibility = "visible";
            hopper.time = 0;
            hopper.clicks = 0;
            hopper.paysoups = 0;
            hopper.choice = "none";
            hopper.timer = minutes(20);
            document.getElementById("hopperhealth").style.visibility = "hidden";
            saveGame();
        }
        if (hopper.clicks >= 50){
            giveSoups(Math.floor(soupsPerSecond*5));
            addCounter("+"+beautifyNumber(Math.floor(soupsPerSecond*5))+" soup" + ((Math.floor(soupsPerSecond*5) !== 1) ? "s" : ""), document.getElementById("hopper"));
            hopperel.style.visibility = "hidden";
            hoppertext.style.visibility = "hidden";
            document.getElementById("hopperinfo").childNodes[1].innerHTML = "You killed the hopper!";
            document.getElementById("hopperinfo").style.visibility = "visible";
            hopper.time = 0;
            hopper.clicks = 0;
            hopper.paysoups = 0;
            hopper.choice = "none";
            hopper.timer = minutes(20);
            document.getElementById("hopperhealth").style.visibility = "hidden";
            saveGame();

            /*
            Notes:
            . Hoppers take away exactly 50% of your soups when you lose to them.
            . Time between hoppers doubled.
            . You can now buy upgrades during an event.
            . Small text box indicates that you have clicked the Pebble III Pants
            . Hopper Health Bar
            . Added "TDM" event
            . You can't avoid hoppers by reloading the page
            . Hoppers reduce your soups per second by 75% when they are on the screen
            . 

            */
        }
    }
};
function clickCooper(){
    let co = document.getElementById("cooper");
    co.style.visibility = "hidden";
    let parm = [items[Math.floor(Math.random()*items.length)], 2];
    giveItem(parm[0].proper_name, parm[1], true);
    addCounter("+"+parm[1]+" "+parm[0].proper_name+"s", co);
};
function deleteSave(){
    let a = Math.floor(Math.random()*1000000);
    let r = prompt("If you're absolutely sure that you want to delete your save, type the following number into the box and submit: '"+a+"'");
    if (r === a || r+"" === a+""){
        document. cookie = "soupClickerSave=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        location.reload();
    }
    else {
        alert("You didn't type the number in correctly!");
    }
};
function main(){
    frames++;
    clipUpgrades();
    updateSoup();
    updateSPS();
    setSoups(bigSoups);
    counterDraw();
    backgroundDraw();
    addRemainingSoups();
    updateClicks();
    updateItems();
    updateTotal();
    updateUpgrades();   
    updateGoldenSoup();
    updateGoldenFeather();
    updateRush();
    updatePebbles();
    updateSave();
    updatePrestige();
    updateEvent();
    updateHopper();
};
loadGame();
clipUpgrades();
let mainInterval = setInterval(main,1000/30);
let soupsInterval = setInterval(addSoups,1000);
let saveInterval = setInterval(saveGame,30000);