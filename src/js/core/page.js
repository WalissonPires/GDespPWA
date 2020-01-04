const APP_CONTENT_SELECTOR = '#AppContent';
export class Pages {
    static activePage(pageId) {
        const $content = $(APP_CONTENT_SELECTOR);
        const $page = $content.find('#' + pageId);
        if ($page.length === 0)
            return false;
        $content.find('.app-page.active').removeClass('active');
        $page.addClass('active');
        const $menu = $('.item[data-page="' + pageId + '"]');
        if ($menu.length === 1) {
            const $menuContext = $menu.closest('.list');
            $menuContext.find('.item.active').removeClass('active');
            $menu.addClass('active');
        }
        return true;
    }
    static createPage(pageName) {
        const pageConstructor = Pages.constructos[pageName];
        if (pageConstructor === undefined)
            throw new Error('Page "' + pageName + '" not found.');
        if (Pages.instances[pageName] !== undefined)
            throw new Error('An instance of the page ' + pageName + ' already exists.');
        const $content = $(APP_CONTENT_SELECTOR);
        if ($content.find('#' + pageName).length > 0) {
            Pages.activePage(pageName);
            return false;
        }
        const $page = $('<div class="app-page"></div>');
        $page.attr('id', pageName);
        $content.append($page);
        Pages.instances[pageName] = new pageConstructor($page[0]);
        return true;
    }
}
Pages.instances = {};
Pages.constructos = {};
//# sourceMappingURL=page.js.map