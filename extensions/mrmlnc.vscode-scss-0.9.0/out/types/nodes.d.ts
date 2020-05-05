export declare enum NodeType {
    Undefined = 0,
    Identifier = 1,
    Stylesheet = 2,
    Ruleset = 3,
    Selector = 4,
    SimpleSelector = 5,
    SelectorInterpolation = 6,
    SelectorCombinator = 7,
    SelectorCombinatorParent = 8,
    SelectorCombinatorSibling = 9,
    SelectorCombinatorAllSiblings = 10,
    SelectorCombinatorShadowPiercingDescendant = 11,
    Page = 12,
    PageBoxMarginBox = 13,
    ClassSelector = 14,
    IdentifierSelector = 15,
    ElementNameSelector = 16,
    PseudoSelector = 17,
    AttributeSelector = 18,
    Declaration = 19,
    Declarations = 20,
    Property = 21,
    Expression = 22,
    BinaryExpression = 23,
    Term = 24,
    Operator = 25,
    Value = 26,
    StringLiteral = 27,
    URILiteral = 28,
    EscapedValue = 29,
    Function = 30,
    NumericValue = 31,
    HexColorValue = 32,
    MixinDeclaration = 33,
    MixinReference = 34,
    VariableName = 35,
    VariableDeclaration = 36,
    Prio = 37,
    Interpolation = 38,
    NestedProperties = 39,
    ExtendsReference = 40,
    SelectorPlaceholder = 41,
    Debug = 42,
    If = 43,
    Else = 44,
    For = 45,
    Each = 46,
    While = 47,
    MixinContent = 48,
    Media = 49,
    Keyframe = 50,
    FontFace = 51,
    Import = 52,
    Namespace = 53,
    Invocation = 54,
    FunctionDeclaration = 55,
    ReturnStatement = 56,
    MediaQuery = 57,
    FunctionParameter = 58,
    FunctionArgument = 59,
    KeyframeSelector = 60,
    ViewPort = 61,
    Document = 62,
    AtApplyRule = 63,
    CustomPropertyDeclaration = 64,
    CustomPropertySet = 65,
    ListEntry = 66
}
export interface INode {
    type: NodeType;
    offset: number;
    length: number;
    accept(node: any): boolean;
    getName(): string;
    getValue(): INode;
    getDefaultValue(): INode;
    getText(): string;
    getParameters(): INode;
    getIdentifier(): INode;
    getParent(): INode;
    getChildren(): INode[];
    getChild(index: number): INode;
    getSelectors(): INode;
}
