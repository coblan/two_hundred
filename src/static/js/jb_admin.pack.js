/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 60);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var mix_editor = exports.mix_editor = {
    data: function data() {
        return {
            org_value: this.rowData[this.field]
        };
    },
    computed: {
        is_dirty: function is_dirty() {
            return this.rowData[this.field] != this.org_value;
        }
    },
    watch: {
        'rowData._hash': function rowData_hash() {
            this.org_value = this.rowData[this.field];
        }
    },
    methods: {
        on_changed: function on_changed() {
            var value = this.rowData[this.field];
            if (value == this.org_value) {
                this.$emit('on-custom-comp', { name: 'row_changed_undo_act', row: this.rowData });
            } else {
                this.$emit('on-custom-comp', { name: 'row_changed', row: this.rowData });
            }
        }
    }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var lay_datetime = {
    props: ['row', 'head'],
    template: '<div><span v-if=\'head.readonly\' v-text=\'row[head.name]\'></span>\n                    <input type="text" :id="\'id_\'+head.name" v-model="row[head.name]"  :placeholder="head.placeholder">\n            \t\t\t<!--<datetime  v-model="row[head.name]" :id="\'id_\'+head.name"-->\n                        \t<!--:placeholder="head.placeholder"></datetime>-->\n               </div>',
    mounted: function mounted() {
        laydate.render({
            elem: $(this.$el).find('input')[0], //指定元素
            type: 'datetime'
        });
    }
};

Vue.component('com-field-datetime', function (resolve, reject) {
    ex.load_js('/static/lib/laydate/laydate.js', function () {
        resolve(lay_datetime);
    });
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ele_transfer = {
    props: ['row', 'head'],
    template: '<div>\n     <el-transfer v-model="value1" :data="trans_data"></el-transfer>\n     </div>',
    data: function data() {
        return {
            value1: []
        };
    },
    computed: {
        trans_data: function trans_data() {
            return [{ key: 'xx', label: 'bbbb' }];
        }
    }
};
Vue.component('com-field-ele-transfer', ele_transfer);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(54);
var label_shower = {
    props: ['row', 'head'],
    methods: {
        handleCheckChange: function handleCheckChange(data, checked, indeterminate) {
            console.log(data, checked, indeterminate);
            var ls = this.$refs.et.getCheckedKeys();
            ls = ex.filter(ls, function (itm) {
                return itm != undefined;
            });
            this.row[this.head.name] = ls;
        },
        handleNodeClick: function handleNodeClick(data) {
            console.log(data);
        }
    },
    data: function data() {
        return {
            selected: [1, 2],
            // demon 数据
            data: [{
                label: '一级 1',
                children: [{
                    label: '二级 1-1',
                    children: [{
                        label: '三级 1-1-1',
                        pk: 1
                    }]
                }]
            }, {
                label: '一级 2',
                children: [{
                    label: '二级 2-1',
                    children: [{
                        label: '三级 2-1-1',
                        pk: 3
                    }]
                }, {
                    label: '二级 2-2',
                    children: [{
                        label: '三级 2-2-1'
                    }]
                }]
            }, {
                label: '一级 3',
                children: [{
                    label: '二级 3-1',
                    children: [{
                        label: '三级 3-1-1',
                        pk: 2
                    }]
                }, {
                    label: '二级 3-2',
                    children: [{
                        label: '三级 3-2-1'
                    }]
                }]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        };
    },
    template: '<div class="com-field-ele-tree-name-layer">\n        <el-tree ref="et" :data="head.options" :props="defaultProps"\n             @node-click="handleNodeClick"\n             show-checkbox\n             @check-change="handleCheckChange"\n\n             :default-checked-keys="row[head.name]"\n             node-key="value"\n    ></el-tree>\n    </div>',
    //default-expand-all
    computed: {
        label: function label() {
            return this.row['_' + this.head.name + '_label'];
        }
    }
};

Vue.component('com-field-ele-tree', label_shower);
//Vue.component('com-field-ele-tree-name-layer',function(resolve,reject){
//ex.load_css('https://unpkg.com/element-ui/lib/theme-chalk/index.css')
//ex.load_js('https://unpkg.com/element-ui/lib/index.js',function(){
//resolve(label_shower)
//})
//})

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var label_shower = {
    props: ['row', 'head'],
    template: '<div><span v-text=\'label\'></span></div>',
    computed: {
        label: function label() {
            return this.row['_' + this.head.name + '_label'];
        }
    }
};

Vue.component('com-field-label-shower', label_shower);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
__webpack_require__(55);

/*
 * config={
 *    accept:""
 * }
 * */

var field_file_uploader = exports.field_file_uploader = {
    props: ['row', 'head'],
    template: '<div><com-file-uploader-tmp v-model="row[head.name]" :config="head.config" :readonly="head.readonly"></com-file-uploader-tmp></div>'
};

var com_file_uploader = exports.com_file_uploader = {
    props: ['value', 'readonly', 'config'],
    data: function data() {

        return {
            picstr: this.value,
            pictures: this.value ? this.value.split(';') : [],
            crt_pic: ''
        };
    },

    template: '<div class="file-uploader">\n    <div v-if="!readonly">\n        <input v-if="cfg.multiple" v-show="!cfg.com_btn" class="pic-input" type="file" @change="upload_pictures($event)" :accept="cfg.accept" multiple="multiple">\n        <input v-else v-show="!cfg.com_btn" class="pic-input" type="file" @change="upload_pictures($event)" :accept="cfg.accept">\n    </div>\n\n    <div class="wrap">\n           <a v-for="pic in pictures" :href="pic"><span  v-text="pic"></span></a>\n    </div>\n\n     <!--<component v-if="cfg.com_btn && ! readonly" :is="cfg.com_btn" @click.native="browse()"></component>-->\n\n\n\n    </div>',
    mounted: function mounted() {
        var self = this;
        if (this.cfg.sortable) {
            ex.load_js("/static/lib/sortable.min.js", function () {
                new Sortable($(self.$el).find('.sortable')[0], {
                    onSort: function onSort( /**Event*/evt) {
                        self.ajust_order();
                    }
                });
            });
        }
    },
    computed: {
        //res_url:function(){
        //    return this.cfg.upload_url ? this.to: "/_face/upload"
        //},
        cfg: function cfg() {
            var def_config = {
                upload_url: '/d/upload',
                accept: 'image/*',
                multiple: true,
                sortable: true,
                on_click: function on_click(url) {
                    window.open(url, '_blank' // <- This is what makes it open in a new window.
                    );
                }
            };
            if (this.config) {
                //if(! this.config.hasOwnProperty('multiple') || this.config.multiple){
                //    def_config.com_btn='file-uploader-btn-plus'
                //}
                ex.assign(def_config, this.config);
            }

            return def_config;
        }

    },
    watch: {
        value: function value(new_val, old_val) {
            if (this.picstr != new_val) {
                this.picstr = new_val;
                this.pictures = this.value ? this.value.split(';') : [];
            }
            if (!this.picstr) {
                $(this.$el).find('.pic-input').val("");
            }
        }
    },
    methods: {
        browse: function browse() {
            $(this.$el).find('input').click();
        },
        enter: function enter(pic) {
            this.crt_pic = pic;
        },
        out: function out() {
            this.crt_pic = '';
        },
        upload_pictures: function upload_pictures(event) {
            var self = this;
            var file_list = event.target.files;
            if (file_list.length == 0) {
                return;
            }
            var upload_url = this.cfg.upload_url;

            //show_upload()

            cfg.show_load();
            fl.uploads(file_list, upload_url, function (resp) {
                cfg.hide_load();
                if (resp) {
                    if (self.cfg.multiple) {
                        self.add_value(resp);
                    } else {
                        self.set_value(resp);
                    }
                }
                //hide_upload(300)
            });
        },
        set_value: function set_value(value) {
            //@value: [url1,url2]
            var val = value.join(';');
            this.$emit('input', val);
        },
        add_value: function add_value(value) {
            var self = this;
            var real_add = ex.filter(value, function (item) {
                return !ex.isin(item, self.pictures);
            });
            var real_list = self.pictures.concat(real_add);
            var val = real_list.join(';');
            self.$emit('input', val);
        },
        ajust_order: function ajust_order() {
            var list = $(this.$el).find('ul.sortable img');
            var url_list = [];
            for (var i = 0; i < list.length; i++) {
                var ele = list[i];
                url_list.push($(ele).attr('src'));
            }
            var val = url_list.join(';');
            this.picstr = val;
            this.$emit('input', val);
        },
        remove: function remove(pic) {
            var pics = this.picstr.split(';');
            ex.remove(pics, function (item) {
                return pic == item;
            });
            var val = pics.join(';');
            this.$emit('input', val);
        },
        is_image: function is_image(url) {
            var type = this.get_res_type(url);
            return ex.isin(type.toLowerCase(), ['jpg', 'png', 'webp', 'gif', 'jpeg', 'ico']);
        },
        get_res_type: function get_res_type(url) {
            var mt = /[^.]+$/.exec(url);
            if (mt.length > 0) {
                return mt[0];
            } else {
                return "";
            }
        },
        get_res_basename: function get_res_basename(url) {
            var mt = /[^/]+$/.exec(url);
            if (mt.length > 0) {
                return mt[0];
            } else {
                return mt[0];
            }
        }
    }

    //var plus_btn={
    //    props:['accept'],
    //    template:`<div class="file-uploader-btn-plus">
    //        <div class="inn-btn"><span>+</span></div>
    //        <div style="text-align: center">添加文件</div>
    //    </div>`,
    //}
    //Vue.component('file-uploader-btn-plus',plus_btn)

};Vue.component('com-file-uploader-tmp', com_file_uploader);
Vue.component('com-field-plain-file', field_file_uploader);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var pop_table_select = {
    props: ['row', 'head'],
    template: '<div>\n        <span  v-text="label"></span>\n        <span v-if="!head.readonly" class="clickable" @click="open_win"><i class="fa fa-search"></i></span>\n    </div>',
    computed: {
        label: function label() {
            return this.row['_' + this.head.name + '_label'];
        }
    },
    methods: {
        open_win: function open_win() {
            var self = this;
            pop_table_layer(this.row, this.head.table_ctx, function (foreign_row) {

                self.row[self.head.name] = foreign_row.pk;
                self.row['_' + self.head.name + '_label'] = foreign_row._label;
            });
        }
    }
};

Vue.component('com-field-pop-table-select', pop_table_select);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.component('com-field-op-btn', {
    props: ['head'],
    template: '<button @click="operation_call()" class="btn btn-default">\n        <i v-if="head.icon" :class="[\'fa\',head.icon]"></i><span v-text="head.label"></span>\n        </button>',
    methods: {
        operation_call: function operation_call() {
            this.$emit('operation', this.head.name);
        }
    }
});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.component('com-sim-fields', {
    props: {
        heads: '',
        row: '',
        okBtn: {
            default: function _default() {
                return '确定';
            }
        },
        exClass: ''
    },
    data: function data() {
        return {};
    },
    created: function created() {
        if (!this.okBtn) {
            this.okBtn = '确定';
        }
    },
    mixins: [mix_fields_data, mix_nice_validator],
    template: ' <div class="field-panel" style="text-align:center;">\n                <com-table-fields :heads="heads" :row="row"\n                    input-width="23em" label-width="5em"\n                    style="width: 30em;text-align: left;display: inline-block;">\n                    <slot>\n                    <tr>\n                    <td></td>\n                    <td>\n                    <button @click="submit"\n                        style="width: 27em;position: relative;" type="btn"\n                            class="btn btn-primary btn-sm"><span v-text="okBtn"></span></button></td>\n                    </tr>\n                    </slot>\n           </com-table-fields>\n        </div>',
    methods: {
        submit: function submit() {
            if (this.isValid()) {
                this.$emit('submit');
            }
        }
    }
});

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pop_fields_layer = pop_fields_layer;

var _com_pop_fields = __webpack_require__(44);

function pop_fields_layer(row, fields_ctx, callback) {
    // row,head ->//model_name,relat_field

    var heads = fields_ctx.heads;
    var ops = fields_ctx.ops;
    var extra_mixins = fields_ctx.extra_mixins || [];
    var com_fields = window[fields_ctx.fieldsPanel] || _com_pop_fields.com_pop_field;
    var com_id = md5(extra_mixins);
    if (!window['_vue_com_' + com_id]) {
        extra_mixins = ex.map(extra_mixins, function (name) {
            return window[name];
        });
        var com_pop_field_real = $.extend({}, com_fields);
        com_pop_field_real.mixins = com_fields.mixins.concat(extra_mixins);
        Vue.component('com-pop-fields-' + com_id, com_pop_field_real);
        window['_vue_com_' + com_id] = true;
    }

    var pop_id = new Date().getTime();

    self.opened_layer_indx = layer.open({
        type: 1,
        area: ['800px', '500px'],
        title: '详细',
        resize: true,
        resizing: function resizing(layero) {
            var total_height = $('#fields-pop-' + pop_id).parents('.layui-layer').height();
            $('#fields-pop-' + pop_id).parents('.layui-layer-content').height(total_height - 42);
        },
        shadeClose: true, //点击遮罩关闭
        content: '<div id="fields-pop-' + pop_id + '" style="height: 100%;">\n                    <component :is="\'com-pop-fields-\'+com_id" @del_success="on_del()" @sub_success="on_sub_success($event)"\n                    :row="row" :heads="fields_heads" :ops="ops"></component>\n                </div>',
        end: function end() {

            eventBus.$emit('openlayer_changed');
        }
    });

    new Vue({
        el: '#fields-pop-' + pop_id,
        data: {
            row: row,
            fields_heads: heads,
            ops: ops,
            com_id: com_id
        },
        mounted: function mounted() {
            //if(! trigger.head.use_table_row){
            //    var self=this
            //    cfg.show_load()
            //    var dc ={fun:'get_row',model_name:model_name}
            //    dc[relat_field] = trigger.rowData[relat_field]
            //    var post_data=[dc]
            //    ex.post('/d/ajax',JSON.stringify(post_data),function(resp){
            //        self.row = resp.get_row
            //        cfg.hide_load()
            //    })
            //}

        },
        methods: {
            on_sub_success: function on_sub_success(event) {
                // 将新建的row 插入到表格中
                //if(! old_row.pk) {
                //    self.rows.splice(0, 0, new_row)
                //}
                //if(this.head.use_table_row){
                //    var old_row = event.old_row
                //    var new_row=event.new_row
                //    ex.assign(self.row,new_row)
                //}else{
                //    trigger.update_row()
                //}
                callback({ name: 'after_save', new_row: event.new_row, old_row: event.old_row });
                //eventBus.$emit('pop-win-'+pop_id,{name:'after_save',new_row:event.new_row,old_row:event.old_row})
            }
            //on_del:function(){
            //    ex.remove(self.rows,row)
            //    layer.close(self.opened_layer_indx)
            //},
        }
    });

    eventBus.$emit('openlayer_changed');
} /*
  * root 层面创建Vue组件，形成弹出框
  * */


window.pop_fields_layer = pop_fields_layer;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pop_table_layer = pop_table_layer;
/*
 * root 层面创建Vue组件，形成弹出框
 * */

function pop_table_layer(row, table_ctx, callback) {
    // row,head ->//model_name,relat_field


    var pop_id = new Date().getTime();

    var opened_layer_indx = layer.open({
        type: 1,
        area: ['800px', '500px'],
        title: '列表',
        resize: true,
        resizing: function resizing(layero) {
            var total_height = $('#pop-table-' + pop_id).parents('.layui-layer').height();
            $('#pop-table-' + pop_id).parents('.layui-layer-content').height(total_height - 42);
            layer_vue.resize();
            layer_vue.setHeight(total_height - 160);
        },
        shadeClose: true, //点击遮罩关闭
        content: '<div id="pop-table-' + pop_id + '" style="height: 100%;">\n\n            <div class="rows-block flex-v" style="height: 100%">\n                <div class=\'flex\' style="min-height: 3em;" v-if="row_filters.length > 0">\n                    <com-filter class="flex" :heads="row_filters" :search_args="search_args"\n                                @submit="search()"></com-filter>\n                    <div class="flex-grow"></div>\n                </div>\n                <div class="box box-success flex-grow flex-v" >\n                    <div class="table-wraper flex-grow" style="position: relative">\n                    <div style="position: absolute;top:0;right:0;left:0;bottom: 0">\n                     <el-table class="table" ref="e_table"\n                                      :data="rows"\n                                      border\n                                      show-summary\n                                      :fit="false"\n                                      :stripe="true"\n                                      size="mini"\n                                      @sort-change="sortChange($event)"\n                                      @selection-change="handleSelectionChange"\n                                      :summary-method="getSum"\n                                      height="100%"\n                                      style="width: 100%">\n                                <el-table-column\n                                        type="selection"\n                                        width="55">\n                                </el-table-column>\n\n                                <template  v-for="head in heads">\n\n                                    <el-table-column v-if="head.editor"\n                                                     :show-overflow-tooltip="is_show_tooltip(head) "\n                                                     :label="head.label"\n                                                     :sortable="is_sort(head)"\n                                                     :width="head.width">\n                                        <template slot-scope="scope">\n                                            <component :is="head.editor"\n                                                       @on-custom-comp="on_td_event($event)"\n                                                       :row-data="scope.row" :field="head.name" :index="scope.$index">\n                                            </component>\n\n                                        </template>\n\n                                    </el-table-column>\n\n                                    <el-table-column v-else\n                                                     :show-overflow-tooltip="is_show_tooltip(head) "\n                                                     :prop="head.name.toString()"\n                                                     :label="head.label"\n                                                     :sortable="is_sort(head)"\n                                                     :width="head.width">\n                                    </el-table-column>\n\n                                </template>\n\n                            </el-table>\n                     </div>\n\n                    </div>\n                    <div style="margin-top: 10px;">\n                         <el-pagination\n                                @size-change="on_perpage_change"\n                                @current-change="get_page"\n                                :current-page="row_pages.crt_page"\n                                :page-sizes="[20, 50, 100, 500]"\n                                :page-size="row_pages.perpage"\n                                layout="total, sizes, prev, pager, next, jumper"\n                                :total="row_pages.total">\n                        </el-pagination>\n                    </div>\n                </div>\n        </div>\n    </div>'
    });

    var layer_vue = new Vue({
        el: '#pop-table-' + pop_id,
        data: {
            par_row: row,
            //table_ctx:table_ctx,

            heads: table_ctx.heads,
            row_filters: table_ctx.row_filters,
            row_sort: table_ctx.row_sort,
            director_name: table_ctx.director_name,
            row_pages: {},
            rows: [],
            footer: [],
            selected: [],
            del_info: [],
            search_args: {},

            height: 350
        },
        mixins: [mix_table_data, mix_ele_table_adapter],
        mounted: function mounted() {
            this.getRows();
            //this.$refs.com_table.getRows()
            //var self =this
            //setTimeout(function(){
            //     self.$refs.com_table.getRows()
            // },1000)

            var self = this;
            ex.assign(this.op_funs, {
                send_select: function send_select(kws) {
                    //callback({name:'selected',row:kws.row})
                    callback(kws.row);
                    layer.close(opened_layer_indx);
                }
            });
        },
        methods: {
            setHeight: function setHeight(height) {
                this.height = height;
            }
            //on_sub_success:function(event){
            //    callback({name:'selected',row:event.row})
            //    //callback({name:'after_save',new_row:event.new_row,old_row:event.old_row})
            //
            //},

        }
    });
}

window.pop_table_layer = pop_table_layer;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(56);

var mix_ele_table_adapter = {
    methods: {
        is_sort: function is_sort(head) {
            if (ex.isin(head.name, this.row_sort.sortable)) {
                return 'custom';
            } else {
                return false;
            }
        },
        is_show_tooltip: function is_show_tooltip(head) {
            if (head.show_tooltip == undefined) {
                return true;
            } else {
                return head.show_tooltip;
            }
        },
        handleSelectionChange: function handleSelectionChange(val) {
            this.selected = val;
        },
        sortChange: function sortChange(params) {
            //{ column, prop, order }
            var self = this;
            //                this.$refs.e_table.clearSort()
            //                ex.each(this.row_sort.sortable,function(name){
            if (params.prop) {
                if (params.order == 'ascending') {
                    self.search_args._sort = params.prop;
                } else if (params.order == 'descending') {
                    self.search_args._sort = '-' + params.prop;
                }
            } else {
                self.search_args._sort = '';
            }
            this.search();
            //                })
        },

        getSum: function getSum(param) {
            return this.footer;
        },
        on_perpage_change: function on_perpage_change(perpage) {
            this.search_args._perpage = perpage;
            this.search_args._page = 1;
            this.getRows();
        }
    }
};

window.mix_ele_table_adapter = mix_ele_table_adapter;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mix_fields_data = {
    data: function data() {
        return {
            op_funs: {}
        };
    },
    mounted: function mounted() {
        var self = this;
        ex.assign(this.op_funs, {
            save: function save() {
                self.save();
            }
        });
    },
    methods: {
        on_operation: function on_operation(op) {
            var fun_name = op.fun || op.name;
            this.op_funs[fun_name](op.kws);
        },
        get_data: function get_data() {
            this.data_getter(this);
        },
        setErrors: function setErrors(errors) {
            ex.each(this.heads, function (head) {
                if (errors[head.name]) {
                    Vue.set(head, 'error', errors[head.name].join(';'));
                } else if (head.error) {
                    //delete head.error
                    Vue.delete(head, 'error');
                    //Vue.set(head,'error',null)
                }
            });
        },
        dataSaver: function dataSaver(callback) {
            var post_data = [{ fun: 'save_row', row: this.row }];
            ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                callback(resp.save_row);
            });
        },
        save: function save() {
            var self = this;

            this.setErrors({});
            eventBus.$emit('sync_data');

            if (self.before_save() == 'break') {
                return;
            }
            //var loader = layer.load(2)
            cfg.show_load();
            self.dataSaver(function (rt) {
                if (rt.errors) {
                    cfg.hide_load();
                    self.setErrors(rt.errors);
                    self.showErrors(rt.errors);
                } else {
                    cfg.hide_load(2000);
                    self.after_save(rt.row);
                    self.setErrors({});
                }
            });
        },
        before_save: function before_save() {
            return 'continue';
        },
        afterSave: function afterSave(resp) {},
        after_save: function after_save(new_row) {
            ex.assign(this.row, new_row);
        },
        showErrors: function showErrors(errors) {
            for (var k in errors) {
                //var head = ex.findone(this.heads,{name:k})
                $(this.$el).find('#id_' + k).trigger("showmsg", ["error", errors[k].join(';')]);
                //str += head.label + ':' + errors[k] +'<br>'
            }

            //var str = ""
            //for(var k in errors){
            //    var head = ex.findone(this.heads,{name:k})
            //    str += head.label + ':' + errors[k] +'<br>'
            //}
            //
            //layer.confirm(str,{title:['错误','color:white;background-color:red']})
        },
        clear: function clear() {
            this.row = {};
            this.set_errors({});
        }

    }
};

window.mix_fields_data = mix_fields_data;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
用在fields表单里面的mixins

增加nicevalidator功能
* */

var nice_validator = {
    mounted: function mounted() {
        var self = this;
        var validator = {};
        ex.each(this.heads, function (head) {
            var ls = [];

            if (head.fv_rule) {
                ls.push(head.fv_rule);
            }
            if (head.required) {
                if (!head.fv_rule || head.fv_rule.search('required') == -1) {
                    // 规则不包含 required的时候，再添加上去
                    ls.push('required');
                }
            }
            validator[head.name] = ls.join(';');
        });
        if ($(this.$el).hasClass('field-panel')) {
            this.nice_validator = $(this.$el).validator({
                fields: validator
            });
        } else {
            this.nice_validator = $(this.$el).find('.field-panel').validator({
                fields: validator
            });
        }
    },
    methods: {
        isValid: function isValid() {
            var nice_rt = this.nice_validator.isValid();
            //var totalValid=[nice_rt]
            var totalValid = ex.vueBroadCall(this, 'isValid');
            totalValid.push(nice_rt);

            //ex.each(this.$children,function(child){
            //    if(child.isValid){
            //        totalValid.push(child.isValid())
            //    }
            //})

            var valid = true;
            ex.each(totalValid, function (item) {
                valid = valid && item;
            });
            return valid;
        },
        before_save: function before_save() {
            ex.vueSuper(this, { mixin: nice_validator, fun: 'before_save' });
            if (this.isValid()) {
                return 'continue';
            } else {
                return 'break';
            }
        }
    }

    //$.validator.config({
    //    rules: {
    //        error_msg: function(ele,param){
    //
    //        }
    //    }
    //}
    //
    //);

};window.mix_nice_validator = nice_validator;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mix_table_data = {
    data: function data() {
        return {
            op_funs: {},
            changed_rows: []
        };
    },
    mounted: function mounted() {
        var self = this;
        ex.assign(this.op_funs, {
            save_changed_rows: function save_changed_rows() {
                self.save_rows(self.changed_rows);
                self.changed_rows = [];
            },
            add_new: function add_new(kws) {
                /*
                * model_name,
                * */
                self.add_new(kws);
            },
            delete: function _delete() {
                self.del_selected();
            },
            get_data: function get_data() {
                self.getRows();
            },
            selected_set_value: function selected_set_value(kws) {
                /* kws ={ field,value }
                * */
                ex.each(self.selected, function (row) {
                    row[kws.field] = kws.value;
                    if (row._hash != ex.hashDict(row)) {
                        if (!ex.isin(row, self.changed_rows)) {
                            self.changed_rows.push(row);
                        }
                    }
                });
            },
            emitEvent: function emitEvent(e) {
                self.$emit(e);
            }

        });
        //this.$refs.op_save_changed_rows[0].set_enable(false)
        //this.$refs.op_delete[0].set_enable(false)
    },
    computed: {
        changed: function changed() {
            return this.changed_rows.length != 0;
        }
    },
    methods: {
        on_operation: function on_operation(kws) {
            var fun_name = kws.fun || kws.name;
            this.op_funs[fun_name](kws);
        },
        on_td_event: function on_td_event(kws) {
            var fun_name = kws.fun || kws.name;
            this.op_funs[fun_name](kws);
            //this.op_funs[e.name](e)
        },
        search: function search() {
            this.search_args._page = 1;
            this.getRows();
        },
        add_new: function add_new(kws) {
            var self = this;
            var fields_ctx = kws.fields_ctx;
            var post_data = [{ fun: 'get_row', director_name: fields_ctx.director_name }];
            cfg.show_load();
            ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                cfg.hide_load();
                var new_row = resp.get_row;
                //var pop_id= new Date().getTime()
                // e = {name:'after_save',new_row:event.new_row,old_row:event.old_row}
                //eventBus.$on('pop-win-'+pop_id,function(e){
                //    self.update_or_insert(e.new_row, e.old_row)
                //})
                //pop_fields_layer(new_row,kws.heads,kws.ops,pop_id)
                pop_fields_layer(new_row, fields_ctx, function (e) {
                    self.update_or_insert(e.new_row, e.old_row);
                });
            });
        },
        editRow: function editRow(kws) {
            var row = kws.row;
            var fields_ctx = kws.fields_ctx;
        },
        update_or_insert: function update_or_insert(new_row, old_row) {
            if (old_row && !old_row.pk) {
                this.rows.splice(0, 0, new_row);
            } else {
                var table_row = ex.findone(this.rows, { pk: new_row.pk });
                ex.assign(table_row, new_row);
            }
        },
        getRows: function getRows() {
            /*
            以后都用这个函数，不用什么get_data 或者 data_getter 了
            * */
            var self = this;

            cfg.show_load();
            var post_data = [{ fun: 'get_rows', director_name: self.director_name, search_args: self.search_args }];
            $.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                self.rows = resp.get_rows.rows;
                self.row_pages = resp.get_rows.row_pages;
                self.search_args = resp.get_rows.search_args;
                cfg.hide_load();
            });
        },
        get_data: function get_data() {
            this.getRows();
            //this.data_getter(this)
        },
        get_page: function get_page(page_number) {
            this.search_args._page = page_number;
            this.getRows();
        },
        get_search_args: function get_search_args() {
            return this.search_args;
        },
        //data_getter:function(){
        //    // 默认的 data_getter
        //    var self=this
        //
        //    cfg.show_load()
        //    var post_data=[{fun:'get_rows',director_name:this.director_name,search_args:this.search_args}]
        //    $.get('/d/ajax',JSON.stringify(post_data),function(resp){
        //        self.rows = resp.rows
        //        self.row_pages = resp.row_pages
        //        cfg.hide_load()
        //    })
        //},
        save_rows: function save_rows(rows) {
            var self = this;
            var post_data = [{ fun: 'save_rows', rows: rows }];
            cfg.show_load();
            ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                ex.each(rows, function (row) {
                    var new_row = ex.findone(resp.save_rows, { pk: row.pk });
                    ex.assign(row, new_row);
                });
                cfg.hide_load(2000);
            });
        },
        clear: function clear() {
            this.rows = [];
            this.row_pages = {};
        },

        del_selected: function del_selected() {
            var self = this;
            layer.confirm('真的删除吗?', { icon: 3, title: '确认' }, function (index) {
                layer.close(index);
                //var ss = layer.load(2);
                cfg.show_load();
                var post_data = [{ fun: 'del_rows', rows: self.selected }];
                $.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                    //layer.close(ss)
                    ex.each(self.selected, function (item) {
                        ex.remove(self.rows, { pk: item.pk });
                    });
                    self.selected = [];
                    cfg.hide_load(200);
                    //layer.msg('删除成功',{time:2000})
                });
            });
        }

    }
};

