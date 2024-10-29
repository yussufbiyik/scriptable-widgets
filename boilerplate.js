const config = {
    seperator: {
        // Outputs something like "---Hello World---"
        multiplier: 3,
        createSeperator: (title) => {return ""+"-".repeat(config.seperator.multiplier) + title + "-".repeat(config.seperator.multiplier)+""}
    },
    font: {
        default: new Font("Menlo", 11)
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

// Create Widget
async function createWidget(){
    const widget = new ListWidget();
    // You can also assign this line to a variable to use it later 
    // but extraFunctionality is a better way to manipulate the line 
    // to keep the code uncluttered. (i think)
    addWidgetLine(widget, "Hello World!");
    return widget;
}

// Show the widget
const widget = await createWidget();
Script.setWidget(widget);
Script.complete();
widget.presentMedium();