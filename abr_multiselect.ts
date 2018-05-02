namespace XRMMultiselect {
    export class Controller {
        public myButtons: Array<ButtonViewModel>;
        constructor() {
            this.onLoad();
        }
        public onLoad() {
            this.myButtons = [];
            let query = window.location.search.substring(1);
            if (query != null && query.split("=").length > 1) {
                let elements = query.split("=")[1];
                elements = decodeURIComponent(elements);
                let controls = elements.split(";");
                for (var i in controls) {
                    if (controls[i] != null)
                        this.myButtons.push(new ButtonViewModel(controls[i].trim()));
                }
            }

            window.addEventListener("keydown", function (event) {
                if (event.ctrlKey == true && event.which == 83 && event.shiftKey == false) {
                    event.preventDefault();
                    (<any>window.parent).Xrm.Page.data.save();
                }
            });
        }
    }
    export class ButtonViewModel {
        public label: string;
        public ctrl: any;
        public attr: any;
        public reqLevel: string;
        public isClicked: KnockoutObservable<boolean>;
        public className: KnockoutComputed<string>;
        public isRequired: KnockoutComputed<boolean>;
        constructor(public controlName: string) {
            try {
                this.ctrl = (<any>window.parent).Xrm.Page.ui.controls.get(controlName);
                this.attr = (<any>window.parent).Xrm.Page.getAttribute(controlName);
                this.label = this.ctrl.getLabel();
                this.reqLevel = this.attr.getRequiredLevel();
                this.isClicked = ko.observable(this.attr.getValue());
                this.disabledState = this.ctrl.getDisabled();
                this.className = ko.computed(() => {
                    return (this.isClicked() ? "clicked" : "unclicked") + this.reqClassName() + _this.disabledClassName();
                });
                this.isRequired = ko.computed(() => {
                    return (this.reqLevel == 'required');
                });
                this.isDisabled = ko.computed(function () {
                    return (_this.disabledState == 'disabled');
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
                return " " +this.reqLevel;
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
