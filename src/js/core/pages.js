(function(){

    var APP_CONTENT_SELECTOR  = '#AppContent';

    var Pages = function() {}

    Pages.instances = {};

    Pages.activePage = function(pageId) {

        var $content = $(APP_CONTENT_SELECTOR);
        var $page = $content.find('#' + pageId);

        if ($page.length === 0)
            return false;

        $content.find('.app-page.active').removeClass('active');
        $page.addClass('active');

        var $menu = $('.item[data-page="' + pageId + '"]');
        if ($menu.length === 1) {

            var $menuContext = $menu.closest('.list');
            $menuContext.find('.item.active').removeClass('active');

            $menu.addClass('active');
        }

        return true;
    };

    Pages.createPage = function(pageName) {

        const pageConstructor = App.Pages[pageName];

        if (pageConstructor === undefined)
            throw new Error('Page "' + pageName + '" not found.');

        if (Pages.instances[pageName] !== undefined)            
            throw new Error('An instance of the page ' + pageName + ' already exists.');

        var $content = $(APP_CONTENT_SELECTOR);

        if ($content.find('#' + pageName).length > 0) {

            Pages.activePage(pageName);
            return false;
        }

        var $page = $('<div class="app-page"></div>');
        $page.attr('id', pageName);
        
        $content.append($page);

        Pages.instances[pageName] = new pageConstructor($page[0]);

        return true;
    };

    App.Utils.Namespace.CreateIfNotExists('App.Utils').Pages = Pages;
})();