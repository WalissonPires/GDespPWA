
export function jsxRaw(html: string, wrapperTag: string = 'div') {

    let $el = $(html);

    if ($el.length == 2)
        $el = $(`<${wrapperTag}></${wrapperTag}>`).append($el);

    return $el[0];
}