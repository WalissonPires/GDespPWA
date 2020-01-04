class AppFactory {
    /**
     * React-like createElement function so we can use JSX in our TypeScript/JavaScript code.
     */
    createElement(tag, attrs, children) {
        if (tag instanceof Function) {
            var args = Object.assign({}, attrs);
            args.children = children;
            var component = new tag(args);
            return component.render();
        }
        var element = document.createElement(tag);
        for (let name in attrs) {
            if (name && attrs.hasOwnProperty(name)) {
                var value = attrs[name];
                if (value === true) {
                    element.setAttribute(name, name);
                }
                else if (value !== false && value != null) {
                    element.setAttribute(name, value.toString());
                }
            }
        }
        for (let i = 2; i < arguments.length; i++) {
            let child = arguments[i];
            if (child === null || child === undefined)
                continue;
            if (Array.isArray(child)) {
                for (const childItem of child) {
                    element.appendChild(childItem.nodeType == null ?
                        document.createTextNode(childItem.toString()) : childItem);
                }
            }
            else {
                element.appendChild(child.nodeType == null ?
                    document.createTextNode(child.toString()) : child);
            }
        }
        return element;
    }
}
/**
 * Basic services available throughout YetaWF.
 */
var React = new AppFactory();
//# sourceMappingURL=jsx-factory.js.map