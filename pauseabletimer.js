"use strict";
exports.__esModule = true;
var Rx_1 = require("rxjs/Rx");
var Subject_1 = require("rxjs/Subject");
var IntervalState;
(function (IntervalState) {
    IntervalState[IntervalState["Countdown"] = 0] = "Countdown";
    IntervalState[IntervalState["Countup"] = 1] = "Countup";
    IntervalState[IntervalState["Completed"] = 2] = "Completed";
})(IntervalState = exports.IntervalState || (exports.IntervalState = {}));
var Index = /** @class */ (function () {
    function Index() {
        var _this = this;
        this.paused = false;
        this.initializeTimer();
        this.getStart().addEventListener('click', function () { return _this.start(); });
        this.getPause().addEventListener('click', function () { return _this.pause(); });
        this.getReset().addEventListener('click', function () { return _this.reset(); });
    }
    Index.prototype.initializeTimer = function () {
        var source = Rx_1.Observable.create(function (observer) {
            observer.next(Rx_1.Observable.timer(0, 500)
                .startWith(20)
                .map(function (val) { IntervalState.Countdown, val--; }));
            observer.next(Rx_1.Observable.timer(0, 500)
                .map(function (val) { IntervalState.Countup, val++; }));
        }).concat().publish();
        this.pauser = new Subject_1.Subject();
        this.publication = this.pauser
            .switchMap(function (paused) { return (paused == true) ? Rx_1.Observable.never() : source; })
            .take(40);
        this.subscribeTimer();
    };
    Index.prototype.subscribeTimer = function () {
        this.publication.subscribe(function (e) {
            console.log(e);
        }, function (err) {
            console.log(err);
        }, function () {
            console.log("Timer completed!");
        });
    };
    Index.prototype.start = function () {
        this.getStart().setAttribute('disabled', 'true');
        this.source.connect();
        console.log("start");
        this.pauser.next(false);
    };
    Index.prototype.pause = function () {
        this.paused = (this.paused) ? false : true;
        this.getPause().innerHTML = (this.paused) ? 'UNPAUSE' : 'PAUSE';
        this.pauser.next(this.paused);
    };
    Index.prototype.reset = function () {
        this.getStart().setAttribute('disabled', 'false');
        //this.pauser.next(true);
    };
    Index.prototype.getStart = function () {
        return document.getElementById('start');
    };
    Index.prototype.getPause = function () {
        return document.getElementById('pause');
    };
    Index.prototype.getReset = function () {
        return document.getElementById('reset');
    };
    return Index;
}());
exports.Index = Index;
exports["default"] = new Index();
