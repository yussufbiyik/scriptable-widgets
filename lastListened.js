const lastFMArgs = args.widgetParameter.split(",");

const config = {
    seperator: {
        // Outputs something like "---Hello World---"
        multiplier: 3,
        createSeperator: (title) => {return ""+"-".repeat(config.seperator.multiplier) + title + "-".repeat(config.seperator.multiplier)+""}
    },
    font: {
        small: new Font("Menlo", 13),
        default: new Font("Menlo", 15),
        bold: new Font("Menlo-Bold", 15)
    },
    lastFM:{
        username: lastFMArgs[0],
        apiKey: lastFMArgs[1]
    }
}
/**
 * Adds a text line to the widget.
 * 
 * @param {ListWidget} widget - Target widget to add this line to.
 * @param {String} content - Content of the line.
 * @param {Boolean} [isCentered=false] - Should the text be centered?
 * @param {Font} [font=config.font.default] - Font of the text.
 * @param {Function} [extraFunctionality=()=>{}] - Extra functionality to add to the line, executes before returning the line.
 * @returns {WidgetText} - Returns the WidgetText object.
 */
function addWidgetLine(widget, content, isCentered = false, font = config.font.default, extraFunctionality = ()=>{}){
    const line = widget.addText(content);
    line.font = font;
    if(isCentered) line.centerAlignText();
    extraFunctionality(line);
    return line;
}

async function getSong(){
    // Get the most recent song from last.fm
    const recentSongURL = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${config.lastFM.username}&api_key=${config.lastFM.apiKey}&format=json&limit=1`;
    const req = new Request(recentSongURL);
    const res = await req.loadJSON();
    const songAlbumArt = await new Request(res.recenttracks.track[0].image[3]["#text"]).loadImage();
    const songName = `${res.recenttracks.track[0].artist["#text"]} - ${res.recenttracks.track[0].name}`;
    // Get detailed information about the song
    return {
        name: songName,
        albumArt: songAlbumArt
    }
}

// Create Widget
async function createWidget(){
    const widget = new ListWidget();
    // Create stack to hold the content horizontally
    const contentStack = widget.addStack();
    contentStack.spacing = 10;
    contentStack.setPadding(1, 1, 1, 1);
    // Add the album art and song name to the widget
    const song = await getSong();
    const albumArtImage = contentStack.addImage(song.albumArt);
    albumArtImage.cornerRadius = 20;
    // Create another stack to display the text aesthetically
    const textStack = contentStack.addStack();
    textStack.layoutVertically();
    textStack.spacing = 5;
    addWidgetLine(textStack, "Last Listened:", true, config.font.small);
    addWidgetLine(textStack, song.name, false, config.font.bold);
    return widget;
}

// Show the widget
const widget = await createWidget();
Script.setWidget(widget);
Script.complete();
widget.presentMedium();