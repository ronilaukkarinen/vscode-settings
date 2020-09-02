"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManager = void 0;
const models_1 = require("../model/models");
const Util_1 = require("../Util");
const fileIt = require("file-it");
const fs = require("fs");
const os = require("os");
class EventManager {
    constructor() { }
    static getInstance() {
        if (!EventManager.instance) {
            EventManager.instance = new EventManager();
        }
        return EventManager.instance;
    }
    storeEvent(event) {
        fileIt.appendJsonFileSync(Util_1.getPluginEventsFile(), event);
    }
    /**
     *
     * @param type i.e. window | mouse | etc...
     * @param name i.e. close | click | etc...
     * @param description
     */
    createCodeTimeEvent(type, name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const nowTimes = Util_1.getNowTimes();
            const event = new models_1.CodeTimeEvent();
            event.timestamp = nowTimes.now_in_sec;
            event.timestamp_local = nowTimes.local_now_in_sec;
            event.type = type;
            event.name = name;
            event.description = description;
            event.hostname = yield Util_1.getHostname();
            this.storeEvent(event);
        });
    }
}
exports.EventManager = EventManager;
//# sourceMappingURL=EventManager.js.map