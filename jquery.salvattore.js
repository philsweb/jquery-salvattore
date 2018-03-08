/*!
 Salvattore jQuery Plugin
 @name  jquery.salvattore.js
 @description a jQuery plugin for using Salvattore (https://salvattore.js.org)
 @version 1.0.0
 @copyright (c) 2018 Philipp Nikolajev (https://nikolajev.ee)
 @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
(function ($) {
    $.fn.salvattoreInit = function (options) {

        "use strict";

        var minTileWidth = (options === undefined || options.minTileWidth === undefined) ? 100 : options.minTileWidth,
            maxTileWidth = (options === undefined || options.maxTileWidth === undefined) ? 150 : options.maxTileWidth,
            maxColumnAmount = (options === undefined || options.maxColumnAmount === undefined) ? 10 : options.maxColumnAmount,
            tilePaddingX = (options === undefined || options.tilePaddingX === undefined) ? 5 : options.tilePaddingX,
            tilePaddingY = (options === undefined || options.tilePaddingY === undefined) ? 5 : options.tilePaddingY,
            animationDuration = (options === undefined || options.animationDuration === undefined) ? 50 : options.animationDuration,
            fadeInSpeed = (options === undefined || options.fadeInSpeed === undefined) ? 1.5 : options.fadeInSpeed;

        $('body').css('min-width', minTileWidth + tilePaddingX * 2);

        var scrollBarWidth = $.getScrollBarWidth(),
            mediaQueryData = [],
            minColumnWidth = minTileWidth + (tilePaddingX * 2);

        for (var i = 2; i <= maxColumnAmount; i++) {
            mediaQueryData.push(Math.round(minColumnWidth * i + scrollBarWidth));
        }

        function getWindowWidthStep(windowWidth) {
            var state = 1;
            $.each(mediaQueryData, function (key, value) {
                if (windowWidth < value) {
                    return false;
                }
                state++;
            });
            return state;
        }

        function setTilePadding() {
            var windowWidth = $(window).width() + scrollBarWidth,
                tileWidth = $(window).width() / getWindowWidthStep(windowWidth),
                tileContent = $('.tile-content');

            if (tileWidth > maxTileWidth) {
                var padding = Math.round((tileWidth - maxTileWidth) / 2) + 1;

                if (padding < tilePaddingX) {
                    padding = tilePaddingX;
                }

                tileContent.css('padding', tilePaddingY + 'px ' + padding +
                    'px ' + tilePaddingY + 'px ' + padding + 'px');
                return;
            }

            tileContent.css('padding', tilePaddingY + 'px ' + tilePaddingX + 'px ' + tilePaddingY +
                'px ' + tilePaddingX + 'px');
        }

        $(window).resize(function () {
            setTilePadding();
        });


        var mediaQueries = "";

        $.each(mediaQueryData, function (key, value) {
                if (key === 0) {
                    mediaQueries += "@media screen and (max-width:" + (mediaQueryData[key] - 1) + "px){" +
                        ".salvattore[data-columns]::before{content:'" + (key + 1) +
                        " .column.size-1of" + (key + 1) + "';}}";

                    return;
                }

                mediaQueries += "@media screen and (min-width:" + mediaQueryData[(key - 1)] + "px) " +
                    "and (max-width:" + (mediaQueryData[key] - 1) + "px){" +
                    ".salvattore[data-columns]::before{content:'" + (key + 1) + ".column.size-1of" +
                    (key + 1) + "';}}";

                if (key === (mediaQueryData.length - 1)) {
                    mediaQueries += "@media screen and (min-width: " + mediaQueryData[(key)] + "px){" +
                        ".salvattore[data-columns]::before{content:'" + (key + 2) + " .column.size-1of" +
                        (key + 2) + "';}}";
                }

            }
        );

        var mediaQueriesStyle = $('<style>'),
            head = $('head');
        head.prepend(mediaQueriesStyle.append(mediaQueries));

        var columnWidths = "";

        for (i = 1; i <= maxColumnAmount; i++) {
            columnWidths += ".size-1of" + i + "{width: " + jsHelper.round((100 / i), 5) + "%;}";
        }

        var columnWidthsStyle = $('<style>');
        head.prepend(columnWidthsStyle.append(columnWidths));

        function initSalvattore(element) {
            salvattore.registerGrid(element);
            salvattore.rescanMediaQueries()
        }

        return this.each(function () {
            var tileContent = $("<div class='tile-content'/>");
            $(this).children().wrap(tileContent);

            initSalvattore(this);

            $(this).animate({opacity: 1}, animationDuration);

            var columns = $(this).children().length;
            $(this).children().each(function (index1) {
                $(this).children().each(function (index2) {
                    $(this).css({opacity: 0}).delay((index1 + (columns * index2)) * animationDuration).animate(
                        {opacity: 1}, Math.round(animationDuration * fadeInSpeed)
                    );
                });
            });

            setTilePadding();
        });
    };
})(jQuery);