function getName(controlName) {
	try {
		var ctrl = window.parent.Xrm.Page.ui.controls.get(controlName);
		return ctrl.getLabel();
	}
	catch (e) {
		console.log("Error: getName", controlName, e.message);
		return controlName;
	}
};
function setValue(controlName, value) {
	try {
		var attr = window.parent.Xrm.Page.getAttribute(controlName);
		attr.setValue(value);
    	attr.setSubmitMode("always");
	}
	catch (e) {
        if ( window.console && window.console.log )
		console.log("Error: setValue", controlName, e.message);
	}
};
function getValue(controlName) {
    try {
        return window.parent.Xrm.Page.getAttribute(controlName).getValue();
    }
    catch (e) {
        console.log("Error getValue", controlName, e.message);
    }
}

var ButtonViewModel = function (controlName) {
    this.controlName = controlName;
    this.name = getName(this.controlName);
    this.registerClick = function () {
        this.isClicked(!this.isClicked());
		setValue(this.controlName, this.isClicked());
    };
    this.isClicked = ko.observable(getValue(this.controlName));
    this.className = ko.pureComputed(function () {
        return (this.isClicked() ? "clicked" : "unclicked")
    }, this);
}
    
var myButtons = new Array();
var query = window.location.search.substring(1);
if (query != null && query.split("=").length > 1)
{
    var elements = query.split("=")[1];
    elements = decodeURIComponent(elements);
    var controls = elements.split(";");
    for (var i in controls) {
        if (controls[i] != null)
            myButtons.push(new ButtonViewModel(controls[i].trim()));
    }
}
ko.applyBindings(myButtons);

window.addEventListener("keydown", function (event) {
	if (event.ctrlKey == true && event.which == 83 && event.shiftKey == false) {
		event.preventDefault();
        window.parent.Xrm.Page.data.save();
    }
});	