(function (execute) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], execute);
    } else if (typeof exports === 'object') {
        execute(require('jquery'));
    } else {
        execute(jQuery);
    }
})(function ($) {
    'use strict';
    var defaults = {
        "width": "300px",
        "hoverColor": "#f8f8f8",
        "paddingLeft": "8px",
        "arrowRight": "8px",
        "maxHeight": "220px"
    };
    var pluginName = 'pickArea', area = cityData, picknum = 0;

    function Plugin(element, options) {
        this.ele = $(element);
        this.identity = null;
        this.format = null;
        this.config = $.extend({}, defaults, options);
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            this.render();
        },
        render: function () {
            var _this = this;
            var htmlStr = '';
            var format = this.config.format;
            var prename = this.ele.attr("name");
            this.identity = this.getRandomStr();
            this.ele.addClass(this.identity);
            var setFormat = null;
            var contentStr = null;
            if (format && format != "") {
                setFormat = format;
            } else if ((prename && prename != "" && !format) || (prename && prename != "" && format && format == "")) {
                setFormat = prename;
            } else {
                contentStr = '<div class="pick-show">' +
                    '<input type="hidden" value="" class="pick-area" readonly/>' +
                    '<span class="pick-province">-</span><i>/</i>' +
                    '<span class="pick-city">-</span><i>/</i>' +
                    '<span class="pick-county">-</span>' +
                    '<em class="pick-arrow down"></em>' +
                    '</div>' +
                    '<ul class="pick-list">' +

                    '</ul>';
                this.format = "p/c/c";
            }
            if (setFormat) {
                var slash = 0, arrFor = setFormat.split(""), strSpan = "", areaArr = setFormat.split("/");
                for (var format_i = 0; format_i < arrFor.length; format_i++) {
                    if (arrFor[format_i] == "/") {
                        slash++;
                    }
                }
                if (setFormat.match("province")) {
                    if (slash == 0) {
                        strSpan = '<span class="pick-province">-</span>';
                        this.format = "p";
                    } else if (slash == 1) {
                        strSpan = '<span class="pick-province">-</span>' +
                            '<i>/</i>' +
                            '<span class="pick-city">-</span>';
                        this.format = "p/c";
                    } else if (slash == 2) {
                        strSpan = '<span class="pick-province">-</span>' +
                            '<i>/</i>' +
                            '<span class="pick-city">-</span>' +
                            '<i>/</i>' +
                            '<span class="pick-county">-</span>';
                        this.format = "p/c/c";
                    }
                    contentStr = '<div class="pick-show">' +
                        '<input type="hidden" value="" class="pick-area" readonly/>' +
                        strSpan +
                        '<em class="pick-arrow down"></em>' +
                        '</div>' +
                        '<ul class="pick-list">' +
                        '</ul>';
                } else {
                    if (slash == 0) {
                        strSpan = '<span class="pick-province">' + areaArr[0] + '</span>';
                        this.format = "p";
                    } else if (slash == 1) {
                        strSpan = '<span class="pick-province">' + areaArr[0] + '</span>' +
                            '<i>/</i>' +
                            '<span class="pick-city">' + areaArr[1] + '</span>';
                        this.format = "p/c";
                    } else if (slash == 2) {
                        strSpan = '<span class="pick-province">' + areaArr[0] + '</span>' +
                            '<i>/</i>' +
                            '<span class="pick-city">' + areaArr[1] + '</span>' +
                            '<i>/</i>' +
                            '<span class="pick-county">' + areaArr[2] + '</span>';
                        this.format = "p/c/c";
                    }
                    contentStr = '<div class="pick-show">' +
                        '<input type="hidden" value="" class="pick-area" readonly/>' +
                        strSpan +
                        '<em class="pick-arrow down"></em>' +
                        '</div>' +
                        '<ul class="pick-list">' +
                        '</ul>';
                }
            }
            this.ele.append(contentStr);
            if (picknum == 1) {
                $("body").append('<input type="hidden" class="pick-area-hidden" value="">');
                $("body").append('<input type="hidden" class="pick-area-dom" value="">');
            }
            if (this.config.paddingLeft) {
                this.ele.find(".pick-show").css({
                    "padding-left": parseInt(this.config.paddingLeft) + "px",
                    "padding-right": parseInt(this.config.arrowRight) + 16 + "px"
                });
            }
            if (this.config.arrowRight) {
                this.ele.find(".pick-arrow").css("right", parseInt(this.config.arrowRight) + "px");
            }
            if (this.config.width) {
                this.ele.css({"width": parseInt(this.config.width) + "px"});
                this.ele.find(".pick-list").css({"width": parseInt(this.config.width) - 2 + "px"});
                var checkNum = null;
                if (this.format == "p/c/c") {
                    checkNum = 3;
                } else if (this.format == "p/c") {
                    checkNum = 2;
                } else if (this.format == "p") {
                    checkNum = 1;
                }
                this.ele.find(".pick-show span").css({"max-width": (parseInt(this.config.width) - parseInt(this.config.paddingLeft) - parseInt(this.config.arrowRight) - 16 - this.ele.find("i").outerWidth() * (checkNum - 1) - 12 * checkNum - 10 ) / checkNum})
            }
            if (this.config.display) {
                this.ele.css({"display": this.config.display});
            }
            if (this.config.float) {
                this.ele.css({"float": this.config.float});
            }
            if (this.config.arrowColor) {
                this.ele.find(".pick-arrow").css({"border-color": this.config.arrowColor + " transparent transparent transparent"});
            }
            if (this.config.borderColor) {
                this.ele.find(".pick-show").css("border-color", this.config.borderColor);
            }
            if (this.config.listBdColor) {
                this.ele.find(".pick-list").css("border-color", this.config.listBdColor);
            }
            if (this.config.color) {
                this.ele.find(".pick-show span,.pick-show i").css("color", this.config.color);
            }
            if (this.config.height) {
                this.ele.find(".pick-show").css({
                    "height": parseInt(this.config.height) + "px",
                    "line-height": parseInt(this.config.height) + "px"
                });
                this.ele.find(".pick-list").css({"line-height": parseInt(this.config.height) + "px"});
                this.ele.find(".pick-arrow").css({"top": Math.floor((parseInt(this.config.height) - 8) / 2) + "px"});
                this.ele.find(".pick-show span").css({"margin-top": Math.floor((parseInt(this.config.height) - 24) / 2) + "px"});
            }
            if (this.config.fontSize) {
                this.ele.css({"font-size": parseInt(this.config.fontSize) + "px"})
            }
            if (this.config.maxHeight) {
                this.ele.find(".pick-list").css({"max-height": parseInt(this.config.maxHeight) + "px"})
            }
            $("." + this.identity).on("mouseenter", ".pick-list li,.pick-show span", function () {
                $(this).css("background", _this.config.hoverColor);
            }).on("mouseleave", ".pick-list li,.pick-show span", function () {
                if (!$(this).attr("class").match("pressActive")) {
                    if (!$(this).hasClass("pick-selectedLi")) {
                        $(this).css("background", "#fff");
                    }
                }
            });
            this.ele.find(".pick-province").click(function (e) {
                var e = e || event;
                e.stopPropagation();
                $(this).parents("body").find(".pick-area span").removeClass("pressActive").css("background", "#fff");
                $(this).parents("body").find(".pick-list").hide();
                $(this).addClass("pressActive").css("background", _this.config.hoverColor).siblings("span").removeClass("pressActive").css("background", "#fff");
                $(this).siblings(".pick-arrow").removeClass('down').addClass('up');
                _this.createProvince(e);
            });
            this.ele.find(".pick-city").click(function (e) {
                var e = e || event;
                e.stopPropagation();
                if (_this.ele.find(".pick-province").html() != "-") {
                    $(this).parents("body").find(".pick-area span").removeClass("pressActive").css("background", "#fff");
                    $(this).parents("body").find(".pick-list").hide();
                    $(this).addClass("pressActive").css("background", _this.config.hoverColor).siblings("span").removeClass("pressActive").css("background", "#fff");
                    $(this).siblings(".pick-arrow").removeClass('down').addClass('up');
                    _this.createCity(e);
                } else {
                    $("body").find(".pick-area").not("." + _this.identity).find(".pick-list").hide();
                    $(this).siblings(".pick-arrow").removeClass('up').addClass('down');
                    $("body").find(".pick-area").not("." + _this.identity).find("span").removeClass("pressActive").css("background", "#fff");
                }
            });
            this.ele.find(".pick-county").click(function (e) {
                var e = e || event;
                e.stopPropagation();
                if (_this.ele.find(".pick-city").html() != "-") {
                    $(this).parents("body").find(".pick-area span").removeClass("pressActive").css("background", "#fff");
                    $(this).parents("body").find(".pick-list").hide();
                    $(this).addClass("pressActive").css("background", _this.config.hoverColor).siblings("span").removeClass("pressActive").css("background", "#fff");
                    $(this).siblings(".pick-arrow").removeClass('down').addClass('up');
                    _this.createCounty(e);
                } else {
                    $("body").find(".pick-area").not("." + _this.identity).find(".pick-list").hide();
                    $(this).siblings(".pick-arrow").removeClass('up').addClass('down');
                    $("body").find(".pick-area").not("." + _this.identity).find("span").removeClass("pressActive").css("background", "#fff");
                }
            });
            this.ele.find(".pick-show").click(function (e) {
                var e = e || event;
                e.stopPropagation();
                if ($(this).next(".pick-list").css("display") == "block") {
                    _this.ele.find(".pressActive").removeClass("pressActive").css("background", "#fff");
                    _this.ele.find(".pick-list").html("").hide();
                    $(this).siblings(".pick-arrow").removeClass('down').addClass('up');
                } else {
                    $(".pick-list").scrollTop(0);
                    $(this).parents("body").find(".pick-area span").removeClass("pressActive").css("background", "#fff");
                    $(this).parents("body").find(".pick-list").hide();
                    $(this).siblings(".pick-arrow").removeClass('down').addClass('up');
                    _this.ele.find(".pick-province").addClass("pressActive").css("background", _this.config.hoverColor);
                    _this.createProvince(e);
                }
            })
        },
        createProvince: function (e) {
            var _this = this;
            var proStr = '';
            var selPro = '';
            if (this.ele.find(".pick-province").html != "") {
                selPro = this.ele.find(".pick-province").html();
            }
            for (var i = 0; i < area.length; i++) {
                if (selPro == area[i].name) {
                    proStr += '<li class="ulli pick-selectedLi" style="background:' + this.config.hoverColor + ';color:#333;font-weight:bold;">' + area[i].name + '</li>';
                } else {
                    proStr += '<li class="ulli">' + area[i].name + '</li>';
                }
            }
            this.ele.find(".pick-list").html("").append(proStr).show();
            this.listHide();
            this.ele.find(".pick-list li").css({"padding-left": parseInt(this.config.paddingLeft) + "px"});
            this.ele.find(".pick-list li").click(function (event) {
                event.stopPropagation();
                _this.setVal(_this, this, "pro")
            })
        },
        createCity: function (e) {
            var _this = this, setPro = '', cityJson = "", cityStr = '', selCity = '';
            setPro = this.ele.find(".pick-province").html();
            if (this.ele.find(".pick-city").html != "") {
                selCity = this.ele.find(".pick-city").html();
            }
            for (var i = 0; i < area.length; i++) {
                if (setPro == area[i].name) {
                    cityJson = area[i].provinces;
                }
            }
            if (cityJson.length != 0) {
                for (var j = 0; j < cityJson.length; j++) {
                    if (selCity == cityJson[j].name) {
                        cityStr += '<li class="ulli pick-selectedLi" style="background:' + this.config.hoverColor + ';color:#333;font-weight:bold;">' + cityJson[j].name + '</li>';
                    } else {
                        cityStr += '<li class="ulli">' + cityJson[j].name + '</li>';
                    }
                }
                this.ele.find(".pick-list").html("").append(cityStr).show();
                this.listHide();
                this.ele.find(".pick-list li").css({"padding-left": parseInt(this.config.paddingLeft) + "px"});
                this.ele.find(".pick-list li").click(function (event) {
                    event.stopPropagation();
                    _this.setVal(_this, this, "city")
                })
            } else {
                this.ele.find(".pick-list").html("").hide();
                this.ele.find(".pick-arrow").removeClass('up').addClass('down');
                this.ele.find(".pick-show span").removeClass("pressActive");
            }
        },
        createCounty: function (e) {
            var _this = this, setPro = "", setCity = '', cityJson = "", countyJson = "", countyStr = '', selCounty = '';
            setPro = this.ele.find(".pick-province").html();
            setCity = this.ele.find(".pick-city").html();
            if (setCity == "-") {
                this.ele.find(".pick-show span").removeClass("pressActive");
                this.ele.find(".pick-show").removeClass('up').addClass('down');
                return;
            } else {
                if (this.ele.find(".pick-county").html != "") {
                    selCounty = this.ele.find(".pick-county").html();
                }
                for (var i = 0; i < area.length; i++) {
                    if (setPro == area[i].name) {
                        cityJson = area[i].provinces;
                    }
                }
                for (var j = 0; j < cityJson.length; j++) {
                    if (setCity == cityJson[j].name) {
                        countyJson = cityJson[j].cities;
                    }
                }
                for (var t = 0; t < countyJson.length; t++) {
                    if (selCounty == countyJson[t].name) {
                        countyStr += '<li class="ulli pick-selectedLi" style="background:' + this.config.hoverColor + ';color:#333;font-weight:bold;">' + countyJson[t].name + '</li>';
                    } else {
                        countyStr += '<li class="ulli">' + countyJson[t].name + '</li>';
                    }
                }
                this.ele.find(".pick-list").html("").append(countyStr).show();
                this.listHide();
                this.ele.find(".pick-list li").css({"padding-left": parseInt(this.config.paddingLeft) + "px"});
                this.ele.find(".pick-list li").click(function (event) {
                    event.stopPropagation();
                    _this.setVal(_this, this, "county")
                });
            }
        },
        setVal: function (_this, aim, s) {
            var _this = this;
            _this.ele.find(".pressActive").html($(aim).html());
            if (s == "pro") {
                _this.ele.find(".pick-city").html("-");
                _this.ele.find(".pick-county").html("-");
                _this.ele.find(".pick-province").removeClass("pressActive").css("background", "#fff");
                _this.ele.find(".pick-city").addClass("pressActive").css("background", _this.config.hoverColor);
                _this.ele.find("input[type=hidden].pick-area").val(_this.ele.find(".pick-province").html());
                if (this.format == "p") {
                    _this.ele.find(".pick-list").hide();
                    _this.ele.find(".pick-arrow").removeClass('up').addClass('down');
                } else {
                    this.createCity();
                }
                $(".pick-list").scrollTop(0);
                $(".pick-area-hidden").val(_this.ele.find(".pick-province").html());
                this.setBack(this);
            } else if (s == "city") {
                _this.ele.find(".pick-county").html("-");
                _this.ele.find(".pick-city").removeClass("pressActive").css("background", "#fff");
                _this.ele.find(".pick-county").addClass("pressActive").css("background", _this.config.hoverColor);
                _this.ele.find("input[type=hidden].pick-area").val(_this.ele.find(".pick-province").html() + "/" + _this.ele.find(".pick-city").html());
                if (this.format == "p/c") {
                    _this.ele.find(".pick-list").hide();
                    _this.ele.find(".pick-arrow").removeClass('up').addClass('down');
                } else {
                    this.createCounty();
                }
                $(".pick-list").scrollTop(0);
                $(".pick-area-hidden").val(_this.ele.find(".pick-province").html() + " " + _this.ele.find(".pick-city").html());
                this.setBack(this);
            } else if (s == "county") {
                _this.ele.find(".pick-list").hide();
                _this.ele.find(".pick-arrow").removeClass('up').addClass('down');
                _this.ele.find(".pick-county").removeClass("pressActive").css("background", "#fff");
                _this.ele.find("input[type=hidden].pick-area").val(_this.ele.find(".pick-province").html() + "/" + _this.ele.find(".pick-city").html() + "/" + _this.ele.find(".pick-county").html());
                $(".pick-list").scrollTop(0);
                $(".pick-area-hidden").val(_this.ele.find(".pick-province").html() + " " + _this.ele.find(".pick-city").html() + " " + _this.ele.find(".pick-county").html());
                this.setBack(this);
            }
        },
        listHide: function () {
            $(document).one("click", function () {
                $(".pick-list").html("").hide();
                $(".pick-show").find(".pick-arrow").removeClass('up').addClass('down');
                $(".pick-show span").removeClass("pressActive").css("background", "#fff");
            });
        },
        setBack: function (_this) {
            $(".pick-area-dom").val(_this.identity);
            if (typeof _this.config.getVal === "function") {
                _this.config.getVal();
            }
        },
        getRandomStr: function () {
            var str = "",
                alphabet = ['A', 'B', "C", "D", "E", "F", "G", "H", "I", "G", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            for (var i = 0; i < 26; i++) {
                str += alphabet[parseInt(Math.random() * 26)];
            }
            str += Date.parse(new Date());
            return str;
        }
    };
    $.fn[pluginName] = function (options) {
        picknum++;
        return this.each(function (index) {
            new Plugin(this, options);
        })
    };
});