window.mix_table_data = mix_table_data;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mix_v_table_adapter = {

    mounted: function mounted() {
        eventBus.$on('content_resize', this.resize);
        eventBus.$on('openlayer_changed', this.refreshSize);
    },
    computed: {
        columns: function columns() {
            var self = this;
            var first_col = {
                width: 60,
                titleAlign: 'center',
                columnAlign: 'center',
                type: 'selection',
                isFrozen: true
            };
            var cols = [first_col];
            var converted_heads = ex.map(this.heads, function (head) {
                var col = ex.copy(head);
                var dc = {
                    field: head.name,
                    title: head.label,
                    isResize: true
                };
                if (head.editor) {
                    dc.componentName = head.editor;
                }
                if (ex.isin(head.name, self.row_sort.sortable)) {
                    dc.orderBy = '';
                }
                ex.assign(col, dc);
                if (!col.width) {
                    col.width = 200;
                }
                return col;
            });
            cols = cols.concat(converted_heads);
            return cols;
        }
    },
    methods: {
        refreshSize: function refreshSize() {
            this.$refs.vtable.resize();
        },
        resize: function resize() {
            var self = this;
            $(self.$refs.vtable.$el).find('.v-table-rightview').css('width', '100%');
            $(self.$refs.vtable.$el).find('.v-table-header').css('width', '100%');
            $(self.$refs.vtable.$el).find('.v-table-body').css('width', '100%');

            var tmid = setInterval(function () {
                self.$refs.vtable.resize();
            }, 50);
            setTimeout(function () {
                //self.$refs.vtable.resize()
                clearInterval(tmid);
            }, 600);
        },
        on_perpage_change: function on_perpage_change(perpage) {
            this.search_args._perpage = perpage;
            this.search_args._page = 1;
            this.getRows();
        },
        sortChange: function sortChange(params) {
            var self = this;
            ex.each(this.row_sort.sortable, function (name) {
                if (params[name]) {
                    if (params[name] == 'asc') {
                        self.search_args._sort = name;
                    } else {
                        self.search_args._sort = '-' + name;
                    }
                    return 'break';
                }
            });
            this.get_data();
        }
    }
};
window.mix_v_table_adapter = mix_v_table_adapter;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
将 pk 数组映射为 label字符串
[1,2,3] -> '小王;小张;小赵'
* */
var array_mapper = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="show_data"></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    computed: {
        show_data: function show_data() {
            var self = this;
            if (this.table_par) {
                var values = self.rowData[self.field];
                var options = ex.map(values, function (value) {
                    return { value: value, label: self.head.options[value] };
                });
                var ordered_values = ex.sortOrder(options, 'label');
                var str = '';
                ex.each(ordered_values, function (itm) {
                    str += itm.label;
                    //str+= options[itm]
                    str += ';';
                });
                return str;
                //return options[value]
            }
        }
    }
};

