
let renown = {
    count: 0n,
    prestiges: 0,
    inMenu: false,
    coverTime: 0,
    upgrades: [
        {
            x: 0,
            y: -66.66,
            width: 88,
            height: 88,
            background: "beacon-88.png",

            name: "Renown Shop",
            description: "The first renown upgrade.",
            cost: 0,
            bought: false,
            needed: [],
            prestige: 1,

        },
        {
            x: -200,
            y: 50,
            width: 72,
            height: 72,
            background: "magma-72.png",

            name: "Tenacity",
            description: "Doubles the number of soups per click that you get.",
            cost: 0,
            bought: false,
            needed: ["Renown Shop"],
            prestige: 1,

        },
        {
            x: -66.66,
            y: 50,
            width: 72,
            height: 72,
            background: "apple-72.png",

            name: "Extra Hearts",
            description: "You start the game with 10 Soup Collectors.",
            cost: 0,
            bought: false,
            needed: ["Renown Shop"],
            prestige: 1,

        },
        {
            x: 66.66,
            y: 50,
            width: 64,
            height: 64,
            background: "enchantment-300.png",

            name: "Mysticism",
            description: "There is a small chance to get 100 seconds of your current soups per second when you click the soup.",
            cost: 0,
            bought: false,
            needed: ["Renown Shop"],
            prestige: 1,
        },
        {
            x: 200,
            y: 50,
            width: 64,
            height: 64,
            background: "porkchop-128.png",

            name: "Scam Artist",
            description: "Store items cost 5% less.",
            cost: 0,
            bought: false,
            needed: ["Renown Shop"],
            prestige: 1,
        },
        {
            x: -200,
            y: 150,
            width: 64,
            height: 64,
            background: "gapple-128.png",

            name: "Yummy",
            description: "Clicking the soup gives you +10% of your normal soups per second.",
            cost: 0,
            bought: false,
            needed: ["Renown Shop"],
            prestige: 1,
        },
        {
            x: -66.66,
            y: 150,
            width: 64,
            height: 64,
            background: "bread-128.png",

            name: "Overheal",
            description: "Doubles the number of soups you get per second.",
            cost: 0,
            bought: false,
            needed: ["Renown Shop"],
            prestige: 2,
        },
        {
            x: 66.66,
            y: 150,
            width: 64,
            height: 64,
            background: "dirt-300.png",

            name: "Dirty",
            description: "All effects from Golden Soups last 5s longer.",
            cost: 0,
            bought: false,
            needed: ["Renown Shop"],
            prestige: 2,
        },
        {
            x: 200,
            y: 150,
            width: 64,
            height: 64,
            background: "water-72.png",

            name: "Fishing Club",
            description: "Pebble III Pants give you 2 pants instead of 1 per click.",
            cost: 0,
            bought: false,
            needed: ["Renown Shop"],
            prestige: 3,
        },
        {
            x: -200,
            y: 250,
            width: 64,
            height: 64,
            background: "chicken-128.png",

            name: "First Strike",
            description: "The first time you click on the soup each second rewards +100% soup.",
            cost: 0,
            bought: false,
            needed: ["Renown Shop"],
            prestige: 4,
        },
        {
            x: -66.66,
            y: 250,
            width: 56,
            height: 56,
            background: "stairs-150.png",

            name: "Divine Intervention",
            description: "There is a small chance to get twice as much renown when you prestige.",
            cost: 0,
            bought: false,
            needed: ["Renown Shop"],
            prestige: 5,
        },
        {
            x: 66.66,
            y: 250,
            width: 72,
            height: 72,
            background: "soup-128.png",

            name: "Tasty Soup",
            description: "You get one more renown from Major Events.",
            cost: 0,
            bought: false,
            needed: ["Renown Shop"],
            prestige: 5,
        },
        {
            x: 200,
            y: 250,
            width: 56,
            height: 56,
            background: "activ-rails-64.png",

            name: "Fast Pass",
            description: "You start the game with 1 million soups.",
            cost: 0,
            bought: false,
            needed: ["Renown Shop"],
            prestige: 8,
        },
        {
            x: -200,
            y: 350,
            width: 56,
            height: 56,
            background: "acacia-door-128.png",

            name: "The Way",
            description: "You can now prestige even when you would not earn any renown.<br>(I don't know why you would want this)",
            cost: 0,
            bought: false,
            needed: ["Renown Shop"],
            prestige: 8,
        },
        {
            x: -66.66,
            y: 350,
            width: 72,
            height: 72,
            background: "magma-72.png",

            name: "Tenacity II",
            description: "Triples the number of soups per click that you get.",
            cost: 0,
            bought: false,
            needed: ["Tenacity"],
            prestige: 9,
        },
        {
            x: 66.66,
            y: 350,
            width: 72,
            height: 72,
            background: "apple-72.png",

            name: "Extra Hearts II",
            description: "You start the game with 10 more Soup Collectors.",
            cost: 0,
            bought: false,
            needed: ["Extra Hearts"],
            prestige: 9,
        },
        {
            x: 200,
            y: 350,
            width: 64,
            height: 64,
            background: "porkchop-128.png",

            name: "Scam Artist II",
            description: "Store items cost another 5% less.",
            cost: 0,
            bought: false,
            needed: ["Scam Artist"],
            prestige: 10,
        },
    ],
};
/*
MAKE vvv WORK!
Tasty Soup
*/


