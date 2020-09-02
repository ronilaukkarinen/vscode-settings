"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UIElement {
    constructor() {
        this.element_name = "";
        this.element_location = "";
        this.color = "";
        this.icon_name = "";
        this.cta_text = "";
    }
    static transformKpmItemToUIElement(kpmItem) {
        const cta_text = kpmItem.description || kpmItem.tooltip;
        return this.buildUIElement(kpmItem.name, kpmItem.location, kpmItem.interactionIcon, cta_text, kpmItem.color);
    }
    static buildUIElement(element_name, element_location, icon_name, cta_text, color) {
        const uiEl = new UIElement();
        uiEl.color = color;
        uiEl.cta_text = cta_text;
        uiEl.element_location = element_location;
        uiEl.element_name = element_name;
        uiEl.icon_name = icon_name;
        return uiEl;
    }
}
exports.default = UIElement;
//# sourceMappingURL=UIElement.js.map