Vue.component('com-table-array-mapper', array_mapper);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 options:{
 key:value
 }
 * */
var mapper = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="show_data"></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
    },
    computed: {
        show_data: function show_data() {
            if (this.table_par) {
                var value = this.rowData[this.field];
                var head = ex.findone(this.table_par.heads, { name: this.field });
                var options = head.options;
                var opt = ex.findone(options, { value: value });
                return opt.label;
            }
        }
    }
};

Vue.component('com-table-array-option-mapper', mapper);

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bool_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span>\n       <el-switch\n              v-model="is_true"\n              active-color="#13ce66"\n              inactive-color="#ff4949">\n        </el-switch>\n    </span>',

    computed: {
        is_true: {
            get: function get() {
                var value = this.rowData[this.field];
                if (value == 1) {
                    return true;
                } else {
                    return value;
                }
            },
            set: function set(newValue) {
                var crt_value = this.rowData[this.field];
                if (crt_value == 0 || crt_value == 1) {
                    this.rowData[this.field] = newValue ? 1 : 0;
                } else {
                    this.rowData[this.field] = newValue;
                }
            }
        }
    }

};

Vue.component('com-table-bool-editor', bool_shower);

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bool_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span>\n    <i v-if="rowData[field]" style="color: green" class="fa fa-check-circle"></i>\n    <i v-else style="color: red" class="fa fa-times-circle"></i>\n    </span>'

};

