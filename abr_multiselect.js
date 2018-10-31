var XRMMultiselect;
(function (XRMMultiselect) {
    var Controller = /** @class */ (function () {
        function Controller() {
            this.onLoad();
        }
        Controller.prototype.onLoad = function () {
            var _this = this;
            if (typeof (Xrm) == 'undefined')
                Xrm = parent.Xrm;
            this.myButtons = [];
            var query = window.location.search.substring(1);
            if (query != null && query.split('=').length > 1) {
                var elements = query.split('=')[1];
                elements = decodeURIComponent(elements);
                var controls = void 0;
                try {
                    var configuration = JSON.parse(elements);
                    controls = [];
                    controls = controls.concat(configuration.Fields);
                    controls = controls.concat(this.getControlsFromSections(configuration.Sections));
                }
                catch (error) {
                    console.log(error);
                    controls = elements.split(';');
                }
                controls.forEach(function (ctrl) {
                    if (ctrl != null)
                        _this.myButtons.push(new ButtonViewModel(ctrl.trim()));
                });
            }
            window.addEventListener('keydown', function (event) {
                if (event.ctrlKey == true && event.which == 83 && event.shiftKey == false) {
                    event.preventDefault();
                    window.parent.Xrm.Page.data.save();
                }
            });
        };
        Controller.prototype.getControlsFromSections = function (sections) {
            var controls = [];
            sections.forEach(function (section) {
                var xrmSection = Xrm.Page.ui.tabs.get(section.TabName).sections.get(section.SectionName);
                var xrmCtrls = xrmSection.controls.get();
                for (var i = 0; i < xrmCtrls.length; i++) {
                    if (xrmCtrls[i].getAttribute().getAttributeType() == 'boolean')
                        controls.push(xrmCtrls[i].getName());
                }
            });
            return controls;
        };
        return Controller;
    }());
    XRMMultiselect.Controller = Controller;
    var ConfigurationModel = /** @class */ (function () {
        function ConfigurationModel() {
        }
        return ConfigurationModel;
    }());
    XRMMultiselect.ConfigurationModel = ConfigurationModel;
    var SectionModel = /** @class */ (function () {
        function SectionModel() {
        }
        return SectionModel;
    }());
    XRMMultiselect.SectionModel = SectionModel;
    var ButtonViewModel = /** @class */ (function () {
        function ButtonViewModel(controlName) {
            var _this = this;
            this.controlName = controlName;
            try {
                this.ctrl = Xrm.Page.ui.controls.get(controlName);
                this.attr = Xrm.Page.getAttribute(controlName);
                this.label = this.ctrl.getLabel();
                this.reqLevel = this.attr.getRequiredLevel();
                this.isClicked = ko.observable(this.attr.getValue());
                this.disabledState = this.ctrl.getDisabled();
                this.className = ko.computed(function () {
                    return (_this.isClicked() ? 'clicked' : 'unclicked') + _this.reqClassName() + _this.disabledClassName();
                });
                this.isRequired = ko.computed(function () {
                    return (_this.reqLevel == 'required');
                });
                this.isDisabled = ko.computed(function () {
                    return (this.disabledState == 'disabled');
                });
            }
            catch (ex) {
                console.log('Error on geting Xrm attribue', controlName, ex);
            }
        }
        ButtonViewModel.prototype.reqClassName = function () {
            if (this.reqLevel == 'none')
                return '';
            else
                return ' ' + this.reqLevel;
        };
        ButtonViewModel.prototype.disabledClassName = function () {
            if (this.disabledState)
                return ' disabled';
            else
                return '';
        };
        ButtonViewModel.prototype.registerClick = function () {
            this.isClicked(!this.isClicked());
            this.setValue(this.controlName, this.isClicked());
        };
        ;
        ButtonViewModel.prototype.setValue = function (controlName, value) {
            try {
                this.attr.setValue(value);
                this.attr.setSubmitMode("always");
            }
            catch (e) {
                console.log("Error: setValue", controlName, e.message);
            }
        };
        return ButtonViewModel;
    }());
    XRMMultiselect.ButtonViewModel = ButtonViewModel;
})(XRMMultiselect || (XRMMultiselect = {}));
;
//# sourceMappingURL=abr_multiselect.js.map