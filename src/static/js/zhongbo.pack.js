/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _put_task_in_sangao = __webpack_require__(1);

var put_task = _interopRequireWildcard(_put_task_in_sangao);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var zhongbo_logic = {
    mounted: function mounted() {
        var self = this;
        ex.assign(this.op_funs, {
            updateFromYuan: function updateFromYuan() {
                cfg.show_load();
                var post_data = [{ fun: 'updateFromYuan' }];
                ex.post('/d/ajax/zhongbo', JSON.stringify(post_data), function (resp) {
                    var count = resp.updateFromYuan.count;
                    cfg.hide_load();
                    layer.alert('更新完成，新增' + count + '条数据', function () {
                        location.reload();
                    });
                });
            },
            putTaskIntoSangao: function putTaskIntoSangao() {
                cfg.show_load();
                var count = self.selected.length;
                ex.each(self.selected, function (item) {
                    var post_data = [{ fun: 'putIntoSangao', pk: item.pk }];
                    ex.post('/d/ajax/zhongbo', JSON.stringify(post_data), function (resp) {
                        //alert(resp)
                        var row = resp.putIntoSangao.row;
                        item.san_taskid = row.taskid;
                        item.status = row.status;
                        item._sangao_link = 'http://10.231.18.25/CityGrid/CaseOperate_flat/ParticularDisplayInfo.aspx?categoryId=undefined&taskid=' + item.san_taskid;

                        count -= 1;
                        if (count <= 0) {
                            cfg.hide_load(400);
                        }
                    });
                });
            },
            updateFromSan: function updateFromSan() {
                var taskids = ex.map(self.selected, function (item) {
                    return item.san_taskid;
                });
                var post_data = [{ fun: 'updateFromSan', taskids: taskids }];
                cfg.show_load();
                ex.post('/d/ajax/zhongbo', JSON.stringify(post_data), function (resp) {
                    var new_rows = resp.updateFromSan;
                    ex.each(self.selected, function (item) {
                        var new_row = ex.findone(new_rows, { san_taskid: item.san_taskid });
                        ex.assign(item, new_row);
                    });
                    cfg.hide_load(400);
                });
            },
            taskToYuanjing: function taskToYuanjing() {
                //eg1
                layer.confirm('真的准备好提交到【远景系统】吗？', { icon: 3, title: '提示' }, function (index) {
                    //do something
                    var pks = ex.map(self.selected, function (item) {
                        return item.pk;
                    });
                    var post_data = [{ fun: 'taskToYuanjing', pks: pks }];
                    cfg.show_load();
                    ex.post('/d/ajax/zhongbo', JSON.stringify(post_data), function (resp) {
                        cfg.hide_load(1000);
                    });

                    layer.close(index);
                });
            }
        });
    }
};

window.zhongbo_logic = zhongbo_logic;

/***/ })
/******/ ]);