Vue.component('com-table-bool-shower', bool_shower);

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mix_editor = __webpack_require__(2);

__webpack_require__(57);

var check_box = {
    props: ['rowData', 'field', 'index'],
    template: '<div :class="[\'com-table-checkbox\',{\'dirty\':is_dirty}]"><input style="width: 100%" @change="on_changed()" type="checkbox" v-model="rowData[field]"></div>',
    mixins: [_mix_editor.mix_editor]
};

Vue.component('com-table-checkbox', check_box);

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
额外的点击列，例如“详情”
* */

var extra_click = {
    props: ['rowData', 'field', 'index'],
    template: '<span class="clickable" v-text="head.extra_label" @click="on_click()"></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },

    methods: {
        on_click: function on_click() {
            this.$emit('on-custom-comp', { name: this.head.extra_fun, row: this.rowData, head: this.head });
        }

    }
};

Vue.component('com-table-extraclick', extra_click);

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var foreign_click_select = {
    props: ['rowData', 'field', 'index'],
    template: '<span class="clickable" v-text="rowData[field]" @click="on_click()"></span>',
    data: function data() {
        return {
            label: '_' + this.field + '_label'
        };
    },
    computed: {},
    methods: {
        on_click: function on_click() {
            this.$emit('on-custom-comp', { fun: 'send_select', row: this.rowData });
        }
    }
};

