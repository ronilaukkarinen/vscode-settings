// import { KpmItem } from "./models";
// export default class UIElement {
//   element_name: string = "";
//   element_location: string = "";
//   color: string = "";
//   icon_name: string = "";
//   cta_text: string = "";
//   static transformKpmItemToUIElement(kpmItem: KpmItem): UIElement {
//     const cta_text = kpmItem.description || kpmItem.tooltip;
//     return this.buildUIElement(
//       kpmItem.name,
//       kpmItem.location,
//       kpmItem.interactionIcon,
//       cta_text,
//       kpmItem.color
//     );
//   }
//   static buildUIElement(
//     element_name: string,
//     element_location: string,
//     icon_name: string,
//     cta_text: string,
//     color: string
//   ): UIElement {
//     const uiEl: UIElement = new UIElement();
//     uiEl.color = color;
//     uiEl.cta_text = cta_text;
//     uiEl.element_location = element_location;
//     uiEl.element_name = element_name;
//     uiEl.icon_name = icon_name;
//     return uiEl;
//   }
// }
//# sourceMappingURL=UIElement.js.map