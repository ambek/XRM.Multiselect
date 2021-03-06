﻿namespace XRMMultiselect {
    export class Controller {
        public myButtons: Array<ButtonViewModel>;
        constructor() {
            this.onLoad();
        }
        public onLoad() {
            if (typeof (Xrm) == 'undefined')
                Xrm = (<any>parent).Xrm;
            this.myButtons = [];
            let query = window.location.search.substring(1);
            if (query != null && query.split('=').length > 1) {
                let elements = query.split('=')[1];
                elements = decodeURIComponent(elements);
                let controls: Array<string>;
                try {
                    var configuration: ConfigurationModel = JSON.parse(elements);
                    controls = [];
                    controls = controls.concat(configuration.Fields);
                    controls = controls.concat(this.getControlsFromSections(configuration.Sections));
                }
                catch (error) {
                    console.log(error)
                    controls = elements.split(';');
                }
                controls.forEach((ctrl) => {
                    if (ctrl != null)
                        this.myButtons.push(new ButtonViewModel(ctrl.trim()));
                });
            }

            window.addEventListener('keydown', function (event) {
                if (event.ctrlKey == true && event.which == 83 && event.shiftKey == false) {
                    event.preventDefault();
                    (<any>window.parent).Xrm.Page.data.save();
                }
            });
        }
        private getControlsFromSections(sections: Array<SectionModel>): Array<string> {
            let controls: Array<string> = [];
            sections.forEach((section) => {
                let xrmSection = Xrm.Page.ui.tabs.get(section.TabName).sections.get(section.SectionName);
                var xrmCtrls = xrmSection.controls.get();
                for (var i = 0; i < xrmCtrls.length; i++) {
                    if (xrmCtrls[i].getAttribute().getAttributeType() == 'boolean')
                        controls.push(xrmCtrls[i].getName());
                }
            });
            return controls;
        }
    }
    export class ConfigurationModel {
        public Fields: Array<string>;
        public Sections: Array<SectionModel>;
    }
    export class SectionModel {
        public TabName: string;
        public SectionName: string;
    }
    export class ButtonViewModel {
        public label: string;
        public ctrl: any;
        public attr: any;
        public reqLevel: string;
        public isClicked: KnockoutObservable<boolean>;
        public className: KnockoutComputed<string>;
        public isRequired: KnockoutComputed<boolean>;
        public disabledState: KnockoutComputed<boolean>;
        public isDisabled: KnockoutComputed<boolean>;
        constructor(public controlName: string) {
            try {
                this.ctrl = Xrm.Page.ui.controls.get(controlName);
                this.attr = Xrm.Page.getAttribute(controlName);
                this.label = this.ctrl.getLabel();
                this.reqLevel = this.attr.getRequiredLevel();
                this.isClicked = ko.observable(this.attr.getValue());
                this.disabledState = this.ctrl.getDisabled();
                this.className = ko.computed(() => {
                    return (this.isClicked() ? 'clicked' : 'unclicked') + this.reqClassName() + this.disabledClassName();
                });
                this.isRequired = ko.computed(() => {
                    return (this.reqLevel == 'required');
                });
                this.isDisabled = ko.computed(function () {
                    return (this.disabledState == 'disabled');
                });
            }
            catch (ex) {
                console.log('Error on geting Xrm attribue', controlName, ex);
            }
        }
        public reqClassName(): string {
            if (this.reqLevel == 'none')
                return '';
            else
                return ' ' + this.reqLevel;
        }
        public disabledClassName(): string {
            if (this.disabledState)
                return ' disabled';
            else
                return '';
        }
        public registerClick() {
            this.isClicked(!this.isClicked());
            this.setValue(this.controlName, this.isClicked());
        };

        public setValue(controlName, value) {
            try {
                this.attr.setValue(value);
                this.attr.setSubmitMode("always");
            }
            catch (e) {
                console.log("Error: setValue", controlName, e.message);
            }
        }
    }
};