Vue.component('com-table-foreign-click-select', foreign_click_select);

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bool_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-html="rowData[field]"></span>'

};

Vue.component('com-table-html-shower', bool_shower);

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bool_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span>\n    <a :href="link" target="_blank" v-text="rowData[field]"></a>\n    </span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    computed: {
        link: function link() {
            return this.rowData[this.head.link_field];
        }
    }

};

Vue.component('com-table-jump-link', bool_shower);

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var label_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="show_text"></span>',
    data: function data() {
        return {
            label: '_' + this.field + '_label'
        };
    },
    computed: {
        show_text: function show_text() {
            return this.rowData[this.label] || '';
        }
    }
};

Vue.component('com-table-label-shower', label_shower);

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(58);
var line_text = {
    props: ['rowData', 'field', 'index'],
    template: '<div :class="[\'com-table-linetext\',{\'dirty\':is_dirty}]">\n        <span v-if="readonly" v-text="rowData[field]"></span>\n        <input v-else @change="on_changed()" style="width: 100%" type="text" v-model="rowData[field]">\n    </div>',
    data: function data() {
        return {
            org_value: this.rowData[this.field]
        };
    },
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    computed: {
        is_dirty: function is_dirty() {
            return this.rowData[this.field] != this.org_value;
        },
        readonly: function readonly() {
            if (this.head.readonly) {
                return _readonly[this.head.readonly.fun](this, this.head.readonly);
            } else {
                return false;
            }
        }
    },
    watch: {
        'rowData._hash': function rowData_hash() {
            this.org_value = this.rowData[this.field];
        }
    },
    methods: {
        getRowValue: function getRowValue(field) {
            return this.rowData[field];
        },
        on_changed: function on_changed() {
            var value = this.rowData[this.field];
            if (value == this.org_value) {
                this.$emit('on-custom-comp', { name: 'row_changed_undo_act', row: this.rowData });
            } else {
                this.$emit('on-custom-comp', { name: 'row_changed', row: this.rowData });
            }
        }
    }
};

Vue.component('com-table-linetext', line_text);

var _readonly = {
    checkRowValue: function checkRowValue(self, kws) {
        var field = kws.field;
        var target_value = kws.target_value;
        return self.rowData[field] == target_value;
    }
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
options:{
    key:value
}
* */
var mapper = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="show_data"></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
    },
    computed: {
        show_data: function show_data() {
            if (this.table_par) {
                var value = this.rowData[this.field];
                var head = ex.findone(this.table_par.heads, { name: this.field });
                var options = head.options;
                return options[value];
            }
        }
    }
};

Vue.component('com-table-mapper', mapper);

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 额外的点击列，例如“详情”
 * */

/*
* head={
*
* }
* */
var operations = {
    props: ['rowData', 'field', 'index'],
    template: '<div>\n        <span style="margin-right: 1em" v-for="op in head.operations" v-show="! rowData[\'_op_\'+op.name+\'_hide\']" class="clickable" v-text="op.label" @click="on_click()"></span>\n    </div>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    methods: {
        on_click: function on_click() {
            this.$emit('on-custom-comp', { name: this.head.extra_fun, row: this.rowData });
        }

    }
};

Vue.component('com-table-operations', operations);

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var picture = {
    props: ['rowData', 'field', 'index'],
    template: '<span>\n        <img @load=\'loaded=true\' v-show=\'loaded\' @click="open()" :src="src" alt="" height="96px" style="cursor: pointer;">\n        </span>',
    data: function data() {
        return {
            loaded: false
        };
    },
    watch: {
        src: function src() {
            this.loaded = false;
        }
    },
    computed: {
        src: function src() {
            return this.rowData[this.field];
        }
    },
    methods: {
        open: function open() {
            window.open(this.rowData[this.field]);
        }
    }
};

Vue.component('com-table-picture', picture);

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var pop_fields = exports.pop_fields = {
    template: '<span v-text="show_text" @click="edit_me()" class="clickable"></span>',
    props: ['rowData', 'field', 'index'],
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        if (table_par) {
            var value = this.rowData[this.field];
            this.head = ex.findone(table_par.heads, { name: this.field });
        }
    },
    computed: {
        show_text: function show_text() {
            if (this.head.show_label) {
                return show_label[this.head.show_label.fun](this.rowData, this.head.show_label);
            } else {
                return this.rowData[this.field];
            }
        }
    },
    methods: {
        edit_me: function edit_me() {
            this.open_layer();
        },
        open_layer: function open_layer() {
            var self = this;

            var fun = get_row[this.head.get_row.fun];
            var kws = this.head.get_row.kws;
            fun(function (pop_row) {
                //pop_fields_layer(pop_row,self.head.fields_heads,ops,self.head.extra_mixins,function(kws){
                pop_fields_layer(pop_row, self.head.fields_ctx, function (kws) {

                    if (kws.name == 'after_save') {
                        var fun = after_save[self.head.after_save.fun];
                        fun(self, kws.new_row, kws.old_row);
                    }
                });
            }, this.rowData, kws);
        }

    }
};
Vue.component('com-table-pop-fields', pop_fields);

var show_label = {
    use_other_field: function use_other_field(row, kws) {
        var other_field = kws.other_field;
        return row[other_field];
    },
    text_label: function text_label(row, show_label) {
        return show_label.text;
    }
};

var get_row = {
    use_table_row: function use_table_row(callback, row, kws) {
        callback(row);
    },
    get_table_row: function get_table_row(callback, row, kws) {
        var cache_row = ex.copy(row);
        callback(cache_row);
    },
    get_with_relat_field: function get_with_relat_field(callback, row, kws) {
        var director_name = kws.director_name;
        var relat_field = kws.relat_field;

        var dc = { fun: 'get_row', director_name: director_name };
        dc[relat_field] = row[relat_field];
        var post_data = [dc];
        cfg.show_load();
        ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
            cfg.hide_load();
            callback(resp.get_row);
        });
    }
};

