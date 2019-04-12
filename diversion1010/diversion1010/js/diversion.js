'use strict';

/**
 * @author wallis
 * @date 2018-8-21
 * @desc 恒惠贷导流页
 */

(function (window) {

	function Listener(vm, node, name, nodeValue, type) {
		Passive.target = this;
		this.vm = vm;
		this.node = node;
		this.name = name;
		this.nodeValue = nodeValue;
		this.type = type;
		this._update();
		Passive.target = null;
	};

	Listener.prototype = {
		_update: function () {
			this._getValue();
			if (this.type === 'style') {
				this.node.style[this.name] = this.value;
			};
			if (this.type === 'input') {
				this.node.nodeValue = this.value;
			};
			if (this.type === 'show') {
				if (!this.value) {
					this.node.outHTML = '<!--' + node.outerHTML + '-->';
				}
			};
			if (this.type === 'text') {
				this.node.nodeValue = this.value;
			};
			if (this.type === 'attr') {
				this.node[this.name] = this.value;
			}
		},
		_getValue: function () {
			this.value = this.vm[this.nodeValue];
		}
	}

	function Passive() {
		this.subs = [];
	}

	Passive.prototype = {
		_addSub: function (sub) {
			this.subs.push(sub);
		},
		_notify: function () {
			this.subs.forEach(function (sub) {
				sub._update();
			})
		}
	};

	function watcher(data, vm) {
		Object.keys(data).forEach(function (key) {
			_wacther(vm, key, data[key]);
		})
	}

	function _wacther(vm, key, value) {
		var sub = new Passive();
		Object.defineProperty(vm, key, {
			set: function (newValue) {
				if (value === newValue) {
					return;
				}
				value = newValue;
				sub._notify();
			},
			get: function () {
				if (Passive.target) {
					sub._addSub(Passive.target);
				}
				return value;
			}
		})
	}

	function nodeToFragment(node, vm) {
		var fragment = document.createDocumentFragment(),
			child; //文档片
		while (child = node.firstChild) {
			deepComplier(child, vm);
			fragment.appendChild(child);
		}
		return fragment;
	}

	function deepComplier(node, vm) {
		complier(node, vm);
		if (node.childNodes.length > 0) {
			for (var i = 0, l = node.childNodes.length; i < l; i++) {
				deepComplier(node.childNodes[i], vm);
			}
		}
	}

	function complier(node, vm) {
		var reg = /\[(.*)\]/;
		var clickREG = /\@(.*)/;
		var attrREG = /^(v-attr-)(.*)/;
		if (node.nodeType === 1) {
			var attrs = node.attributes;
			for (var i = 0; i < attrs.length; i++) {
				if (reg.test(attrs[i].nodeName)) {

					var name = RegExp.$1.trim();

					node.style[name] = vm[attrs[i].nodeValue];

					new Listener(vm, node, name, attrs[i].nodeValue, 'style');
					node.removeAttribute(attrs[i].nodeName);
					i--;
				}

				if (attrs[i].nodeName === 'v-model') {

					node.nodeValue = vm[attrs[i].nodeValue];
					(function (index) {
						node.addEventListener('input', function (e) {
							e = e || window.event;
							var target = e.srcElement || e.target;
							vm[attrs[index].nodeValue] = target.value.trim();
						})
					})(i);

					new Listener(vm, node, '', attrs[i].nodeValue, 'input');
				}

				if (clickREG.test(attrs[i].nodeName)) {
					var name = RegExp.$1.trim();
					var event = attrs[i].nodeValue;
					node.addEventListener(name, function () {
						vm[event].call(vm);
					});
				}

				if (attrREG.test(attrs[i].nodeName)) {

					var name = RegExp.$2.trim();

					node[name] = vm[attrs[i].nodeValue];
					new Listener(vm, node, name, attrs[i].nodeValue, 'attr');
					//					node.removeAttribute(attrs[i].nodeName);
					//					i--;
				}

				if (attrs[i].nodeName === 'v-if') {
					var show = vm[attrs[i].nodeValue];
					if (!show) {
						node.outerHTML = '<!--' + node.outerHTML + '-->';
					}
					//					new Listener(vm,node,,attrs[i].nodeValue,'show');
				}
			}
		}
		if (node.nodeType === 3) {
			var textREG = /\{\{(.*)\}\}/;

			if (textREG.test(node.nodeValue)) {
				var name = RegExp.$1.trim();

				node.nodeValue = vm[name];

				new Listener(vm, node, '', name, 'text');
			}
		}
	}

	function copy(data, vm) {
		for (var k in data) {
			vm.__proto__[k] = data[k];
		}
	}

	function Vm(options) {
		this.data = options.data;
		this.element = document.querySelector(options.el);
		this.init = options.init;
		this.methods = options.methods;

		watcher(this.data, this); //绑定数据

		copy(this.methods, this); //绑定方法

		var dummyDOM = nodeToFragment(this.element, this); //创建dom

		this.element.appendChild(dummyDOM); //document 里已经存在dom

		this.init(); //钩子函数
	}

	window.Vm = Vm;
})(window);
//---------------------- 为埋点信息
$(function () {
	var vm = new Vm({
		el: 'body',
		data: {
			show: true,
			content: '获取验证码',
			mobile: '',
			code: '',
			waiting: false,
			operatorORnot: false,
			downloadFlag: true
		},
		init: function () {
			var that = this;
			this.pv();
			this.visitMD(); //------------------
			$(window).on('beforeunload', function () {
				if (that.downloadFlag) {
					that.leaveMD.call(that);
				}
			});

			// 紧急修改点击关闭download框

			$('.closeDownload').on('click', function (event) {
				event.stopPropagation();
				$('.download').css('display', 'none');
			})

			///  紧急 修改 部分 解决 埋点 次数 虚高问题

			$('.assoitBOX').css('display', 'none').load('assoit.html');
			this.checkHash();
			$(window).on('hashchange', function () {
				that.checkHash();
			})

			var winHeight = $(window).height();
			// 当键盘弹起时，下载框不能随着键盘弹起
			var size = [window.width, window.height];

			$(window).on('resize', function () {
				// 解决地址栏缺少时导致显示bug
				window.resizeTo(size[0], size[1]);
				var thisHeight = $(this).height();
				if (location.hash.indexOf('assoit') === -1) {
					if (winHeight - thisHeight > 50) {
						$('.mod_container').addClass('autoHeight');
						$('.download').css({
							'position': 'static'
						})
					} else {
						$('.mod_container').removeClass('autoHeight');
						$('.download').css({
							'display': 'block',
							'position': 'fixed'
						});
					}
				}
			})
			///////
		},
		methods: {
			checkHash: function () {
				if (location.hash.indexOf('assoit') !== -1) {
					$('.mod_container').css({
						'backgroundColor': '#fff'
					});
					// hash切换时隐藏图片
					$('.bgImg').css('display', 'none');
					//显示协议
					$('.assoitBOX').css('display', 'block');
					// hash切换时隐藏图片
					$('.download').css('display', 'none');
					// 解决当window滑动时，回到主页面，scrollTop滑动导致视图显示不正确
					$('html,body').css('height', 'auto');
					$(window).scrollTop(0);
				} else {
					$('.mod_container').css({
						'backgroundColor': '#2B98FF'
					});
					// hash切换时显示图片
					$('.bgImg').css('display', 'block');
					$('.assoitBOX').css('display', 'none');
					$('.download').css({
						'display': 'block',
						'position': 'fixed'
					});
					// 解决当window滑动时，回到主页面，scrollTop滑动导致视图显示不正确
					$('html,body').css('height', 'auto');
					$(window).scrollTop(0);
					// $('html,body').css('height', '100%');
				}
			},
			// ip pv
			pv: function () {
				$.ajax({
					url: '/pv/trace/savePageView?pageName=HengHuiDaiDiversion_1009',
					type: 'post',
					contentType: 'application/json'
				})
			},
			mobileMD: function () {
				localStorage.setItem('mobile', this.mobile);
				setMD({
					buriedKey: "WEB_MOBILE_BLUR",
					CH: location.getParams('CH'),
					LK: location.getParams('LK'),
					userAgent: navigator.userAgent,
					mobile: this.mobile
				})
			},
			codeMD: function () {
				setMD({
					buriedKey: "WEB_CODE_BLUR",
					CH: location.getParams('CH'),
					LK: location.getParams('LK'),
					userAgent: navigator.userAgent,
					mobile: this.mobile
				})
			},
			getCodeMD: function () {
				setMD({
					buriedKey: "WEB_GETCODE_CLICK",
					CH: location.getParams('CH'),
					LK: location.getParams('LK'),
					userAgent: navigator.userAgent,
					mobile: this.mobile
				})
			},
			submitMD: function () {
				setMD({
					buriedKey: "WEB_SUBMIT_CLICK",
					CH: location.getParams('CH'),
					LK: location.getParams('LK'),
					userAgent: navigator.userAgent,
					mobile: this.mobile
				})
			},
			visitMD: function () {
				setMD({
					buriedKey: "WEB_OPRNURL_ONLOAD",
					CH: location.getParams('CH'),
					LK: location.getParams('LK'),
					userAgent: navigator.userAgent,
					mobile: this.mobile
				})
			},
			leaveMD: function () {
				if (!this.operatorORnot) {
					setMD({
						buriedKey: "WEB_LEAVE_CLOSE",
						CH: location.getParams('CH'),
						LK: location.getParams('LK'),
						userAgent: navigator.userAgent,
						mobile: this.mobile
					})
				}
			},
			downloadMD: function () {

				setMD({
					buriedKey: "WEB_DOWNLOAD_CLICK",
					CH: location.getParams('CH'),
					LK: location.getParams('LK'),
					userAgent: navigator.userAgent,
					mobile: this.mobile
				})
			},
			assiotMD: function () {
				setMD({
					buriedKey: "WEB_ASSOIT_ONLOAD",
					CH: location.getParams('CH'),
					LK: location.getParams('LK'),
					userAgent: navigator.userAgent,
					mobile: this.mobile
				})
			},
			cardMD: function () {
				setMD({
					buriedKey: "WEB_CARD_CLICK",
					CH: location.getParams('CH'),
					LK: location.getParams('LK'),
					userAgent: navigator.userAgent,
					mobile: this.mobile
				})
			},
			checkMobile: function () {
				var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
				if (this.mobile.trim() === '') {
					$.toast('手机号不能为空');
					return false;
				}
				if (!reg.test(this.mobile.trim())) {
					$.toast('请填写正确的手机号码');
					return false;
				}
				return true;
			},
			checkVCode: function () {
				if (this.code.trim() === '') {
					$.toast('验证码不能为空');
					return false;
				}
				return true;
			},
			// 底部栏点击下载事件
			clickDownload: function () {
				// 将downloadFlag 置为 false,false则不触发beforeunload事件
				this.downloadFlag = false;
				this.downloadMD();
				if ($.getSystem()) {
					$('.iphone')[0].click();
				} else {
					$('.android')[0].click();
				}
				this.downloadFlag = true;
			},
			getVcode: function () {
				var that = this;

				if (!this.checkMobile()) {
					return;
				}

				$.$interval({
					init: function () {
						that.content = 59 + "s后重新获取";
						that.waiting = true;
						that.getCodeMD(); //---------------------
					},
					listener: function (nowDIS) {
						that.content = (59 - nowDIS) + "s后重新获取";
					},
					callback: function () {
						that.content = "获取验证码";
						that.waiting = false;
					}
				})

				var substime = formatDateTime();
				var mobile = this.mobile.trim();

				var sha1 = new jsSHA("SHA-1", 'TEXT');
				sha1.update(md5(mobile).toUpperCase() + "|" + substime);
				var sign = sha1.getHash('HEX');

				$.ajax({
					url: '/diversion/login/getValidationCode/' + mobile,
					type: 'get',
					headers: {
						'app-name': 'h5',
						'platform-type': 'web',
						'channel': 'h5',
						'app-version-name': '9.9.9',
						'app-version-code': '2000000',
						'app-version': '2000000',
						'req-time': substime,
						'sign': sign
					},
					success: function (res) {
						$.toast('验证码已发送');
					},
					error: function () {
						$.toast('网络错误，请重新获取');
					}
				})
			},
			submit: function () {
				if (!this.checkMobile() || !this.checkVCode()) {
					return;
				}

				var params = {
					mobile: this.mobile.trim(),
					code: this.code.trim(),
					channel: location.getParams('CH'),
					channelAttr: location.getParams('LK')
				};

				var that = this;

				this.submitMD(); //------------------------

				this.operatorORnot = true;

				$.ajax({
					url: '/diversion/login/checkValidationCode',
					type: 'post',
					headers: {
						'app-name': 'h5',
						'platform-type': 'web',
						'channel': 'h5',
						'app-version-name': '9.9.9',
						'app-version-code': '2000000',
						'app-version': '2000000'
					},
					contentType: 'application/json',
					data: JSON.stringify(params),
					success: function (res) {
						if (res.resCode === 0) {
							$.toast('恭喜你注册成功，已为你开通信用资质，马上下载APP领取你的额度。', function () {
								if ($.getSystem()) {
									$('.iphone')[0].click();
								} else {
									$('.android')[0].click();
								}
							});
						} else {
							$.toast(res.errorMsg)
						}
					},
					error: function () {
						$.toast('网络错误');
					}
				})
			},
			yhk_tapA: function () {
				this.cardMD()
				$.toast('请填写手机号，点击「立即申请」');
			},
			yhk_tapB: function () {
				this.cardMD()
				$.toast('请填写手机号，点击「立即申请」');
			}
		},
	})
})