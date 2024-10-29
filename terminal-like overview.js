// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: black; icon-glyph: video;

const timetable = [
    {
        name: "[⚛️] Elektromanyetik Alanlar",
        todos: [],
        day: 2,
        room: "4-B",
        time: "09:30-12:15",
    },
];

// Repeated Codes
const multiplier = 3;
const seperator = (title) => {return ""+"-".repeat(multiplier) + title + "-".repeat(multiplier)+""};

const defaultFont = new Font("Menlo", 11);

// Get last listened song from last.fm
async function getSong(){
    const lastfmDetails = {
        user: "username",
        api_key: "apiKey",
    }
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastfmDetails.user}&api_key=${lastfmDetails.api_key}&format=json&limit=1`;
    const req = new Request(url);
    const res = await req.loadJSON();
    const song = `${res.recenttracks.track[0].artist["#text"]} - ${res.recenttracks.track[0].name}`;
    return song;
}

function addWidgetLine(widget, content, isCentered = false){
    const line = widget.addText(content);
    line.font = defaultFont;
    if(isCentered) line.centerAlignText();
    return line;
}

// Create Widget
async function createWidget(){
    const widget = new ListWidget();
    const user = "yourname"
    const name = addWidgetLine(widget, `$${user}@${Device.model()} ./overview.txt`);
    // Overview
    const classesOfTheDay = timetable.filter(c => c.day === new Date().getDay());
    const overviewSeperator = addWidgetLine(widget, seperator("Overview"), true);
    const overviewInfo = [
        ` [🔋] Battery: %${(Device.batteryLevel()*100).toFixed(0)} (${(Device.isCharging) ? "Charging" : "Decharging"})`,
        ` [📅] Date & Time: ${new Date().toLocaleDateString()}`,
        ` [🏫] Class Count: ${(classesOfTheDay.length == 0)?0:classesOfTheDay.length}`,
        ` [💿] ${await getSong()}`,
    ];
    const overview = addWidgetLine(widget, overviewInfo.join("\n"));
    // Timetable
    const timetableSeperator = addWidgetLine(widget, seperator("Classes"), true);
    if(classesOfTheDay.length == 0){
        const noClass = addWidgetLine(widget, " [🛏️] No classes today.");
    }else{
        const classes = addWidgetLine(widget, classesOfTheDay.map(c => ` ${c.name} ${c.room} ${c.time}`).join("\n"))
    }
    return widget;
}

const widget = await createWidget();
// Refresh after 24 hours
const now = Date.now();
widget.refreshAfterDate = new Date(now + 24*60*60*1000);
// Show the widget
Script.setWidget(widget);
Script.complete();
widget.presentMedium();