var after_save = {
    do_nothing: function do_nothing(self, new_row, old_row, table) {},
    update_or_insert: function update_or_insert(self, new_row, old_row) {
        self.$emit('on-custom-comp', { name: 'update_or_insert', new_row: new_row, old_row: old_row });
        //if(! old_row.pk) {
        //    table.rows.splice(0, 0, new_row)
        //}else{
        //    ex.assign(table.rowData,new_row)
        //}

    }
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mix_editor = __webpack_require__(2);

__webpack_require__(59);


var select = {
    props: ['rowData', 'field', 'index'],
    template: '<div :class="[\'com-table-select\',{\'dirty\':is_dirty}]">\n            <el-dropdown trigger="click" placement="bottom" @command="handleCommand">\n                <span class="el-dropdown-link clickable" v-html="show_label"></span>\n                <el-dropdown-menu slot="dropdown">\n                    <el-dropdown-item v-for="op in head.options"\n                    :command="op.value"\n                    :class="{\'crt-value\':rowData[field]==op.value}" >\n                    <div v-text="op.label"></div>\n                    </el-dropdown-item>\n                </el-dropdown-menu>\n            </el-dropdown>\n        </div>\n\n    ',
    data: function data() {
        return {};
    },
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    mixins: [_mix_editor.mix_editor],
    computed: {
        show_label: function show_label() {
            var value = this.rowData[this.field];
            var opt = ex.findone(this.head.options, { value: value });
            return opt.html_label || opt.label;
        }
    },
    methods: {
        handleCommand: function handleCommand(command) {
            //this.$message('click on item ' + command);
            if (this.rowData[this.field] != command) {
                this.rowData[this.field] = command;
                this.on_changed();
            }
        },

        setSelect: function setSelect(value) {
            if (this.rowData[this.field] != value) {
                this.rowData[this.field] = value;
                this.on_changed();
            }
        }
        //on_changed:function(){
        //    this.$emit('on-custom-comp',{name:'row_changed',row:this.rowData})
        //}
    }
};

Vue.component('com-table-select', select);

//Vue.component('com-table-select',function(resolve,reject){
//    ex.load_css('https://unpkg.com/element-ui/lib/theme-chalk/index.css')
//    ex.load_js('https://unpkg.com/element-ui/lib/index.js',function(){
//        resolve(select)
//    })
//})


//var select = {
//    props:['rowData','field','index'],
//    template:`<div >
//    <select style="width: 100%" @change="on_changed()"  v-model="rowData[field]">
//        <option v-for="op in head.options" :value="op.value" v-text="op.label"></option>
//    </select>
//    </div>`,
//    data:function(){
//        return {
//        }
//    },
//    created:function(){
//        // find head from parent table
//        var table_par = this.$parent
//        while (true){
//            if (table_par.heads){
//                break
//            }
//            table_par = table_par.$parent
//            if(!table_par){
//                break
//            }
//        }
//        this.table_par = table_par
//        this. head  = ex.findone(this.table_par.heads,{name:this.field})
//    },
//    methods:{
//        on_changed:function(){
//            this.$emit('on-custom-comp',{name:'row_changed',row:this.rowData})
//        }
//    }
//}

//Vue.component('com-table-select',select)

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var switch_to_tab = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="rowData[field]" @click="goto_tab()" class="clickable"></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        var head = ex.findone(table_par.heads, { name: this.field });
        this.head = head;
    },
    methods: {
        goto_tab: function goto_tab() {
            this.$emit('on-custom-comp', { name: 'switch_to_tab',
                tab_name: this.head.tab_name,
                row: this.rowData });
        }
    }
};

Vue.component('com-table-switch-to-tab', switch_to_tab);

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 无用了。准备删除
var delete_op = {
    props: ['name'],
    template: ' <a class="clickable" @click="delete_op()" :disabled="!enable">\u5220\u9664</a>',
    data: function data() {
        return {
            enable: false
        };
    },
    methods: {
        delete_op: function delete_op() {
            this.$emit('operation', this.name);
        },
        set_enable: function set_enable(yes) {
            this.enable = yes;
        }
    }
};
Vue.component('com-op-delete', delete_op);

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var op_a = {
    props: ['head'],
    template: ' <a class="clickable" @click="operation_call()"  v-text="head.label" ></a>',
    data: function data() {
        return {
            enable: true
        };
    },
    methods: {
        operation_call: function operation_call() {
            this.$emit('operation', this.head.name);
        },
        set_enable: function set_enable(yes) {
            this.enable = yes;
        }
    }
};
Vue.component('com-op-a', op_a);

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var op_a = {
    props: ['head', 'disabled'],
    template: ' <span style="margin-left: 3px">\n    <button :class="norm_class" @click="operation_call()"  :style="head.style" :disabled="disabled">\n        <i v-if="head.icon" :class=\'["fa",head.icon]\'></i>\n        <span  v-text="head.label"></span>\n    </button>\n    </span>',
    data: function data() {
        return {
            enable: true
        };
    },
    computed: {
        norm_class: function norm_class() {
            if (this.head.class) {
                return 'btn btn-sm ' + this.head.class;
            } else {
                return 'btn btn-sm btn-default';
            }
        }
    },
    methods: {
        operation_call: function operation_call() {
            this.$emit('operation', this.head.name);
        },
        set_enable: function set_enable(yes) {
            this.enable = yes;
        }
    }
};
Vue.component('com-op-btn', op_a);

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ajax_fields = {
    props: ['tab_head', 'par_row'],
    data: function data() {
        return {
            heads: this.tab_head.heads,
            ops: this.tab_head.ops,
            errors: {},
            row: {}
        };
    },
    mixins: [mix_fields_data, mix_nice_validator],
    template: '<div class="flex-v"  style="position: absolute;top:0;left:0;bottom: 0;right:0;overflow: auto;padding-bottom: 3em;">\n\n    <div>\n        <div class=\'field-panel msg-hide\' id="form" >\n            <field  v-for=\'head in heads\' :key="head.name" :head="head" :row=\'row\'></field>\n        </div>\n    </div>\n\n    <div class="oprations" style="margin-left: 16em;">\n        <component style="padding: 0.5em;" v-for="op in ops" :is="op.editor" :ref="\'op_\'+op.name" :head="op" @operation="on_operation(op)"></component>\n    </div>\n    </div>\n    </div>',

    //created:function(){
    //    // find head from parent table
    //    var table_par = this.$parent
    //    while (true){
    //        if (table_par.heads){
    //            break
    //        }
    //        table_par = table_par.$parent
    //        if(!table_par){
    //            break
    //        }
    //    }
    //    this.table_par = table_par
    //},

    methods: {
        on_show: function on_show() {
            if (!this.fetched) {
                this.get_data();
                this.fetched = true;
            }
        },
        data_getter: function data_getter() {
            var self = this;
            var fun = get_data[self.tab_head.get_data.fun];
            var kws = self.tab_head.get_data.kws;
            fun(self, function (row) {
                //ex.assign(self.row,row)
                self.row = row;
            }, kws);

            //var self=this
            //cfg.show_load()
            //var dt = {fun:'get_row',model_name:this.model_name}
            //dt[this.relat_field] = this.par_row[this.relat_field]
            //var post_data=[dt]
            //$.post('/d/ajax',JSON.stringify(post_data),function(resp){
            //    self.row=resp.get_row
            //    cfg.hide_load()
            //})
        },
        after_save: function after_save(new_row) {
            if (this.tab_head.after_save) {
                var fun = _after_save[this.tab_head.after_save.fun];
                var kws = this.tab_head.after_save.kws;
                // new_row ,old_row
                fun(this, new_row, kws);
            }
            this.row = new_row;
        }
        // data_getter  回调函数，获取数据,


    } };

Vue.component('com_tab_fields', ajax_fields);

var get_data = {
    get_row: function get_row(self, callback, kws) {
        //kws={model_name ,relat_field}
        var director_name = kws.director_name;
        var relat_field = kws.relat_field;
        var dt = { fun: 'get_row', director_name: director_name };
        dt[relat_field] = self.par_row[relat_field];
        var post_data = [dt];
        cfg.show_load();
        $.post('/d/ajax', JSON.stringify(post_data), function (resp) {
            cfg.hide_load();
            callback(resp.get_row);
        });
    },
    table_row: function table_row(self, callback, kws) {
        callback(self.par_row);
    }
};