let goldenfeather = {
    appeared: false,
    x: 0,
    y: 0,
    takenthisone: false,
};
let goldensoup = {
    appeared: false,
    x: 0,
    y: 0,
    timeWithout: 0,
    spsmult: {
        multi: 2,
        time: 0,
    },
    clickmult: {
        multi: 2,
        time: 0,
    },
    soups: {
        amount: 0,
        time: 0,
    },
};
let pebblePants = {
    appeared: false,
    x: 0,
    y: 0,
    clicks: 0,
    time: 0,
};

let upgrades = [
    {
        name: "overheal",
        proper_name: "Overheal",
        description: "x2 soups from clicks",
        bought: false,
        click: 2,
        sps: 1,
        cost: 0
    },
    {
        name: "2xrewards",
        proper_name: "2x Rewards",
        description: "x2 soups from clicks and SPS",
        bought: false,
        click: 2,
        sps: 2,
        cost: 0,
    },
    {
        name: "TastySoup",
        proper_name: "Tasty Soup",
        description: "x2 soups from clicks",
        bought: false,
        click: 4,
        sps: 1,
        cost: 0,
    },
    {
        name: "SoupsBuff",
        proper_name: "Soups Buff",
        description: "x2 soups from clicks and SPS",
        bought: false,
        click: 1,
        sps: 2,
        cost: 0,
    },
    {
        name: "GoldenFeather",
        proper_name: "Golden Feather",
        description: "Every 1000 clicks, spawn a feather",
        bought: false,
        click: 1,
        sps: 1,
        cost: 0,
    },
    {
        name: "OverhealBuff",
        proper_name: "Overheal Buff",
        description: "x2 soups from clicks and SPS",
        bought: false,
        click: 2,
        sps: 2,
        cost: 0,
    },
    {
        name: "AdminBlessing",
        proper_name: "Admin Blessing",
        description: "x2 soups from SPS",
        bought: false,
        click: 1,
        sps: 2,
        cost: 0,
    },
    {
        name: "SoupsBuff2",
        proper_name: "Soups Buff",
        description: "x2 soups from clicks and SPS",
        bought: false,
        click: 2,
        sps: 2,
        cost: 0,
    },
    {
        name: "GoldenFeather2",
        proper_name: "Golden Feather II",
        description: "Every 750 clicks, spawn a feather",
        bought: false,
        click: 1,
        sps: 1,
        cost: 0,
    },
    {
        name: "FinalUpgrade",
        proper_name: "Pit Update",
        description: "x4 soups from clicks and SPS",
        bought: false,
        click: 4,
        sps: 4,
        cost: 0,
    },
];
let items = [
    {
        name: "SoupCollector",
        proper_name: "Soup Collector",
        cost: BigInt(0),
        value: 0.2,
        amount: 0,
    },
    {
        name: "SoupFarmer",
        proper_name: "Soup Farmer",
        cost: BigInt(0),
        value: 1,
        amount: 0,
    },
    {
        name: "SoupMiner",
        proper_name: "Soup Miner",
        cost: BigInt(0),
        value: 5,
        amount: 0,
    },
    {
        name: "SoupFactory",
        proper_name: "Soup Factory",
        cost: BigInt(),
        value: 10,
        amount: 0,
    },
    {
        name: "SoupPebble",
        proper_name: "Pebble III Pants",
        cost: BigInt(0),
        value: 50,
        amount: 0,
    },
    {
        name: "SoupXV",
        proper_name: "Prestige XV Soup User",
        cost: BigInt(0),
        value: 100,
        amount: 0,
    },
    {
        name: "SoupXXX",
        proper_name: "Prestige XXX Soup User",
        cost: BigInt(0),
        value: 1500,
        amount: 0,
    },
    {
        name: "UltimateSoupGod",
        proper_name: "Ultimate Soup God",
        cost: BigInt(0),
        value: 25000,
        amount: 0,
    },
];
