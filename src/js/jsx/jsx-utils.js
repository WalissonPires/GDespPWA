export function jsxRaw(html, wrapperTag = 'div') {
    let $el = $(html);
    if ($el.length == 2)
        $el = $(`<${wrapperTag}></${wrapperTag}>`).append($el);
    return $el[0];
}
//# sourceMappingURL=jsx-utils.js.map