var _after_save = {
    update_or_insert: function update_or_insert(self, new_row, kws) {
        var old_row = self.row;
        self.$emit('tab-event', { name: 'update_or_insert', new_row: new_row, old_row: old_row });
    }
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ajax_table = {
    props: ['tab_head', 'par_row'], //['heads','row_filters','kw'],
    data: function data() {
        var heads_ctx = this.tab_head.table_ctx;
        return {
            heads: heads_ctx.heads,
            row_filters: heads_ctx.row_filters,
            row_sort: heads_ctx.row_sort,
            director_name: heads_ctx.director_name,
            footer: [],
            rows: [],
            row_pages: {},
            //search_tip:this.kw.search_tip,

            selected: [],
            del_info: [],

            search_args: {}
        };
    },
    mixins: [mix_table_data, mix_ele_table_adapter],
    //watch:{
    //    // 排序变换，获取数据
    //    'row_sort.sort_str':function(v){
    //        this.search_args._sort=v
    //        this.get_data()
    //    }
    //},
    template: '<div class="rows-block flex-v" style="position: absolute;top:0;left:0;bottom: 0;right:0;overflow: auto;padding-bottom: 3em;" >\n        <div class=\'flex\' style="min-height: 3em;" v-if="row_filters.length > 0">\n            <com-filter class="flex" :heads="row_filters" :search_args="search_args"\n                        @submit="search()"></com-filter>\n            <div class="flex-grow"></div>\n        </div>\n        <div class="box box-success flex-grow">\n            <div class="table-wraper" style="position: absolute;top:0;left:0;bottom: 0;right:0;">\n               <el-table class="table" ref="e_table"\n                              :data="rows"\n                              border\n                              show-summary\n                              :fit="false"\n                              :stripe="true"\n                              size="mini"\n                              @sort-change="sortChange($event)"\n                              @selection-change="handleSelectionChange"\n                              :summary-method="getSum"\n                              height="100%"\n                              style="width: 100%">\n                        <el-table-column\n                                type="selection"\n                                width="55">\n                        </el-table-column>\n\n                        <template  v-for="head in heads">\n\n                            <el-table-column v-if="head.editor"\n                                             :show-overflow-tooltip="is_show_tooltip(head) "\n                                             :label="head.label"\n                                             :sortable="is_sort(head)"\n                                             :width="head.width">\n                                <template slot-scope="scope">\n                                    <component :is="head.editor"\n                                               @on-custom-comp="on_td_event($event)"\n                                               :row-data="scope.row" :field="head.name" :index="scope.$index">\n                                    </component>\n\n                                </template>\n\n                            </el-table-column>\n\n                            <el-table-column v-else\n                                             :show-overflow-tooltip="is_show_tooltip(head) "\n                                             :prop="head.name"\n                                             :label="head.label"\n                                             :sortable="is_sort(head)"\n                                             :width="head.width">\n                            </el-table-column>\n\n                        </template>\n\n                    </el-table>\n            </div>\n\n        </div>\n          <div>\n                    <el-pagination\n                        @size-change="on_perpage_change"\n                        @current-change="get_page"\n                        :current-page="row_pages.crt_page"\n                        :page-sizes="[20, 50, 100, 500]"\n                        :page-size="row_pages.perpage"\n                        layout="total, sizes, prev, pager, next, jumper"\n                        :total="row_pages.total">\n                </el-pagination>\n            </div>\n    </div>',

    methods: {
        on_show: function on_show() {
            if (!this.fetched) {
                this.get_data();
                this.fetched = true;
            }
        },
        getRows: function getRows() {
            // 这里clear，数据被清空，造成table的pagenator上下抖动
            //                       com.clear()

            //                        var getter_name = 'get_'+tab.name
            var self = this;
            var fun = get_data[this.tab_head.get_data.fun];
            fun(function (rows, row_pages) {
                self.rows = rows;
                self.row_pages = row_pages;
            }, this.par_row, this.tab_head.get_data.kws, this.search_args);

            //            var self=this
            //            var relat_pk = this.par_row[this.relat_field]
            //        var relat_field = this.relat_field
            //        this.search_args[relat_field] = relat_pk
            //        var post_data=[{fun:'get_rows',search_args:this.search_args,model_name:this.model_name}]
            //            cfg.show_load()
            //        $.post('/d/ajax',JSON.stringify(post_data),function(resp){
            //            cfg.hide_load()
            //            self.rows = resp.get_rows.rows
            //            self.row_pages =resp.get_rows.row_pages
            //        })
        },
        del_item: function del_item() {
            if (this.selected.length == 0) {
                return;
            }
            var del_obj = {};
            for (var j = 0; j < this.selected.length; j++) {
                var pk = this.selected[j];
                for (var i = 0; i < this.rows.length; i++) {
                    if (this.rows[i].pk.toString() == pk) {
                        if (!del_obj[this.rows[i]._class]) {
                            del_obj[this.rows[i]._class] = [];
                        }
                        del_obj[this.rows[i]._class].push(pk);
                    }
                }
            }
            var out_str = '';
            for (var key in del_obj) {
                out_str += key + ':' + del_obj[key].join(':') + ',';
            }
            location = ex.template("{engine_url}/del_rows?rows={rows}&next={next}", { engine_url: engine_url,
                rows: encodeURI(out_str),
                next: encodeURIComponent(location.href) });
        },
        goto_page: function goto_page(page) {
            this.search_args._page = page;
            this.search();
        },
        add_new: function add_new() {
            var url = ex.template('{engine_url}/{page}.edit/?next={next}', {
                engine_url: engine_url,
                page: page_name,
                next: encodeURIComponent(ex.appendSearch(location.pathname, search_args))
            });
            location = url;
        }
    }
};

Vue.component('com_tab_table', ajax_table);

var get_data = {
    get_rows: function get_rows(callback, row, kws, search_args) {
        var relat_field = kws.relat_field;
        var director_name = kws.director_name;

        var self = this;
        var relat_pk = row[kws.relat_field];
        var relat_field = kws.relat_field;
        search_args[relat_field] = relat_pk;
        var post_data = [{ fun: 'get_rows', search_args: search_args, director_name: director_name }];
        cfg.show_load();
        $.post('/d/ajax', JSON.stringify(post_data), function (resp) {
            cfg.hide_load();
            callback(resp.get_rows.rows, resp.get_rows.row_pages);
            //self.rows = resp.get_rows.rows
            //self.row_pages =resp.get_rows.row_pages
        });
    }
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var rules = {
    mobile: [/^1[3-9]\d{9}$/, "请填写有效的手机号"],
    chinese: [/^[\u0391-\uFFE5]+$/, "请填写中文字符"],
    ip: [/^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i, '请填写有效的 IP 地址']
};

$.validator.config({
    rules: rules
});

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(48);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./fields.scss", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./fields.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(49);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./tab.scss", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./tab.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(53);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_editor_base.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_editor_base.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var com_pop_field = exports.com_pop_field = {
    props: ['row', 'heads', 'ops'],
    mixins: [mix_fields_data, mix_nice_validator],

    methods: {
        after_save: function after_save(new_row) {
            this.$emit('sub_success', { new_row: new_row, old_row: this.row });
            ex.assign(this.row, new_row);
        },
        del_row: function del_row() {
            var self = this;
            layer.confirm('真的删除吗?', { icon: 3, title: '确认' }, function (index) {
                layer.close(index);
                var ss = layer.load(2);
                var post_data = [{ fun: 'del_rows', rows: [self.row] }];
                $.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                    layer.close(ss);
                    self.$emit('del_success', self.row);
                });
            });
        }

    },
    template: '<div class="flex-v" style="margin: 0;height: 100%;">\n    <div class = "flex-grow" style="overflow: auto;margin: 0;">\n        <div class="field-panel suit" >\n            <field  v-for="head in heads" :key="head.name" :head="head" :row="row"></field>\n        </div>\n      <div style="height: 15em;">\n      </div>\n    </div>\n     <div style="text-align: right;padding: 8px 3em;">\n        <component v-for="op in ops" :is="op.editor" @operation="on_operation(op)" :head="op"></component>\n        <!--<button @click="save()">\u4FDD\u5B58</button>-->\n        <!--<button @click="del_row()" v-if="row.pk">\u5220\u9664</button>-->\n    </div>\n     </div>',
    data: function data() {
        return {
            fields_kw: {
                heads: this.heads,
                row: this.row,
                errors: {}
            }
        };
    }

    //Vue.component('com-pop-fields',)

};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-field-ele-tree-name-layer {\n  min-width: 20em;\n  border: 1px solid #b1b1b1; }\n  .com-field-ele-tree-name-layer .el-tree {\n    min-height: 20em; }\n", ""]);

// exports


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".file-uploader .item img {\n  max-width: 300px;\n  cursor: pointer; }\n\n.file-uploader .wrap {\n  display: inline-block; }\n\n.file-uploader .sortable {\n  display: flex;\n  flex-wrap: wrap; }\n  .file-uploader .sortable li {\n    display: block;\n    margin: 0.5em;\n    padding: 0.3em;\n    position: relative; }\n    .file-uploader .sortable li:hover .remove-btn {\n      visibility: visible; }\n    .file-uploader .sortable li .file-wrap {\n      width: 10em;\n      height: 12em;\n      border: 2em solid #68abff;\n      text-align: center;\n      padding: 1em 0;\n      background-color: white;\n      box-shadow: 10px 10px 5px #888888;\n      color: #68abff;\n      display: table-cell;\n      vertical-align: middle;\n      cursor: pointer; }\n      .file-uploader .sortable li .file-wrap .file-type {\n        font-size: 250%;\n        font-weight: 700;\n        text-transform: uppercase; }\n\n.file-uploader .remove-btn {\n  font-size: 2em;\n  position: absolute;\n  top: -1em;\n  right: 0.3em;\n  visibility: hidden; }\n  .file-uploader .remove-btn i {\n    color: red; }\n\n.file-uploader-btn-plus {\n  display: inline-block;\n  vertical-align: top; }\n  .file-uploader-btn-plus .inn-btn {\n    width: 5em;\n    height: 5em;\n    display: table-cell;\n    text-align: center;\n    vertical-align: middle;\n    border: 1px solid #e1e1e1;\n    cursor: pointer; }\n    .file-uploader-btn-plus .inn-btn span {\n      font-size: 300%; }\n    .file-uploader-btn-plus .inn-btn:hover {\n      background-color: #e1e1e1; }\n", ""]);

