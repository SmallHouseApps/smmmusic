var app = (function () {
	'use strict';

	function noop() {}

	function assign(tar, src) {
		for (var k in src) tar[k] = src[k];
		return tar;
	}

	function assignTrue(tar, src) {
		for (var k in src) tar[k] = 1;
		return tar;
	}

	function callAfter(fn, i) {
		if (i === 0) fn();
		return () => {
			if (!--i) fn();
		};
	}

	function addLoc(element, file, line, column, char) {
		element.__svelte_meta = {
			loc: { file, line, column, char }
		};
	}

	function run(fn) {
		fn();
	}

	function append(target, node) {
		target.appendChild(node);
	}

	function insert(target, node, anchor) {
		target.insertBefore(node, anchor);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function destroyEach(iterations, detach) {
		for (var i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detach);
		}
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function createComment() {
		return document.createComment('');
	}

	function addListener(node, event, handler) {
		node.addEventListener(event, handler, false);
	}

	function removeListener(node, event, handler) {
		node.removeEventListener(event, handler, false);
	}

	function setAttribute(node, attribute, value) {
		node.setAttribute(attribute, value);
	}

	function toNumber(value) {
		return value === '' ? undefined : +value;
	}

	function setData(text, data) {
		text.data = '' + data;
	}

	function setStyle(node, key, value) {
		node.style.setProperty(key, value);
	}

	function selectOption(select, value) {
		for (var i = 0; i < select.options.length; i += 1) {
			var option = select.options[i];

			if (option.__value === value) {
				option.selected = true;
				return;
			}
		}
	}

	function selectValue(select) {
		var selectedOption = select.querySelector(':checked') || select.options[0];
		return selectedOption && selectedOption.__value;
	}

	function toggleClass(element, name, toggle) {
		element.classList.toggle(name, !!toggle);
	}

	function blankObject() {
		return Object.create(null);
	}

	function destroy(detach) {
		this.destroy = noop;
		this.fire('destroy');
		this.set = noop;

		this._fragment.d(detach !== false);
		this._fragment = null;
		this._state = {};
	}

	function destroyDev(detach) {
		destroy.call(this, detach);
		this.destroy = function() {
			console.warn('Component was already destroyed');
		};
	}

	function _differs(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function _differsImmutable(a, b) {
		return a != a ? b == b : a !== b;
	}

	function fire(eventName, data) {
		var handlers =
			eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (var i = 0; i < handlers.length; i += 1) {
			var handler = handlers[i];

			if (!handler.__calling) {
				try {
					handler.__calling = true;
					handler.call(this, data);
				} finally {
					handler.__calling = false;
				}
			}
		}
	}

	function flush(component) {
		component._lock = true;
		callAll(component._beforecreate);
		callAll(component._oncreate);
		callAll(component._aftercreate);
		component._lock = false;
	}

	function get() {
		return this._state;
	}

	function init(component, options) {
		component._handlers = blankObject();
		component._slots = blankObject();
		component._bind = options._bind;
		component._staged = {};

		component.options = options;
		component.root = options.root || component;
		component.store = options.store || component.root.store;

		if (!options.root) {
			component._beforecreate = [];
			component._oncreate = [];
			component._aftercreate = [];
		}
	}

	function on(eventName, handler) {
		var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function() {
				var index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	}

	function set(newState) {
		this._set(assign({}, newState));
		if (this.root._lock) return;
		flush(this.root);
	}

	function _set(newState) {
		var oldState = this._state,
			changed = {},
			dirty = false;

		newState = assign(this._staged, newState);
		this._staged = {};

		for (var key in newState) {
			if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
		}
		if (!dirty) return;

		this._state = assign(assign({}, oldState), newState);
		this._recompute(changed, this._state);
		if (this._bind) this._bind(changed, this._state);

		if (this._fragment) {
			this.fire("state", { changed: changed, current: this._state, previous: oldState });
			this._fragment.p(changed, this._state);
			this.fire("update", { changed: changed, current: this._state, previous: oldState });
		}
	}

	function _stage(newState) {
		assign(this._staged, newState);
	}

	function setDev(newState) {
		if (typeof newState !== 'object') {
			throw new Error(
				this._debugName + '.set was called without an object of data key-values to update.'
			);
		}

		this._checkReadOnly(newState);
		set.call(this, newState);
	}

	function callAll(fns) {
		while (fns && fns.length) fns.shift()();
	}

	function _mount(target, anchor) {
		this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
	}

	var protoDev = {
		destroy: destroyDev,
		get,
		fire,
		on,
		set: setDev,
		_recompute: noop,
		_set,
		_stage,
		_mount,
		_differs
	};

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var vkApi = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	    module.exports = factory();
	}(commonjsGlobal, (function () {

	    var vkApi = {
	        clientId: 6712188,
	        serviceKey: '8d7a62198d7a62198d7a6219c28d1c096588d7a8d7a6219d6cd55a8fffab6ee67c33985',

	        getGroupById: function (id) {
	            return new Promise(resolve => {
	                var getGroupByIdMethod = 'https://api.vk.com/method/groups.getById?' +
	                    'v=5.84&access_token=' + this.serviceKey +
	                    '&group_id=' + id;

	                fetch(getGroupByIdMethod)
	                    .then(function (response) {
	                        return response.json();
	                    })
	                    .then(function (json) {
	                        resolve(json.response[0]);
	                    })
	                    .catch(alert);
	            });
	        },

	        getWallByGroup: function (id) {
	            return new Promise(resolve => {
	                var getWallByGroupMethod = 'https://api.vk.com/method/wall.get?' +
	                    'v=5.84&access_token=' + this.serviceKey +
	                    '&owner_id=-' + id + '&count=100';

	                fetch(getWallByGroupMethod)
	                    .then(function (response) {
	                        return response.json();
	                    })
	                    .then(function (json) {
	                        resolve(json.response);
	                    })
	                    .catch(alert);
	            });
	        },

	        getGroupMembers: function (id) {
	            return new Promise(resolve => {
	                var getGroupMembersMethod = 'https://api.vk.com/method/groups.getMembers?' +
	                    'v=5.84&access_token=' + this.serviceKey +
	                    '&group_id=' + id;

	                fetch(getGroupMembersMethod)
	                    .then(function (response) {
	                        return response.json();
	                    })
	                    .then(function (json) {
	                        resolve(json.response);
	                    })
	                    .catch(alert);
	            });
	        }
	    };

	    return vkApi;

	})));
	});

	/* src\forms\vkGroups.html generated by Svelte v2.13.5 */

	function data() {
				return {
	        vkGroupId: '',
	        loadType: 'oneItem',
	        fetchGroupList: []
				};
	}
	var methods = {
				getGroupById() {
	        var self = this;
	        var { vkGroupId, formStore } = this.get();
	        console.log(vkGroupId);
	        
	        vkApi.getGroupById(vkGroupId).then(group => {
	            const name = group.name;
	            const screenName = group.screen_name;
	            const avatar = group.photo_200;
	                
	            self.set({ name, screenName, avatar, isFetchGroup: true });
	            formStore.set({ vkGroupId, name, screenName, avatar });
	        });
	    },
	    
	    getGroupByList(){
	        var self = this;
	        var { vkGroupList, fetchGroupList, formStore } = this.get();
	        var vkGroupArr = vkGroupList.split('\n'); 
	        
	        vkGroupArr.forEach(function(el, index){
	            setTimeout(function(){
	                var vkGroupId = el.split('public')[1] ? el.split('public')[1] : el.split('club')[1];
	                vkApi.getGroupById(vkGroupId).then(group => {
	                    var name = group.name;
	                    var screenName = group.screen_name;
	                    var avatar = group.photo_200;
	                        
	                    fetchGroupList.push({ vkGroupId, name, screenName, avatar});
	                    self.set({ fetchGroupList });
	                    self.refs.fetchGroupListEl.scrollTo(0,self.refs.fetchGroupListEl.scrollHeight);
	                    formStore.set({ fetchGroupList, isCorrect: true });
	                });
	            }, 500 * index);
	        });
	        
	    }
			};

	const file = "src\\forms\\vkGroups.html";

	function create_main_fragment(component, ctx) {
		var if_block_anchor, current;

		function select_block_type_4(ctx) {
			if (ctx.formStore.get().vkGroup) return create_if_block;
			return create_if_block_1;
		}

		var current_block_type = select_block_type_4(ctx);
		var if_block = current_block_type(component, ctx);

		return {
			c: function create() {
				if_block.c();
				if_block_anchor = createComment();
			},

			m: function mount(target, anchor) {
				if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				if (current_block_type === (current_block_type = select_block_type_4(ctx)) && if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block.d(1);
					if_block = current_block_type(component, ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if_block.d(detach);
				if (detach) {
					detachNode(if_block_anchor);
				}
			}
		};
	}

	// (32:8) {#if isFetchGroup}
	function create_if_block_3(component, ctx) {
		var div, div_1, img, text_1, div_2, div_3, label, text_2, text_3, input;

		return {
			c: function create() {
				div = createElement("div");
				div_1 = createElement("div");
				img = createElement("img");
				text_1 = createText("\r\n            ");
				div_2 = createElement("div");
				div_3 = createElement("div");
				label = createElement("label");
				text_2 = createText("Название");
				text_3 = createText("\r\n                    ");
				input = createElement("input");
				img.src = ctx.avatar;
				img.alt = "...";
				img.className = "img-thumbnail";
				addLoc(img, file, 34, 16, 1484);
				div_1.className = "col-md-4";
				addLoc(div_1, file, 33, 12, 1444);
				addLoc(label, file, 38, 20, 1656);
				setAttribute(input, "type", "text");
				input.value = ctx.name;
				input.className = "form-control";
				input.disabled = true;
				addLoc(input, file, 39, 20, 1701);
				div_3.className = "form-group";
				addLoc(div_3, file, 37, 16, 1610);
				div_2.className = "col-md-8";
				addLoc(div_2, file, 36, 12, 1570);
				div.className = "row";
				addLoc(div, file, 32, 8, 1413);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, div_1);
				append(div_1, img);
				append(div, text_1);
				append(div, div_2);
				append(div_2, div_3);
				append(div_3, label);
				append(label, text_2);
				append(div_3, text_3);
				append(div_3, input);
			},

			p: function update(changed, ctx) {
				if (changed.avatar) {
					img.src = ctx.avatar;
				}

				if (changed.name) {
					input.value = ctx.name;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}
			}
		};
	}

	// (44:8) {:else}
	function create_if_block_4(component, ctx) {
		var button, text;

		function click_handler(event) {
			component.getGroupById();
		}

		return {
			c: function create() {
				button = createElement("button");
				text = createText("Получить данные по ВК-группе");
				addListener(button, "click", click_handler);
				button.className = "btn btn-primary";
				addLoc(button, file, 44, 8, 1852);
			},

			m: function mount(target, anchor) {
				insert(target, button, anchor);
				append(button, text);
			},

			p: noop,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(button);
				}

				removeListener(button, "click", click_handler);
			}
		};
	}

	// (60:16) {#if fetchGroupList.length != vkGroupList.split('\n').length}
	function create_if_block_8(component, ctx) {
		var text;

		return {
			c: function create() {
				text = createText("Подгружаем...");
			},

			m: function mount(target, anchor) {
				insert(target, text, anchor);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(text);
				}
			}
		};
	}

	// (62:16) {:else}
	function create_if_block_9(component, ctx) {
		var text;

		return {
			c: function create() {
				text = createText("Готово");
			},

			m: function mount(target, anchor) {
				insert(target, text, anchor);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(text);
				}
			}
		};
	}

	// (71:12) {#each fetchGroupList as fetchGroup}
	function create_each_block(component, ctx) {
		var li, div, div_1, img, img_src_value, text_1, div_2, div_3, label, text_2, text_3, input, input_value_value;

		return {
			c: function create() {
				li = createElement("li");
				div = createElement("div");
				div_1 = createElement("div");
				img = createElement("img");
				text_1 = createText("\r\n                    ");
				div_2 = createElement("div");
				div_3 = createElement("div");
				label = createElement("label");
				text_2 = createText("Название");
				text_3 = createText("\r\n                            ");
				input = createElement("input");
				img.src = img_src_value = ctx.fetchGroup.avatar;
				img.alt = "...";
				img.className = "img-thumbnail";
				addLoc(img, file, 74, 24, 3443);
				div_1.className = "col-md-4";
				addLoc(div_1, file, 73, 20, 3395);
				addLoc(label, file, 78, 28, 3658);
				setAttribute(input, "type", "text");
				input.value = input_value_value = ctx.fetchGroup.name;
				input.className = "form-control";
				input.disabled = true;
				addLoc(input, file, 79, 28, 3711);
				div_3.className = "form-group";
				addLoc(div_3, file, 77, 24, 3604);
				div_2.className = "col-md-8";
				addLoc(div_2, file, 76, 20, 3556);
				div.className = "row";
				addLoc(div, file, 72, 16, 3356);
				li.className = "list-group-item svelte-uzvduc";
				addLoc(li, file, 71, 12, 3310);
			},

			m: function mount(target, anchor) {
				insert(target, li, anchor);
				append(li, div);
				append(div, div_1);
				append(div_1, img);
				append(div, text_1);
				append(div, div_2);
				append(div_2, div_3);
				append(div_3, label);
				append(label, text_2);
				append(div_3, text_3);
				append(div_3, input);
			},

			p: function update(changed, ctx) {
				if ((changed.fetchGroupList) && img_src_value !== (img_src_value = ctx.fetchGroup.avatar)) {
					img.src = img_src_value;
				}

				if ((changed.fetchGroupList) && input_value_value !== (input_value_value = ctx.fetchGroup.name)) {
					input.value = input_value_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(li);
				}
			}
		};
	}

	// (53:8) {#if fetchGroupList.length == 0}
	function create_if_block_6(component, ctx) {
		var button, text;

		function click_handler(event) {
			component.getGroupByList();
		}

		return {
			c: function create() {
				button = createElement("button");
				text = createText("Получить данные по ВК-группам");
				addListener(button, "click", click_handler);
				button.className = "btn btn-primary";
				addLoc(button, file, 53, 8, 2347);
			},

			m: function mount(target, anchor) {
				insert(target, button, anchor);
				append(button, text);
			},

			p: noop,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(button);
				}

				removeListener(button, "click", click_handler);
			}
		};
	}

	// (55:8) {:else}
	function create_if_block_7(component, ctx) {
		var p, text, text_1_value = ctx.fetchGroupList.length, text_1, text_2, span, span_class_value, text_5, div, div_1, div_1_aria_valuenow_value, div_1_aria_valuemax_value, text_7, ul;

		function select_block_type_1(ctx) {
			if (ctx.fetchGroupList.length != ctx.vkGroupList.split('\n').length) return create_if_block_8;
			return create_if_block_9;
		}

		var current_block_type = select_block_type_1(ctx);
		var if_block = current_block_type(component, ctx);

		var each_value = ctx.fetchGroupList;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(component, get_each_context(ctx, each_value, i));
		}

		return {
			c: function create() {
				p = createElement("p");
				text = createText("Получено ");
				text_1 = createText(text_1_value);
				text_2 = createText(" ВК-групп  \r\n            ");
				span = createElement("span");
				if_block.c();
				text_5 = createText("\r\n        ");
				div = createElement("div");
				div_1 = createElement("div");
				text_7 = createText("\r\n        ");
				ul = createElement("ul");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				span.className = span_class_value = "badge " + (ctx.fetchGroupList.length != ctx.vkGroupList.split('\n').length ? 'badge-warning' : 'badge-success') + " svelte-uzvduc";
				addLoc(span, file, 57, 12, 2546);
				addLoc(p, file, 55, 8, 2472);
				div_1.className = "progress-bar svelte-uzvduc";
				setAttribute(div_1, "role", "progressbar");
				setStyle(div_1, "width", "" + (ctx.fetchGroupList.length / ctx.vkGroupList.split('\n').length) * 100 + "%");
				setAttribute(div_1, "aria-valuenow", div_1_aria_valuenow_value = ctx.fetchGroupList.length);
				setAttribute(div_1, "aria-valuemin", "0");
				setAttribute(div_1, "aria-valuemax", div_1_aria_valuemax_value = ctx.vkGroupList.split('\n').length);
				addLoc(div_1, file, 67, 12, 2937);
				div.className = "progress svelte-uzvduc";
				addLoc(div, file, 66, 8, 2901);
				ul.className = "list-group svelte-uzvduc";
				addLoc(ul, file, 69, 8, 3202);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
				append(p, text);
				append(p, text_1);
				append(p, text_2);
				append(p, span);
				if_block.m(span, null);
				insert(target, text_5, anchor);
				insert(target, div, anchor);
				append(div, div_1);
				insert(target, text_7, anchor);
				insert(target, ul, anchor);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(ul, null);
				}

				component.refs.fetchGroupListEl = ul;
			},

			p: function update(changed, ctx) {
				if ((changed.fetchGroupList) && text_1_value !== (text_1_value = ctx.fetchGroupList.length)) {
					setData(text_1, text_1_value);
				}

				if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
					if_block.d(1);
					if_block = current_block_type(component, ctx);
					if_block.c();
					if_block.m(span, null);
				}

				if ((changed.fetchGroupList || changed.vkGroupList) && span_class_value !== (span_class_value = "badge " + (ctx.fetchGroupList.length != ctx.vkGroupList.split('\n').length ? 'badge-warning' : 'badge-success') + " svelte-uzvduc")) {
					span.className = span_class_value;
				}

				if (changed.fetchGroupList || changed.vkGroupList) {
					setStyle(div_1, "width", "" + (ctx.fetchGroupList.length / ctx.vkGroupList.split('\n').length) * 100 + "%");
				}

				if ((changed.fetchGroupList) && div_1_aria_valuenow_value !== (div_1_aria_valuenow_value = ctx.fetchGroupList.length)) {
					setAttribute(div_1, "aria-valuenow", div_1_aria_valuenow_value);
				}

				if ((changed.vkGroupList) && div_1_aria_valuemax_value !== (div_1_aria_valuemax_value = ctx.vkGroupList.split('\n').length)) {
					setAttribute(div_1, "aria-valuemax", div_1_aria_valuemax_value);
				}

				if (changed.fetchGroupList) {
					each_value = ctx.fetchGroupList;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(ul, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(p);
				}

				if_block.d();
				if (detach) {
					detachNode(text_5);
					detachNode(div);
					detachNode(text_7);
					detachNode(ul);
				}

				destroyEach(each_blocks, detach);

				if (component.refs.fetchGroupListEl === ul) component.refs.fetchGroupListEl = null;
			}
		};
	}

	// (26:4) {#if loadType == 'oneItem'}
	function create_if_block_2(component, ctx) {
		var div, label, text, text_1, input, input_updating = false, text_2, small, text_3, text_5, if_block_anchor;

		function input_input_handler() {
			input_updating = true;
			component.set({ vkGroupId: toNumber(input.value) });
			input_updating = false;
		}

		function input_handler(event) {
			component.set({ isFetchGroup: false });
		}

		function select_block_type(ctx) {
			if (ctx.isFetchGroup) return create_if_block_3;
			return create_if_block_4;
		}

		var current_block_type = select_block_type(ctx);
		var if_block = current_block_type(component, ctx);

		return {
			c: function create() {
				div = createElement("div");
				label = createElement("label");
				text = createText("ID ВК-группы");
				text_1 = createText("\r\n            ");
				input = createElement("input");
				text_2 = createText("\r\n            ");
				small = createElement("small");
				text_3 = createText("Обычно указан в ссылке https://vk.com/public[ID].");
				text_5 = createText("\r\n        ");
				if_block.c();
				if_block_anchor = createComment();
				addLoc(label, file, 27, 12, 1106);
				addListener(input, "input", input_input_handler);
				addListener(input, "input", input_handler);
				setAttribute(input, "type", "number");
				input.className = "form-control";
				addLoc(input, file, 28, 12, 1147);
				small.className = "form-text text-muted";
				addLoc(small, file, 29, 12, 1266);
				div.className = "form-group";
				addLoc(div, file, 26, 8, 1068);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, label);
				append(label, text);
				append(div, text_1);
				append(div, input);

				input.value = ctx.vkGroupId;

				append(div, text_2);
				append(div, small);
				append(small, text_3);
				insert(target, text_5, anchor);
				if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
			},

			p: function update(changed, ctx) {
				if (!input_updating && changed.vkGroupId) input.value = ctx.vkGroupId;

				if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block.d(1);
					if_block = current_block_type(component, ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(input, "input", input_input_handler);
				removeListener(input, "input", input_handler);
				if (detach) {
					detachNode(text_5);
				}

				if_block.d(detach);
				if (detach) {
					detachNode(if_block_anchor);
				}
			}
		};
	}

	// (47:4) {:else}
	function create_if_block_5(component, ctx) {
		var div, label, text, text_1, textarea, textarea_updating = false, text_2, small, text_3, text_5, if_block_anchor;

		function textarea_input_handler() {
			textarea_updating = true;
			component.set({ vkGroupList: textarea.value });
			textarea_updating = false;
		}

		function input_handler(event) {
			component.set({ fetchGroupList: [] });
		}

		function select_block_type_2(ctx) {
			if (ctx.fetchGroupList.length == 0) return create_if_block_6;
			return create_if_block_7;
		}

		var current_block_type = select_block_type_2(ctx);
		var if_block = current_block_type(component, ctx);

		return {
			c: function create() {
				div = createElement("div");
				label = createElement("label");
				text = createText("Список ссылок ВК-групп");
				text_1 = createText("\r\n            ");
				textarea = createElement("textarea");
				text_2 = createText("\r\n            ");
				small = createElement("small");
				text_3 = createText("Разделитель между ссылками ПЕРЕНОС СТРОКИ");
				text_5 = createText("\r\n        ");
				if_block.c();
				if_block_anchor = createComment();
				addLoc(label, file, 48, 12, 2023);
				addListener(textarea, "input", textarea_input_handler);
				addListener(textarea, "input", input_handler);
				textarea.className = "form-control";
				addLoc(textarea, file, 49, 12, 2074);
				small.className = "form-text text-muted";
				addLoc(small, file, 50, 12, 2194);
				div.className = "form-group";
				addLoc(div, file, 47, 8, 1985);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, label);
				append(label, text);
				append(div, text_1);
				append(div, textarea);

				textarea.value = ctx.vkGroupList;

				append(div, text_2);
				append(div, small);
				append(small, text_3);
				insert(target, text_5, anchor);
				if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
			},

			p: function update(changed, ctx) {
				if (!textarea_updating && changed.vkGroupList) textarea.value = ctx.vkGroupList;

				if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block.d(1);
					if_block = current_block_type(component, ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(textarea, "input", textarea_input_handler);
				removeListener(textarea, "input", input_handler);
				if (detach) {
					detachNode(text_5);
				}

				if_block.d(detach);
				if (detach) {
					detachNode(if_block_anchor);
				}
			}
		};
	}

	// (1:0) {#if formStore.get().vkGroup}
	function create_if_block(component, ctx) {
		var div, div_1, img, img_src_value, text_1, div_2, div_3, label, text_2, text_3, input, input_value_value, text_5, div_4, label_1, text_6, text_7, input_1, input_1_updating = false;

		function input_1_input_handler() {
			input_1_updating = true;
			ctx.formStore.get().vkGroup.price = input_1.value;
			component.set({ formStore: ctx.formStore });
			input_1_updating = false;
		}

		return {
			c: function create() {
				div = createElement("div");
				div_1 = createElement("div");
				img = createElement("img");
				text_1 = createText("\r\n        ");
				div_2 = createElement("div");
				div_3 = createElement("div");
				label = createElement("label");
				text_2 = createText("Название");
				text_3 = createText("\r\n                ");
				input = createElement("input");
				text_5 = createText("\r\n            ");
				div_4 = createElement("div");
				label_1 = createElement("label");
				text_6 = createText("Стоимость");
				text_7 = createText("\r\n                ");
				input_1 = createElement("input");
				img.src = img_src_value = ctx.formStore.get().vkGroup.avatar;
				img.className = "circle";
				setStyle(img, "width", "100%");
				addLoc(img, file, 3, 12, 98);
				div_1.className = "col-md-4";
				addLoc(div_1, file, 2, 8, 62);
				addLoc(label, file, 7, 16, 281);
				setAttribute(input, "type", "text");
				input.value = input_value_value = ctx.formStore.get().vkGroup.name;
				input.className = "form-control";
				input.disabled = true;
				addLoc(input, file, 8, 16, 322);
				div_3.className = "form-group";
				addLoc(div_3, file, 6, 12, 239);
				addLoc(label_1, file, 11, 16, 486);
				addListener(input_1, "input", input_1_input_handler);
				setAttribute(input_1, "type", "text");
				input_1.className = "form-control";
				addLoc(input_1, file, 12, 16, 528);
				div_4.className = "form-group";
				addLoc(div_4, file, 10, 12, 444);
				div_2.className = "col-md-8";
				addLoc(div_2, file, 5, 8, 203);
				div.className = "row";
				addLoc(div, file, 1, 4, 35);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, div_1);
				append(div_1, img);
				append(div, text_1);
				append(div, div_2);
				append(div_2, div_3);
				append(div_3, label);
				append(label, text_2);
				append(div_3, text_3);
				append(div_3, input);
				append(div_2, text_5);
				append(div_2, div_4);
				append(div_4, label_1);
				append(label_1, text_6);
				append(div_4, text_7);
				append(div_4, input_1);

				input_1.value = ctx.formStore.get().vkGroup.price;
			},

			p: function update(changed, _ctx) {
				ctx = _ctx;
				if ((changed.formStore) && img_src_value !== (img_src_value = ctx.formStore.get().vkGroup.avatar)) {
					img.src = img_src_value;
				}

				if ((changed.formStore) && input_value_value !== (input_value_value = ctx.formStore.get().vkGroup.name)) {
					input.value = input_value_value;
				}

				if (!input_1_updating && changed.formStore) input_1.value = ctx.formStore.get().vkGroup.price;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(input_1, "input", input_1_input_handler);
			}
		};
	}

	// (17:0) {:else}
	function create_if_block_1(component, ctx) {
		var ul, li, a, text, text_2, li_1, a_1, text_3, text_6, if_block_anchor;

		function click_handler(event) {
			component.set({ loadType: 'oneItem' });
		}

		function click_handler_1(event) {
			component.set({ loadType: 'listItem' });
		}

		function select_block_type_3(ctx) {
			if (ctx.loadType == 'oneItem') return create_if_block_2;
			return create_if_block_5;
		}

		var current_block_type = select_block_type_3(ctx);
		var if_block = current_block_type(component, ctx);

		return {
			c: function create() {
				ul = createElement("ul");
				li = createElement("li");
				a = createElement("a");
				text = createText("Поштучно");
				text_2 = createText("\r\n    ");
				li_1 = createElement("li");
				a_1 = createElement("a");
				text_3 = createText("Списком");
				text_6 = createText("\r\n    ");
				if_block.c();
				if_block_anchor = createComment();
				addListener(a, "click", click_handler);
				a.className = "nav-link";
				toggleClass(a, "active", ctx.loadType == 'oneItem');
				addLoc(a, file, 19, 8, 736);
				li.className = "nav-item svelte-uzvduc";
				addLoc(li, file, 18, 4, 705);
				addListener(a_1, "click", click_handler_1);
				a_1.className = "nav-link";
				toggleClass(a_1, "active", ctx.loadType == 'listItem');
				addLoc(a_1, file, 22, 8, 893);
				li_1.className = "nav-item svelte-uzvduc";
				addLoc(li_1, file, 21, 4, 862);
				ul.className = "nav nav-tabs svelte-uzvduc";
				addLoc(ul, file, 17, 4, 674);
			},

			m: function mount(target, anchor) {
				insert(target, ul, anchor);
				append(ul, li);
				append(li, a);
				append(a, text);
				append(ul, text_2);
				append(ul, li_1);
				append(li_1, a_1);
				append(a_1, text_3);
				insert(target, text_6, anchor);
				if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
			},

			p: function update(changed, ctx) {
				if (changed.loadType) {
					toggleClass(a, "active", ctx.loadType == 'oneItem');
					toggleClass(a_1, "active", ctx.loadType == 'listItem');
				}

				if (current_block_type === (current_block_type = select_block_type_3(ctx)) && if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block.d(1);
					if_block = current_block_type(component, ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(ul);
				}

				removeListener(a, "click", click_handler);
				removeListener(a_1, "click", click_handler_1);
				if (detach) {
					detachNode(text_6);
				}

				if_block.d(detach);
				if (detach) {
					detachNode(if_block_anchor);
				}
			}
		};
	}

	function get_each_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.fetchGroup = list[i];
		child_ctx.each_value = list;
		child_ctx.fetchGroup_index = i;
		return child_ctx;
	}

	function VkGroups(options) {
		this._debugName = '<VkGroups>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this.refs = {};
		this._state = assign(data(), options.data);
		if (!('formStore' in this._state)) console.warn("<VkGroups> was created without expected data property 'formStore'");
		if (!('loadType' in this._state)) console.warn("<VkGroups> was created without expected data property 'loadType'");
		if (!('vkGroupId' in this._state)) console.warn("<VkGroups> was created without expected data property 'vkGroupId'");
		if (!('isFetchGroup' in this._state)) console.warn("<VkGroups> was created without expected data property 'isFetchGroup'");
		if (!('avatar' in this._state)) console.warn("<VkGroups> was created without expected data property 'avatar'");
		if (!('name' in this._state)) console.warn("<VkGroups> was created without expected data property 'name'");
		if (!('vkGroupList' in this._state)) console.warn("<VkGroups> was created without expected data property 'vkGroupList'");
		if (!('fetchGroupList' in this._state)) console.warn("<VkGroups> was created without expected data property 'fetchGroupList'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(VkGroups.prototype, protoDev);
	assign(VkGroups.prototype, methods);

	VkGroups.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	var phalconApi = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	    module.exports = factory();
	}(commonjsGlobal, (function () {

	    var phalconApi = {
	        vkGroups: {
	            all: function () {
	                return new Promise(resolve => {
	                    fetch('/vk-groups/all')
	                        .then(function (response) {
	                            return response.json();
	                        })
	                        .then(function (json) {
	                            resolve(json);
	                        })
	                        .catch(error => {
	                            console.error(error);
	                        });
	                });
	            },
	            create: function (data) {
	                return new Promise(resolve => {
	                    var xhr = new XMLHttpRequest();
	                    xhr.open("POST", '/vk-groups/create', true);
	                    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

	                    xhr.onload = function (e) {
	                        resolve(xhr.status);
	                    };
	                    xhr.send(JSON.stringify(data));
	                });
	            },
	            insert: function (data) {
	                return new Promise(resolve => {
	                    var xhr = new XMLHttpRequest();
	                    xhr.open("POST", '/vk-groups/insert', true);
	                    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

	                    xhr.onload = function (e) {
	                        resolve(xhr.status);
	                    };
	                    xhr.send(JSON.stringify(data));
	                });
	            },
	            remove: function (id) {
	                return new Promise(resolve => {
	                    var xhr = new XMLHttpRequest();
	                    xhr.open("POST", '/vk-groups/remove/' + id, true);
	                    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

	                    xhr.onload = function (e) {
	                        resolve(xhr.status);
	                    };
	                    xhr.send();
	                });
	            },
	            update: function (id, data) {
	                return new Promise(resolve => {
	                    var xhr = new XMLHttpRequest();
	                    xhr.open("POST", '/vk-groups/update/' + id, true);
	                    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

	                    xhr.onload = function (e) {
	                        resolve(xhr);
	                    };
	                    xhr.send( JSON.stringify(data) );
	                });
	            }
	        },
	        users: {
	            all: function () {
	                return new Promise(resolve => {
	                    fetch('/users/all')
	                        .then(function (response) {
	                            return response.json();
	                        })
	                        .then(function (json) {
	                            resolve(json);
	                        })
	                        .catch(error => {
	                            console.error(error);
	                        });
	                });
	            },
	            create: function (data) {
	                return new Promise(resolve => {
	                    var xhr = new XMLHttpRequest();
	                    xhr.open("POST", '/users/create', true);
	                    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

	                    xhr.onload = function (e) {
	                        resolve(xhr.status);
	                    };
	                    xhr.send(JSON.stringify(data));
	                });
	            },
	            get: function (id) {
	                return new Promise(resolve => {
	                    fetch('/users/get/' + id)
	                        .then(function (response) {
	                            return response.json();
	                        })
	                        .then(function (json) {
	                            resolve(json);
	                        })
	                        .catch(error => {
	                            console.error(error);
	                        });
	                });
	            }
	        },
	        roles: {
	            all: function () {
	                return new Promise(resolve => {
	                    fetch('/roles/all')
	                        .then(function (response) {
	                            return response.json();
	                        })
	                        .then(function (json) {
	                            resolve(json);
	                        })
	                        .catch(error => {
	                            console.error(error);
	                        });
	                });
	            },
	        },
	        packages: {
	            all: function () {
	                return new Promise(resolve => {
	                    fetch('/packages/all')
	                        .then(function (response) {
	                            return response.json();
	                        })
	                        .then(function (json) {
	                            resolve(json);
	                        })
	                        .catch(error => {
	                            console.error(error);
	                        });
	                });
	            },
	            create: function (data) {
	                console.log('create', data);
	                return new Promise(resolve => {
	                    var xhr = new XMLHttpRequest();
	                    xhr.open("POST", '/packages/create', true);
	                    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

	                    xhr.onload = function (e) {
	                        resolve(xhr.status);
	                    };
	                    xhr.send(JSON.stringify(data));
	                });
	            },
	        },
	        session: {
	            get: function() {
	                return new Promise(resolve => {
	                    fetch('/session/get')
	                        .then(function (response) {
	                            return response.json();
	                        })
	                        .then(function (json) {
	                            resolve(json);
	                        })
	                        .catch(error => {
	                            console.error(error);
	                        });
	                });
	            },
	            start: function(data) {
	                return new Promise(resolve => {
	                    var xhr = new XMLHttpRequest();
	                    xhr.open("POST", '/session/start', true);
	                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	                    var body = 'email=' + encodeURIComponent(data.email) +
	                    '&password=' + encodeURIComponent(data.password);

	                    xhr.onload = function (e) {
	                        resolve(xhr.status);
	                    };
	                    
	                    xhr.send(body);
	                });
	            }
	        },
	        orders: {
	            all: function () {
	                return new Promise(resolve => {
	                    fetch('/orders/all')
	                        .then(function (response) {
	                            return response.json();
	                        })
	                        .then(function (json) {
	                            resolve(json);
	                        })
	                        .catch(error => {
	                            console.error(error);
	                        });
	                });
	            },
	            get: function () {
	                return new Promise(resolve => {
	                    fetch('/orders/get')
	                        .then(function (response) {
	                            return response.json();
	                        })
	                        .then(function (json) {
	                            resolve(json);
	                        })
	                        .catch(error => {
	                            console.error(error);
	                        });
	                });
	            },
	            create: function (data) {
	                return new Promise(resolve => {
	                    var xhr = new XMLHttpRequest();
	                    xhr.open("POST", '/orders/create', true);
	                    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

	                    xhr.onload = function (e) {
	                        resolve(xhr.status);
	                    };
	                    xhr.send(JSON.stringify(data));
	                });
	            },
	            update: function (id, data) {
	                return new Promise(resolve => {
	                    var xhr = new XMLHttpRequest();
	                    xhr.open("POST", '/orders/update/' + id, true);
	                    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

	                    xhr.onload = function (e) {
	                        resolve(xhr);
	                    };
	                    xhr.send( JSON.stringify(data) );
	                });
	            }
	        },
	        status: {
	            all: function () {
	                return new Promise(resolve => {
	                    fetch('/status/all')
	                        .then(function (response) {
	                            return response.json();
	                        })
	                        .then(function (json) {
	                            resolve(json);
	                        })
	                        .catch(error => {
	                            console.error(error);
	                        });
	                });
	            },
	        }
	    };

	    return phalconApi;

	})));
	});

	/* src\forms\packages.html generated by Svelte v2.13.5 */

	function data$1() {
	    return { name: '', price: 0, groups: [] };
	}
	var methods$1 = {
	    saveForm() {
	        console.log('saveForm');
	        const { name, price, formStore } = this.get();
	        const isCorrect = true;
	        
	        var groups = $('#groups').val();
	        if(!groups || groups.length == 0) groups = formStore.get().groups;

	        formStore.set({ name, price, groups, isCorrect });
	    }
	};

	function oncreate() {
	    const self = this;
	    
	    phalconApi.vkGroups.all().then(groups => {
	        this.set({ groups });
	        $('#groups').select2();
	        $('#groups').on('change', function (e) {
	            self.saveForm();
	        });
	    });
	}
	function onstate({ changed, current, previous }) {
	    if(current.groups && current.groups.length > 0) this.saveForm();
			}
	const file$1 = "src\\forms\\packages.html";

	function create_main_fragment$1(component, ctx) {
		var div, div_1, div_2, label, text, text_1, input, input_updating = false, text_2, small, text_3, text_6, div_3, div_4, label_1, text_7, text_8, input_1, input_1_updating = false, text_9, small_1, text_10, text_13, div_5, div_6, label_2, text_14, text_15, select, current;

		function input_input_handler() {
			input_updating = true;
			component.set({ name: input.value });
			input_updating = false;
		}

		function input_1_input_handler() {
			input_1_updating = true;
			component.set({ price: toNumber(input_1.value) });
			input_1_updating = false;
		}

		var each_value = ctx.groups;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$1(component, get_each_context$1(ctx, each_value, i));
		}

		return {
			c: function create() {
				div = createElement("div");
				div_1 = createElement("div");
				div_2 = createElement("div");
				label = createElement("label");
				text = createText("Название");
				text_1 = createText("\r\n            ");
				input = createElement("input");
				text_2 = createText("\r\n            ");
				small = createElement("small");
				text_3 = createText("Отображаемое название пакета");
				text_6 = createText("\r\n    ");
				div_3 = createElement("div");
				div_4 = createElement("div");
				label_1 = createElement("label");
				text_7 = createText("Цена");
				text_8 = createText("\r\n            ");
				input_1 = createElement("input");
				text_9 = createText("\r\n            ");
				small_1 = createElement("small");
				text_10 = createText("Цена пакета");
				text_13 = createText("\r\n    ");
				div_5 = createElement("div");
				div_6 = createElement("div");
				label_2 = createElement("label");
				text_14 = createText("ВК-группы");
				text_15 = createText("\r\n            ");
				select = createElement("select");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				addLoc(label, file$1, 3, 12, 93);
				addListener(input, "input", input_input_handler);
				setAttribute(input, "type", "text");
				input.className = "form-control";
				addLoc(input, file$1, 4, 12, 130);
				small.className = "form-text text-muted";
				addLoc(small, file$1, 5, 12, 202);
				div_2.className = "form-group";
				addLoc(div_2, file$1, 2, 8, 55);
				div_1.className = "col-md-6";
				addLoc(div_1, file$1, 1, 4, 23);
				addLoc(label_1, file$1, 10, 12, 378);
				addListener(input_1, "input", input_1_input_handler);
				setAttribute(input_1, "type", "number");
				input_1.className = "form-control";
				addLoc(input_1, file$1, 11, 12, 411);
				small_1.className = "form-text text-muted";
				addLoc(small_1, file$1, 12, 12, 486);
				div_4.className = "form-group";
				addLoc(div_4, file$1, 9, 8, 340);
				div_3.className = "col-md-6";
				addLoc(div_3, file$1, 8, 4, 308);
				addLoc(label_2, file$1, 17, 12, 646);
				select.id = "groups";
				select.className = "js-example-responsive form-control";
				select.multiple = "multiple";
				setStyle(select, "width", "100%");
				addLoc(select, file$1, 18, 12, 684);
				div_6.className = "form-group";
				addLoc(div_6, file$1, 16, 8, 608);
				div_5.className = "col-md-12";
				addLoc(div_5, file$1, 15, 4, 575);
				div.className = "row";
				addLoc(div, file$1, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, div_1);
				append(div_1, div_2);
				append(div_2, label);
				append(label, text);
				append(div_2, text_1);
				append(div_2, input);

				input.value = ctx.name;

				append(div_2, text_2);
				append(div_2, small);
				append(small, text_3);
				append(div, text_6);
				append(div, div_3);
				append(div_3, div_4);
				append(div_4, label_1);
				append(label_1, text_7);
				append(div_4, text_8);
				append(div_4, input_1);

				input_1.value = ctx.price;

				append(div_4, text_9);
				append(div_4, small_1);
				append(small_1, text_10);
				append(div, text_13);
				append(div, div_5);
				append(div_5, div_6);
				append(div_6, label_2);
				append(label_2, text_14);
				append(div_6, text_15);
				append(div_6, select);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(select, null);
				}

				current = true;
			},

			p: function update(changed, ctx) {
				if (!input_updating && changed.name) input.value = ctx.name;
				if (!input_1_updating && changed.price) input_1.value = ctx.price;

				if (changed.groups || changed.formStore) {
					each_value = ctx.groups;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$1(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block$1(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(select, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(input, "input", input_input_handler);
				removeListener(input_1, "input", input_1_input_handler);

				destroyEach(each_blocks, detach);
			}
		};
	}

	// (20:16) {#each groups as group}
	function create_each_block$1(component, ctx) {
		var option, text_value = ctx.group.name, text, option_value_value, option_selected_value;

		return {
			c: function create() {
				option = createElement("option");
				text = createText(text_value);
				option.__value = option_value_value = ctx.group.id;
				option.value = option.__value;
				option.selected = option_selected_value = ctx.formStore.get().groups && ctx.formStore.get().groups.indexOf(ctx.group.id) != -1 ? 'selected' : '';
				addLoc(option, file$1, 20, 16, 846);
			},

			m: function mount(target, anchor) {
				insert(target, option, anchor);
				append(option, text);
			},

			p: function update(changed, ctx) {
				if ((changed.groups) && text_value !== (text_value = ctx.group.name)) {
					setData(text, text_value);
				}

				if ((changed.groups) && option_value_value !== (option_value_value = ctx.group.id)) {
					option.__value = option_value_value;
				}

				option.value = option.__value;
				if ((changed.formStore || changed.groups) && option_selected_value !== (option_selected_value = ctx.formStore.get().groups && ctx.formStore.get().groups.indexOf(ctx.group.id) != -1 ? 'selected' : '')) {
					option.selected = option_selected_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(option);
				}
			}
		};
	}

	function get_each_context$1(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.group = list[i];
		child_ctx.each_value = list;
		child_ctx.group_index = i;
		return child_ctx;
	}

	function Packages(options) {
		this._debugName = '<Packages>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$1(), options.data);
		if (!('name' in this._state)) console.warn("<Packages> was created without expected data property 'name'");
		if (!('price' in this._state)) console.warn("<Packages> was created without expected data property 'price'");
		if (!('groups' in this._state)) console.warn("<Packages> was created without expected data property 'groups'");
		if (!('formStore' in this._state)) console.warn("<Packages> was created without expected data property 'formStore'");
		this._intro = !!options.intro;

		this._handlers.state = [onstate];

		onstate.call(this, { changed: assignTrue({}, this._state), current: this._state });

		this._fragment = create_main_fragment$1(this, this._state);

		this.root._oncreate.push(() => {
			oncreate.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Packages.prototype, protoDev);
	assign(Packages.prototype, methods$1);

	Packages.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src\forms\orders.html generated by Svelte v2.13.5 */

	function Price({ groups, packages }){
	    var selectedGroups = $('#groups').val();
	    var selectedPackages = $('#packages').val();
	    var price = 0;
	    
	    groups.map(group => {
	        if(selectedGroups.indexOf(String(group.id)) != -1) {
	            price += parseFloat(group.price);
	        }
	    });
	    
	    packages.map(item => {
	        if(selectedPackages.indexOf(String(item.id)) != -1) {
	            price += parseFloat(item.price);
	        }
	    });

	    return price;
	}
	function data$2() {
	    return { name: '', email: '', password: '', phone: '', groups: [], packages: [], users: [], status: [] };
	}
	var methods$2 = {
	    saveForm() {
	        const { name, email, password, formStore, phone } = this.get();
	        const id = formStore.get().current ? formStore.get().current.id : null;

	        var user = { name, email, password };
	        var user_id = $('#users').val();
	        var status_id = $('#status').val();

	        var groups = $('#groups').val();
	        if(!groups || groups.length == 0) groups = formStore.get().groups;

	        var packages = $('#packages').val();
	        if(!packages || packages.length == 0) packages = formStore.get().packages;

	        const order = { id, status_id, user_id, phone, user, groups, packages };

	        formStore.set({ order });
	    }
	};

	async function oncreate$1() {
	    const self = this;
	    const { formStore } = this.get();
	    const { session, rights } = this.options.root.get();
	    this.set({ session, rights });
	   
	    var { current } = formStore.get();
	    if(current){
	        const groups = current.groups.map(item => {
	            return item.id;
	        });

	        const packages = current.packages.map(item => {
	            return item.id;
	        });

	        this.set({ phone: current.phone });
	        formStore.set({ groups, packages });
	    }

	    await phalconApi.vkGroups.all().then(groups => {
	        this.set({ groups });
	        $('#groups').select2();
	        $('#groups').on('change', function (e) {
	            self.set({ groups });
	        });
	    });

	    await phalconApi.packages.all().then(packages => {
	        this.set({ packages });
	        $('#packages').select2();
	        $('#packages').on('change', function (e) {
	            self.set({ packages });
	        });
	    });

	    await phalconApi.users.all().then(users => {
	        this.set({ users });
	        $('#users').select2();
	        $('#users').on('change', function (e) {
	            self.set({ users });
	        });
	    });

	    await phalconApi.status.all().then(status => {
	        this.set({ status });
	        $('#status').select2();
	        $('#status').on('change', function (e) {
	            self.set({ status });
	        });
	    });
	}
	function ondestroy(){
	    const { formStore } = this.get();
	    formStore.set({ current: null, groups: null, packages: null });
	}
	function onstate$1({ changed, current, previous }) {
	    if(current.groups && current.groups.length > 0) { 
	        this.saveForm(); 
	    }
			}
	const file$2 = "src\\forms\\orders.html";

	function create_main_fragment$2(component, ctx) {
		var div, current;

		function select_block_type(ctx) {
			if (ctx.formStore.get().current) return create_if_block$1;
			return create_if_block_1$1;
		}

		var current_block_type = select_block_type(ctx);
		var if_block = current_block_type(component, ctx);

		return {
			c: function create() {
				div = createElement("div");
				if_block.c();
				div.className = "row";
				addLoc(div, file$2, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				if_block.m(div, null);
				current = true;
			},

			p: function update(changed, ctx) {
				if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block.d(1);
					if_block = current_block_type(component, ctx);
					if_block.c();
					if_block.m(div, null);
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				if_block.d();
			}
		};
	}

	// (13:20) {#each status as item}
	function create_each_block$2(component, ctx) {
		var option, text_value = ctx.item.name, text, option_value_value, option_selected_value;

		return {
			c: function create() {
				option = createElement("option");
				text = createText(text_value);
				option.__value = option_value_value = ctx.item.id;
				option.value = option.__value;
				option.selected = option_selected_value = ctx.formStore.get().current.status_id == ctx.item.id ? 'selected' : '';
				addLoc(option, file$2, 13, 20, 509);
			},

			m: function mount(target, anchor) {
				insert(target, option, anchor);
				append(option, text);
			},

			p: function update(changed, ctx) {
				if ((changed.status) && text_value !== (text_value = ctx.item.name)) {
					setData(text, text_value);
				}

				if ((changed.status) && option_value_value !== (option_value_value = ctx.item.id)) {
					option.__value = option_value_value;
				}

				option.value = option.__value;
				if ((changed.formStore || changed.status) && option_selected_value !== (option_selected_value = ctx.formStore.get().current.status_id == ctx.item.id ? 'selected' : '')) {
					option.selected = option_selected_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(option);
				}
			}
		};
	}

	// (23:20) {#each groups as group}
	function create_each_block_1(component, ctx) {
		var option, text_value = ctx.group.name, text, text_1, text_2_value = ctx.group.price, text_2, text_3, option_value_value, option_selected_value;

		return {
			c: function create() {
				option = createElement("option");
				text = createText(text_value);
				text_1 = createText(" ");
				text_2 = createText(text_2_value);
				text_3 = createText(" руб");
				option.__value = option_value_value = ctx.group.id;
				option.value = option.__value;
				option.selected = option_selected_value = ctx.formStore.get().groups && ctx.formStore.get().groups.indexOf(ctx.group.id) != -1 ? 'selected' : '';
				addLoc(option, file$2, 23, 20, 1002);
			},

			m: function mount(target, anchor) {
				insert(target, option, anchor);
				append(option, text);
				append(option, text_1);
				append(option, text_2);
				append(option, text_3);
			},

			p: function update(changed, ctx) {
				if ((changed.groups) && text_value !== (text_value = ctx.group.name)) {
					setData(text, text_value);
				}

				if ((changed.groups) && text_2_value !== (text_2_value = ctx.group.price)) {
					setData(text_2, text_2_value);
				}

				if ((changed.groups) && option_value_value !== (option_value_value = ctx.group.id)) {
					option.__value = option_value_value;
				}

				option.value = option.__value;
				if ((changed.formStore || changed.groups) && option_selected_value !== (option_selected_value = ctx.formStore.get().groups && ctx.formStore.get().groups.indexOf(ctx.group.id) != -1 ? 'selected' : '')) {
					option.selected = option_selected_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(option);
				}
			}
		};
	}

	// (33:20) {#each packages as item}
	function create_each_block_2(component, ctx) {
		var option, text_value = ctx.item.name, text, text_1, text_2_value = ctx.item.price, text_2, text_3, option_value_value, option_selected_value;

		return {
			c: function create() {
				option = createElement("option");
				text = createText(text_value);
				text_1 = createText(" ");
				text_2 = createText(text_2_value);
				text_3 = createText(" руб");
				option.__value = option_value_value = ctx.item.id;
				option.value = option.__value;
				option.selected = option_selected_value = ctx.formStore.get().packages && ctx.formStore.get().packages.indexOf(ctx.item.id) != -1 ? 'selected' : '';
				addLoc(option, file$2, 33, 20, 1543);
			},

			m: function mount(target, anchor) {
				insert(target, option, anchor);
				append(option, text);
				append(option, text_1);
				append(option, text_2);
				append(option, text_3);
			},

			p: function update(changed, ctx) {
				if ((changed.packages) && text_value !== (text_value = ctx.item.name)) {
					setData(text, text_value);
				}

				if ((changed.packages) && text_2_value !== (text_2_value = ctx.item.price)) {
					setData(text_2, text_2_value);
				}

				if ((changed.packages) && option_value_value !== (option_value_value = ctx.item.id)) {
					option.__value = option_value_value;
				}

				option.value = option.__value;
				if ((changed.formStore || changed.packages) && option_selected_value !== (option_selected_value = ctx.formStore.get().packages && ctx.formStore.get().packages.indexOf(ctx.item.id) != -1 ? 'selected' : '')) {
					option.selected = option_selected_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(option);
				}
			}
		};
	}

	// (43:8) {#if session && !session.name}
	function create_if_block_2$1(component, ctx) {
		var div, div_1, label, text, text_1, input, input_updating = false, text_4, div_2, div_3, label_1, text_5, text_6, input_1, input_1_updating = false, text_9, div_4, div_5, label_2, text_10, text_11, input_2, input_2_updating = false;

		function input_input_handler() {
			input_updating = true;
			component.set({ name: input.value });
			input_updating = false;
		}

		function input_1_input_handler() {
			input_1_updating = true;
			component.set({ email: input_1.value });
			input_1_updating = false;
		}

		function input_2_input_handler() {
			input_2_updating = true;
			component.set({ password: input_2.value });
			input_2_updating = false;
		}

		return {
			c: function create() {
				div = createElement("div");
				div_1 = createElement("div");
				label = createElement("label");
				text = createText("Ваше имя");
				text_1 = createText("\r\n                ");
				input = createElement("input");
				text_4 = createText("\r\n        ");
				div_2 = createElement("div");
				div_3 = createElement("div");
				label_1 = createElement("label");
				text_5 = createText("Ваш email");
				text_6 = createText("\r\n                ");
				input_1 = createElement("input");
				text_9 = createText("\r\n        ");
				div_4 = createElement("div");
				div_5 = createElement("div");
				label_2 = createElement("label");
				text_10 = createText("Пароль");
				text_11 = createText("\r\n                ");
				input_2 = createElement("input");
				addLoc(label, file$2, 45, 16, 2110);
				addListener(input, "input", input_input_handler);
				setAttribute(input, "type", "text");
				input.className = "form-control";
				addLoc(input, file$2, 46, 16, 2151);
				div_1.className = "form-group";
				addLoc(div_1, file$2, 44, 12, 2068);
				div.className = "col-md-6";
				addLoc(div, file$2, 43, 8, 2032);
				addLoc(label_1, file$2, 51, 16, 2333);
				addListener(input_1, "input", input_1_input_handler);
				setAttribute(input_1, "type", "email");
				input_1.className = "form-control";
				addLoc(input_1, file$2, 52, 16, 2375);
				div_3.className = "form-group";
				addLoc(div_3, file$2, 50, 12, 2291);
				div_2.className = "col-md-6";
				addLoc(div_2, file$2, 49, 8, 2255);
				addLoc(label_2, file$2, 57, 16, 2560);
				addListener(input_2, "input", input_2_input_handler);
				setAttribute(input_2, "type", "password");
				input_2.className = "form-control";
				addLoc(input_2, file$2, 58, 16, 2599);
				div_5.className = "form-group";
				addLoc(div_5, file$2, 56, 12, 2518);
				div_4.className = "col-md-12";
				addLoc(div_4, file$2, 55, 8, 2481);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, div_1);
				append(div_1, label);
				append(label, text);
				append(div_1, text_1);
				append(div_1, input);

				input.value = ctx.name;

				insert(target, text_4, anchor);
				insert(target, div_2, anchor);
				append(div_2, div_3);
				append(div_3, label_1);
				append(label_1, text_5);
				append(div_3, text_6);
				append(div_3, input_1);

				input_1.value = ctx.email;

				insert(target, text_9, anchor);
				insert(target, div_4, anchor);
				append(div_4, div_5);
				append(div_5, label_2);
				append(label_2, text_10);
				append(div_5, text_11);
				append(div_5, input_2);

				input_2.value = ctx.password;
			},

			p: function update(changed, ctx) {
				if (!input_updating && changed.name) input.value = ctx.name;
				if (!input_1_updating && changed.email) input_1.value = ctx.email;
				if (!input_2_updating && changed.password) input_2.value = ctx.password;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(input, "input", input_input_handler);
				if (detach) {
					detachNode(text_4);
					detachNode(div_2);
				}

				removeListener(input_1, "input", input_1_input_handler);
				if (detach) {
					detachNode(text_9);
					detachNode(div_4);
				}

				removeListener(input_2, "input", input_2_input_handler);
			}
		};
	}

	// (69:24) {#each users as user}
	function create_each_block_3(component, ctx) {
		var option, text_value = ctx.user.name, text, text_1, text_2_value = ctx.user.email, text_2, option_value_value;

		return {
			c: function create() {
				option = createElement("option");
				text = createText(text_value);
				text_1 = createText(" ");
				text_2 = createText(text_2_value);
				option.__value = option_value_value = ctx.user.id;
				option.value = option.__value;
				addLoc(option, file$2, 69, 24, 3091);
			},

			m: function mount(target, anchor) {
				insert(target, option, anchor);
				append(option, text);
				append(option, text_1);
				append(option, text_2);
			},

			p: function update(changed, ctx) {
				if ((changed.users) && text_value !== (text_value = ctx.user.name)) {
					setData(text, text_value);
				}

				if ((changed.users) && text_2_value !== (text_2_value = ctx.user.email)) {
					setData(text_2, text_2_value);
				}

				if ((changed.users) && option_value_value !== (option_value_value = ctx.user.id)) {
					option.__value = option_value_value;
				}

				option.value = option.__value;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(option);
				}
			}
		};
	}

	// (64:8) {#if rights && rights.Orders.indexOf('all') != -1}
	function create_if_block_3$1(component, ctx) {
		var div, div_1, label, text, text_1, select;

		var each_value_3 = ctx.users;

		var each_blocks = [];

		for (var i = 0; i < each_value_3.length; i += 1) {
			each_blocks[i] = create_each_block_3(component, get_each_context_1(ctx, each_value_3, i));
		}

		return {
			c: function create() {
				div = createElement("div");
				div_1 = createElement("div");
				label = createElement("label");
				text = createText("Пользователь");
				text_1 = createText("\r\n                    ");
				select = createElement("select");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				addLoc(label, file$2, 66, 20, 2887);
				select.id = "users";
				select.className = "js-example-responsive form-control";
				setStyle(select, "width", "100%");
				addLoc(select, file$2, 67, 20, 2936);
				div_1.className = "form-group";
				addLoc(div_1, file$2, 65, 16, 2841);
				div.className = "col-md-12";
				addLoc(div, file$2, 64, 12, 2800);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, div_1);
				append(div_1, label);
				append(label, text);
				append(div_1, text_1);
				append(div_1, select);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(select, null);
				}
			},

			p: function update(changed, ctx) {
				if (changed.users) {
					each_value_3 = ctx.users;

					for (var i = 0; i < each_value_3.length; i += 1) {
						const child_ctx = get_each_context_1(ctx, each_value_3, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block_3(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(select, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value_3.length;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				destroyEach(each_blocks, detach);
			}
		};
	}

	// (81:20) {#each groups as group}
	function create_each_block_4(component, ctx) {
		var option, text_value = ctx.group.name, text, text_1, text_2_value = ctx.group.price, text_2, text_3, option_value_value, option_selected_value;

		return {
			c: function create() {
				option = createElement("option");
				text = createText(text_value);
				text_1 = createText(" ");
				text_2 = createText(text_2_value);
				text_3 = createText(" руб");
				option.__value = option_value_value = ctx.group.id;
				option.value = option.__value;
				option.selected = option_selected_value = ctx.formStore.get().groups && ctx.formStore.get().groups.indexOf(ctx.group.id) != -1 ? 'selected' : '';
				addLoc(option, file$2, 81, 20, 3576);
			},

			m: function mount(target, anchor) {
				insert(target, option, anchor);
				append(option, text);
				append(option, text_1);
				append(option, text_2);
				append(option, text_3);
			},

			p: function update(changed, ctx) {
				if ((changed.groups) && text_value !== (text_value = ctx.group.name)) {
					setData(text, text_value);
				}

				if ((changed.groups) && text_2_value !== (text_2_value = ctx.group.price)) {
					setData(text_2, text_2_value);
				}

				if ((changed.groups) && option_value_value !== (option_value_value = ctx.group.id)) {
					option.__value = option_value_value;
				}

				option.value = option.__value;
				if ((changed.formStore || changed.groups) && option_selected_value !== (option_selected_value = ctx.formStore.get().groups && ctx.formStore.get().groups.indexOf(ctx.group.id) != -1 ? 'selected' : '')) {
					option.selected = option_selected_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(option);
				}
			}
		};
	}

	// (91:20) {#each packages as item}
	function create_each_block_5(component, ctx) {
		var option, text_value = ctx.item.name, text, text_1, text_2_value = ctx.item.price, text_2, text_3, option_value_value, option_selected_value;

		return {
			c: function create() {
				option = createElement("option");
				text = createText(text_value);
				text_1 = createText(" ");
				text_2 = createText(text_2_value);
				text_3 = createText(" руб");
				option.__value = option_value_value = ctx.item.id;
				option.value = option.__value;
				option.selected = option_selected_value = ctx.formStore.get().packages && ctx.formStore.get().packages.indexOf(ctx.item.id) != -1 ? 'selected' : '';
				addLoc(option, file$2, 91, 20, 4139);
			},

			m: function mount(target, anchor) {
				insert(target, option, anchor);
				append(option, text);
				append(option, text_1);
				append(option, text_2);
				append(option, text_3);
			},

			p: function update(changed, ctx) {
				if ((changed.packages) && text_value !== (text_value = ctx.item.name)) {
					setData(text, text_value);
				}

				if ((changed.packages) && text_2_value !== (text_2_value = ctx.item.price)) {
					setData(text_2, text_2_value);
				}

				if ((changed.packages) && option_value_value !== (option_value_value = ctx.item.id)) {
					option.__value = option_value_value;
				}

				option.value = option.__value;
				if ((changed.formStore || changed.packages) && option_selected_value !== (option_selected_value = ctx.formStore.get().packages && ctx.formStore.get().packages.indexOf(ctx.item.id) != -1 ? 'selected' : '')) {
					option.selected = option_selected_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(option);
				}
			}
		};
	}

	// (2:4) {#if formStore.get().current}
	function create_if_block$1(component, ctx) {
		var div, div_1, label, text, text_1, input, input_updating = false, text_4, div_2, div_3, label_1, text_5, text_6, select, text_9, div_4, div_5, label_2, text_10, text_11, select_1, text_14, div_6, div_7, label_3, text_15, text_16, select_2, text_19, div_8, p, text_20, span, text_21, text_22;

		function input_input_handler() {
			input_updating = true;
			component.set({ phone: input.value });
			input_updating = false;
		}

		var each_value = ctx.status;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$2(component, get_each_context$2(ctx, each_value, i));
		}

		var each_value_1 = ctx.groups;

		var each_1_blocks = [];

		for (var i = 0; i < each_value_1.length; i += 1) {
			each_1_blocks[i] = create_each_block_1(component, get_each_1_context(ctx, each_value_1, i));
		}

		var each_value_2 = ctx.packages;

		var each_2_blocks = [];

		for (var i = 0; i < each_value_2.length; i += 1) {
			each_2_blocks[i] = create_each_block_2(component, get_each_2_context(ctx, each_value_2, i));
		}

		return {
			c: function create() {
				div = createElement("div");
				div_1 = createElement("div");
				label = createElement("label");
				text = createText("Телефон");
				text_1 = createText("\r\n                ");
				input = createElement("input");
				text_4 = createText("\r\n        ");
				div_2 = createElement("div");
				div_3 = createElement("div");
				label_1 = createElement("label");
				text_5 = createText("Статус");
				text_6 = createText("\r\n                ");
				select = createElement("select");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				text_9 = createText("\r\n        ");
				div_4 = createElement("div");
				div_5 = createElement("div");
				label_2 = createElement("label");
				text_10 = createText("ВК-группы");
				text_11 = createText("\r\n                ");
				select_1 = createElement("select");

				for (var i = 0; i < each_1_blocks.length; i += 1) {
					each_1_blocks[i].c();
				}

				text_14 = createText("\r\n        ");
				div_6 = createElement("div");
				div_7 = createElement("div");
				label_3 = createElement("label");
				text_15 = createText("Пакеты");
				text_16 = createText("\r\n                ");
				select_2 = createElement("select");

				for (var i = 0; i < each_2_blocks.length; i += 1) {
					each_2_blocks[i].c();
				}

				text_19 = createText("\r\n        ");
				div_8 = createElement("div");
				p = createElement("p");
				text_20 = createText("Общая стоимость: ");
				span = createElement("span");
				text_21 = createText(ctx.Price);
				text_22 = createText("₽");
				addLoc(label, file$2, 4, 16, 140);
				addListener(input, "input", input_input_handler);
				setAttribute(input, "type", "text");
				input.className = "form-control";
				addLoc(input, file$2, 5, 16, 180);
				div_1.className = "form-group";
				addLoc(div_1, file$2, 3, 12, 98);
				div.className = "col-md-6";
				addLoc(div, file$2, 2, 8, 62);
				addLoc(label_1, file$2, 10, 16, 363);
				select.id = "status";
				select.className = "form-control";
				addLoc(select, file$2, 11, 16, 402);
				div_3.className = "form-group";
				addLoc(div_3, file$2, 9, 12, 321);
				div_2.className = "col-md-6";
				addLoc(div_2, file$2, 8, 8, 285);
				addLoc(label_2, file$2, 20, 16, 812);
				select_1.id = "groups";
				select_1.className = "form-control";
				select_1.multiple = "multiple";
				setStyle(select_1, "width", "100%");
				addLoc(select_1, file$2, 21, 16, 854);
				div_5.className = "form-group";
				addLoc(div_5, file$2, 19, 12, 770);
				div_4.className = "col-md-12";
				addLoc(div_4, file$2, 18, 8, 733);
				addLoc(label_3, file$2, 30, 16, 1353);
				select_2.id = "packages";
				select_2.className = "form-control";
				select_2.multiple = "multiple";
				setStyle(select_2, "width", "100%");
				addLoc(select_2, file$2, 31, 16, 1392);
				div_7.className = "form-group";
				addLoc(div_7, file$2, 29, 12, 1311);
				div_6.className = "col-md-12";
				addLoc(div_6, file$2, 28, 8, 1274);
				setStyle(span, "color", "red");
				setStyle(span, "font-size", "22px");
				addLoc(span, file$2, 39, 51, 1891);
				p.className = "text-right";
				addLoc(p, file$2, 39, 12, 1852);
				div_8.className = "col-md-12";
				addLoc(div_8, file$2, 38, 8, 1815);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, div_1);
				append(div_1, label);
				append(label, text);
				append(div_1, text_1);
				append(div_1, input);

				input.value = ctx.phone;

				insert(target, text_4, anchor);
				insert(target, div_2, anchor);
				append(div_2, div_3);
				append(div_3, label_1);
				append(label_1, text_5);
				append(div_3, text_6);
				append(div_3, select);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(select, null);
				}

				insert(target, text_9, anchor);
				insert(target, div_4, anchor);
				append(div_4, div_5);
				append(div_5, label_2);
				append(label_2, text_10);
				append(div_5, text_11);
				append(div_5, select_1);

				for (var i = 0; i < each_1_blocks.length; i += 1) {
					each_1_blocks[i].m(select_1, null);
				}

				insert(target, text_14, anchor);
				insert(target, div_6, anchor);
				append(div_6, div_7);
				append(div_7, label_3);
				append(label_3, text_15);
				append(div_7, text_16);
				append(div_7, select_2);

				for (var i = 0; i < each_2_blocks.length; i += 1) {
					each_2_blocks[i].m(select_2, null);
				}

				insert(target, text_19, anchor);
				insert(target, div_8, anchor);
				append(div_8, p);
				append(p, text_20);
				append(p, span);
				append(span, text_21);
				append(span, text_22);
			},

			p: function update(changed, ctx) {
				if (!input_updating && changed.phone) input.value = ctx.phone;

				if (changed.status || changed.formStore) {
					each_value = ctx.status;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$2(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block$2(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(select, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}

				if (changed.groups || changed.formStore) {
					each_value_1 = ctx.groups;

					for (var i = 0; i < each_value_1.length; i += 1) {
						const child_ctx = get_each_1_context(ctx, each_value_1, i);

						if (each_1_blocks[i]) {
							each_1_blocks[i].p(changed, child_ctx);
						} else {
							each_1_blocks[i] = create_each_block_1(component, child_ctx);
							each_1_blocks[i].c();
							each_1_blocks[i].m(select_1, null);
						}
					}

					for (; i < each_1_blocks.length; i += 1) {
						each_1_blocks[i].d(1);
					}
					each_1_blocks.length = each_value_1.length;
				}

				if (changed.packages || changed.formStore) {
					each_value_2 = ctx.packages;

					for (var i = 0; i < each_value_2.length; i += 1) {
						const child_ctx = get_each_2_context(ctx, each_value_2, i);

						if (each_2_blocks[i]) {
							each_2_blocks[i].p(changed, child_ctx);
						} else {
							each_2_blocks[i] = create_each_block_2(component, child_ctx);
							each_2_blocks[i].c();
							each_2_blocks[i].m(select_2, null);
						}
					}

					for (; i < each_2_blocks.length; i += 1) {
						each_2_blocks[i].d(1);
					}
					each_2_blocks.length = each_value_2.length;
				}

				if (changed.Price) {
					setData(text_21, ctx.Price);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(input, "input", input_input_handler);
				if (detach) {
					detachNode(text_4);
					detachNode(div_2);
				}

				destroyEach(each_blocks, detach);

				if (detach) {
					detachNode(text_9);
					detachNode(div_4);
				}

				destroyEach(each_1_blocks, detach);

				if (detach) {
					detachNode(text_14);
					detachNode(div_6);
				}

				destroyEach(each_2_blocks, detach);

				if (detach) {
					detachNode(text_19);
					detachNode(div_8);
				}
			}
		};
	}

	// (42:4) {:else}
	function create_if_block_1$1(component, ctx) {
		var text, text_1, div, div_1, label, text_2, text_3, select, text_6, div_2, div_3, label_1, text_7, text_8, select_1, text_11, div_4, div_5, label_2, text_12, text_13, input, input_updating = false, text_16, div_6, p, text_17, span, text_18, text_19;

		var if_block = (ctx.session && !ctx.session.name) && create_if_block_2$1(component, ctx);

		var if_block_1 = (ctx.rights && ctx.rights.Orders.indexOf('all') != -1) && create_if_block_3$1(component, ctx);

		var each_value_4 = ctx.groups;

		var each_blocks = [];

		for (var i = 0; i < each_value_4.length; i += 1) {
			each_blocks[i] = create_each_block_4(component, get_each_context_2(ctx, each_value_4, i));
		}

		var each_value_5 = ctx.packages;

		var each_1_blocks = [];

		for (var i = 0; i < each_value_5.length; i += 1) {
			each_1_blocks[i] = create_each_block_5(component, get_each_1_context_1(ctx, each_value_5, i));
		}

		function input_input_handler() {
			input_updating = true;
			component.set({ phone: input.value });
			input_updating = false;
		}

		return {
			c: function create() {
				if (if_block) if_block.c();
				text = createText("\r\n        \r\n        ");
				if (if_block_1) if_block_1.c();
				text_1 = createText("\r\n\r\n        ");
				div = createElement("div");
				div_1 = createElement("div");
				label = createElement("label");
				text_2 = createText("ВК-группы");
				text_3 = createText("\r\n                ");
				select = createElement("select");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				text_6 = createText("\r\n        ");
				div_2 = createElement("div");
				div_3 = createElement("div");
				label_1 = createElement("label");
				text_7 = createText("Пакеты");
				text_8 = createText("\r\n                ");
				select_1 = createElement("select");

				for (var i = 0; i < each_1_blocks.length; i += 1) {
					each_1_blocks[i].c();
				}

				text_11 = createText("\r\n\r\n        ");
				div_4 = createElement("div");
				div_5 = createElement("div");
				label_2 = createElement("label");
				text_12 = createText("Телефон для связи");
				text_13 = createText("\r\n                ");
				input = createElement("input");
				text_16 = createText("\r\n        ");
				div_6 = createElement("div");
				p = createElement("p");
				text_17 = createText("Общая стоимость: ");
				span = createElement("span");
				text_18 = createText(ctx.Price);
				text_19 = createText("₽");
				addLoc(label, file$2, 78, 16, 3364);
				select.id = "groups";
				select.className = "js-example-responsive form-control";
				select.multiple = "multiple";
				setStyle(select, "width", "100%");
				addLoc(select, file$2, 79, 16, 3406);
				div_1.className = "form-group";
				addLoc(div_1, file$2, 77, 12, 3322);
				div.className = "col-md-12";
				addLoc(div, file$2, 76, 8, 3285);
				addLoc(label_1, file$2, 88, 16, 3927);
				select_1.id = "packages";
				select_1.className = "js-example-responsive form-control";
				select_1.multiple = "multiple";
				setStyle(select_1, "width", "100%");
				addLoc(select_1, file$2, 89, 16, 3966);
				div_3.className = "form-group";
				addLoc(div_3, file$2, 87, 12, 3885);
				div_2.className = "col-md-12";
				addLoc(div_2, file$2, 86, 8, 3848);
				addLoc(label_2, file$2, 99, 16, 4491);
				addListener(input, "input", input_input_handler);
				setAttribute(input, "type", "phone");
				input.className = "form-control";
				addLoc(input, file$2, 100, 16, 4541);
				div_5.className = "form-group";
				addLoc(div_5, file$2, 98, 12, 4449);
				div_4.className = "col-md-6";
				addLoc(div_4, file$2, 97, 8, 4413);
				setStyle(span, "color", "red");
				setStyle(span, "font-size", "22px");
				addLoc(span, file$2, 104, 51, 4722);
				p.className = "text-right";
				addLoc(p, file$2, 104, 12, 4683);
				div_6.className = "col-md-6";
				addLoc(div_6, file$2, 103, 8, 4647);
			},

			m: function mount(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert(target, text, anchor);
				if (if_block_1) if_block_1.m(target, anchor);
				insert(target, text_1, anchor);
				insert(target, div, anchor);
				append(div, div_1);
				append(div_1, label);
				append(label, text_2);
				append(div_1, text_3);
				append(div_1, select);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(select, null);
				}

				insert(target, text_6, anchor);
				insert(target, div_2, anchor);
				append(div_2, div_3);
				append(div_3, label_1);
				append(label_1, text_7);
				append(div_3, text_8);
				append(div_3, select_1);

				for (var i = 0; i < each_1_blocks.length; i += 1) {
					each_1_blocks[i].m(select_1, null);
				}

				insert(target, text_11, anchor);
				insert(target, div_4, anchor);
				append(div_4, div_5);
				append(div_5, label_2);
				append(label_2, text_12);
				append(div_5, text_13);
				append(div_5, input);

				input.value = ctx.phone;

				insert(target, text_16, anchor);
				insert(target, div_6, anchor);
				append(div_6, p);
				append(p, text_17);
				append(p, span);
				append(span, text_18);
				append(span, text_19);
			},

			p: function update(changed, ctx) {
				if (ctx.session && !ctx.session.name) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block_2$1(component, ctx);
						if_block.c();
						if_block.m(text.parentNode, text);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if (ctx.rights && ctx.rights.Orders.indexOf('all') != -1) {
					if (if_block_1) {
						if_block_1.p(changed, ctx);
					} else {
						if_block_1 = create_if_block_3$1(component, ctx);
						if_block_1.c();
						if_block_1.m(text_1.parentNode, text_1);
					}
				} else if (if_block_1) {
					if_block_1.d(1);
					if_block_1 = null;
				}

				if (changed.groups || changed.formStore) {
					each_value_4 = ctx.groups;

					for (var i = 0; i < each_value_4.length; i += 1) {
						const child_ctx = get_each_context_2(ctx, each_value_4, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block_4(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(select, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value_4.length;
				}

				if (changed.packages || changed.formStore) {
					each_value_5 = ctx.packages;

					for (var i = 0; i < each_value_5.length; i += 1) {
						const child_ctx = get_each_1_context_1(ctx, each_value_5, i);

						if (each_1_blocks[i]) {
							each_1_blocks[i].p(changed, child_ctx);
						} else {
							each_1_blocks[i] = create_each_block_5(component, child_ctx);
							each_1_blocks[i].c();
							each_1_blocks[i].m(select_1, null);
						}
					}

					for (; i < each_1_blocks.length; i += 1) {
						each_1_blocks[i].d(1);
					}
					each_1_blocks.length = each_value_5.length;
				}

				if (!input_updating && changed.phone) input.value = ctx.phone;
				if (changed.Price) {
					setData(text_18, ctx.Price);
				}
			},

			d: function destroy$$1(detach) {
				if (if_block) if_block.d(detach);
				if (detach) {
					detachNode(text);
				}

				if (if_block_1) if_block_1.d(detach);
				if (detach) {
					detachNode(text_1);
					detachNode(div);
				}

				destroyEach(each_blocks, detach);

				if (detach) {
					detachNode(text_6);
					detachNode(div_2);
				}

				destroyEach(each_1_blocks, detach);

				if (detach) {
					detachNode(text_11);
					detachNode(div_4);
				}

				removeListener(input, "input", input_input_handler);
				if (detach) {
					detachNode(text_16);
					detachNode(div_6);
				}
			}
		};
	}

	function get_each_context$2(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.item = list[i];
		child_ctx.each_value = list;
		child_ctx.item_index = i;
		return child_ctx;
	}

	function get_each_1_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.group = list[i];
		child_ctx.each_value_1 = list;
		child_ctx.group_index = i;
		return child_ctx;
	}

	function get_each_2_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.item = list[i];
		child_ctx.each_value_2 = list;
		child_ctx.item_index_1 = i;
		return child_ctx;
	}

	function get_each_context_1(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.user = list[i];
		child_ctx.each_value_3 = list;
		child_ctx.user_index = i;
		return child_ctx;
	}

	function get_each_context_2(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.group = list[i];
		child_ctx.each_value_4 = list;
		child_ctx.group_index_1 = i;
		return child_ctx;
	}

	function get_each_1_context_1(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.item = list[i];
		child_ctx.each_value_5 = list;
		child_ctx.item_index_2 = i;
		return child_ctx;
	}

	function Orders(options) {
		this._debugName = '<Orders>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$2(), options.data);
		this._recompute({ groups: 1, packages: 1 }, this._state);
		if (!('groups' in this._state)) console.warn("<Orders> was created without expected data property 'groups'");
		if (!('packages' in this._state)) console.warn("<Orders> was created without expected data property 'packages'");
		if (!('formStore' in this._state)) console.warn("<Orders> was created without expected data property 'formStore'");
		if (!('phone' in this._state)) console.warn("<Orders> was created without expected data property 'phone'");
		if (!('status' in this._state)) console.warn("<Orders> was created without expected data property 'status'");

		if (!('session' in this._state)) console.warn("<Orders> was created without expected data property 'session'");
		if (!('name' in this._state)) console.warn("<Orders> was created without expected data property 'name'");
		if (!('email' in this._state)) console.warn("<Orders> was created without expected data property 'email'");
		if (!('password' in this._state)) console.warn("<Orders> was created without expected data property 'password'");
		if (!('rights' in this._state)) console.warn("<Orders> was created without expected data property 'rights'");
		if (!('users' in this._state)) console.warn("<Orders> was created without expected data property 'users'");
		this._intro = !!options.intro;

		this._handlers.state = [onstate$1];

		this._handlers.destroy = [ondestroy];

		onstate$1.call(this, { changed: assignTrue({}, this._state), current: this._state });

		this._fragment = create_main_fragment$2(this, this._state);

		this.root._oncreate.push(() => {
			oncreate$1.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Orders.prototype, protoDev);
	assign(Orders.prototype, methods$2);

	Orders.prototype._checkReadOnly = function _checkReadOnly(newState) {
		if ('Price' in newState && !this._updatingReadonlyProperty) throw new Error("<Orders>: Cannot set read-only property 'Price'");
	};

	Orders.prototype._recompute = function _recompute(changed, state) {
		if (changed.groups || changed.packages) {
			if (this._differs(state.Price, (state.Price = Price(state)))) changed.Price = true;
		}
	};

	/* src\forms\auth.html generated by Svelte v2.13.5 */

	function data$3(){
	    return {
	        email: '',
	        password: ''
	    }
	}
	var methods$3 = {
	    saveForm() {
	        const { email, password, formStore } = this.get();
	        const isCorrect = true;

	        formStore.set({ email, password, isCorrect });
	    }
	};

	function onstate$2({ changed, current, previous }) {
	    this.saveForm();
	}
	const file$3 = "src\\forms\\auth.html";

	function create_main_fragment$3(component, ctx) {
		var div, div_1, div_2, label, text, text_1, input, input_updating = false, text_4, div_3, div_4, label_1, text_5, text_6, input_1, input_1_updating = false, current;

		function input_input_handler() {
			input_updating = true;
			component.set({ email: input.value });
			input_updating = false;
		}

		function input_1_input_handler() {
			input_1_updating = true;
			component.set({ password: input_1.value });
			input_1_updating = false;
		}

		return {
			c: function create() {
				div = createElement("div");
				div_1 = createElement("div");
				div_2 = createElement("div");
				label = createElement("label");
				text = createText("Email");
				text_1 = createText("\r\n            ");
				input = createElement("input");
				text_4 = createText("\r\n    ");
				div_3 = createElement("div");
				div_4 = createElement("div");
				label_1 = createElement("label");
				text_5 = createText("Пароль");
				text_6 = createText("\r\n            ");
				input_1 = createElement("input");
				addLoc(label, file$3, 3, 12, 94);
				addListener(input, "input", input_input_handler);
				setAttribute(input, "type", "email");
				input.className = "form-control";
				addLoc(input, file$3, 4, 12, 128);
				div_2.className = "form-group";
				addLoc(div_2, file$3, 2, 8, 56);
				div_1.className = "col-md-12";
				addLoc(div_1, file$3, 1, 4, 23);
				addLoc(label_1, file$3, 9, 12, 293);
				addListener(input_1, "input", input_1_input_handler);
				setAttribute(input_1, "type", "password");
				input_1.className = "form-control";
				addLoc(input_1, file$3, 10, 12, 328);
				div_4.className = "form-group";
				addLoc(div_4, file$3, 8, 8, 255);
				div_3.className = "col-md-12";
				addLoc(div_3, file$3, 7, 4, 222);
				div.className = "row";
				addLoc(div, file$3, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, div_1);
				append(div_1, div_2);
				append(div_2, label);
				append(label, text);
				append(div_2, text_1);
				append(div_2, input);

				input.value = ctx.email;

				append(div, text_4);
				append(div, div_3);
				append(div_3, div_4);
				append(div_4, label_1);
				append(label_1, text_5);
				append(div_4, text_6);
				append(div_4, input_1);

				input_1.value = ctx.password;

				current = true;
			},

			p: function update(changed, ctx) {
				if (!input_updating && changed.email) input.value = ctx.email;
				if (!input_1_updating && changed.password) input_1.value = ctx.password;
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(input, "input", input_input_handler);
				removeListener(input_1, "input", input_1_input_handler);
			}
		};
	}

	function Auth(options) {
		this._debugName = '<Auth>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$3(), options.data);
		if (!('email' in this._state)) console.warn("<Auth> was created without expected data property 'email'");
		if (!('password' in this._state)) console.warn("<Auth> was created without expected data property 'password'");
		this._intro = !!options.intro;

		this._handlers.state = [onstate$2];

		onstate$2.call(this, { changed: assignTrue({}, this._state), current: this._state });

		this._fragment = create_main_fragment$3(this, this._state);

		this.root._oncreate.push(() => {
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Auth.prototype, protoDev);
	assign(Auth.prototype, methods$3);

	Auth.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src\forms\users.html generated by Svelte v2.13.5 */

	function data$4() {
	    return { name: '', email: '', role_id: '', password: '', passwordAgree: '', roles: [], validator: {}, isCorrect: false };
	}
	var methods$4 = {
	    saveForm() {
	        const { name, email, password, passwordAgree, role_id, formStore } = this.get();
	        
	        var r = /^\w+@\w+\.\w{2,4}$/i;
	        this.isValid(name.length, 'name');
	        this.isValid(r.test(email), 'email');
	        this.isValid(role_id && role_id != '0', 'role_id');
	        this.isValid(password.length == 6, 'password');
	        this.isValid(password == passwordAgree, 'passwordAgree');
	        this.checkFormValid();

	        const user = { name, email, role_id, password };
	        const { isCorrect } = this.get();

	        formStore.set({ user, isCorrect });
	    },

	    isValid(bool, name) {
	        var { validator } = this.get();
	        
	        if(bool) validator[name] = 'is-valid';
	        else validator[name] = 'is-invalid';

	        this.set({ validator });
	    },

	    checkFormValid() {
	        var { validator, isCorrect } = this.get();
	        
	        isCorrect = true;
	        for(var key in validator) {
	            if (validator[key] == 'is-invalid') isCorrect = false;
	        }

	        this.set({ isCorrect });
	    }
	};

	function oncreate$2() {
	    phalconApi.roles.all().then(roles => {
	        this.set({ roles });
	    });
	}
	function onstate$3({ changed, current, previous }) {
	    console.log(current);
	    if(!changed.isCorrect){ 
	        this.saveForm();
	    }
			}
	const file$4 = "src\\forms\\users.html";

	function create_main_fragment$4(component, ctx) {
		var div, div_1, div_2, label, text, text_1, input, input_updating = false, input_class_value, text_2, text_5, div_3, div_4, label_1, text_6, text_7, input_1, input_1_updating = false, input_1_class_value, text_8, text_11, div_5, div_6, label_2, text_12, text_13, input_2, input_2_updating = false, input_2_class_value, text_14, text_17, div_7, div_8, label_3, text_18, text_19, input_3, input_3_updating = false, input_3_class_value, text_20, text_23, div_9, div_10, label_4, text_24, text_25, select, option, text_26, select_updating = false, select_class_value, text_27, current;

		function input_input_handler() {
			input_updating = true;
			component.set({ name: input.value });
			input_updating = false;
		}

		var if_block = (ctx.validator.name == 'is-invalid') && create_if_block$2(component, ctx);

		function input_1_input_handler() {
			input_1_updating = true;
			component.set({ email: input_1.value });
			input_1_updating = false;
		}

		var if_block_1 = (ctx.validator.email == 'is-invalid') && create_if_block_1$2(component, ctx);

		function input_2_input_handler() {
			input_2_updating = true;
			component.set({ password: input_2.value });
			input_2_updating = false;
		}

		var if_block_2 = (ctx.validator.password == 'is-invalid') && create_if_block_2$2(component, ctx);

		function input_3_input_handler() {
			input_3_updating = true;
			component.set({ passwordAgree: input_3.value });
			input_3_updating = false;
		}

		var if_block_3 = (ctx.validator.passwordAgree == 'is-invalid') && create_if_block_3$2(component, ctx);

		var each_value = ctx.roles;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$3(component, get_each_context$3(ctx, each_value, i));
		}

		function select_change_handler() {
			select_updating = true;
			component.set({ role_id: selectValue(select) });
			select_updating = false;
		}

		var if_block_4 = (ctx.validator.role_id == 'is-invalid') && create_if_block_4$1(component, ctx);

		return {
			c: function create() {
				div = createElement("div");
				div_1 = createElement("div");
				div_2 = createElement("div");
				label = createElement("label");
				text = createText("Имя");
				text_1 = createText("\r\n            ");
				input = createElement("input");
				text_2 = createText("\r\n            ");
				if (if_block) if_block.c();
				text_5 = createText("\r\n    ");
				div_3 = createElement("div");
				div_4 = createElement("div");
				label_1 = createElement("label");
				text_6 = createText("Email");
				text_7 = createText("\r\n            ");
				input_1 = createElement("input");
				text_8 = createText("\r\n            ");
				if (if_block_1) if_block_1.c();
				text_11 = createText("\r\n    ");
				div_5 = createElement("div");
				div_6 = createElement("div");
				label_2 = createElement("label");
				text_12 = createText("Пароль пользователя");
				text_13 = createText("\r\n            ");
				input_2 = createElement("input");
				text_14 = createText("\r\n            ");
				if (if_block_2) if_block_2.c();
				text_17 = createText("\r\n    ");
				div_7 = createElement("div");
				div_8 = createElement("div");
				label_3 = createElement("label");
				text_18 = createText("Подтвердите пароль");
				text_19 = createText("\r\n            ");
				input_3 = createElement("input");
				text_20 = createText("\r\n            ");
				if (if_block_3) if_block_3.c();
				text_23 = createText("\r\n    ");
				div_9 = createElement("div");
				div_10 = createElement("div");
				label_4 = createElement("label");
				text_24 = createText("Роль");
				text_25 = createText("\r\n            ");
				select = createElement("select");
				option = createElement("option");
				text_26 = createText("Не выбрана");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				text_27 = createText("\r\n            ");
				if (if_block_4) if_block_4.c();
				addLoc(label, file$4, 3, 12, 93);
				addListener(input, "input", input_input_handler);
				setAttribute(input, "type", "text");
				input.className = input_class_value = "form-control " + ctx.validator.name;
				addLoc(input, file$4, 4, 12, 125);
				div_2.className = "form-group";
				addLoc(div_2, file$4, 2, 8, 55);
				div_1.className = "col-md-6";
				addLoc(div_1, file$4, 1, 4, 23);
				label_1.htmlFor = "email";
				addLoc(label_1, file$4, 12, 12, 452);
				addListener(input_1, "input", input_1_input_handler);
				input_1.id = "email";
				setAttribute(input_1, "type", "email");
				input_1.className = input_1_class_value = "form-control " + ctx.validator.email;
				addLoc(input_1, file$4, 13, 12, 498);
				div_4.className = "form-group";
				addLoc(div_4, file$4, 11, 8, 414);
				div_3.className = "col-md-6";
				addLoc(div_3, file$4, 10, 4, 382);
				addLoc(label_2, file$4, 21, 12, 836);
				addListener(input_2, "input", input_2_input_handler);
				input_2.id = "password";
				setAttribute(input_2, "type", "password");
				input_2.className = input_2_class_value = "form-control " + ctx.validator.password;
				addLoc(input_2, file$4, 22, 12, 884);
				div_6.className = "form-group";
				addLoc(div_6, file$4, 20, 8, 798);
				div_5.className = "col-md-6";
				addLoc(div_5, file$4, 19, 4, 766);
				addLoc(label_3, file$4, 30, 12, 1250);
				addListener(input_3, "input", input_3_input_handler);
				input_3.id = "passwordAgree";
				setAttribute(input_3, "type", "password");
				input_3.className = input_3_class_value = "form-control " + ctx.validator.passwordAgree;
				addLoc(input_3, file$4, 31, 12, 1297);
				div_8.className = "form-group";
				addLoc(div_8, file$4, 29, 8, 1212);
				div_7.className = "col-md-6";
				addLoc(div_7, file$4, 28, 4, 1180);
				addLoc(label_4, file$4, 39, 12, 1665);
				option.__value = "0";
				option.value = option.__value;
				option.selected = true;
				addLoc(option, file$4, 41, 16, 1819);
				addListener(select, "change", select_change_handler);
				if (!('role_id' in ctx)) component.root._beforecreate.push(select_change_handler);
				select.id = "role_id";
				select.className = select_class_value = "form-control " + ctx.validator.role_id;
				setStyle(select, "width", "100%");
				addLoc(select, file$4, 40, 12, 1698);
				div_10.className = "form-group";
				addLoc(div_10, file$4, 38, 8, 1627);
				div_9.className = "col-md-12";
				addLoc(div_9, file$4, 37, 4, 1594);
				div.className = "row";
				addLoc(div, file$4, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, div_1);
				append(div_1, div_2);
				append(div_2, label);
				append(label, text);
				append(div_2, text_1);
				append(div_2, input);

				input.value = ctx.name;

				append(div_2, text_2);
				if (if_block) if_block.m(div_2, null);
				append(div, text_5);
				append(div, div_3);
				append(div_3, div_4);
				append(div_4, label_1);
				append(label_1, text_6);
				append(div_4, text_7);
				append(div_4, input_1);

				input_1.value = ctx.email;

				append(div_4, text_8);
				if (if_block_1) if_block_1.m(div_4, null);
				append(div, text_11);
				append(div, div_5);
				append(div_5, div_6);
				append(div_6, label_2);
				append(label_2, text_12);
				append(div_6, text_13);
				append(div_6, input_2);

				input_2.value = ctx.password;

				append(div_6, text_14);
				if (if_block_2) if_block_2.m(div_6, null);
				append(div, text_17);
				append(div, div_7);
				append(div_7, div_8);
				append(div_8, label_3);
				append(label_3, text_18);
				append(div_8, text_19);
				append(div_8, input_3);

				input_3.value = ctx.passwordAgree;

				append(div_8, text_20);
				if (if_block_3) if_block_3.m(div_8, null);
				append(div, text_23);
				append(div, div_9);
				append(div_9, div_10);
				append(div_10, label_4);
				append(label_4, text_24);
				append(div_10, text_25);
				append(div_10, select);
				append(select, option);
				append(option, text_26);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(select, null);
				}

				selectOption(select, ctx.role_id);

				append(div_10, text_27);
				if (if_block_4) if_block_4.m(div_10, null);
				current = true;
			},

			p: function update(changed, ctx) {
				if (!input_updating && changed.name) input.value = ctx.name;
				if ((changed.validator) && input_class_value !== (input_class_value = "form-control " + ctx.validator.name)) {
					input.className = input_class_value;
				}

				if (ctx.validator.name == 'is-invalid') {
					if (!if_block) {
						if_block = create_if_block$2(component, ctx);
						if_block.c();
						if_block.m(div_2, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if (!input_1_updating && changed.email) input_1.value = ctx.email;
				if ((changed.validator) && input_1_class_value !== (input_1_class_value = "form-control " + ctx.validator.email)) {
					input_1.className = input_1_class_value;
				}

				if (ctx.validator.email == 'is-invalid') {
					if (!if_block_1) {
						if_block_1 = create_if_block_1$2(component, ctx);
						if_block_1.c();
						if_block_1.m(div_4, null);
					}
				} else if (if_block_1) {
					if_block_1.d(1);
					if_block_1 = null;
				}

				if (!input_2_updating && changed.password) input_2.value = ctx.password;
				if ((changed.validator) && input_2_class_value !== (input_2_class_value = "form-control " + ctx.validator.password)) {
					input_2.className = input_2_class_value;
				}

				if (ctx.validator.password == 'is-invalid') {
					if (!if_block_2) {
						if_block_2 = create_if_block_2$2(component, ctx);
						if_block_2.c();
						if_block_2.m(div_6, null);
					}
				} else if (if_block_2) {
					if_block_2.d(1);
					if_block_2 = null;
				}

				if (!input_3_updating && changed.passwordAgree) input_3.value = ctx.passwordAgree;
				if ((changed.validator) && input_3_class_value !== (input_3_class_value = "form-control " + ctx.validator.passwordAgree)) {
					input_3.className = input_3_class_value;
				}

				if (ctx.validator.passwordAgree == 'is-invalid') {
					if (!if_block_3) {
						if_block_3 = create_if_block_3$2(component, ctx);
						if_block_3.c();
						if_block_3.m(div_8, null);
					}
				} else if (if_block_3) {
					if_block_3.d(1);
					if_block_3 = null;
				}

				if (changed.roles) {
					each_value = ctx.roles;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$3(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block$3(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(select, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}

				if (!select_updating && changed.role_id) selectOption(select, ctx.role_id);
				if ((changed.validator) && select_class_value !== (select_class_value = "form-control " + ctx.validator.role_id)) {
					select.className = select_class_value;
				}

				if (ctx.validator.role_id == 'is-invalid') {
					if (!if_block_4) {
						if_block_4 = create_if_block_4$1(component, ctx);
						if_block_4.c();
						if_block_4.m(div_10, null);
					}
				} else if (if_block_4) {
					if_block_4.d(1);
					if_block_4 = null;
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(input, "input", input_input_handler);
				if (if_block) if_block.d();
				removeListener(input_1, "input", input_1_input_handler);
				if (if_block_1) if_block_1.d();
				removeListener(input_2, "input", input_2_input_handler);
				if (if_block_2) if_block_2.d();
				removeListener(input_3, "input", input_3_input_handler);
				if (if_block_3) if_block_3.d();

				destroyEach(each_blocks, detach);

				removeListener(select, "change", select_change_handler);
				if (if_block_4) if_block_4.d();
			}
		};
	}

	// (6:12) {#if validator.name == 'is-invalid'}
	function create_if_block$2(component, ctx) {
		var div, text;

		return {
			c: function create() {
				div = createElement("div");
				text = createText("Поле обязательно к заполнению");
				div.className = "invalid-feedback";
				addLoc(div, file$4, 6, 12, 264);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, text);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}
			}
		};
	}

	// (15:12) {#if validator.email == 'is-invalid'}
	function create_if_block_1$2(component, ctx) {
		var div, text;

		return {
			c: function create() {
				div = createElement("div");
				text = createText("Неправильный формат email");
				div.className = "invalid-feedback";
				addLoc(div, file$4, 15, 12, 652);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, text);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}
			}
		};
	}

	// (24:12) {#if validator.password == 'is-invalid'}
	function create_if_block_2$2(component, ctx) {
		var div, text;

		return {
			c: function create() {
				div = createElement("div");
				text = createText("Пароль должен быть не менее 6 символов");
				div.className = "invalid-feedback";
				addLoc(div, file$4, 24, 12, 1053);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, text);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}
			}
		};
	}

	// (33:12) {#if validator.passwordAgree == 'is-invalid'}
	function create_if_block_3$2(component, ctx) {
		var div, text;

		return {
			c: function create() {
				div = createElement("div");
				text = createText("Пароли не совпадают");
				div.className = "invalid-feedback";
				addLoc(div, file$4, 33, 12, 1486);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, text);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}
			}
		};
	}

	// (43:16) {#each roles as role}
	function create_each_block$3(component, ctx) {
		var option, text_value = ctx.role.name, text, option_value_value;

		return {
			c: function create() {
				option = createElement("option");
				text = createText(text_value);
				option.__value = option_value_value = ctx.role.id;
				option.value = option.__value;
				addLoc(option, file$4, 43, 16, 1922);
			},

			m: function mount(target, anchor) {
				insert(target, option, anchor);
				append(option, text);
			},

			p: function update(changed, ctx) {
				if ((changed.roles) && text_value !== (text_value = ctx.role.name)) {
					setData(text, text_value);
				}

				if ((changed.roles) && option_value_value !== (option_value_value = ctx.role.id)) {
					option.__value = option_value_value;
				}

				option.value = option.__value;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(option);
				}
			}
		};
	}

	// (47:12) {#if validator.role_id == 'is-invalid'}
	function create_if_block_4$1(component, ctx) {
		var div, text;

		return {
			c: function create() {
				div = createElement("div");
				text = createText("Выберите роль");
				div.className = "invalid-feedback";
				addLoc(div, file$4, 47, 12, 2083);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, text);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}
			}
		};
	}

	function get_each_context$3(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.role = list[i];
		child_ctx.each_value = list;
		child_ctx.role_index = i;
		return child_ctx;
	}

	function Users(options) {
		this._debugName = '<Users>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$4(), options.data);
		if (!('name' in this._state)) console.warn("<Users> was created without expected data property 'name'");
		if (!('validator' in this._state)) console.warn("<Users> was created without expected data property 'validator'");
		if (!('email' in this._state)) console.warn("<Users> was created without expected data property 'email'");
		if (!('password' in this._state)) console.warn("<Users> was created without expected data property 'password'");
		if (!('passwordAgree' in this._state)) console.warn("<Users> was created without expected data property 'passwordAgree'");
		if (!('role_id' in this._state)) console.warn("<Users> was created without expected data property 'role_id'");
		if (!('roles' in this._state)) console.warn("<Users> was created without expected data property 'roles'");
		this._intro = !!options.intro;

		this._handlers.state = [onstate$3];

		onstate$3.call(this, { changed: assignTrue({}, this._state), current: this._state });

		this._fragment = create_main_fragment$4(this, this._state);

		this.root._oncreate.push(() => {
			oncreate$2.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Users.prototype, protoDev);
	assign(Users.prototype, methods$4);

	Users.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/*!
	 * nano-assign v1.0.0
	 * (c) 2017-present egoist <0x142857@gmail.com>
	 * Released under the MIT License.
	 */

	var index = function(obj) {
	  var arguments$1 = arguments;

	  for (var i = 1; i < arguments.length; i++) {
	    // eslint-disable-next-line guard-for-in, prefer-rest-params
	    for (var p in arguments[i]) { obj[p] = arguments$1[i][p]; }
	  }
	  return obj
	};

	var nanoAssign_common = index;

	function _interopDefault$1 (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

	var assign$1 = _interopDefault$1(nanoAssign_common);

	/* src\components\modal.html generated by Svelte v2.13.5 */

	function ComponentLink({ component }) {
					if (component === 'VkGroupsForm') return VkGroups;
					if (component === 'PackagesForm') return Packages;
					if (component === 'AuthForm') return Auth;
	    if (component === 'OrderForm') return Orders;
	    if (component === 'UsersForm') return Users;
				}

	var methods$5 = {
	    close(){
	        const { formStore } = this.get();

	        formStore.set({ isClose: true });
	        this.destroy();
	    },
				createModel() {
	        var { component, formStore } = this.get();
	        

	        if(component == 'VkGroupsForm'){
	            var { vkGroupId, name, screenName, avatar, fetchGroupList, vkGroup } = formStore.get();

	            if(vkGroup){
	                phalconApi.vkGroups.update(vkGroup.id, vkGroup).then(response => {
	                    if(response.status == 200) this.options.root.toast('success', 'Группа успешно обновлена!');
	                    formStore.set({ isLoad: true });
	                    $('#modal').modal('hide');
	                });
	            } else

	            if(fetchGroupList && fetchGroupList.length > 0){
	                phalconApi.vkGroups.insert(fetchGroupList).then(status => {
	                    if(status == 200) this.options.root.toast('success', 'Группы успешно добавлены!');
	                    formStore.set({ isLoad: true });
	                    $('#modal').modal('hide');
	                });
	            } else
	            
	            if(vkGroupId){
	                var data = { vkGroupId, name, screenName, avatar };
	                phalconApi.vkGroups.create(data).then(status => {
	                    if(status == 200) this.options.root.toast('success', 'Группы успешно добавлены!');
	                    formStore.set({ isLoad: true });
	                    $('#modal').modal('hide');
	                });
	            }
	        }

	        if(component == 'PackagesForm'){
	            console.log('PackagesForm save', Packages);
	            var { name, price, groups, component } = formStore.get();

	            phalconApi.packages.create({ name, price, groups }).then(status => {
	                if(status == 200) this.options.root.toast('success', 'Группы успешно добавлены!');
	                formStore.set({ isLoad: true });
	                $('#modal').modal('hide');
	            });
	        }

	        if(component == 'AuthForm'){
	            var { email, password } = formStore.get();
	            phalconApi.session.start({ email, password }).then(status => {
	                console.log(status);
	                if(status == 404) { 
	                    this.options.root.toast('danger', 'Пользователь не найден!');
	                } else 

	                if(status == 401) {
	                    this.options.root.toast('danger', 'Неверный пароль!');
	                } else

	                if(status == 200) {
	                    this.options.root.toast('success', 'Авторизация прошла успешно!');
	                    setTimeout(function(){
	                        window.location.replace("/vk-groups");
	                    }, 1000);
	                } else {
	                    this.options.root.toast('danger', 'Ошибка, обратитесь к администратору!');
	                }
	            });
	        }

	        if(component == 'OrderForm'){
	            const { order } = formStore.get();
	            if(order.id){
	                phalconApi.orders.update(order.id, order).then(response => {
	                    if(response.status == 200) this.options.root.toast('success', 'Заказ успешно обновлен!');
	                    else this.options.root.toast('danger', 'Ошибка, обратитесь к администратору!');

	                    formStore.set({ isLoad: true });
	                    $('#modal').modal('hide');
	                });
	            } else {
	                phalconApi.orders.create(order).then(status => {
	                    if(status == 200) this.options.root.toast('success', 'Заказ создан успешно!');
	                    else this.options.root.toast('danger', 'Ошибка, обратитесь к администратору!');

	                    formStore.set({ isLoad: true });
	                    $('#modal').modal('hide');
	                });
	            }
	        }

	        if(component == 'UsersForm'){
	            const { user, isCorrect } = formStore.get();
	            if(isCorrect){
	                phalconApi.users.create(user).then(status => {
	                    if(status == 200) this.options.root.toast('success', 'Пользователь создан успешно!');
	                    else this.options.root.toast('danger', 'Ошибка, обратитесь к администратору!');
	                });
	            } else {
	                this.options.root.toast('danger', 'Есть ошибки в заполнении!');
	            }
	        }
	    }
	};

	function oncreate$3() {
	            const self = this;

	            $('#modal').modal('show');
	            $('#modal').on('hidden.bs.modal', function () {
	                self.close();
	            });
	        }
	function ondestroy$1() {
	    
	}
	const file$5 = "src\\components\\modal.html";

	function create_main_fragment$5(component, ctx) {
		var div, div_1, div_2, div_3, h5, text, text_1, button, span, text_2, text_5, div_4, text_7, div_5, button_1, text_8, text_9, button_2, text_10, current;

		var switch_value = ctx.ComponentLink;

		function switch_props(ctx) {
			var switch_instance_initial_data = { formStore: ctx.formStore };
			return {
				root: component.root,
				store: component.store,
				data: switch_instance_initial_data
			};
		}

		if (switch_value) {
			var switch_instance = new switch_value(switch_props(ctx));
		}

		function click_handler(event) {
			component.createModel();
		}

		return {
			c: function create() {
				div = createElement("div");
				div_1 = createElement("div");
				div_2 = createElement("div");
				div_3 = createElement("div");
				h5 = createElement("h5");
				text = createText(ctx.title);
				text_1 = createText("\r\n        ");
				button = createElement("button");
				span = createElement("span");
				text_2 = createText("×");
				text_5 = createText("\r\n      ");
				div_4 = createElement("div");
				if (switch_instance) switch_instance._fragment.c();
				text_7 = createText("\r\n      ");
				div_5 = createElement("div");
				button_1 = createElement("button");
				text_8 = createText("Отмена");
				text_9 = createText("\r\n        ");
				button_2 = createElement("button");
				text_10 = createText("Сохранить");
				h5.className = "modal-title";
				h5.id = "modal-label";
				addLoc(h5, file$5, 4, 8, 235);
				setAttribute(span, "aria-hidden", "true");
				addLoc(span, file$5, 6, 10, 367);
				button.type = "button";
				button.className = "close";
				button.dataset.dismiss = "modal";
				addLoc(button, file$5, 5, 8, 298);
				div_3.className = "modal-header svelte-1bs5evu";
				addLoc(div_3, file$5, 3, 6, 199);
				div_4.className = "modal-body";
				addLoc(div_4, file$5, 9, 6, 447);
				button_1.type = "button";
				button_1.className = "btn btn-secondary";
				button_1.dataset.dismiss = "modal";
				addLoc(button_1, file$5, 13, 8, 601);
				addListener(button_2, "click", click_handler);
				button_2.type = "button";
				button_2.className = "btn btn-success";
				addLoc(button_2, file$5, 14, 8, 695);
				div_5.className = "modal-footer";
				addLoc(div_5, file$5, 12, 6, 565);
				div_2.className = "modal-content";
				addLoc(div_2, file$5, 2, 4, 164);
				div_1.className = "modal-dialog";
				setAttribute(div_1, "role", "document");
				addLoc(div_1, file$5, 1, 2, 116);
				div.className = "modal fade";
				div.id = "modal";
				div.tabIndex = "-1";
				setAttribute(div, "role", "dialog");
				setAttribute(div, "aria-labelledby", "modal-label");
				setAttribute(div, "aria-hidden", "true");
				addLoc(div, file$5, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, div_1);
				append(div_1, div_2);
				append(div_2, div_3);
				append(div_3, h5);
				append(h5, text);
				append(div_3, text_1);
				append(div_3, button);
				append(button, span);
				append(span, text_2);
				append(div_2, text_5);
				append(div_2, div_4);

				if (switch_instance) {
					switch_instance._mount(div_4, null);
				}

				append(div_2, text_7);
				append(div_2, div_5);
				append(div_5, button_1);
				append(button_1, text_8);
				append(div_5, text_9);
				append(div_5, button_2);
				append(button_2, text_10);
				current = true;
			},

			p: function update(changed, ctx) {
				if (!current || changed.title) {
					setData(text, ctx.title);
				}

				var switch_instance_changes = {};
				if (changed.formStore) switch_instance_changes.formStore = ctx.formStore;

				if (switch_value !== (switch_value = ctx.ComponentLink)) {
					if (switch_instance) {
						const old_component = switch_instance;
						old_component._fragment.o(() => {
							old_component.destroy();
						});
					}

					if (switch_value) {
						switch_instance = new switch_value(switch_props(ctx));
						switch_instance._fragment.c();
						switch_instance._mount(div_4, null);
					} else {
						switch_instance = null;
					}
				}

				else if (switch_value) {
					switch_instance._set(switch_instance_changes);
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (switch_instance) switch_instance._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				if (switch_instance) switch_instance.destroy();
				removeListener(button_2, "click", click_handler);
			}
		};
	}

	function Modal(options) {
		this._debugName = '<Modal>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign({}, options.data);
		this._recompute({ component: 1 }, this._state);
		if (!('component' in this._state)) console.warn("<Modal> was created without expected data property 'component'");
		if (!('title' in this._state)) console.warn("<Modal> was created without expected data property 'title'");

		if (!('formStore' in this._state)) console.warn("<Modal> was created without expected data property 'formStore'");
		this._intro = !!options.intro;

		this._handlers.destroy = [ondestroy$1];

		this._fragment = create_main_fragment$5(this, this._state);

		this.root._oncreate.push(() => {
			oncreate$3.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Modal.prototype, protoDev);
	assign(Modal.prototype, methods$5);

	Modal.prototype._checkReadOnly = function _checkReadOnly(newState) {
		if ('ComponentLink' in newState && !this._updatingReadonlyProperty) throw new Error("<Modal>: Cannot set read-only property 'ComponentLink'");
	};

	Modal.prototype._recompute = function _recompute(changed, state) {
		if (changed.component) {
			if (this._differs(state.ComponentLink, (state.ComponentLink = ComponentLink(state)))) changed.ComponentLink = true;
		}
	};

	/* src\components\table.html generated by Svelte v2.13.5 */

	Array.prototype.sum = function (prop, checked = false) {
	    var total = 0;
	    for ( var i = 0, _len = this.length; i < _len; i++ ) {
	        if(checked){
	            if(this[i]['checked'])
	                total += parseFloat(this[i][prop]);
	        } else {
	            total += parseFloat(this[i][prop]);
	        }
	    }
	    return total;
	};

	function CheckedCount({ items }) {
	    var CheckedCount = 0;
	    items.map(item => {
	        if(item.checked) CheckedCount++;
	    });

	    return CheckedCount;
	}

	function data$5() {
	    return {
	        filter: null,
	    };
	}
	var methods$6 = {
	    update() {
	        const { defaultFilter } = this.get();
	        
	        if(defaultFilter){
	            if(defaultFilter.desc){
	                this.filter(defaultFilter);
	            } else {
	                this.filter(defaultFilter);
	                this.filter(defaultFilter);
	            }
	        }
	    },
	    filter(column) {
	        if(column.name){
	            var subProp = '';
	            if(column.sum) subProp = column.sum;
	            if(column.prop) subProp = column.prop;
	            if(column.each && column.each.prop) subProp = column.each.prop;
	            const { items, filter } = this.get();

	            if (filter && filter == column.value + subProp) {
	                this.set({ items: items.sort((a, b) => {
	                    if(column.sum){
	                        a = a[column.value].sum(subProp); b = b[column.value].sum(subProp);
	                    } else if (column.each) {
	                        a = a[column.value].length; b = b[column.value].length;
	                    } else if (column.prop) {
	                        a = a[column.value][column.prop]; b = b[column.value][column.prop];
	                    } else {
	                        a = a[column.value]; b = b[column.value];
	                    }

	                    if(parseFloat(a)) a = parseFloat(a);
	                    if(parseFloat(b)) b = parseFloat(b);

	                    return a > b;
	                }), filter: column.value + subProp + '-desc', defaultFilter: column });
	            } else {
	                this.set({ items: items.sort((a, b) => {  
	                    if(column.sum){
	                        a = a[column.value].sum(subProp); b = b[column.value].sum(subProp);
	                    } else if (column.each) {
	                        a = a[column.value].length; b = b[column.value].length;
	                    } else if (column.prop) {
	                        a = a[column.value][column.prop]; b = b[column.value][column.prop];
	                    } else {
	                        a = a[column.value]; b = b[column.value];
	                    }

	                    if(parseFloat(a)) a = parseFloat(a);
	                    if(parseFloat(b)) b = parseFloat(b);

	                    return a < b;
	                }), filter: column.value + subProp, defaultFilter: column });
	            }
	        }
	    },
	    setTrigger(event, type, object) {
	        if(type != 'check') event.stopPropagation();
	        
	        const { store } = this.get();
	        store.set({ 
	            trigger: { type, object } 
	        });
	    },
	    selectAll(){
	        var hasItemNoneChecked = false;
	        $('tbody tr').each(function(index, el){
	            if($(el).attr('data-checked') != 'true') hasItemNoneChecked = true;
	        });

	        $('tbody tr').each(function(index, el){
	            if(hasItemNoneChecked){
	                if($(el).attr('data-checked') != 'true') $(el).trigger('click');
	            } else {
	                $(el).trigger('click');
	            }
	        });
	    },
	    propSum(arrObj, prop) {
	        var total = 0;
	        for (var i = 0;  i < arrObj.length; i++) {
	            total += arrObj[i][prop];
	        }
	        return total
	    }
	};

	function oncreate$4() {
	    this.update();
	}
	function ondestroy$2() {
	    //console.log(this);
	}
	function onstate$4({ changed, current, previous }) {
				if (changed.items && !changed.filter) {
					this.update();
				}
			}
	const file$6 = "src\\components\\table.html";

	function create_main_fragment$6(component, ctx) {
		var div, table, thead, tr, text, text_1, text_4, tbody, text_6, current;

		var if_block = (ctx.withCheckbox) && create_if_block$3(component, ctx);

		var each_value = ctx.columns;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$4(component, get_each_context$4(ctx, each_value, i));
		}

		var if_block_1 = (ctx.actions) && create_if_block_3$3(component, ctx);

		var each_value_1 = ctx.items;

		var each_1_blocks = [];

		for (var i = 0; i < each_value_1.length; i += 1) {
			each_1_blocks[i] = create_each_block_1$1(component, get_each_1_context$1(ctx, each_value_1, i));
		}

		var if_block_2 = (!ctx.hiddenTfoot || typeof(ctx.hiddenTfoot) == 'undefined') && create_if_block_16(component, ctx);

		return {
			c: function create() {
				div = createElement("div");
				table = createElement("table");
				thead = createElement("thead");
				tr = createElement("tr");
				if (if_block) if_block.c();
				text = createText("\r\n                ");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				text_1 = createText("\r\n                ");
				if (if_block_1) if_block_1.c();
				text_4 = createText("\r\n        ");
				tbody = createElement("tbody");

				for (var i = 0; i < each_1_blocks.length; i += 1) {
					each_1_blocks[i].c();
				}

				text_6 = createText("\r\n        ");
				if (if_block_2) if_block_2.c();
				addLoc(tr, file$6, 3, 12, 97);
				thead.className = "svelte-im5gfu";
				addLoc(thead, file$6, 2, 8, 76);
				tbody.className = "svelte-im5gfu";
				addLoc(tbody, file$6, 26, 8, 1328);
				table.className = "table table-sm";
				addLoc(table, file$6, 1, 4, 36);
				div.className = "table-responsive";
				addLoc(div, file$6, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, table);
				append(table, thead);
				append(thead, tr);
				if (if_block) if_block.m(tr, null);
				append(tr, text);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(tr, null);
				}

				append(tr, text_1);
				if (if_block_1) if_block_1.m(tr, null);
				append(table, text_4);
				append(table, tbody);

				for (var i = 0; i < each_1_blocks.length; i += 1) {
					each_1_blocks[i].m(tbody, null);
				}

				append(table, text_6);
				if (if_block_2) if_block_2.m(table, null);
				current = true;
			},

			p: function update(changed, ctx) {
				if (ctx.withCheckbox) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block$3(component, ctx);
						if_block.c();
						if_block.m(tr, text);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if (changed.columns || changed.filter) {
					each_value = ctx.columns;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$4(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block$4(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(tr, text_1);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}

				if (ctx.actions) {
					if (if_block_1) {
						if_block_1.p(changed, ctx);
					} else {
						if_block_1 = create_if_block_3$3(component, ctx);
						if_block_1.c();
						if_block_1.m(tr, null);
					}
				} else if (if_block_1) {
					if_block_1.d(1);
					if_block_1 = null;
				}

				if (changed.items || changed.withCheckbox || changed.columns || changed.actions || changed.rights) {
					each_value_1 = ctx.items;

					for (var i = 0; i < each_value_1.length; i += 1) {
						const child_ctx = get_each_1_context$1(ctx, each_value_1, i);

						if (each_1_blocks[i]) {
							each_1_blocks[i].p(changed, child_ctx);
						} else {
							each_1_blocks[i] = create_each_block_1$1(component, child_ctx);
							each_1_blocks[i].c();
							each_1_blocks[i].m(tbody, null);
						}
					}

					for (; i < each_1_blocks.length; i += 1) {
						each_1_blocks[i].d(1);
					}
					each_1_blocks.length = each_value_1.length;
				}

				if (!ctx.hiddenTfoot || typeof(ctx.hiddenTfoot) == 'undefined') {
					if (if_block_2) {
						if_block_2.p(changed, ctx);
					} else {
						if_block_2 = create_if_block_16(component, ctx);
						if_block_2.c();
						if_block_2.m(table, null);
					}
				} else if (if_block_2) {
					if_block_2.d(1);
					if_block_2 = null;
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				if (if_block) if_block.d();

				destroyEach(each_blocks, detach);

				if (if_block_1) if_block_1.d();

				destroyEach(each_1_blocks, detach);

				if (if_block_2) if_block_2.d();
			}
		};
	}

	// (5:16) {#if withCheckbox}
	function create_if_block$3(component, ctx) {
		var th, input, input_checked_value;

		function click_handler(event) {
			component.selectAll();
		}

		return {
			c: function create() {
				th = createElement("th");
				input = createElement("input");
				addListener(input, "click", click_handler);
				setAttribute(input, "type", "checkbox");
				input.checked = input_checked_value = ctx.CheckedCount == ctx.items.length;
				addLoc(input, file$6, 6, 20, 201);
				setStyle(th, "width", "55px");
				addLoc(th, file$6, 5, 16, 155);
			},

			m: function mount(target, anchor) {
				insert(target, th, anchor);
				append(th, input);
			},

			p: function update(changed, ctx) {
				if ((changed.CheckedCount || changed.items) && input_checked_value !== (input_checked_value = ctx.CheckedCount == ctx.items.length)) {
					input.checked = input_checked_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(th);
				}

				removeListener(input, "click", click_handler);
			}
		};
	}

	// (10:16) {#each columns as column}
	function create_each_block$4(component, ctx) {
		var th, div, text_value = ctx.column.name, text, text_1;

		function select_block_type(ctx) {
			if (ctx.filter == ctx.column.value + (ctx.column.sum ? ctx.column.sum : '') + (ctx.column.each ? ctx.column.each.prop : '') + (ctx.column.prop ? ctx.column.prop : '')) return create_if_block_1$3;
			if (ctx.filter == ctx.column.value + (ctx.column.sum ? ctx.column.sum : '') + (ctx.column.each ? ctx.column.each.prop : '') + (ctx.column.prop ? ctx.column.prop : '') + '-desc') return create_if_block_2$3;
			return null;
		}

		var current_block_type = select_block_type(ctx);
		var if_block = current_block_type && current_block_type(component, ctx);

		return {
			c: function create() {
				th = createElement("th");
				div = createElement("div");
				text = createText(text_value);
				text_1 = createText("\r\n                        ");
				if (if_block) if_block.c();
				div.className = "svelte-im5gfu";
				addLoc(div, file$6, 11, 20, 480);

				th._svelte = { component, ctx };

				addListener(th, "click", click_handler);
				setStyle(th, "width", "" + ctx.column.width + "px");
				addLoc(th, file$6, 10, 16, 396);
			},

			m: function mount(target, anchor) {
				insert(target, th, anchor);
				append(th, div);
				append(div, text);
				append(div, text_1);
				if (if_block) if_block.m(div, null);
			},

			p: function update(changed, _ctx) {
				ctx = _ctx;
				if ((changed.columns) && text_value !== (text_value = ctx.column.name)) {
					setData(text, text_value);
				}

				if (current_block_type !== (current_block_type = select_block_type(ctx))) {
					if (if_block) if_block.d(1);
					if_block = current_block_type && current_block_type(component, ctx);
					if (if_block) if_block.c();
					if (if_block) if_block.m(div, null);
				}

				th._svelte.ctx = ctx;
				if (changed.columns) {
					setStyle(th, "width", "" + ctx.column.width + "px");
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(th);
				}

				if (if_block) if_block.d();
				removeListener(th, "click", click_handler);
			}
		};
	}

	// (14:24) {#if filter == column.value + (column.sum ? column.sum : '') + (column.each ? column.each.prop : '') + (column.prop ? column.prop : '')}
	function create_if_block_1$3(component, ctx) {
		var i, text;

		return {
			c: function create() {
				i = createElement("i");
				text = createText("filter_list");
				i.className = "material-icons filter-icon svelte-im5gfu";
				addLoc(i, file$6, 14, 24, 712);
			},

			m: function mount(target, anchor) {
				insert(target, i, anchor);
				append(i, text);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(i);
				}
			}
		};
	}

	// (16:174) 
	function create_if_block_2$3(component, ctx) {
		var i, text;

		return {
			c: function create() {
				i = createElement("i");
				text = createText("filter_list");
				i.className = "material-icons filter-icon svelte-im5gfu";
				setStyle(i, "transform", "rotateX(180deg)");
				addLoc(i, file$6, 16, 24, 968);
			},

			m: function mount(target, anchor) {
				insert(target, i, anchor);
				append(i, text);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(i);
				}
			}
		};
	}

	// (22:16) {#if actions}
	function create_if_block_3$3(component, ctx) {
		var th;

		return {
			c: function create() {
				th = createElement("th");
				setStyle(th, "width", "" + 50*ctx.actions.length + "px");
				addLoc(th, file$6, 22, 16, 1212);
			},

			m: function mount(target, anchor) {
				insert(target, th, anchor);
			},

			p: function update(changed, ctx) {
				if (changed.actions) {
					setStyle(th, "width", "" + 50*ctx.actions.length + "px");
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(th);
				}
			}
		};
	}

	// (28:12) {#each items as item}
	function create_each_block_1$1(component, ctx) {
		var tr, text, text_1, tr_data_checked_value;

		var if_block = (ctx.withCheckbox) && create_if_block_4$2(component, ctx);

		var each_value_2 = ctx.columns;

		var each_blocks = [];

		for (var i = 0; i < each_value_2.length; i += 1) {
			each_blocks[i] = create_each_block_2$1(component, get_each_context_1$1(ctx, each_value_2, i));
		}

		var if_block_1 = (ctx.actions) && create_if_block_14(component, ctx);

		return {
			c: function create() {
				tr = createElement("tr");
				if (if_block) if_block.c();
				text = createText("\r\n                ");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				text_1 = createText("\r\n                ");
				if (if_block_1) if_block_1.c();
				setAttribute(tr, "onclick", "$(this).find('#check').trigger('click')");
				tr.dataset.checked = tr_data_checked_value = ctx.item.checked;
				tr.className = "svelte-im5gfu";
				addLoc(tr, file$6, 28, 12, 1384);
			},

			m: function mount(target, anchor) {
				insert(target, tr, anchor);
				if (if_block) if_block.m(tr, null);
				append(tr, text);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(tr, null);
				}

				append(tr, text_1);
				if (if_block_1) if_block_1.m(tr, null);
			},

			p: function update(changed, ctx) {
				if (ctx.withCheckbox) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block_4$2(component, ctx);
						if_block.c();
						if_block.m(tr, text);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if (changed.columns || changed.items) {
					each_value_2 = ctx.columns;

					for (var i = 0; i < each_value_2.length; i += 1) {
						const child_ctx = get_each_context_1$1(ctx, each_value_2, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block_2$1(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(tr, text_1);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value_2.length;
				}

				if (ctx.actions) {
					if (if_block_1) {
						if_block_1.p(changed, ctx);
					} else {
						if_block_1 = create_if_block_14(component, ctx);
						if_block_1.c();
						if_block_1.m(tr, null);
					}
				} else if (if_block_1) {
					if_block_1.d(1);
					if_block_1 = null;
				}

				if ((changed.items) && tr_data_checked_value !== (tr_data_checked_value = ctx.item.checked)) {
					tr.dataset.checked = tr_data_checked_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(tr);
				}

				if (if_block) if_block.d();

				destroyEach(each_blocks, detach);

				if (if_block_1) if_block_1.d();
			}
		};
	}

	// (30:16) {#if withCheckbox}
	function create_if_block_4$2(component, ctx) {
		var td, input;

		function input_change_handler() {
			ctx.each_value_1[ctx.item_index].checked = input.checked;
			component.set({ items: ctx.items });
		}

		return {
			c: function create() {
				td = createElement("td");
				input = createElement("input");
				input._svelte = { component, ctx };

				addListener(input, "change", input_change_handler);
				addListener(input, "click", click_handler_1);
				setAttribute(input, "type", "checkbox");
				input.id = "check";
				setAttribute(input, "onclick", "event.stopPropagation()");
				addLoc(input, file$6, 31, 20, 1589);
				td.className = "align-middle";
				setStyle(td, "width", "55px");
				addLoc(td, file$6, 30, 16, 1522);
			},

			m: function mount(target, anchor) {
				insert(target, td, anchor);
				append(td, input);

				input.checked = ctx.item.checked;
			},

			p: function update(changed, _ctx) {
				ctx = _ctx;
				input._svelte.ctx = ctx;
				if (changed.items) input.checked = ctx.item.checked;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(td);
				}

				removeListener(input, "change", input_change_handler);
				removeListener(input, "click", click_handler_1);
			}
		};
	}

	// (35:16) {#each columns as column}
	function create_each_block_2$1(component, ctx) {
		var td;

		function select_block_type_2(ctx) {
			if (ctx.column.location) return create_if_block_5$1;
			if (ctx.column.count) return create_if_block_6$1;
			if (ctx.column.img) return create_if_block_7$1;
			if (ctx.column.sum) return create_if_block_8$1;
			if (ctx.column.each) return create_if_block_9$1;
			if (ctx.column.prop) return create_if_block_12;
			return create_if_block_13;
		}

		var current_block_type = select_block_type_2(ctx);
		var if_block = current_block_type(component, ctx);

		return {
			c: function create() {
				td = createElement("td");
				if_block.c();
				td.className = "align-middle";
				setStyle(td, "width", "" + ctx.column.width + "px");
				setStyle(td, "color", ctx.column.color);
				addLoc(td, file$6, 35, 16, 1835);
			},

			m: function mount(target, anchor) {
				insert(target, td, anchor);
				if_block.m(td, null);
			},

			p: function update(changed, ctx) {
				if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block.d(1);
					if_block = current_block_type(component, ctx);
					if_block.c();
					if_block.m(td, null);
				}

				if (changed.columns) {
					setStyle(td, "width", "" + ctx.column.width + "px");
					setStyle(td, "color", ctx.column.color);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(td);
				}

				if_block.d();
			}
		};
	}

	// (46:24) {#each item[column.value] as subItem}
	function create_each_block_3$1(component, ctx) {
		var if_block_anchor;

		function select_block_type_1(ctx) {
			if (ctx.column.each.location) return create_if_block_10;
			return create_if_block_11;
		}

		var current_block_type = select_block_type_1(ctx);
		var if_block = current_block_type(component, ctx);

		return {
			c: function create() {
				if_block.c();
				if_block_anchor = createComment();
			},

			m: function mount(target, anchor) {
				if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
			},

			p: function update(changed, ctx) {
				if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block.d(1);
					if_block = current_block_type(component, ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},

			d: function destroy$$1(detach) {
				if_block.d(detach);
				if (detach) {
					detachNode(if_block_anchor);
				}
			}
		};
	}

	// (47:28) {#if column.each.location}
	function create_if_block_10(component, ctx) {
		var a, text_value = ctx.subItem[ctx.column.each.prop], text, a_href_value;

		return {
			c: function create() {
				a = createElement("a");
				text = createText(text_value);
				a.href = a_href_value = "" + ctx.column.each.location.href + ctx.subItem[ctx.column.each.location.itemValueColumnId];
				a.target = "_blank";
				a.className = "badge badge-pill badge-primary";
				setStyle(a, "margin-right", "5px");
				setStyle(a, "margin-bottom", "5px");
				addLoc(a, file$6, 47, 28, 2706);
			},

			m: function mount(target, anchor) {
				insert(target, a, anchor);
				append(a, text);
			},

			p: function update(changed, ctx) {
				if ((changed.items || changed.columns) && text_value !== (text_value = ctx.subItem[ctx.column.each.prop])) {
					setData(text, text_value);
				}

				if ((changed.columns || changed.items) && a_href_value !== (a_href_value = "" + ctx.column.each.location.href + ctx.subItem[ctx.column.each.location.itemValueColumnId])) {
					a.href = a_href_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(a);
				}
			}
		};
	}

	// (49:28) {:else}
	function create_if_block_11(component, ctx) {
		var span, text_value = ctx.subItem[ctx.column.each.prop] || 'Нет данных', text;

		return {
			c: function create() {
				span = createElement("span");
				text = createText(text_value);
				span.className = "badge badge-pill badge-primary";
				addLoc(span, file$6, 49, 28, 2993);
			},

			m: function mount(target, anchor) {
				insert(target, span, anchor);
				append(span, text);
			},

			p: function update(changed, ctx) {
				if ((changed.items || changed.columns) && text_value !== (text_value = ctx.subItem[ctx.column.each.prop] || 'Нет данных')) {
					setData(text, text_value);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(span);
				}
			}
		};
	}

	// (37:20) {#if column.location}
	function create_if_block_5$1(component, ctx) {
		var a, text_value = ctx.item[ctx.column.value] || 'Нет данных', text, a_href_value;

		return {
			c: function create() {
				a = createElement("a");
				text = createText(text_value);
				a.href = a_href_value = "" + ctx.column.location.href + ctx.item[ctx.column.location.itemValueColumnId];
				a.target = "_blank";
				addLoc(a, file$6, 37, 24, 1984);
			},

			m: function mount(target, anchor) {
				insert(target, a, anchor);
				append(a, text);
			},

			p: function update(changed, ctx) {
				if ((changed.items || changed.columns) && text_value !== (text_value = ctx.item[ctx.column.value] || 'Нет данных')) {
					setData(text, text_value);
				}

				if ((changed.columns || changed.items) && a_href_value !== (a_href_value = "" + ctx.column.location.href + ctx.item[ctx.column.location.itemValueColumnId])) {
					a.href = a_href_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(a);
				}
			}
		};
	}

	// (39:42) 
	function create_if_block_6$1(component, ctx) {
		var text_value = ctx.item[ctx.column.value].length || 'Нет данных', text;

		return {
			c: function create() {
				text = createText(text_value);
			},

			m: function mount(target, anchor) {
				insert(target, text, anchor);
			},

			p: function update(changed, ctx) {
				if ((changed.items || changed.columns) && text_value !== (text_value = ctx.item[ctx.column.value].length || 'Нет данных')) {
					setData(text, text_value);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(text);
				}
			}
		};
	}

	// (41:40) 
	function create_if_block_7$1(component, ctx) {
		var img, img_src_value, img_width_value, img_height_value;

		return {
			c: function create() {
				img = createElement("img");
				img.src = img_src_value = ctx.item[ctx.column.value];
				img.className = "circle";
				img.width = img_width_value = ctx.column.img.width;
				img.height = img_height_value = ctx.column.img.height;
				addLoc(img, file$6, 41, 24, 2295);
			},

			m: function mount(target, anchor) {
				insert(target, img, anchor);
			},

			p: function update(changed, ctx) {
				if ((changed.items || changed.columns) && img_src_value !== (img_src_value = ctx.item[ctx.column.value])) {
					img.src = img_src_value;
				}

				if ((changed.columns) && img_width_value !== (img_width_value = ctx.column.img.width)) {
					img.width = img_width_value;
				}

				if ((changed.columns) && img_height_value !== (img_height_value = ctx.column.img.height)) {
					img.height = img_height_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(img);
				}
			}
		};
	}

	// (43:40) 
	function create_if_block_8$1(component, ctx) {
		var text_value = ctx.item[ctx.column.value].sum(ctx.column.sum) || 'Нет данных', text;

		return {
			c: function create() {
				text = createText(text_value);
			},

			m: function mount(target, anchor) {
				insert(target, text, anchor);
			},

			p: function update(changed, ctx) {
				if ((changed.items || changed.columns) && text_value !== (text_value = ctx.item[ctx.column.value].sum(ctx.column.sum) || 'Нет данных')) {
					setData(text, text_value);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(text);
				}
			}
		};
	}

	// (45:41) 
	function create_if_block_9$1(component, ctx) {
		var each_anchor;

		var each_value_3 = ctx.item[ctx.column.value];

		var each_blocks = [];

		for (var i = 0; i < each_value_3.length; i += 1) {
			each_blocks[i] = create_each_block_3$1(component, get_each_context_2$1(ctx, each_value_3, i));
		}

		return {
			c: function create() {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_anchor = createComment();
			},

			m: function mount(target, anchor) {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(target, anchor);
				}

				insert(target, each_anchor, anchor);
			},

			p: function update(changed, ctx) {
				if (changed.columns || changed.items) {
					each_value_3 = ctx.item[ctx.column.value];

					for (var i = 0; i < each_value_3.length; i += 1) {
						const child_ctx = get_each_context_2$1(ctx, each_value_3, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block_3$1(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(each_anchor.parentNode, each_anchor);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value_3.length;
				}
			},

			d: function destroy$$1(detach) {
				destroyEach(each_blocks, detach);

				if (detach) {
					detachNode(each_anchor);
				}
			}
		};
	}

	// (53:41) 
	function create_if_block_12(component, ctx) {
		var text_value = ctx.item[ctx.column.value] ? ctx.item[ctx.column.value][ctx.column.prop] : 'Нет данных', text;

		return {
			c: function create() {
				text = createText(text_value);
			},

			m: function mount(target, anchor) {
				insert(target, text, anchor);
			},

			p: function update(changed, ctx) {
				if ((changed.items || changed.columns) && text_value !== (text_value = ctx.item[ctx.column.value] ? ctx.item[ctx.column.value][ctx.column.prop] : 'Нет данных')) {
					setData(text, text_value);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(text);
				}
			}
		};
	}

	// (55:20) {:else}
	function create_if_block_13(component, ctx) {
		var text_value = ctx.item[ctx.column.value] || 'Нет данных', text;

		return {
			c: function create() {
				text = createText(text_value);
			},

			m: function mount(target, anchor) {
				insert(target, text, anchor);
			},

			p: function update(changed, ctx) {
				if ((changed.items || changed.columns) && text_value !== (text_value = ctx.item[ctx.column.value] || 'Нет данных')) {
					setData(text, text_value);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(text);
				}
			}
		};
	}

	// (62:20) {#each actions as action}
	function create_each_block_4$1(component, ctx) {
		var if_block_anchor;

		var if_block = (ctx.rights.indexOf(ctx.action.value) != -1) && create_if_block_15(component, ctx);

		return {
			c: function create() {
				if (if_block) if_block.c();
				if_block_anchor = createComment();
			},

			m: function mount(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
			},

			p: function update(changed, ctx) {
				if (ctx.rights.indexOf(ctx.action.value) != -1) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block_15(component, ctx);
						if_block.c();
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},

			d: function destroy$$1(detach) {
				if (if_block) if_block.d(detach);
				if (detach) {
					detachNode(if_block_anchor);
				}
			}
		};
	}

	// (63:24) {#if rights.indexOf(action.value) != -1}
	function create_if_block_15(component, ctx) {
		var i, text_value = ctx.action.value, text, i_class_value, i_id_value, i_title_value;

		return {
			c: function create() {
				i = createElement("i");
				text = createText(text_value);
				i._svelte = { component, ctx };

				addListener(i, "click", click_handler_2);
				i.className = i_class_value = "material-icons text-primary pointer " + ctx.action.colorText + " svelte-im5gfu";
				i.id = i_id_value = "" + ctx.item.id + "-" + ctx.action.value + "-btn";
				i.title = i_title_value = ctx.action.name;
				addLoc(i, file$6, 63, 24, 3710);
			},

			m: function mount(target, anchor) {
				insert(target, i, anchor);
				append(i, text);
			},

			p: function update(changed, _ctx) {
				ctx = _ctx;
				if ((changed.actions) && text_value !== (text_value = ctx.action.value)) {
					setData(text, text_value);
				}

				i._svelte.ctx = ctx;
				if ((changed.actions) && i_class_value !== (i_class_value = "material-icons text-primary pointer " + ctx.action.colorText + " svelte-im5gfu")) {
					i.className = i_class_value;
				}

				if ((changed.items || changed.actions) && i_id_value !== (i_id_value = "" + ctx.item.id + "-" + ctx.action.value + "-btn")) {
					i.id = i_id_value;
				}

				if ((changed.actions) && i_title_value !== (i_title_value = ctx.action.name)) {
					i.title = i_title_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(i);
				}

				removeListener(i, "click", click_handler_2);
			}
		};
	}

	// (60:16) {#if actions}
	function create_if_block_14(component, ctx) {
		var td;

		var each_value_4 = ctx.actions;

		var each_blocks = [];

		for (var i = 0; i < each_value_4.length; i += 1) {
			each_blocks[i] = create_each_block_4$1(component, get_each_context_3(ctx, each_value_4, i));
		}

		return {
			c: function create() {
				td = createElement("td");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				td.className = "align-middle";
				setStyle(td, "width", "" + 50*ctx.actions.length + "px");
				addLoc(td, file$6, 60, 16, 3509);
			},

			m: function mount(target, anchor) {
				insert(target, td, anchor);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(td, null);
				}
			},

			p: function update(changed, ctx) {
				if (changed.rights || changed.actions || changed.items) {
					each_value_4 = ctx.actions;

					for (var i = 0; i < each_value_4.length; i += 1) {
						const child_ctx = get_each_context_3(ctx, each_value_4, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block_4$1(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(td, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value_4.length;
				}

				if (changed.actions) {
					setStyle(td, "width", "" + 50*ctx.actions.length + "px");
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(td);
				}

				destroyEach(each_blocks, detach);
			}
		};
	}

	// (77:16) {#if withCheckbox}
	function create_if_block_17(component, ctx) {
		var th, text_value = ctx.CheckedCount > 0 ? 'Выделено:'+ctx.CheckedCount : 'Итого', text;

		return {
			c: function create() {
				th = createElement("th");
				text = createText(text_value);
				setStyle(th, "width", "55px");
				addLoc(th, file$6, 77, 16, 4274);
			},

			m: function mount(target, anchor) {
				insert(target, th, anchor);
				append(th, text);
			},

			p: function update(changed, ctx) {
				if ((changed.CheckedCount) && text_value !== (text_value = ctx.CheckedCount > 0 ? 'Выделено:'+ctx.CheckedCount : 'Итого')) {
					setData(text, text_value);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(th);
				}
			}
		};
	}

	// (82:16) {#each columns as column}
	function create_each_block_5$1(component, ctx) {
		var th;

		var if_block = (!ctx.column.hiddenTfoot) && create_if_block_18(component, ctx);

		return {
			c: function create() {
				th = createElement("th");
				if (if_block) if_block.c();
				th._svelte = { component, ctx };

				addListener(th, "click", click_handler_3);
				setStyle(th, "width", "" + ctx.column.width + "px");
				addLoc(th, file$6, 82, 16, 4482);
			},

			m: function mount(target, anchor) {
				insert(target, th, anchor);
				if (if_block) if_block.m(th, null);
			},

			p: function update(changed, _ctx) {
				ctx = _ctx;
				if (!ctx.column.hiddenTfoot) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block_18(component, ctx);
						if_block.c();
						if_block.m(th, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				th._svelte.ctx = ctx;
				if (changed.columns) {
					setStyle(th, "width", "" + ctx.column.width + "px");
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(th);
				}

				if (if_block) if_block.d();
				removeListener(th, "click", click_handler_3);
			}
		};
	}

	// (86:24) {#if CheckedCount > 0}
	function create_if_block_19(component, ctx) {
		var text_value = ctx.items.sum(ctx.column.value, true) ? ctx.items.sum(ctx.column.value, true).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1 ").replace('.', ',') : '', text;

		return {
			c: function create() {
				text = createText(text_value);
			},

			m: function mount(target, anchor) {
				insert(target, text, anchor);
			},

			p: function update(changed, ctx) {
				if ((changed.items || changed.columns) && text_value !== (text_value = ctx.items.sum(ctx.column.value, true) ? ctx.items.sum(ctx.column.value, true).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1 ").replace('.', ',') : '')) {
					setData(text, text_value);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(text);
				}
			}
		};
	}

	// (88:24) {:else}
	function create_if_block_20(component, ctx) {
		var text_value = ctx.items.sum(ctx.column.value) ? ctx.items.sum(ctx.column.value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1 ").replace('.', ',') : '', text;

		return {
			c: function create() {
				text = createText(text_value);
			},

			m: function mount(target, anchor) {
				insert(target, text, anchor);
			},

			p: function update(changed, ctx) {
				if ((changed.items || changed.columns) && text_value !== (text_value = ctx.items.sum(ctx.column.value) ? ctx.items.sum(ctx.column.value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1 ").replace('.', ',') : '')) {
					setData(text, text_value);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(text);
				}
			}
		};
	}

	// (84:20) {#if !column.hiddenTfoot}
	function create_if_block_18(component, ctx) {
		var div;

		function select_block_type_3(ctx) {
			if (ctx.CheckedCount > 0) return create_if_block_19;
			return create_if_block_20;
		}

		var current_block_type = select_block_type_3(ctx);
		var if_block = current_block_type(component, ctx);

		return {
			c: function create() {
				div = createElement("div");
				if_block.c();
				addLoc(div, file$6, 84, 20, 4613);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				if_block.m(div, null);
			},

			p: function update(changed, ctx) {
				if (current_block_type === (current_block_type = select_block_type_3(ctx)) && if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block.d(1);
					if_block = current_block_type(component, ctx);
					if_block.c();
					if_block.m(div, null);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				if_block.d();
			}
		};
	}

	// (95:16) {#if actions}
	function create_if_block_21(component, ctx) {
		var th;

		return {
			c: function create() {
				th = createElement("th");
				setStyle(th, "width", "" + 50*ctx.actions.length + "px");
				addLoc(th, file$6, 95, 16, 5200);
			},

			m: function mount(target, anchor) {
				insert(target, th, anchor);
			},

			p: function update(changed, ctx) {
				if (changed.actions) {
					setStyle(th, "width", "" + 50*ctx.actions.length + "px");
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(th);
				}
			}
		};
	}

	// (74:8) {#if !hiddenTfoot || typeof(hiddenTfoot) == 'undefined'}
	function create_if_block_16(component, ctx) {
		var tfoot, tr, text, text_1;

		var if_block = (ctx.withCheckbox) && create_if_block_17(component, ctx);

		var each_value_5 = ctx.columns;

		var each_blocks = [];

		for (var i = 0; i < each_value_5.length; i += 1) {
			each_blocks[i] = create_each_block_5$1(component, get_each_context_4(ctx, each_value_5, i));
		}

		var if_block_1 = (ctx.actions) && create_if_block_21(component, ctx);

		return {
			c: function create() {
				tfoot = createElement("tfoot");
				tr = createElement("tr");
				if (if_block) if_block.c();
				text = createText("\r\n                ");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				text_1 = createText("\r\n                ");
				if (if_block_1) if_block_1.c();
				addLoc(tr, file$6, 75, 12, 4216);
				tfoot.className = "svelte-im5gfu";
				addLoc(tfoot, file$6, 74, 8, 4195);
			},

			m: function mount(target, anchor) {
				insert(target, tfoot, anchor);
				append(tfoot, tr);
				if (if_block) if_block.m(tr, null);
				append(tr, text);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(tr, null);
				}

				append(tr, text_1);
				if (if_block_1) if_block_1.m(tr, null);
			},

			p: function update(changed, ctx) {
				if (ctx.withCheckbox) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block_17(component, ctx);
						if_block.c();
						if_block.m(tr, text);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if (changed.columns || changed.CheckedCount || changed.items) {
					each_value_5 = ctx.columns;

					for (var i = 0; i < each_value_5.length; i += 1) {
						const child_ctx = get_each_context_4(ctx, each_value_5, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block_5$1(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(tr, text_1);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value_5.length;
				}

				if (ctx.actions) {
					if (if_block_1) {
						if_block_1.p(changed, ctx);
					} else {
						if_block_1 = create_if_block_21(component, ctx);
						if_block_1.c();
						if_block_1.m(tr, null);
					}
				} else if (if_block_1) {
					if_block_1.d(1);
					if_block_1 = null;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(tfoot);
				}

				if (if_block) if_block.d();

				destroyEach(each_blocks, detach);

				if (if_block_1) if_block_1.d();
			}
		};
	}

	function get_each_context$4(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.column = list[i];
		child_ctx.each_value = list;
		child_ctx.column_index = i;
		return child_ctx;
	}

	function click_handler(event) {
		const { component, ctx } = this._svelte;

		component.filter(ctx.column);
	}

	function get_each_1_context$1(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.item = list[i];
		child_ctx.each_value_1 = list;
		child_ctx.item_index = i;
		return child_ctx;
	}

	function click_handler_1(event) {
		const { component, ctx } = this._svelte;

		component.setTrigger(event, 'check', ctx.item);
	}

	function get_each_context_1$1(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.column = list[i];
		child_ctx.each_value_2 = list;
		child_ctx.column_index_1 = i;
		return child_ctx;
	}

	function get_each_context_2$1(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.subItem = list[i];
		child_ctx.each_value_3 = list;
		child_ctx.subItem_index = i;
		return child_ctx;
	}

	function get_each_context_3(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.action = list[i];
		child_ctx.each_value_4 = list;
		child_ctx.action_index = i;
		return child_ctx;
	}

	function click_handler_2(event) {
		const { component, ctx } = this._svelte;

		component.setTrigger(event, ctx.action.value, ctx.item);
	}

	function get_each_context_4(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.column = list[i];
		child_ctx.each_value_5 = list;
		child_ctx.column_index_2 = i;
		return child_ctx;
	}

	function click_handler_3(event) {
		const { component, ctx } = this._svelte;

		component.filter(ctx.column);
	}

	function Table(options) {
		this._debugName = '<Table>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$5(), options.data);
		this._recompute({ items: 1 }, this._state);
		if (!('items' in this._state)) console.warn("<Table> was created without expected data property 'items'");
		if (!('withCheckbox' in this._state)) console.warn("<Table> was created without expected data property 'withCheckbox'");

		if (!('columns' in this._state)) console.warn("<Table> was created without expected data property 'columns'");
		if (!('filter' in this._state)) console.warn("<Table> was created without expected data property 'filter'");
		if (!('actions' in this._state)) console.warn("<Table> was created without expected data property 'actions'");
		if (!('rights' in this._state)) console.warn("<Table> was created without expected data property 'rights'");
		if (!('hiddenTfoot' in this._state)) console.warn("<Table> was created without expected data property 'hiddenTfoot'");
		this._intro = !!options.intro;

		this._handlers.state = [onstate$4];

		this._handlers.destroy = [ondestroy$2];

		onstate$4.call(this, { changed: assignTrue({}, this._state), current: this._state });

		this._fragment = create_main_fragment$6(this, this._state);

		this.root._oncreate.push(() => {
			oncreate$4.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Table.prototype, protoDev);
	assign(Table.prototype, methods$6);

	Table.prototype._checkReadOnly = function _checkReadOnly(newState) {
		if ('CheckedCount' in newState && !this._updatingReadonlyProperty) throw new Error("<Table>: Cannot set read-only property 'CheckedCount'");
	};

	Table.prototype._recompute = function _recompute(changed, state) {
		if (changed.items) {
			if (this._differs(state.CheckedCount, (state.CheckedCount = CheckedCount(state)))) changed.CheckedCount = true;
		}
	};

	function Store(state, options) {
		this._handlers = {};
		this._dependents = [];

		this._computed = blankObject();
		this._sortedComputedProperties = [];

		this._state = assign({}, state);
		this._differs = options && options.immutable ? _differsImmutable : _differs;
	}

	assign(Store.prototype, {
		_add(component, props) {
			this._dependents.push({
				component: component,
				props: props
			});
		},

		_init(props) {
			const state = {};
			for (let i = 0; i < props.length; i += 1) {
				const prop = props[i];
				state['$' + prop] = this._state[prop];
			}
			return state;
		},

		_remove(component) {
			let i = this._dependents.length;
			while (i--) {
				if (this._dependents[i].component === component) {
					this._dependents.splice(i, 1);
					return;
				}
			}
		},

		_set(newState, changed) {
			const previous = this._state;
			this._state = assign(assign({}, previous), newState);

			for (let i = 0; i < this._sortedComputedProperties.length; i += 1) {
				this._sortedComputedProperties[i].update(this._state, changed);
			}

			this.fire('state', {
				changed,
				previous,
				current: this._state
			});

			this._dependents
				.filter(dependent => {
					const componentState = {};
					let dirty = false;

					for (let j = 0; j < dependent.props.length; j += 1) {
						const prop = dependent.props[j];
						if (prop in changed) {
							componentState['$' + prop] = this._state[prop];
							dirty = true;
						}
					}

					if (dirty) {
						dependent.component._stage(componentState);
						return true;
					}
				})
				.forEach(dependent => {
					dependent.component.set({});
				});

			this.fire('update', {
				changed,
				previous,
				current: this._state
			});
		},

		_sortComputedProperties() {
			const computed = this._computed;
			const sorted = this._sortedComputedProperties = [];
			const visited = blankObject();
			let currentKey;

			function visit(key) {
				const c = computed[key];

				if (c) {
					c.deps.forEach(dep => {
						if (dep === currentKey) {
							throw new Error(`Cyclical dependency detected between ${dep} <-> ${key}`);
						}

						visit(dep);
					});

					if (!visited[key]) {
						visited[key] = true;
						sorted.push(c);
					}
				}
			}

			for (const key in this._computed) {
				visit(currentKey = key);
			}
		},

		compute(key, deps, fn) {
			let value;

			const c = {
				deps,
				update: (state, changed, dirty) => {
					const values = deps.map(dep => {
						if (dep in changed) dirty = true;
						return state[dep];
					});

					if (dirty) {
						const newValue = fn.apply(null, values);
						if (this._differs(newValue, value)) {
							value = newValue;
							changed[key] = true;
							state[key] = value;
						}
					}
				}
			};

			this._computed[key] = c;
			this._sortComputedProperties();

			const state = assign({}, this._state);
			const changed = {};
			c.update(state, changed, true);
			this._set(state, changed);
		},

		fire,

		get,

		on,

		set(newState) {
			const oldState = this._state;
			const changed = this._changed = {};
			let dirty = false;

			for (const key in newState) {
				if (this._computed[key]) throw new Error(`'${key}' is a read-only property`);
				if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
			}
			if (!dirty) return;

			this._set(newState, changed);
		}
	});

	/* src\components\vkGroups.html generated by Svelte v2.13.5 */

	const tableStore = new Store();
	const formStore = new Store();

	function VkGroups$1({ vkGroups }) {
	    var newOrder = JSON.parse(localStorage.getItem('newOrder'));
	    if(newOrder){
	        vkGroups = vkGroups.map(vkGroup => {
	            if(newOrder.vkGroups.indexOf(vkGroup.id) != -1){
	                vkGroup.checked = true;
	            }
	            return vkGroup;
	        });
	    }
	    return vkGroups;
	}

	function data$6() {
	    return {
	        vkGroups: [],
	        checked: JSON.parse(localStorage.getItem('newOrder')) ? JSON.parse(localStorage.getItem('newOrder')).vkGroups : [],
	        filter: null,
	        loader: {
	            isProgress: false,
	            value: 0,
	            max: 100
	        },
	        table: {
	            columns: [{
	                name: '',
	                value: 'avatar',
	                img: {
	                    width: 100,
	                    height: 100
	                }
	            }, {
	                name: 'Название',
	                value: 'name',
	                location: {
	                    href: 'https://vk.com/public',
	                    itemValueColumnId: 'vk_group_id'
	                }
	            }, {
	                name: 'Аудитория',
	                value: 'members'
	            }, {
	                name: 'Охват поста',
	                value: 'views'
	            }, {
	                name: 'Лайков',
	                value: 'likes'
	            }, {
	                name: 'Репостов',
	                value: 'reposts'
	            }, {
	                name: 'Стоимость',
	                value: 'price',
	                color: 'red'
	            }],
	            actions: [{
	                name: 'редактировать',
	                value: 'edit'
	            }, {
	                name: 'удалить',
	                value: 'delete',
	                colorText: 'danger-text'
	            }],
	            defaultFilter: {
	                name: 'Название',
	                value: 'name',
	                location: {
	                    href: 'https://vk.com/public',
	                    itemValueColumnId: 'vk_group_id'
	                },
	                asc: true
	            },
	            store: tableStore
	        },
	        formStore
	    };
	}
	var methods$7 = {
	    update() {
	        phalconApi.vkGroups.all().then(vkGroups => {
	            this.set({ vkGroups });
	        });
	    },
	    checked(id){
	        var { checked } = this.get();
	        if(checked){
	            if(checked.indexOf(id) == -1){
	                checked.push(id);
	            } else {
	                checked = checked.filter(checkId => checkId != id);
	            }
	        } else {
	            checked = [id];
	        }
	        this.set({ checked });
	        formStore.set({ groups: checked });
	    },
	    deleteGroup(id) {
	        const { vkGroups } = this.get();

	        phalconApi.vkGroups.remove(id).then(status => {
	            if (status == 200) {
	                this.options.root.toast('success', 'Группа удалена!');
	                this.set({ vkGroups: vkGroups.filter((vkGroup => vkGroup.id != id)) });
	            }
	        });
	    },
	    updateStatistic(){
	        var self = this;
	        var { vkGroups, loader } = this.get();

	        loader.max = vkGroups.length;
	        loader.isProgress = true;
	        this.set({ loader });

	        vkGroups.forEach(function (vkGroup, index) {
	            setTimeout(function () {
	                vkApi.getGroupMembers(vkGroup.vk_group_id).then(async group => {
	                    var data = {};

	                    await vkApi.getWallByGroup(vkGroup.vk_group_id).then(wall => {
	                        var likes, views, reposts;
	                        likes = views = reposts = 0;
	                        wall.items.forEach(function (item) {
	                            likes += item.likes.count;
	                            views += item.views.count;
	                            reposts += item.reposts.count;
	                        });

	                        data = {
	                            likes: Math.round(likes / 100),
	                            views: Math.round(views / 100),
	                            reposts: Math.round(reposts / 100),
	                            members: group.count
	                        };
	                    });

	                    await phalconApi.vkGroups.update(vkGroup.id, data).then(data => {
	                        loader.value++;
	                        if (data.status == 200) {
	                            data = JSON.parse(data.response);

	                            vkGroups = vkGroups.map(vkGroup => {
	                                if (vkGroup.id == data.id) vkGroup = data;
	                                return vkGroup;
	                            });

	                            self.set({ vkGroups, loader });
	                        }
	                    });
	                });
	            }, 1000 * index);
	        });
	    }
	};

	function oncreate$5() {
	    const { checked, formStore } = this.get();

	    tableStore.on('state', ({ changed, current }) => {
	        if (changed.trigger) {
	            var targetId = current.trigger.object.id;
	            var { newOrder } = this.options.root.get();

	            if (current.trigger.type == 'delete') this.deleteGroup(targetId);

	            if (current.trigger.type == 'edit') {
	                formStore.set({ vkGroup: current.trigger.object });
	                this.set({ modal: { name: 'Редактирование ВК-группы', component: 'VkGroupsForm' } });
	            }

	            if (current.trigger.type == 'check'){ 
	                this.checked(targetId);

	                if(newOrder && newOrder.vkGroups){
	                    if(newOrder.vkGroups.indexOf(targetId) == -1){
	                        newOrder.vkGroups.push(targetId);
	                        newOrder.price += current.trigger.object.price;
	                    } else {
	                        newOrder.vkGroups.splice(newOrder.vkGroups.indexOf(targetId), 1);
	                        newOrder.price -= current.trigger.object.price;
	                    }
	                } else { 
	                    newOrder = {};
	                    newOrder.vkGroups = [targetId];
	                    newOrder.price = current.trigger.object.price;
	                }

	                if((!newOrder.vkGroups || newOrder.vkGroups.length == 0) && (!newOrder.packages || newOrder.packages.length == 0)){
	                    newOrder = null;
	                }
	                
	                this.options.root.set({ newOrder });
	                localStorage.setItem('newOrder', JSON.stringify(newOrder));
	                
	                if(newOrder){
	                    $('#newOrder').css('transform', 'translateY(0)');
	                    setTimeout(function(){
	                        if(newOrder.vkGroups && newOrder.vkGroups.length > 0){
	                            $('#newOrder').css('transform', 'translateY(72%)');
	                        }
	                    }, 500);
	                }
	            }
	        }
	    });

	    formStore.on('state', ({ changed, current }) => {
	        if (changed.isLoad) {
	            this.update();
	            formStore.set({ isLoad: false });
	        }

	        if(changed.isClose){
	            this.set({ modal: null });
	            formStore.set({ isClose: false });
	        }

	        if(changed.groups){
	            console.log(changed, current);
	        }
	    });

	    if(checked && checked.length > 0){
	        formStore.set({ groups: checked });
	    } else {
	        this.set({ checked: [] });
	    }

	    this.update();
	}
	function onstate$5({ changed, current, previous }) {
	    // this fires before oncreate, and on every state change.
	    // the first time it runs, `previous` is undefined
	    console.log(changed, current, previous);
	    if (changed.loader) {
	        if (current.loader.value == current.loader.max) {
	            this.set({
	                loader: {
	                    isProgress: false,
	                    value: 0,
	                    max: 100
	                }
	            });

	            this.options.root.toast('success', 'Статистика обновлена успешно!');
	        }
	    }
	}
	const file$7 = "src\\components\\vkGroups.html";

	function create_main_fragment$7(component, ctx) {
		var div, text, text_2, div_1, current_block_type_index, if_block_2, text_3, current;

		var if_block = (ctx.rights.VkGroups.indexOf('create') != -1) && create_if_block$4(component, ctx);

		var if_block_1 = (ctx.rights.VkGroups.indexOf('update') != -1) && create_if_block_1$4(component, ctx);

		var if_block_creators = [
			create_if_block_2$4,
			create_if_block_7$2
		];

		var if_blocks = [];

		function select_block_type(ctx) {
			if (ctx.vkGroups.length) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block_2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](component, ctx);

		var if_block_3 = (ctx.modal && ctx.modal.component) && create_if_block_8$2(component, ctx);

		return {
			c: function create() {
				div = createElement("div");
				if (if_block) if_block.c();
				text = createText("\r\n\r\n    ");
				if (if_block_1) if_block_1.c();
				text_2 = createText("\r\n\r\n");
				div_1 = createElement("div");
				if_block_2.c();
				text_3 = createText("\r\n\r\n    ");
				if (if_block_3) if_block_3.c();
				div.className = "col-md-6";
				setStyle(div, "padding-top", "3px");
				addLoc(div, file$7, 0, 0, 0);
				div_1.className = "col-md-12";
				addLoc(div_1, file$7, 14, 0, 498);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				if (if_block) if_block.m(div, null);
				append(div, text);
				if (if_block_1) if_block_1.m(div, null);
				insert(target, text_2, anchor);
				insert(target, div_1, anchor);
				if_blocks[current_block_type_index].m(div_1, null);
				append(div_1, text_3);
				if (if_block_3) if_block_3.m(div_1, null);
				current = true;
			},

			p: function update(changed, ctx) {
				if (ctx.rights.VkGroups.indexOf('create') != -1) {
					if (!if_block) {
						if_block = create_if_block$4(component, ctx);
						if_block.c();
						if_block.m(div, text);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if (ctx.rights.VkGroups.indexOf('update') != -1) {
					if (if_block_1) {
						if_block_1.p(changed, ctx);
					} else {
						if_block_1 = create_if_block_1$4(component, ctx);
						if_block_1.c();
						if_block_1.m(div, null);
					}
				} else if (if_block_1) {
					if_block_1.d(1);
					if_block_1 = null;
				}

				var previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);
				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(changed, ctx);
				} else {
					if_block_2.o(function() {
						if_blocks[previous_block_index].d(1);
						if_blocks[previous_block_index] = null;
					});

					if_block_2 = if_blocks[current_block_type_index];
					if (!if_block_2) {
						if_block_2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](component, ctx);
						if_block_2.c();
					}
					if_block_2.m(div_1, text_3);
				}

				if (ctx.modal && ctx.modal.component) {
					if (if_block_3) {
						if_block_3.p(changed, ctx);
					} else {
						if_block_3 = create_if_block_8$2(component, ctx);
						if (if_block_3) if_block_3.c();
					}

					if_block_3.i(div_1, null);
				} else if (if_block_3) {
					if_block_3.o(function() {
						if_block_3.d(1);
						if_block_3 = null;
					});
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				outrocallback = callAfter(outrocallback, 2);

				if (if_block_2) if_block_2.o(outrocallback);
				else outrocallback();

				if (if_block_3) if_block_3.o(outrocallback);
				else outrocallback();

				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				if (if_block) if_block.d();
				if (if_block_1) if_block_1.d();
				if (detach) {
					detachNode(text_2);
					detachNode(div_1);
				}

				if_blocks[current_block_type_index].d();
				if (if_block_3) if_block_3.d();
			}
		};
	}

	// (2:4) {#if rights.VkGroups.indexOf('create') != -1}
	function create_if_block$4(component, ctx) {
		var button, text;

		function click_handler(event) {
			component.set({ modal: { name: 'Новая ВК-группа', component: 'VkGroupsForm' } });
		}

		return {
			c: function create() {
				button = createElement("button");
				text = createText("Новая группа");
				addListener(button, "click", click_handler);
				button.type = "button";
				button.className = "btn btn-success";
				addLoc(button, file$7, 2, 4, 104);
			},

			m: function mount(target, anchor) {
				insert(target, button, anchor);
				append(button, text);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(button);
				}

				removeListener(button, "click", click_handler);
			}
		};
	}

	// (8:4) {#if rights.VkGroups.indexOf('update') != -1}
	function create_if_block_1$4(component, ctx) {
		var button, text, button_disabled_value;

		function click_handler(event) {
			component.updateStatistic();
		}

		return {
			c: function create() {
				button = createElement("button");
				text = createText("Обновить статистику");
				addListener(button, "click", click_handler);
				button.className = "btn btn-info";
				button.disabled = button_disabled_value = ctx.vkGroups.length == 0;
				addLoc(button, file$7, 8, 4, 339);
			},

			m: function mount(target, anchor) {
				insert(target, button, anchor);
				append(button, text);
			},

			p: function update(changed, ctx) {
				if ((changed.vkGroups) && button_disabled_value !== (button_disabled_value = ctx.vkGroups.length == 0)) {
					button.disabled = button_disabled_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(button);
				}

				removeListener(button, "click", click_handler);
			}
		};
	}

	// (17:8) {#if loader.isProgress}
	function create_if_block_3$4(component, ctx) {
		var div, div_1, div_1_aria_valuenow_value, div_1_aria_valuemax_value;

		return {
			c: function create() {
				div = createElement("div");
				div_1 = createElement("div");
				div_1.className = "progress-bar progress-bar-striped";
				setAttribute(div_1, "role", "progressbar");
				setStyle(div_1, "width", "" + (ctx.loader.value / ctx.loader.max) * 100 + "%");
				setAttribute(div_1, "aria-valuenow", div_1_aria_valuenow_value = ctx.loader.value);
				setAttribute(div_1, "aria-valuemin", "0");
				setAttribute(div_1, "aria-valuemax", div_1_aria_valuemax_value = ctx.loader.max);
				addLoc(div_1, file$7, 18, 12, 628);
				div.className = "progress";
				addLoc(div, file$7, 17, 8, 592);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, div_1);
			},

			p: function update(changed, ctx) {
				if (changed.loader) {
					setStyle(div_1, "width", "" + (ctx.loader.value / ctx.loader.max) * 100 + "%");
				}

				if ((changed.loader) && div_1_aria_valuenow_value !== (div_1_aria_valuenow_value = ctx.loader.value)) {
					setAttribute(div_1, "aria-valuenow", div_1_aria_valuenow_value);
				}

				if ((changed.loader) && div_1_aria_valuemax_value !== (div_1_aria_valuemax_value = ctx.loader.max)) {
					setAttribute(div_1, "aria-valuemax", div_1_aria_valuemax_value);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}
			}
		};
	}

	// (32:12) {#if rights.Orders.indexOf('create') != -1}
	function create_if_block_5$2(component, ctx) {
		var button, text;

		function click_handler(event) {
			component.set({ modal: { name: 'Новый заказ', component: 'OrderForm' } });
		}

		return {
			c: function create() {
				button = createElement("button");
				text = createText("Оформить заказ");
				addListener(button, "click", click_handler);
				button.type = "button";
				button.className = "btn btn-outline-success pulse";
				setStyle(button, "margin", "5px");
				addLoc(button, file$7, 32, 12, 1260);
			},

			m: function mount(target, anchor) {
				insert(target, button, anchor);
				append(button, text);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(button);
				}

				removeListener(button, "click", click_handler);
			}
		};
	}

	// (41:12) {#if rights.Packages.indexOf('create') != -1}
	function create_if_block_6$2(component, ctx) {
		var button, text;

		function click_handler(event) {
			component.set({ modal: { name: 'Новый пакет', component: 'PackagesForm' } });
		}

		return {
			c: function create() {
				button = createElement("button");
				text = createText("Создать пакет из выделенных групп");
				addListener(button, "click", click_handler);
				button.type = "button";
				button.className = "btn btn-outline-primary";
				setStyle(button, "margin", "5px");
				addLoc(button, file$7, 41, 12, 1631);
			},

			m: function mount(target, anchor) {
				insert(target, button, anchor);
				append(button, text);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(button);
				}

				removeListener(button, "click", click_handler);
			}
		};
	}

	// (31:8) {#if checked.length}
	function create_if_block_4$3(component, ctx) {
		var text, if_block_1_anchor;

		var if_block = (ctx.rights.Orders.indexOf('create') != -1) && create_if_block_5$2(component, ctx);

		var if_block_1 = (ctx.rights.Packages.indexOf('create') != -1) && create_if_block_6$2(component, ctx);

		return {
			c: function create() {
				if (if_block) if_block.c();
				text = createText("\r\n            \r\n            ");
				if (if_block_1) if_block_1.c();
				if_block_1_anchor = createComment();
			},

			m: function mount(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert(target, text, anchor);
				if (if_block_1) if_block_1.m(target, anchor);
				insert(target, if_block_1_anchor, anchor);
			},

			p: function update(changed, ctx) {
				if (ctx.rights.Orders.indexOf('create') != -1) {
					if (!if_block) {
						if_block = create_if_block_5$2(component, ctx);
						if_block.c();
						if_block.m(text.parentNode, text);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if (ctx.rights.Packages.indexOf('create') != -1) {
					if (!if_block_1) {
						if_block_1 = create_if_block_6$2(component, ctx);
						if_block_1.c();
						if_block_1.m(if_block_1_anchor.parentNode, if_block_1_anchor);
					}
				} else if (if_block_1) {
					if_block_1.d(1);
					if_block_1 = null;
				}
			},

			d: function destroy$$1(detach) {
				if (if_block) if_block.d(detach);
				if (detach) {
					detachNode(text);
				}

				if (if_block_1) if_block_1.d(detach);
				if (detach) {
					detachNode(if_block_1_anchor);
				}
			}
		};
	}

	// (16:4) {#if vkGroups.length}
	function create_if_block_2$4(component, ctx) {
		var text, text_1, if_block_1_anchor, current;

		var if_block = (ctx.loader.isProgress) && create_if_block_3$4(component, ctx);

		var table_initial_data = {
		 	columns: ctx.table.columns,
		 	items: ctx.VkGroups,
		 	actions: ctx.table.actions,
		 	store: ctx.table.store,
		 	rights: ctx.rights.VkGroups,
		 	defaultFilter: ctx.table.defaultFilter,
		 	withCheckbox: "true"
		 };
		var table = new Table({
			root: component.root,
			store: component.store,
			data: table_initial_data
		});

		var if_block_1 = (ctx.checked.length) && create_if_block_4$3(component, ctx);

		return {
			c: function create() {
				if (if_block) if_block.c();
				text = createText("\r\n        ");
				table._fragment.c();
				text_1 = createText(" \r\n        ");
				if (if_block_1) if_block_1.c();
				if_block_1_anchor = createComment();
			},

			m: function mount(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert(target, text, anchor);
				table._mount(target, anchor);
				insert(target, text_1, anchor);
				if (if_block_1) if_block_1.m(target, anchor);
				insert(target, if_block_1_anchor, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				if (ctx.loader.isProgress) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block_3$4(component, ctx);
						if_block.c();
						if_block.m(text.parentNode, text);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				var table_changes = {};
				if (changed.table) table_changes.columns = ctx.table.columns;
				if (changed.VkGroups) table_changes.items = ctx.VkGroups;
				if (changed.table) table_changes.actions = ctx.table.actions;
				if (changed.table) table_changes.store = ctx.table.store;
				if (changed.rights) table_changes.rights = ctx.rights.VkGroups;
				if (changed.table) table_changes.defaultFilter = ctx.table.defaultFilter;
				table._set(table_changes);

				if (ctx.checked.length) {
					if (if_block_1) {
						if_block_1.p(changed, ctx);
					} else {
						if_block_1 = create_if_block_4$3(component, ctx);
						if_block_1.c();
						if_block_1.m(if_block_1_anchor.parentNode, if_block_1_anchor);
					}
				} else if (if_block_1) {
					if_block_1.d(1);
					if_block_1 = null;
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (table) table._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				if (if_block) if_block.d(detach);
				if (detach) {
					detachNode(text);
				}

				table.destroy(detach);
				if (detach) {
					detachNode(text_1);
				}

				if (if_block_1) if_block_1.d(detach);
				if (detach) {
					detachNode(if_block_1_anchor);
				}
			}
		};
	}

	// (50:4) {:else}
	function create_if_block_7$2(component, ctx) {
		var h2, text, current;

		return {
			c: function create() {
				h2 = createElement("h2");
				text = createText("--ПУСТО--");
				h2.className = "text-center";
				addLoc(h2, file$7, 50, 8, 1969);
			},

			m: function mount(target, anchor) {
				insert(target, h2, anchor);
				append(h2, text);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(h2);
				}
			}
		};
	}

	// (54:4) {#if modal && modal.component}
	function create_if_block_8$2(component, ctx) {
		var current;

		var modal_initial_data = {
		 	title: ctx.modal.name,
		 	component: ctx.modal.component,
		 	formStore: ctx.formStore
		 };
		var modal = new Modal({
			root: component.root,
			store: component.store,
			data: modal_initial_data
		});

		return {
			c: function create() {
				modal._fragment.c();
			},

			m: function mount(target, anchor) {
				modal._mount(target, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				var modal_changes = {};
				if (changed.modal) modal_changes.title = ctx.modal.name;
				if (changed.modal) modal_changes.component = ctx.modal.component;
				if (changed.formStore) modal_changes.formStore = ctx.formStore;
				modal._set(modal_changes);
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (modal) modal._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				modal.destroy(detach);
			}
		};
	}

	function VkGroups_1(options) {
		this._debugName = '<VkGroups_1>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$6(), options.data);
		this._recompute({ vkGroups: 1 }, this._state);
		if (!('vkGroups' in this._state)) console.warn("<VkGroups_1> was created without expected data property 'vkGroups'");
		if (!('rights' in this._state)) console.warn("<VkGroups_1> was created without expected data property 'rights'");
		if (!('loader' in this._state)) console.warn("<VkGroups_1> was created without expected data property 'loader'");
		if (!('table' in this._state)) console.warn("<VkGroups_1> was created without expected data property 'table'");

		if (!('checked' in this._state)) console.warn("<VkGroups_1> was created without expected data property 'checked'");
		if (!('modal' in this._state)) console.warn("<VkGroups_1> was created without expected data property 'modal'");
		if (!('formStore' in this._state)) console.warn("<VkGroups_1> was created without expected data property 'formStore'");
		this._intro = !!options.intro;

		this._handlers.state = [onstate$5];

		onstate$5.call(this, { changed: assignTrue({}, this._state), current: this._state });

		this._fragment = create_main_fragment$7(this, this._state);

		this.root._oncreate.push(() => {
			oncreate$5.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(VkGroups_1.prototype, protoDev);
	assign(VkGroups_1.prototype, methods$7);

	VkGroups_1.prototype._checkReadOnly = function _checkReadOnly(newState) {
		if ('VkGroups' in newState && !this._updatingReadonlyProperty) throw new Error("<VkGroups_1>: Cannot set read-only property 'VkGroups'");
	};

	VkGroups_1.prototype._recompute = function _recompute(changed, state) {
		if (changed.vkGroups) {
			if (this._differs(state.VkGroups, (state.VkGroups = VkGroups$1(state)))) changed.VkGroups = true;
		}
	};

	/* src\components\packages.html generated by Svelte v2.13.5 */

	const tableStore$1 = new Store();
	const formStore$1 = new Store();

	function data$7() {
	    return {
	        packages: [],
	        table: {
	            columns: [{
	                name: 'Наименование',
	                value: 'name',
	                width: 170
	            }, {
	                name: 'Цена',
	                value: 'price'
	            }, {
	                name: 'Группы в пакете',
	                value: 'groups',
	                width: 250,
	                each: {
	                    prop: 'name',
	                    location: {
	                        href: 'https://vk.com/public',
	                        itemValueColumnId: 'vk_group_id'
	                    }
	                }
	            }, {
	                name: 'Аудитория',
	                value: 'groups',
	                sum: 'members'
	            }, {
	                name: 'Охват поста',
	                value: 'groups',
	                sum: 'views'
	            }, {
	                name: 'Лайков',
	                value: 'groups',
	                sum: 'likes'
	            }, {
	                name: 'Репостов',
	                value: 'groups',
	                sum: 'reposts'
	            }],
	            actions: [{
	                name: 'удалить',
	                value: 'delete',
	                colorText: 'danger-text'
	            }],
	            store: tableStore$1
	        },
	        formStore: formStore$1
	    };
	}
	var methods$8 = {
	    update() {
	        phalconApi.packages.all().then(packages => {
	            this.set({ packages });
	        });
	    }
	};

	function oncreate$6(){
	    console.log(this.options.root);
	    this.update();
	}
	const file$8 = "src\\components\\packages.html";

	function create_main_fragment$8(component, ctx) {
		var div, text_1, div_1, current_block_type_index, if_block_1, text_2, current;

		var if_block = (ctx.rights.Packages.indexOf('create') != -1) && create_if_block$5(component, ctx);

		var if_block_creators = [
			create_if_block_1$5,
			create_if_block_2$5
		];

		var if_blocks = [];

		function select_block_type(ctx) {
			if (ctx.packages.length > 0) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block_1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](component, ctx);

		var if_block_2 = (ctx.showModal) && create_if_block_3$5(component, ctx);

		return {
			c: function create() {
				div = createElement("div");
				if (if_block) if_block.c();
				text_1 = createText("\r\n\r\n");
				div_1 = createElement("div");
				if_block_1.c();
				text_2 = createText("\r\n\r\n    ");
				if (if_block_2) if_block_2.c();
				div.className = "col-md-6";
				setStyle(div, "padding-top", "3px");
				addLoc(div, file$8, 0, 0, 0);
				div_1.className = "col-md-12";
				addLoc(div_1, file$8, 8, 0, 286);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				if (if_block) if_block.m(div, null);
				insert(target, text_1, anchor);
				insert(target, div_1, anchor);
				if_blocks[current_block_type_index].m(div_1, null);
				append(div_1, text_2);
				if (if_block_2) if_block_2.m(div_1, null);
				current = true;
			},

			p: function update(changed, ctx) {
				if (ctx.rights.Packages.indexOf('create') != -1) {
					if (!if_block) {
						if_block = create_if_block$5(component, ctx);
						if_block.c();
						if_block.m(div, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				var previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);
				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(changed, ctx);
				} else {
					if_block_1.o(function() {
						if_blocks[previous_block_index].d(1);
						if_blocks[previous_block_index] = null;
					});

					if_block_1 = if_blocks[current_block_type_index];
					if (!if_block_1) {
						if_block_1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](component, ctx);
						if_block_1.c();
					}
					if_block_1.m(div_1, text_2);
				}

				if (ctx.showModal) {
					if (if_block_2) {
						if_block_2.p(changed, ctx);
					} else {
						if_block_2 = create_if_block_3$5(component, ctx);
						if (if_block_2) if_block_2.c();
					}

					if_block_2.i(div_1, null);
				} else if (if_block_2) {
					if_block_2.o(function() {
						if_block_2.d(1);
						if_block_2 = null;
					});
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				outrocallback = callAfter(outrocallback, 2);

				if (if_block_1) if_block_1.o(outrocallback);
				else outrocallback();

				if (if_block_2) if_block_2.o(outrocallback);
				else outrocallback();

				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				if (if_block) if_block.d();
				if (detach) {
					detachNode(text_1);
					detachNode(div_1);
				}

				if_blocks[current_block_type_index].d();
				if (if_block_2) if_block_2.d();
			}
		};
	}

	// (2:4) {#if rights.Packages.indexOf('create') != -1}
	function create_if_block$5(component, ctx) {
		var button, text;

		function click_handler(event) {
			component.set({ showModal: true });
		}

		return {
			c: function create() {
				button = createElement("button");
				text = createText("Новый пакет");
				addListener(button, "click", click_handler);
				button.type = "button";
				button.className = "btn btn-success";
				button.dataset.toggle = "modal";
				button.dataset.target = "#modal";
				addLoc(button, file$8, 2, 4, 104);
			},

			m: function mount(target, anchor) {
				insert(target, button, anchor);
				append(button, text);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(button);
				}

				removeListener(button, "click", click_handler);
			}
		};
	}

	// (10:4) {#if packages.length > 0}
	function create_if_block_1$5(component, ctx) {
		var current;

		var table_initial_data = {
		 	columns: ctx.table.columns,
		 	items: ctx.packages,
		 	actions: ctx.table.actions,
		 	store: ctx.table.store,
		 	rights: ctx.rights.Packages,
		 	withCheckbox: "true"
		 };
		var table = new Table({
			root: component.root,
			store: component.store,
			data: table_initial_data
		});

		return {
			c: function create() {
				table._fragment.c();
			},

			m: function mount(target, anchor) {
				table._mount(target, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				var table_changes = {};
				if (changed.table) table_changes.columns = ctx.table.columns;
				if (changed.packages) table_changes.items = ctx.packages;
				if (changed.table) table_changes.actions = ctx.table.actions;
				if (changed.table) table_changes.store = ctx.table.store;
				if (changed.rights) table_changes.rights = ctx.rights.Packages;
				table._set(table_changes);
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (table) table._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				table.destroy(detach);
			}
		};
	}

	// (18:4) {:else}
	function create_if_block_2$5(component, ctx) {
		var h2, text, current;

		return {
			c: function create() {
				h2 = createElement("h2");
				text = createText("--ПУСТО--");
				h2.className = "text-center";
				addLoc(h2, file$8, 18, 4, 562);
			},

			m: function mount(target, anchor) {
				insert(target, h2, anchor);
				append(h2, text);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(h2);
				}
			}
		};
	}

	// (22:4) {#if showModal}
	function create_if_block_3$5(component, ctx) {
		var current;

		var modal_initial_data = {
		 	title: "Новый пакет",
		 	component: "PackagesForm",
		 	formStore: ctx.formStore
		 };
		var modal = new Modal({
			root: component.root,
			store: component.store,
			data: modal_initial_data
		});

		return {
			c: function create() {
				modal._fragment.c();
			},

			m: function mount(target, anchor) {
				modal._mount(target, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				var modal_changes = {};
				if (changed.formStore) modal_changes.formStore = ctx.formStore;
				modal._set(modal_changes);
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (modal) modal._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				modal.destroy(detach);
			}
		};
	}

	function Packages$1(options) {
		this._debugName = '<Packages>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$7(), options.data);
		if (!('rights' in this._state)) console.warn("<Packages> was created without expected data property 'rights'");
		if (!('packages' in this._state)) console.warn("<Packages> was created without expected data property 'packages'");
		if (!('table' in this._state)) console.warn("<Packages> was created without expected data property 'table'");
		if (!('showModal' in this._state)) console.warn("<Packages> was created without expected data property 'showModal'");
		if (!('formStore' in this._state)) console.warn("<Packages> was created without expected data property 'formStore'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$8(this, this._state);

		this.root._oncreate.push(() => {
			oncreate$6.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Packages$1.prototype, protoDev);
	assign(Packages$1.prototype, methods$8);

	Packages$1.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src\components\users.html generated by Svelte v2.13.5 */

	const tableStore$2 = new Store();
	const formStore$2 = new Store();

	function data$8() {
	    return {
	        users: [],
	        table: {
	            columns: [{
	                name: 'Имя',
	                value: 'name'
	            }, {
	                name: 'email',
	                value: 'email'
	            }, {
	                name: 'Роль',
	                value: 'role_name'
	            }],
	            actions: [{
	                name: 'редактировать',
	                value: 'edit'
	            }],
	            hiddenTfoot: true,
	            store: tableStore$2
	        },
	        formStore: formStore$2
	    };
	}
	var methods$9 = {
	    update() {
	        phalconApi.users.all().then(users => {
	            this.set({ users });
	        });
	    }
	};

	function oncreate$7() {
	   this.update();

	    formStore$2.on('state', ({ changed, current }) => {
	        if (changed.isLoad) {
	            this.update();
	            formStore$2.set({ isLoad: false });
	        }

	        if(changed.isClose){
	            this.set({ modal: null });
	            formStore$2.set({ isClose: false });
	        }
	    });
	}
	const file$9 = "src\\components\\users.html";

	function create_main_fragment$9(component, ctx) {
		var div, text_1, div_1, current_block_type_index, if_block_1, text_2, current;

		var if_block = (ctx.rights.Users.indexOf('create') != -1) && create_if_block$6(component, ctx);

		var if_block_creators = [
			create_if_block_1$6,
			create_if_block_2$6
		];

		var if_blocks = [];

		function select_block_type(ctx) {
			if (ctx.users.length) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block_1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](component, ctx);

		var if_block_2 = (ctx.modal && ctx.modal.component) && create_if_block_3$6(component, ctx);

		return {
			c: function create() {
				div = createElement("div");
				if (if_block) if_block.c();
				text_1 = createText("\r\n\r\n");
				div_1 = createElement("div");
				if_block_1.c();
				text_2 = createText("\r\n\r\n    ");
				if (if_block_2) if_block_2.c();
				div.className = "col-md-6";
				setStyle(div, "padding-top", "3px");
				addLoc(div, file$9, 0, 0, 0);
				div_1.className = "col-md-12";
				addLoc(div_1, file$9, 8, 0, 295);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				if (if_block) if_block.m(div, null);
				insert(target, text_1, anchor);
				insert(target, div_1, anchor);
				if_blocks[current_block_type_index].m(div_1, null);
				append(div_1, text_2);
				if (if_block_2) if_block_2.m(div_1, null);
				current = true;
			},

			p: function update(changed, ctx) {
				if (ctx.rights.Users.indexOf('create') != -1) {
					if (!if_block) {
						if_block = create_if_block$6(component, ctx);
						if_block.c();
						if_block.m(div, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				var previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);
				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(changed, ctx);
				} else {
					if_block_1.o(function() {
						if_blocks[previous_block_index].d(1);
						if_blocks[previous_block_index] = null;
					});

					if_block_1 = if_blocks[current_block_type_index];
					if (!if_block_1) {
						if_block_1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](component, ctx);
						if_block_1.c();
					}
					if_block_1.m(div_1, text_2);
				}

				if (ctx.modal && ctx.modal.component) {
					if (if_block_2) {
						if_block_2.p(changed, ctx);
					} else {
						if_block_2 = create_if_block_3$6(component, ctx);
						if (if_block_2) if_block_2.c();
					}

					if_block_2.i(div_1, null);
				} else if (if_block_2) {
					if_block_2.o(function() {
						if_block_2.d(1);
						if_block_2 = null;
					});
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				outrocallback = callAfter(outrocallback, 2);

				if (if_block_1) if_block_1.o(outrocallback);
				else outrocallback();

				if (if_block_2) if_block_2.o(outrocallback);
				else outrocallback();

				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				if (if_block) if_block.d();
				if (detach) {
					detachNode(text_1);
					detachNode(div_1);
				}

				if_blocks[current_block_type_index].d();
				if (if_block_2) if_block_2.d();
			}
		};
	}

	// (2:4) {#if rights.Users.indexOf('create') != -1}
	function create_if_block$6(component, ctx) {
		var button, text;

		function click_handler(event) {
			component.set({ modal: { name: 'Новый пользователь', component: 'UsersForm' } });
		}

		return {
			c: function create() {
				button = createElement("button");
				text = createText("Новый пользователь");
				addListener(button, "click", click_handler);
				button.type = "button";
				button.className = "btn btn-success";
				addLoc(button, file$9, 2, 4, 101);
			},

			m: function mount(target, anchor) {
				insert(target, button, anchor);
				append(button, text);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(button);
				}

				removeListener(button, "click", click_handler);
			}
		};
	}

	// (10:4) {#if users.length}
	function create_if_block_1$6(component, ctx) {
		var current;

		var table_initial_data = {
		 	columns: ctx.table.columns,
		 	items: ctx.users,
		 	actions: ctx.table.actions,
		 	store: ctx.table.store,
		 	rights: ctx.rights.Users,
		 	hiddenTfoot: ctx.table.hiddenTfoot
		 };
		var table = new Table({
			root: component.root,
			store: component.store,
			data: table_initial_data
		});

		return {
			c: function create() {
				table._fragment.c();
			},

			m: function mount(target, anchor) {
				table._mount(target, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				var table_changes = {};
				if (changed.table) table_changes.columns = ctx.table.columns;
				if (changed.users) table_changes.items = ctx.users;
				if (changed.table) table_changes.actions = ctx.table.actions;
				if (changed.table) table_changes.store = ctx.table.store;
				if (changed.rights) table_changes.rights = ctx.rights.Users;
				if (changed.table) table_changes.hiddenTfoot = ctx.table.hiddenTfoot;
				table._set(table_changes);
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (table) table._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				table.destroy(detach);
			}
		};
	}

	// (12:4) {:else}
	function create_if_block_2$6(component, ctx) {
		var h2, text, current;

		return {
			c: function create() {
				h2 = createElement("h2");
				text = createText("--ПУСТО--");
				h2.className = "text-center";
				addLoc(h2, file$9, 12, 4, 512);
			},

			m: function mount(target, anchor) {
				insert(target, h2, anchor);
				append(h2, text);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(h2);
				}
			}
		};
	}

	// (16:4) {#if modal && modal.component}
	function create_if_block_3$6(component, ctx) {
		var current;

		var modal_initial_data = {
		 	title: ctx.modal.name,
		 	component: ctx.modal.component,
		 	formStore: ctx.formStore
		 };
		var modal = new Modal({
			root: component.root,
			store: component.store,
			data: modal_initial_data
		});

		return {
			c: function create() {
				modal._fragment.c();
			},

			m: function mount(target, anchor) {
				modal._mount(target, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				var modal_changes = {};
				if (changed.modal) modal_changes.title = ctx.modal.name;
				if (changed.modal) modal_changes.component = ctx.modal.component;
				if (changed.formStore) modal_changes.formStore = ctx.formStore;
				modal._set(modal_changes);
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (modal) modal._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				modal.destroy(detach);
			}
		};
	}

	function Users$1(options) {
		this._debugName = '<Users>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$8(), options.data);
		if (!('rights' in this._state)) console.warn("<Users> was created without expected data property 'rights'");
		if (!('users' in this._state)) console.warn("<Users> was created without expected data property 'users'");
		if (!('table' in this._state)) console.warn("<Users> was created without expected data property 'table'");
		if (!('modal' in this._state)) console.warn("<Users> was created without expected data property 'modal'");
		if (!('formStore' in this._state)) console.warn("<Users> was created without expected data property 'formStore'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$9(this, this._state);

		this.root._oncreate.push(() => {
			oncreate$7.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Users$1.prototype, protoDev);
	assign(Users$1.prototype, methods$9);

	Users$1.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src\components\orders.html generated by Svelte v2.13.5 */

	const tableStore$3 = new Store();
	const formStore$3 = new Store();

	function data$9() {
	    return {
	        orders: [],
	        table: {
	            columns: [{
	                name: '№',
	                value: 'id',
	                width: 70
	            }, {
	                name: 'Заказчик',
	                value: 'user',
	                prop: 'name'
	            }, {
	                name: 'Email',
	                value: 'user',
	                prop: 'email'
	            }, {
	                name: 'Телефон',
	                value: 'phone'
	            }, {
	                name: 'Группы',
	                value: 'groups',
	                width: 250,
	                each: {
	                    prop: 'name',
	                    location: {
	                        href: 'https://vk.com/public',
	                        itemValueColumnId: 'vk_group_id'
	                    }
	                }
	            }, {
	                name: 'Пакеты',
	                value: 'packages',
	                each: {
	                    prop: 'name'
	                }
	            }, {
	                name: 'Статус',
	                value: 'status',
	                prop: 'name'
	            }],
	            hiddenTfoot: true,
	            actions: [{
	                name: 'редактировать',
	                value: 'edit',
	                colorText: 'text-primary'
	            }],
	            defaultFilter: {
	                name: '№',
	                value: 'id',
	                width: 70,
	                asc: true
	            },
	            store: tableStore$3
	        },
	        formStore: formStore$3
	    };
	}
	var methods$a = {
	    update() {
	        var { rights } = this.options.root.get();

	        if(rights.Orders.indexOf('all') != -1){
	            phalconApi.orders.all().then(orders => {
	                this.set({ orders });
	            });
	        } else {
	            phalconApi.orders.get().then(orders => {
	                this.set({ orders });
	            });
	        }
	    }
	};

	function oncreate$8(){
	    this.update();

	    tableStore$3.on('state', ({ changed, current }) => {
	        if (changed.trigger) {
	            var targetId = current.trigger.object.id;

	            if (current.trigger.type == 'edit') {
	                formStore$3.set({ current: current.trigger.object });
	                this.set({ modal: { name: 'Редактирование заказа №'+targetId, component: 'OrderForm' } });
	            }
	        }
	    });

	    formStore$3.on('state', ({ changed, current }) => {
	        if (changed.isLoad) {
	            this.update();
	            formStore$3.set({ isLoad: false });
	        }

	        if(changed.isClose){
	            this.set({ modal: null });
	            formStore$3.set({ isClose: false });
	        }
	    });
	}
	const file$a = "src\\components\\orders.html";

	function create_main_fragment$a(component, ctx) {
		var div, text_1, div_1, current_block_type_index, if_block_1, text_2, current;

		var if_block = (ctx.rights.Orders.indexOf('create') != -1) && create_if_block$7(component, ctx);

		var if_block_creators = [
			create_if_block_1$7,
			create_if_block_2$7
		];

		var if_blocks = [];

		function select_block_type(ctx) {
			if (ctx.orders.length > 0) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block_1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](component, ctx);

		var if_block_2 = (ctx.modal && ctx.modal.component) && create_if_block_3$7(component, ctx);

		return {
			c: function create() {
				div = createElement("div");
				if (if_block) if_block.c();
				text_1 = createText("\r\n\r\n");
				div_1 = createElement("div");
				if_block_1.c();
				text_2 = createText("\r\n\r\n    ");
				if (if_block_2) if_block_2.c();
				div.className = "col-md-6";
				setStyle(div, "padding-top", "3px");
				addLoc(div, file$a, 0, 0, 0);
				div_1.className = "col-md-12";
				addLoc(div_1, file$a, 8, 0, 285);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				if (if_block) if_block.m(div, null);
				insert(target, text_1, anchor);
				insert(target, div_1, anchor);
				if_blocks[current_block_type_index].m(div_1, null);
				append(div_1, text_2);
				if (if_block_2) if_block_2.m(div_1, null);
				current = true;
			},

			p: function update(changed, ctx) {
				if (ctx.rights.Orders.indexOf('create') != -1) {
					if (!if_block) {
						if_block = create_if_block$7(component, ctx);
						if_block.c();
						if_block.m(div, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				var previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);
				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(changed, ctx);
				} else {
					if_block_1.o(function() {
						if_blocks[previous_block_index].d(1);
						if_blocks[previous_block_index] = null;
					});

					if_block_1 = if_blocks[current_block_type_index];
					if (!if_block_1) {
						if_block_1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](component, ctx);
						if_block_1.c();
					}
					if_block_1.m(div_1, text_2);
				}

				if (ctx.modal && ctx.modal.component) {
					if (if_block_2) {
						if_block_2.p(changed, ctx);
					} else {
						if_block_2 = create_if_block_3$7(component, ctx);
						if (if_block_2) if_block_2.c();
					}

					if_block_2.i(div_1, null);
				} else if (if_block_2) {
					if_block_2.o(function() {
						if_block_2.d(1);
						if_block_2 = null;
					});
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				outrocallback = callAfter(outrocallback, 2);

				if (if_block_1) if_block_1.o(outrocallback);
				else outrocallback();

				if (if_block_2) if_block_2.o(outrocallback);
				else outrocallback();

				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				if (if_block) if_block.d();
				if (detach) {
					detachNode(text_1);
					detachNode(div_1);
				}

				if_blocks[current_block_type_index].d();
				if (if_block_2) if_block_2.d();
			}
		};
	}

	// (2:4) {#if rights.Orders.indexOf('create') != -1}
	function create_if_block$7(component, ctx) {
		var button, text;

		function click_handler(event) {
			component.set({ modal: { name: 'Новый заказ', component: 'OrderForm' } });
		}

		return {
			c: function create() {
				button = createElement("button");
				text = createText("Оформить заказ");
				addListener(button, "click", click_handler);
				button.type = "button";
				button.className = "btn btn-success";
				addLoc(button, file$a, 2, 4, 102);
			},

			m: function mount(target, anchor) {
				insert(target, button, anchor);
				append(button, text);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(button);
				}

				removeListener(button, "click", click_handler);
			}
		};
	}

	// (10:4) {#if orders.length > 0}
	function create_if_block_1$7(component, ctx) {
		var current;

		var table_initial_data = {
		 	columns: ctx.table.columns,
		 	items: ctx.orders,
		 	actions: ctx.table.actions,
		 	store: ctx.table.store,
		 	rights: ctx.rights.Orders,
		 	defaultFilter: ctx.table.defaultFilter,
		 	hiddenTfoot: ctx.table.hiddenTfoot
		 };
		var table = new Table({
			root: component.root,
			store: component.store,
			data: table_initial_data
		});

		return {
			c: function create() {
				table._fragment.c();
			},

			m: function mount(target, anchor) {
				table._mount(target, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				var table_changes = {};
				if (changed.table) table_changes.columns = ctx.table.columns;
				if (changed.orders) table_changes.items = ctx.orders;
				if (changed.table) table_changes.actions = ctx.table.actions;
				if (changed.table) table_changes.store = ctx.table.store;
				if (changed.rights) table_changes.rights = ctx.rights.Orders;
				if (changed.table) table_changes.defaultFilter = ctx.table.defaultFilter;
				if (changed.table) table_changes.hiddenTfoot = ctx.table.hiddenTfoot;
				table._set(table_changes);
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (table) table._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				table.destroy(detach);
			}
		};
	}

	// (19:4) {:else}
	function create_if_block_2$7(component, ctx) {
		var h2, text, current;

		return {
			c: function create() {
				h2 = createElement("h2");
				text = createText("--ПУСТО--");
				h2.className = "text-center";
				addLoc(h2, file$a, 19, 4, 614);
			},

			m: function mount(target, anchor) {
				insert(target, h2, anchor);
				append(h2, text);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(h2);
				}
			}
		};
	}

	// (23:4) {#if modal && modal.component}
	function create_if_block_3$7(component, ctx) {
		var current;

		var modal_initial_data = {
		 	title: ctx.modal.name,
		 	component: ctx.modal.component,
		 	formStore: ctx.formStore
		 };
		var modal = new Modal({
			root: component.root,
			store: component.store,
			data: modal_initial_data
		});

		return {
			c: function create() {
				modal._fragment.c();
			},

			m: function mount(target, anchor) {
				modal._mount(target, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				var modal_changes = {};
				if (changed.modal) modal_changes.title = ctx.modal.name;
				if (changed.modal) modal_changes.component = ctx.modal.component;
				if (changed.formStore) modal_changes.formStore = ctx.formStore;
				modal._set(modal_changes);
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (modal) modal._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				modal.destroy(detach);
			}
		};
	}

	function Orders$1(options) {
		this._debugName = '<Orders>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$9(), options.data);
		if (!('rights' in this._state)) console.warn("<Orders> was created without expected data property 'rights'");
		if (!('orders' in this._state)) console.warn("<Orders> was created without expected data property 'orders'");
		if (!('table' in this._state)) console.warn("<Orders> was created without expected data property 'table'");
		if (!('modal' in this._state)) console.warn("<Orders> was created without expected data property 'modal'");
		if (!('formStore' in this._state)) console.warn("<Orders> was created without expected data property 'formStore'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$a(this, this._state);

		this.root._oncreate.push(() => {
			oncreate$8.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Orders$1.prototype, protoDev);
	assign(Orders$1.prototype, methods$a);

	Orders$1.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src\App.html generated by Svelte v2.13.5 */

	const formStore$4 = new Store({
	        app: null
	});

	function Navigations({ links, rights }) {
		if(Object.keys(rights).length){
			function modifyPathName(path){
				var componentName;

				if(path.split('-').length > 1){
					componentName = '';
					path.split('-').forEach(function(namePart){
						componentName += namePart.charAt(0).toUpperCase() + namePart.slice(1);
					});
				} else {
					componentName = path.charAt(0).toUpperCase() + path.slice(1);
				}

				return componentName;
			}

			links = links.map(function(link){
				var componentName;

				if(link.dropdown){
					link.dropdown = link.dropdown.map(function(dropdownLink){
						if(dropdownLink.value != ''){
							var path = dropdownLink.value.split('/').pop();
							
							componentName = modifyPathName(path);
							if(!rights[componentName] || rights[componentName].indexOf('index') == -1) return null;
						}

						return dropdownLink;
					}).filter(dropdownLink => dropdownLink);
				}

				componentName = modifyPathName(link.value);
				if(!rights[componentName] || rights[componentName].indexOf('index') == -1) return null;
				
				return link; 
			}).filter(link => link);
		}

		return links;
	}

	function ComponentLink$1({ componentName, rights }) {
		if (componentName === 'VkGroups' && rights.VkGroups) return VkGroups_1;
		if (componentName === 'Packages' && rights.Packages) return Packages$1;
		if (componentName === 'Users' && rights.Users) return Users$1;
		if (componentName === 'Orders' && rights.Orders) return Orders$1;
	}

	function BreadCrumbs({ path }) {
		var breadcrumbs = path.split('/');
		
		var link = '';
		breadcrumbs = breadcrumbs.map(function(item, index){
			if (index == 0) return false;
			var newItem = {};
			
			link += '/' + item;
			newItem.link = link;
			newItem.last = false; 
			if(item == 'vk-groups') newItem.name = 'ВК-группы';
			if(item == 'packages') newItem.name = 'Пакеты';
			if(item == 'users') newItem.name = 'Пользователи';
			if(item == 'orders') newItem.name = 'Заказы';
			if(index == breadcrumbs.length - 1) newItem.last = true; 

			return newItem;
		}).filter(breadcrumb => breadcrumb);
		
		console.log('breadcrumbs', breadcrumbs);
		if(breadcrumbs[0] && breadcrumbs[0].link == '/') breadcrumbs = null;

		return breadcrumbs;
	}

	function data$a() {
	            return { 
			formStore: formStore$4 
		};
	}
	var methods$b = {
		toast(type, text) {
			this.set({ toast: {type, text} });
			var x = document.getElementById("toast");
			x.classList.add("show");
			setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
		},

		modifyPathName(path) {
			var componentName;

			if(path.split('-').length > 1){
				componentName = '';
				path.split('-').forEach(function(namePart){
					componentName += namePart.charAt(0).toUpperCase() + namePart.slice(1);
				});
			} else {
				componentName = path.charAt(0).toUpperCase() + path.slice(1);
			}

			return componentName;
		},

		clearOrder() {
			var { componentName, newOrder } = this.get();
			newOrder = null; localStorage.setItem('newOrder', newOrder);

			window.location.reload();
		}
	};

	function oncreate$9() {
		formStore$4.on('state', ({ changed, current }) => {
	                if (changed.isLoad) {
	                    formStore$4.set({ isLoad: false });
	                }

	                if(changed.isClose){
	                    this.set({ modal: null });
	                    formStore$4.set({ isClose: false });
	                }
		});
		
		phalconApi.session.get().then(session => {
			const path = window.location.pathname.split('/').pop();
			const componentName = this.modifyPathName(path);
			const rights = JSON.parse(session.rights);
			const rightsReady = true;
			const sessionName = session.name;
			
			this.set({ componentName, rights, rightsReady, sessionName, session });
		});
	}
	const file$b = "src\\App.html";

	function create_main_fragment$b(component, ctx) {
		var nav, a, text, text_1, button, span, text_3, div, ul, text_5, text_8, div_1, div_2, text_9, text_12, div_3, div_4, div_4_class_value, text_14, div_5, text_15_value = ctx.toast.text, text_15, div_5_class_value, div_3_class_value, text_17, text_18, if_block_7_anchor, current;

		var if_block = (ctx.rightsReady) && create_if_block$8(component, ctx);

		var if_block_1 = (ctx.rightsReady) && create_if_block_3$8(component, ctx);

		var if_block_2 = (ctx.BreadCrumbs) && create_if_block_6$3(component, ctx);

		var switch_value = ctx.ComponentLink;

		function switch_props(ctx) {
			var switch_instance_initial_data = { rights: ctx.rights };
			return {
				root: component.root,
				store: component.store,
				data: switch_instance_initial_data
			};
		}

		if (switch_value) {
			var switch_instance = new switch_value(switch_props(ctx));
		}

		function select_block_type_2(ctx) {
			if (ctx.toast.type == 'success') return create_if_block_7$3;
			if (ctx.toast.type == 'warning') return create_if_block_8$3;
			if (ctx.toast.type == 'danger') return create_if_block_9$2;
			return null;
		}

		var current_block_type = select_block_type_2(ctx);
		var if_block_3 = current_block_type && current_block_type(component, ctx);

		var if_block_6 = (ctx.modal && ctx.modal.component) && create_if_block_10$1(component, ctx);

		var if_block_7 = (ctx.newOrder) && create_if_block_11$1(component, ctx);

		return {
			c: function create() {
				nav = createElement("nav");
				a = createElement("a");
				text = createText(ctx.appName);
				text_1 = createText("\n\t");
				button = createElement("button");
				span = createElement("span");
				text_3 = createText("\n\n\t");
				div = createElement("div");
				ul = createElement("ul");
				if (if_block) if_block.c();
				text_5 = createText("\n\t\t");
				if (if_block_1) if_block_1.c();
				text_8 = createText("\n\n");
				div_1 = createElement("div");
				div_2 = createElement("div");
				if (if_block_2) if_block_2.c();
				text_9 = createText("\n\t\t");
				if (switch_instance) switch_instance._fragment.c();
				text_12 = createText("\n\n");
				div_3 = createElement("div");
				div_4 = createElement("div");
				if (if_block_3) if_block_3.c();
				text_14 = createText("\n\t");
				div_5 = createElement("div");
				text_15 = createText(text_15_value);
				text_17 = createText("\n\n");
				if (if_block_6) if_block_6.c();
				text_18 = createText("\n\n");
				if (if_block_7) if_block_7.c();
				if_block_7_anchor = createComment();
				a.className = "navbar-brand";
				a.href = "/";
				addLoc(a, file$b, 1, 1, 62);
				span.className = "navbar-toggler-icon";
				addLoc(span, file$b, 4, 2, 313);
				button.className = "navbar-toggler";
				button.type = "button";
				button.dataset.toggle = "collapse";
				button.dataset.target = "#navbarSupportedContent";
				setAttribute(button, "aria-controls", "navbarSupportedContent");
				setAttribute(button, "aria-expanded", "false");
				setAttribute(button, "aria-label", "Toggle navigation");
				addLoc(button, file$b, 2, 1, 110);
				ul.className = "navbar-nav mr-auto";
				addLoc(ul, file$b, 8, 2, 437);
				div.className = "collapse navbar-collapse";
				div.id = "navbarSupportedContent";
				addLoc(div, file$b, 7, 1, 368);
				nav.className = "navbar navbar-expand-lg navbar-dark bg-primary svelte-13e2uxn";
				addLoc(nav, file$b, 0, 0, 0);
				div_2.className = "row";
				addLoc(div_2, file$b, 45, 1, 1703);
				div_1.className = "container";
				addLoc(div_1, file$b, 44, 0, 1678);
				div_4.id = "img";
				div_4.className = div_4_class_value = ctx.toast.type;
				addLoc(div_4, file$b, 63, 1, 2236);
				div_5.id = "desc";
				div_5.className = div_5_class_value = ctx.toast.type;
				addLoc(div_5, file$b, 72, 1, 2507);
				div_3.id = "toast";
				div_3.className = div_3_class_value = ctx.toast.type;
				addLoc(div_3, file$b, 62, 0, 2197);
			},

			m: function mount(target, anchor) {
				insert(target, nav, anchor);
				append(nav, a);
				append(a, text);
				append(nav, text_1);
				append(nav, button);
				append(button, span);
				append(nav, text_3);
				append(nav, div);
				append(div, ul);
				if (if_block) if_block.m(ul, null);
				append(div, text_5);
				if (if_block_1) if_block_1.m(div, null);
				insert(target, text_8, anchor);
				insert(target, div_1, anchor);
				append(div_1, div_2);
				if (if_block_2) if_block_2.m(div_2, null);
				append(div_2, text_9);

				if (switch_instance) {
					switch_instance._mount(div_2, null);
				}

				insert(target, text_12, anchor);
				insert(target, div_3, anchor);
				append(div_3, div_4);
				if (if_block_3) if_block_3.m(div_4, null);
				append(div_3, text_14);
				append(div_3, div_5);
				append(div_5, text_15);
				insert(target, text_17, anchor);
				if (if_block_6) if_block_6.m(target, anchor);
				insert(target, text_18, anchor);
				if (if_block_7) if_block_7.m(target, anchor);
				insert(target, if_block_7_anchor, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				if (!current || changed.appName) {
					setData(text, ctx.appName);
				}

				if (ctx.rightsReady) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block$8(component, ctx);
						if_block.c();
						if_block.m(ul, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if (ctx.rightsReady) {
					if (if_block_1) {
						if_block_1.p(changed, ctx);
					} else {
						if_block_1 = create_if_block_3$8(component, ctx);
						if_block_1.c();
						if_block_1.m(div, null);
					}
				} else if (if_block_1) {
					if_block_1.d(1);
					if_block_1 = null;
				}

				if (ctx.BreadCrumbs) {
					if (if_block_2) {
						if_block_2.p(changed, ctx);
					} else {
						if_block_2 = create_if_block_6$3(component, ctx);
						if_block_2.c();
						if_block_2.m(div_2, text_9);
					}
				} else if (if_block_2) {
					if_block_2.d(1);
					if_block_2 = null;
				}

				var switch_instance_changes = {};
				if (changed.rights) switch_instance_changes.rights = ctx.rights;

				if (switch_value !== (switch_value = ctx.ComponentLink)) {
					if (switch_instance) {
						const old_component = switch_instance;
						old_component._fragment.o(() => {
							old_component.destroy();
						});
					}

					if (switch_value) {
						switch_instance = new switch_value(switch_props(ctx));
						switch_instance._fragment.c();
						switch_instance._mount(div_2, null);
					} else {
						switch_instance = null;
					}
				}

				else if (switch_value) {
					switch_instance._set(switch_instance_changes);
				}

				if (current_block_type !== (current_block_type = select_block_type_2(ctx))) {
					if (if_block_3) if_block_3.d(1);
					if_block_3 = current_block_type && current_block_type(component, ctx);
					if (if_block_3) if_block_3.c();
					if (if_block_3) if_block_3.m(div_4, null);
				}

				if ((!current || changed.toast) && div_4_class_value !== (div_4_class_value = ctx.toast.type)) {
					div_4.className = div_4_class_value;
				}

				if ((!current || changed.toast) && text_15_value !== (text_15_value = ctx.toast.text)) {
					setData(text_15, text_15_value);
				}

				if ((!current || changed.toast) && div_5_class_value !== (div_5_class_value = ctx.toast.type)) {
					div_5.className = div_5_class_value;
				}

				if ((!current || changed.toast) && div_3_class_value !== (div_3_class_value = ctx.toast.type)) {
					div_3.className = div_3_class_value;
				}

				if (ctx.modal && ctx.modal.component) {
					if (if_block_6) {
						if_block_6.p(changed, ctx);
					} else {
						if_block_6 = create_if_block_10$1(component, ctx);
						if (if_block_6) if_block_6.c();
					}

					if_block_6.i(text_18.parentNode, text_18);
				} else if (if_block_6) {
					if_block_6.o(function() {
						if_block_6.d(1);
						if_block_6 = null;
					});
				}

				if (ctx.newOrder) {
					if (if_block_7) {
						if_block_7.p(changed, ctx);
					} else {
						if_block_7 = create_if_block_11$1(component, ctx);
						if_block_7.c();
						if_block_7.m(if_block_7_anchor.parentNode, if_block_7_anchor);
					}
				} else if (if_block_7) {
					if_block_7.d(1);
					if_block_7 = null;
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				outrocallback = callAfter(outrocallback, 2);

				if (switch_instance) switch_instance._fragment.o(outrocallback);

				if (if_block_6) if_block_6.o(outrocallback);
				else outrocallback();

				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(nav);
				}

				if (if_block) if_block.d();
				if (if_block_1) if_block_1.d();
				if (detach) {
					detachNode(text_8);
					detachNode(div_1);
				}

				if (if_block_2) if_block_2.d();
				if (switch_instance) switch_instance.destroy();
				if (detach) {
					detachNode(text_12);
					detachNode(div_3);
				}

				if (if_block_3) if_block_3.d();
				if (detach) {
					detachNode(text_17);
				}

				if (if_block_6) if_block_6.d(detach);
				if (detach) {
					detachNode(text_18);
				}

				if (if_block_7) if_block_7.d(detach);
				if (detach) {
					detachNode(if_block_7_anchor);
				}
			}
		};
	}

	// (11:4) {#each Navigations as link}
	function create_each_block$5(component, ctx) {
		var if_block_anchor;

		function select_block_type(ctx) {
			if (ctx.link.dropdown) return create_if_block_1$8;
			return create_if_block_2$8;
		}

		var current_block_type = select_block_type(ctx);
		var if_block = current_block_type(component, ctx);

		return {
			c: function create() {
				if_block.c();
				if_block_anchor = createComment();
			},

			m: function mount(target, anchor) {
				if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
			},

			p: function update(changed, ctx) {
				if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block.d(1);
					if_block = current_block_type(component, ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},

			d: function destroy$$1(detach) {
				if_block.d(detach);
				if (detach) {
					detachNode(if_block_anchor);
				}
			}
		};
	}

	// (19:7) {#each link.dropdown as dropdownLink}
	function create_each_block_1$2(component, ctx) {
		var a, text_value = ctx.dropdownLink.name, text, a_href_value;

		return {
			c: function create() {
				a = createElement("a");
				text = createText(text_value);
				a.className = "dropdown-item";
				a.href = a_href_value = "/" + ctx.link.value + ctx.dropdownLink.value;
				addLoc(a, file$b, 19, 7, 913);
			},

			m: function mount(target, anchor) {
				insert(target, a, anchor);
				append(a, text);
			},

			p: function update(changed, ctx) {
				if ((changed.Navigations) && text_value !== (text_value = ctx.dropdownLink.name)) {
					setData(text, text_value);
				}

				if ((changed.Navigations) && a_href_value !== (a_href_value = "/" + ctx.link.value + ctx.dropdownLink.value)) {
					a.href = a_href_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(a);
				}
			}
		};
	}

	// (12:5) {#if link.dropdown}
	function create_if_block_1$8(component, ctx) {
		var li, a, text_value = ctx.link.name, text, a_href_value, a_id_value, text_2, div, div_aria_labelledby_value;

		var each_value_1 = ctx.link.dropdown;

		var each_blocks = [];

		for (var i = 0; i < each_value_1.length; i += 1) {
			each_blocks[i] = create_each_block_1$2(component, get_each_context_1$2(ctx, each_value_1, i));
		}

		return {
			c: function create() {
				li = createElement("li");
				a = createElement("a");
				text = createText(text_value);
				text_2 = createText("\n\t\t\t\t\t\t");
				div = createElement("div");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				a.className = "nav-link dropdown-toggle svelte-13e2uxn";
				a.href = a_href_value = "/" + ctx.link.value;
				a.id = a_id_value = "navbar-" + ctx.link.value;
				setAttribute(a, "role", "button");
				a.dataset.toggle = "dropdown";
				setAttribute(a, "aria-haspopup", "true");
				setAttribute(a, "aria-expanded", "false");
				addLoc(a, file$b, 13, 6, 590);
				div.className = "dropdown-menu";
				setAttribute(div, "aria-labelledby", div_aria_labelledby_value = "navbar-" + ctx.link.value);
				addLoc(div, file$b, 17, 6, 795);
				li.className = "nav-item dropdown";
				addLoc(li, file$b, 12, 5, 553);
			},

			m: function mount(target, anchor) {
				insert(target, li, anchor);
				append(li, a);
				append(a, text);
				append(li, text_2);
				append(li, div);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(div, null);
				}
			},

			p: function update(changed, ctx) {
				if ((changed.Navigations) && text_value !== (text_value = ctx.link.name)) {
					setData(text, text_value);
				}

				if ((changed.Navigations) && a_href_value !== (a_href_value = "/" + ctx.link.value)) {
					a.href = a_href_value;
				}

				if ((changed.Navigations) && a_id_value !== (a_id_value = "navbar-" + ctx.link.value)) {
					a.id = a_id_value;
				}

				if (changed.Navigations) {
					each_value_1 = ctx.link.dropdown;

					for (var i = 0; i < each_value_1.length; i += 1) {
						const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block_1$2(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(div, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value_1.length;
				}

				if ((changed.Navigations) && div_aria_labelledby_value !== (div_aria_labelledby_value = "navbar-" + ctx.link.value)) {
					setAttribute(div, "aria-labelledby", div_aria_labelledby_value);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(li);
				}

				destroyEach(each_blocks, detach);
			}
		};
	}

	// (24:5) {:else}
	function create_if_block_2$8(component, ctx) {
		var li, a, text_value = ctx.link.name, text, a_class_value, a_href_value;

		return {
			c: function create() {
				li = createElement("li");
				a = createElement("a");
				text = createText(text_value);
				a.className = a_class_value = "nav-link " + (ctx.path == '/'+ctx.link.value ? 'active' : '');
				a.href = a_href_value = "/" + ctx.link.value;
				addLoc(a, file$b, 25, 6, 1088);
				li.className = "nav-item";
				addLoc(li, file$b, 24, 5, 1060);
			},

			m: function mount(target, anchor) {
				insert(target, li, anchor);
				append(li, a);
				append(a, text);
			},

			p: function update(changed, ctx) {
				if ((changed.Navigations) && text_value !== (text_value = ctx.link.name)) {
					setData(text, text_value);
				}

				if ((changed.path || changed.Navigations) && a_class_value !== (a_class_value = "nav-link " + (ctx.path == '/'+ctx.link.value ? 'active' : ''))) {
					a.className = a_class_value;
				}

				if ((changed.Navigations) && a_href_value !== (a_href_value = "/" + ctx.link.value)) {
					a.href = a_href_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(li);
				}
			}
		};
	}

	// (10:3) {#if rightsReady}
	function create_if_block$8(component, ctx) {
		var each_anchor;

		var each_value = ctx.Navigations;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$5(component, get_each_context$5(ctx, each_value, i));
		}

		return {
			c: function create() {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_anchor = createComment();
			},

			m: function mount(target, anchor) {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(target, anchor);
				}

				insert(target, each_anchor, anchor);
			},

			p: function update(changed, ctx) {
				if (changed.Navigations || changed.path) {
					each_value = ctx.Navigations;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$5(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block$5(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(each_anchor.parentNode, each_anchor);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}
			},

			d: function destroy$$1(detach) {
				destroyEach(each_blocks, detach);

				if (detach) {
					detachNode(each_anchor);
				}
			}
		};
	}

	// (34:3) {#if sessionName}
	function create_if_block_4$4(component, ctx) {
		var span, text, text_1, text_2, a, text_3;

		return {
			c: function create() {
				span = createElement("span");
				text = createText("Здравствуйте, ");
				text_1 = createText(ctx.sessionName);
				text_2 = createText("\n\t\t\t");
				a = createElement("a");
				text_3 = createText("Выйти");
				setStyle(span, "color", "white");
				setStyle(span, "padding-right", "15px");
				addLoc(span, file$b, 34, 3, 1324);
				a.href = "/session/end";
				a.className = "btn btn-outline-light";
				addLoc(a, file$b, 35, 3, 1411);
			},

			m: function mount(target, anchor) {
				insert(target, span, anchor);
				append(span, text);
				append(span, text_1);
				insert(target, text_2, anchor);
				insert(target, a, anchor);
				append(a, text_3);
			},

			p: function update(changed, ctx) {
				if (changed.sessionName) {
					setData(text_1, ctx.sessionName);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(span);
					detachNode(text_2);
					detachNode(a);
				}
			}
		};
	}

	// (37:3) {:else}
	function create_if_block_5$3(component, ctx) {
		var button, text;

		function click_handler(event) {
			component.set({ modal: { component: 'AuthForm', name: 'Авторизация' } });
		}

		return {
			c: function create() {
				button = createElement("button");
				text = createText("Авторизация");
				addListener(button, "click", click_handler);
				button.type = "button";
				button.className = "btn btn-outline-light";
				addLoc(button, file$b, 37, 3, 1488);
			},

			m: function mount(target, anchor) {
				insert(target, button, anchor);
				append(button, text);
			},

			p: noop,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(button);
				}

				removeListener(button, "click", click_handler);
			}
		};
	}

	// (32:2) {#if rightsReady}
	function create_if_block_3$8(component, ctx) {
		var form;

		function select_block_type_1(ctx) {
			if (ctx.sessionName) return create_if_block_4$4;
			return create_if_block_5$3;
		}

		var current_block_type = select_block_type_1(ctx);
		var if_block = current_block_type(component, ctx);

		return {
			c: function create() {
				form = createElement("form");
				if_block.c();
				form.className = "form-inline my-2 my-lg-0";
				addLoc(form, file$b, 32, 2, 1260);
			},

			m: function mount(target, anchor) {
				insert(target, form, anchor);
				if_block.m(form, null);
			},

			p: function update(changed, ctx) {
				if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block.d(1);
					if_block = current_block_type(component, ctx);
					if_block.c();
					if_block.m(form, null);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(form);
				}

				if_block.d();
			}
		};
	}

	// (51:5) {#each BreadCrumbs as BreadCrumb}
	function create_each_block_2$2(component, ctx) {
		var li, a, text_value = ctx.BreadCrumb.name, text, a_href_value, li_class_value;

		return {
			c: function create() {
				li = createElement("li");
				a = createElement("a");
				text = createText(text_value);
				a.href = a_href_value = ctx.BreadCrumb.link;
				addLoc(a, file$b, 51, 67, 1933);
				li.className = li_class_value = "breadcrumb-item " + (ctx.BreadCrumb.last ? 'active' : '');
				addLoc(li, file$b, 51, 5, 1871);
			},

			m: function mount(target, anchor) {
				insert(target, li, anchor);
				append(li, a);
				append(a, text);
			},

			p: function update(changed, ctx) {
				if ((changed.BreadCrumbs) && text_value !== (text_value = ctx.BreadCrumb.name)) {
					setData(text, text_value);
				}

				if ((changed.BreadCrumbs) && a_href_value !== (a_href_value = ctx.BreadCrumb.link)) {
					a.href = a_href_value;
				}

				if ((changed.BreadCrumbs) && li_class_value !== (li_class_value = "breadcrumb-item " + (ctx.BreadCrumb.last ? 'active' : ''))) {
					li.className = li_class_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(li);
				}
			}
		};
	}

	// (47:2) {#if BreadCrumbs}
	function create_if_block_6$3(component, ctx) {
		var div, nav, ol;

		var each_value_2 = ctx.BreadCrumbs;

		var each_blocks = [];

		for (var i = 0; i < each_value_2.length; i += 1) {
			each_blocks[i] = create_each_block_2$2(component, get_each_context_2$2(ctx, each_value_2, i));
		}

		return {
			c: function create() {
				div = createElement("div");
				nav = createElement("nav");
				ol = createElement("ol");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				ol.className = "breadcrumb";
				addLoc(ol, file$b, 49, 4, 1803);
				setAttribute(nav, "aria-label", "breadcrumb");
				nav.className = "svelte-13e2uxn";
				addLoc(nav, file$b, 48, 3, 1769);
				div.className = "col-md-6";
				addLoc(div, file$b, 47, 2, 1743);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, nav);
				append(nav, ol);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(ol, null);
				}
			},

			p: function update(changed, ctx) {
				if (changed.BreadCrumbs) {
					each_value_2 = ctx.BreadCrumbs;

					for (var i = 0; i < each_value_2.length; i += 1) {
						const child_ctx = get_each_context_2$2(ctx, each_value_2, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block_2$2(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(ol, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value_2.length;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				destroyEach(each_blocks, detach);
			}
		};
	}

	// (65:2) {#if toast.type == 'success'}
	function create_if_block_7$3(component, ctx) {
		var i, text;

		return {
			c: function create() {
				i = createElement("i");
				text = createText("done");
				i.className = "material-icons";
				addLoc(i, file$b, 65, 2, 2306);
			},

			m: function mount(target, anchor) {
				insert(target, i, anchor);
				append(i, text);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(i);
				}
			}
		};
	}

	// (67:35) 
	function create_if_block_8$3(component, ctx) {
		var i, text;

		return {
			c: function create() {
				i = createElement("i");
				text = createText("warning");
				i.className = "material-icons";
				addLoc(i, file$b, 67, 2, 2379);
			},

			m: function mount(target, anchor) {
				insert(target, i, anchor);
				append(i, text);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(i);
				}
			}
		};
	}

	// (69:34) 
	function create_if_block_9$2(component, ctx) {
		var i, text;

		return {
			c: function create() {
				i = createElement("i");
				text = createText("close");
				i.className = "material-icons";
				addLoc(i, file$b, 69, 2, 2454);
			},

			m: function mount(target, anchor) {
				insert(target, i, anchor);
				append(i, text);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(i);
				}
			}
		};
	}

	// (76:0) {#if modal && modal.component}
	function create_if_block_10$1(component, ctx) {
		var current;

		var modal_initial_data = {
		 	title: ctx.modal.name,
		 	component: ctx.modal.component,
		 	formStore: ctx.formStore
		 };
		var modal = new Modal({
			root: component.root,
			store: component.store,
			data: modal_initial_data
		});

		return {
			c: function create() {
				modal._fragment.c();
			},

			m: function mount(target, anchor) {
				modal._mount(target, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				var modal_changes = {};
				if (changed.modal) modal_changes.title = ctx.modal.name;
				if (changed.modal) modal_changes.component = ctx.modal.component;
				if (changed.formStore) modal_changes.formStore = ctx.formStore;
				modal._set(modal_changes);
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (modal) modal._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				modal.destroy(detach);
			}
		};
	}

	// (88:2) {#if newOrder.vkGroups}
	function create_if_block_12$1(component, ctx) {
		var text, text_1_value = ctx.newOrder.vkGroups.length, text_1, text_2, br;

		return {
			c: function create() {
				text = createText("ВК-группы - ");
				text_1 = createText(text_1_value);
				text_2 = createText(" шт.");
				br = createElement("br");
				addLoc(br, file$b, 88, 45, 3075);
			},

			m: function mount(target, anchor) {
				insert(target, text, anchor);
				insert(target, text_1, anchor);
				insert(target, text_2, anchor);
				insert(target, br, anchor);
			},

			p: function update(changed, ctx) {
				if ((changed.newOrder) && text_1_value !== (text_1_value = ctx.newOrder.vkGroups.length)) {
					setData(text_1, text_1_value);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(text);
					detachNode(text_1);
					detachNode(text_2);
					detachNode(br);
				}
			}
		};
	}

	// (91:2) {#if newOrder.packages}
	function create_if_block_13$1(component, ctx) {
		var text, text_1_value = ctx.newOrder.packages.length, text_1, text_2, br;

		return {
			c: function create() {
				text = createText("Пакеты - ");
				text_1 = createText(text_1_value);
				text_2 = createText(" шт.");
				br = createElement("br");
				addLoc(br, file$b, 91, 42, 3156);
			},

			m: function mount(target, anchor) {
				insert(target, text, anchor);
				insert(target, text_1, anchor);
				insert(target, text_2, anchor);
				insert(target, br, anchor);
			},

			p: function update(changed, ctx) {
				if ((changed.newOrder) && text_1_value !== (text_1_value = ctx.newOrder.packages.length)) {
					setData(text_1, text_1_value);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(text);
					detachNode(text_1);
					detachNode(text_2);
					detachNode(br);
				}
			}
		};
	}

	// (80:0) {#if newOrder}
	function create_if_block_11$1(component, ctx) {
		var div, div_1, h5, text, i, text_1, text_3, p, text_4, text_5, text_6_value = ctx.newOrder.price, text_6, text_7, text_8, button, text_9;

		function click_handler(event) {
			component.clearOrder();
		}

		var if_block = (ctx.newOrder.vkGroups) && create_if_block_12$1(component, ctx);

		var if_block_1 = (ctx.newOrder.packages) && create_if_block_13$1(component, ctx);

		function click_handler_1(event) {
			component.set({ modal: { name: 'Новый заказ', component: 'OrderForm' } });
		}

		return {
			c: function create() {
				div = createElement("div");
				div_1 = createElement("div");
				h5 = createElement("h5");
				text = createText("Новый заказ\n\t\t");
				i = createElement("i");
				text_1 = createText("close");
				text_3 = createText("\n\t");
				p = createElement("p");
				if (if_block) if_block.c();
				text_4 = createText("\n\t\t");
				if (if_block_1) if_block_1.c();
				text_5 = createText("\n\t\tCтоимость - ");
				text_6 = createText(text_6_value);
				text_7 = createText(" руб.");
				text_8 = createText("\n    ");
				button = createElement("button");
				text_9 = createText("Оформить заказ");
				addListener(i, "click", click_handler);
				i.className = "material-icons pointer";
				setStyle(i, "position", "absolute");
				setStyle(i, "top", "10px");
				setStyle(i, "right", "10px");
				i.title = "Очистить заказ";
				addLoc(i, file$b, 84, 2, 2821);
				h5.className = "card-title";
				addLoc(h5, file$b, 82, 4, 2781);
				p.className = "card-text text-left";
				addLoc(p, file$b, 86, 1, 2972);
				addListener(button, "click", click_handler_1);
				button.className = "btn btn-success pulse";
				addLoc(button, file$b, 94, 4, 3213);
				div_1.className = "card-body text-center";
				addLoc(div_1, file$b, 81, 2, 2741);
				div.className = "card svelte-13e2uxn";
				div.id = "newOrder";
				addLoc(div, file$b, 80, 0, 2706);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, div_1);
				append(div_1, h5);
				append(h5, text);
				append(h5, i);
				append(i, text_1);
				append(div_1, text_3);
				append(div_1, p);
				if (if_block) if_block.m(p, null);
				append(p, text_4);
				if (if_block_1) if_block_1.m(p, null);
				append(p, text_5);
				append(p, text_6);
				append(p, text_7);
				append(div_1, text_8);
				append(div_1, button);
				append(button, text_9);
			},

			p: function update(changed, ctx) {
				if (ctx.newOrder.vkGroups) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block_12$1(component, ctx);
						if_block.c();
						if_block.m(p, text_4);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if (ctx.newOrder.packages) {
					if (if_block_1) {
						if_block_1.p(changed, ctx);
					} else {
						if_block_1 = create_if_block_13$1(component, ctx);
						if_block_1.c();
						if_block_1.m(p, text_5);
					}
				} else if (if_block_1) {
					if_block_1.d(1);
					if_block_1 = null;
				}

				if ((changed.newOrder) && text_6_value !== (text_6_value = ctx.newOrder.price)) {
					setData(text_6, text_6_value);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(i, "click", click_handler);
				if (if_block) if_block.d();
				if (if_block_1) if_block_1.d();
				removeListener(button, "click", click_handler_1);
			}
		};
	}

	function get_each_context$5(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.link = list[i];
		child_ctx.each_value = list;
		child_ctx.link_index = i;
		return child_ctx;
	}

	function get_each_context_1$2(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.dropdownLink = list[i];
		child_ctx.each_value_1 = list;
		child_ctx.dropdownLink_index = i;
		return child_ctx;
	}

	function get_each_context_2$2(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.BreadCrumb = list[i];
		child_ctx.each_value_2 = list;
		child_ctx.BreadCrumb_index = i;
		return child_ctx;
	}

	function App(options) {
		this._debugName = '<App>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$a(), options.data);
		this._recompute({ links: 1, rights: 1, componentName: 1, path: 1 }, this._state);
		if (!('links' in this._state)) console.warn("<App> was created without expected data property 'links'");
		if (!('rights' in this._state)) console.warn("<App> was created without expected data property 'rights'");
		if (!('componentName' in this._state)) console.warn("<App> was created without expected data property 'componentName'");
		if (!('path' in this._state)) console.warn("<App> was created without expected data property 'path'");
		if (!('appName' in this._state)) console.warn("<App> was created without expected data property 'appName'");
		if (!('rightsReady' in this._state)) console.warn("<App> was created without expected data property 'rightsReady'");

		if (!('sessionName' in this._state)) console.warn("<App> was created without expected data property 'sessionName'");


		if (!('toast' in this._state)) console.warn("<App> was created without expected data property 'toast'");
		if (!('modal' in this._state)) console.warn("<App> was created without expected data property 'modal'");
		if (!('formStore' in this._state)) console.warn("<App> was created without expected data property 'formStore'");
		if (!('newOrder' in this._state)) console.warn("<App> was created without expected data property 'newOrder'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$b(this, this._state);

		this.root._oncreate.push(() => {
			oncreate$9.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(App.prototype, protoDev);
	assign(App.prototype, methods$b);

	App.prototype._checkReadOnly = function _checkReadOnly(newState) {
		if ('Navigations' in newState && !this._updatingReadonlyProperty) throw new Error("<App>: Cannot set read-only property 'Navigations'");
		if ('ComponentLink' in newState && !this._updatingReadonlyProperty) throw new Error("<App>: Cannot set read-only property 'ComponentLink'");
		if ('BreadCrumbs' in newState && !this._updatingReadonlyProperty) throw new Error("<App>: Cannot set read-only property 'BreadCrumbs'");
	};

	App.prototype._recompute = function _recompute(changed, state) {
		if (changed.links || changed.rights) {
			if (this._differs(state.Navigations, (state.Navigations = Navigations(state)))) changed.Navigations = true;
		}

		if (changed.componentName || changed.rights) {
			if (this._differs(state.ComponentLink, (state.ComponentLink = ComponentLink$1(state)))) changed.ComponentLink = true;
		}

		if (changed.path) {
			if (this._differs(state.BreadCrumbs, (state.BreadCrumbs = BreadCrumbs(state)))) changed.BreadCrumbs = true;
		}
	};

	const app = new App({
		target: document.getElementsByTagName('app')[0],
		data: {
			appName: 'VLAD VK',
			componentName: '',
			rights: {},
			isLoaded: true,
			rightsReady: false,
			newOrder: JSON.parse(localStorage.getItem('newOrder')),
			links: [{
				name: 'ВК-группы',
				value: 'vk-groups',
			}, {
				name: 'Пакеты',
				value: 'packages',
			}, {
				name: 'Пользователи',
				value: 'users',
			}, {
				name: 'Заказы',
				value: 'orders',
			}],
			path: window.location.pathname,
			toast: {
				icon: '',
				text: 'Привет',
				type: 'success'
			}
		}
	});

	return app;

}());
//# sourceMappingURL=bundle.js.map
