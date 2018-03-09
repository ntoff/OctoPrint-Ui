/*
 * View model for OctoPrint-Ui
 *
 * Author: ntoff
 * License: AGPLv3
 */
$(function() {
    function UiViewModel(parameters) {
        var self = this;
        
        self.loginState = parameters[0];
        self.controlState = parameters[1];
        self.settings = parameters[2];
        self.printerState = parameters[3];

        /*
        self.isOperational = ko.observable();
        self.isPrinting = ko.observable();
        self.isPaused = ko.observable();
        self.loginState.isUser = ko.observable();
        */

        self.sidefeedRate = ko.observable(100);
        self.sideflowRate = ko.observable(100);
        self.sideFanPwm = ko.observable(255);
        self.sideDistance = ko.observable(10);

        self.sideExtrusionAmount = ko.observable(10);
        self.tools = ko.observableArray([]);

        self.sideDistances1 = ko.observableArray([0.01, 0.1, 1, 10]);
        self.sideDistances2 = ko.observableArray([5, 50, 100, 150]);
        
        self.sideFanPerc = ko.pureComputed(function() {
            return (Math.round(self.sideFanPwm() / 255 * 100) + '%');
        });
        self.sendCenterCommand = function() {
                console.log("Here's where things get awkward...\n\nYou see, you've pressed a button expecting a result, and the only result is no result (well, not no result, but not much of one).\n\nThe only thing I have to offer you for your curiosity, and your willingness to press a button that has no clear indication of what it does, is this long winded console message. Have a nice day, may all your prints be successful and your spools be tangle free.\n\n")
        };

        self.sendFanCommand = function () {
            OctoPrint.control.sendGcode("M106 S" + self.sideFanPwm());
        };
        self.sendFanOffCommand = function () {
            OctoPrint.control.sendGcode("M106 S0");
        };
        self.sendMotorsOffCommand = function () {
            OctoPrint.control.sendGcode("M84");
        };
        self.sendExtrudeCommand = function () {
            self._sendECommand(1);
        };
        self.sendRetractCommand = function () {
            self._sendECommand(-1);
        };
        self._sendECommand = function (dir) {
            var length = self.sideExtrusionAmount() || self.settings.printer_defaultExtrusionLength();
            OctoPrint.printer.extrude(length * dir);
        };
        self.sendHomeCommand = function(axis){
            OctoPrint.printer.home(axis);
        }
        self.sendFeedRateCommand = function(){
            OctoPrint.control.sendGcode("M220 S" + self.sidefeedRate());
        }
        self.sendFlowRateCommand = function(){
            OctoPrint.control.sendGcode("M221 S" + self.sideflowRate());
        }
        self.resetPercentage = function(valueToReset){
            if (valueToReset === "feedRate") {
                self.sidefeedRate(100);
                OctoPrint.control.sendGcode("M220 S" + self.sidefeedRate());
            }
            else if (valueToReset === 'flowRate') {
                self.sideflowRate(100);
                OctoPrint.control.sendGcode("M221 S" + self.sideflowRate());
            }
        }
        self.sendJogCommand = function (axis, multiplier, distance) {
            if (typeof distance === "undefined")
                distance = self.sideDistance();
            if (self.settings.printerProfiles.currentProfileData() && self.settings.printerProfiles.currentProfileData()["axes"] && self.settings.printerProfiles.currentProfileData()["axes"][axis] && self.settings.printerProfiles.currentProfileData()["axes"][axis]["inverted"]()) {
                multiplier *= -1;
            }

            var data = {};
            data[axis] = distance * multiplier;
            OctoPrint.printer.jog(data);
        };
        self.stripDistanceDecimal = function(distance) {
            return distance.toString().replace(".", "");
        };
        
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: UiViewModel,
        dependencies: [ "loginStateViewModel", "controlViewModel","settingsViewModel", "printerStateViewModel" ],
        elements: [ "#sidebar_plugin_ui_wrapper" ]
    });
});