// exports


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".table .el-table__row > td, .table tr > th, table.el-table__footer tr > td {\n  padding: 2px 0; }\n", ""]);

// exports


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".msg-hide .field .msg {\n  display: none; }\n\n.field .picture {\n  position: relative; }\n  .field .picture .msg-box {\n    position: absolute;\n    left: 260px; }\n", ""]);

// exports


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".el-tabs__item.is-top.is-active {\n  color: #3e8ebd; }\n\n.el-tabs__item.is-top.is-active:after {\n  content: '';\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  width: 100%;\n  height: 3px;\n  background-color: #3e8ebd; }\n\n.tab001 .el-tabs {\n  /*display: flex;*/\n  /*flex-direction: column;*/\n  /*height: 100%;*/ }\n  .tab001 .el-tabs .el-tabs__content {\n    /*flex-grow:10;*/\n    /*position: relative;*/ }\n\nbody {\n  height: 100%; }\n", ""]);

// exports


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-table-checkbox.dirty input {\n  background-color: yellow; }\n", ""]);

// exports


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-table-linetext.dirty input {\n  background-color: yellow; }\n", ""]);

// exports


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".el-dropdown-menu__item.crt-value {\n  background-color: #eaf8ff; }\n\n.com-table-select.dirty {\n  background-color: yellow; }\n", ""]);

// exports


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".dirty {\n  background-color: yellow; }\n", ""]);

// exports


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(45);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./ele_tree_name_layer.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./ele_tree_name_layer.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(46);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./file_uploader.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./file_uploader.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(47);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./mix_ele_table_adapter.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./mix_ele_table_adapter.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(50);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./check_box.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./check_box.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(51);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./linetext.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./linetext.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(52);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./select.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./select.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mix_table_data = __webpack_require__(16);

var mix_table_data = _interopRequireWildcard(_mix_table_data);

var _mix_v_table_adapter = __webpack_require__(17);

var mix_v_table_adapter = _interopRequireWildcard(_mix_v_table_adapter);

var _mix_nice_validator = __webpack_require__(15);

var mix_nice_validator = _interopRequireWildcard(_mix_nice_validator);

var _mix_fields_data = __webpack_require__(14);

var mix_fields_data = _interopRequireWildcard(_mix_fields_data);

var _mix_ele_table_adapter = __webpack_require__(13);

var mix_ele_table_adapter = _interopRequireWildcard(_mix_ele_table_adapter);

var _ajax_fields = __webpack_require__(38);

var ajax_fields = _interopRequireWildcard(_ajax_fields);

var _ajax_table = __webpack_require__(39);

var ajax_table = _interopRequireWildcard(_ajax_table);

var _ele_tree = __webpack_require__(5);

var ele_tree = _interopRequireWildcard(_ele_tree);

var _picture = __webpack_require__(31);

var table_picture = _interopRequireWildcard(_picture);

var _label_shower = __webpack_require__(27);

var table_label_shower = _interopRequireWildcard(_label_shower);

var _mapper = __webpack_require__(29);

var table_mapper = _interopRequireWildcard(_mapper);

var _pop_fields = __webpack_require__(32);

var table_pop_fields = _interopRequireWildcard(_pop_fields);

var _linetext = __webpack_require__(28);

var table_linetext = _interopRequireWildcard(_linetext);

var _check_box = __webpack_require__(22);

var table_checkbox = _interopRequireWildcard(_check_box);

var _switch_to_tab = __webpack_require__(34);

var switch_to_tab = _interopRequireWildcard(_switch_to_tab);

var _select = __webpack_require__(33);

var select = _interopRequireWildcard(_select);

var _extra_click = __webpack_require__(23);

var extra_click = _interopRequireWildcard(_extra_click);

var _array_mapper = __webpack_require__(18);

var array_mapper = _interopRequireWildcard(_array_mapper);

var _operations = __webpack_require__(30);

var operations = _interopRequireWildcard(_operations);

var _bool_shower = __webpack_require__(21);

var bool_shower = _interopRequireWildcard(_bool_shower);

var _foreign_click_select = __webpack_require__(24);

var foreign_click_select = _interopRequireWildcard(_foreign_click_select);

var _array_option_mapper = __webpack_require__(19);

var array_option_mapper = _interopRequireWildcard(_array_option_mapper);

var _html_shower = __webpack_require__(25);

var html_shower = _interopRequireWildcard(_html_shower);

var _bool_editor = __webpack_require__(20);

var bool_editor = _interopRequireWildcard(_bool_editor);

var _jump_link = __webpack_require__(26);

var jump_link = _interopRequireWildcard(_jump_link);

var _label_shower2 = __webpack_require__(6);

var field_label_shower = _interopRequireWildcard(_label_shower2);

var _ele_transfer = __webpack_require__(4);

var ele_transfer = _interopRequireWildcard(_ele_transfer);

var _datetime = __webpack_require__(3);

var datetime = _interopRequireWildcard(_datetime);

var _pop_table_select = __webpack_require__(8);

var pop_table_select = _interopRequireWildcard(_pop_table_select);

var _plain_file = __webpack_require__(7);

var plain_file = _interopRequireWildcard(_plain_file);

var _operator_a = __webpack_require__(36);

var op_a = _interopRequireWildcard(_operator_a);

var _delete_op = __webpack_require__(35);

var delete_op = _interopRequireWildcard(_delete_op);

var _operator_btn = __webpack_require__(37);

var operator_btn = _interopRequireWildcard(_operator_btn);

var _btn = __webpack_require__(9);

var btn = _interopRequireWildcard(_btn);

var _validator = __webpack_require__(40);

var validate = _interopRequireWildcard(_validator);

var _pop_table_layer = __webpack_require__(12);

var pop_table_layer = _interopRequireWildcard(_pop_table_layer);

var _pop_fields_layer = __webpack_require__(11);

var pop_fields_layer = _interopRequireWildcard(_pop_fields_layer);

var _sim_fields = __webpack_require__(10);

var sim_fields = _interopRequireWildcard(_sim_fields);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

__webpack_require__(41);
__webpack_require__(43);
__webpack_require__(42);

//table mix

//import * as com_pop_fields from './com_pop_fields.js'

// table editor


// field editor


// table operator


//fields operator


//import * as com_table from  './misc/com_table.js'

//misc


//fields_panels

/***/ })
/******/ ]);