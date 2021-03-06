console.log('test mới 15');


odoo.define('pos_keyboard.pos', function (require) {
    "use strict";

    var core = require('web.core');
    var gui = require('point_of_sale.gui');
    var models = require('point_of_sale.models');
    var screens = require('point_of_sale.screens');
    var PopupWidget = require('point_of_sale.popups');





    var _super_posmodel = models.PosModel.prototype;
    models.PosModel = models.PosModel.extend({
        initialize: function (session, attributes) {
            var self = this;
            this.keypad = new Keypad({'pos': this});
            _super_posmodel.initialize.call(this, session, attributes);
            this.ready.then(function(){
                self.keypad.set_action_callback(function(data){
                    var current_screen = self.gui.current_screen;
                    var current_popup = self.gui.current_popup;

                    if (current_popup) {
                        current_popup.keypad_action(data);
                    } else if (current_screen.numpad && current_screen.numpad.keypad_action) {
                        current_screen.numpad.keypad_action(data);
                    }
                });
            });
        }
    });

    gui.Gui.prototype.popup_classes.filter(function(c){
        return c.name === 'password';
    })[0].widget.include({
        init: function(parent, args) {
            this._super(parent, args);
            this.popup_type = 'password';
        },
    });

    PopupWidget.include({
        keypad_action: function(data){
            var type = this.pos.keypad.type;
            if (data.type === type.numchar){
                this.click_keyboard(data.val);
            } else if (data.type === type.backspace){
                this.click_keyboard('BACKSPACE');
            } else if (data.type === type.enter){
                this.click_confirm();
            } else if (data.type === type.escape){
                this.click_cancel();
            }
        },
        click_keyboard: function(value){
            var newbuf = this.gui.numpad_input(
                this.inputbuffer,
                value,
                {'firstinput': this.firstinput});

            this.firstinput = (newbuf.length === 0);

            var $value = this.$('.value');
            if (newbuf !== this.inputbuffer) {
                this.inputbuffer = newbuf;
                $value.text(this.inputbuffer);
            }
            if (this.popup_type === 'password') {
                $value.text($value.text().replace(/./g, '•'));
            }
        },
        show: function(options){
            this._super(options);
            this.$('input,textarea').focus();
        },
    });

    screens.NumpadWidget.include({
        keypad_action: function(data){
             var type = this.pos.keypad.type;
             if (data.type === type.numchar){
                 this.state.appendNewChar(data.val);
             }
             else if (data.type === type.bmode) {
                 this.state.changeMode(data.val);
             }
             else if (data.type === type.sign){
                 this.clickSwitchSign();
             }
             else if (data.type === type.backspace){
                 this.clickDeleteLastChar();
             }
        }
    });

    screens.PaymentScreenWidget.include({
        show: function(){
            this._super();
            this.pos.keypad.disconnect();
        },
        hide: function(){
            this._super();
            this.pos.keypad.connect();
        }
    });

    // this module mimics a keypad-only cash register. Use connect() and
    // disconnect() to activate and deactivate it.
    var Keypad = core.Class.extend({
        init: function(attributes){
            this.pos = attributes.pos;
            /*this.pos_widget = this.pos.pos_widget;*/
            this.type = {
                numchar: 'number, dot',
                bmode: 'quantity, discount, price',
                sign: '+, -',
                backspace: 'backspace',
                enter: 'enter',
                escape: 'escape',
            };
            this.data = {
                type: undefined,
                val: undefined
            };
            this.action_callback = undefined;
        },

        save_callback: function(){
            this.saved_callback_stack.push(this.action_callback);
        },

        restore_callback: function(){
            if (this.saved_callback_stack.length > 0) {
                this.action_callback = this.saved_callback_stack.pop();
            }
        },

        set_action_callback: function(callback){
            this.action_callback = callback;
        },

        //remove action callback
        reset_action_callback: function(){
            this.action_callback = undefined;
        },




        // starts catching keyboard events and tries to interpret keystrokes,
        // calling the callback when needed.
        connect: function(){


            // thêm vào nè 
                //ahihi 
            $.shortcutOggy = function(key, callback, args) {
            console.log('đã chạy được');
            $(document).keydown(function(e) {
                if(!args) args=[]; // IE barks when args is null
                if((e.keyCode == key.charCodeAt(0) || e.keyCode == key)) {
                    callback.apply(this, args);
                    return false;
                        }
                    });        
                };
                // chọn khách hàng
                $.shortcutOggy('67', function() {
                   console.log('Đã nhấn chữ C');
                   $('.button.js_set_customer').click();
                  setTimeout(function() {
         $('.searchbox input')[1].focus()
         }, 500);

                });

                
             

                // phím a
                 $.shortcutOggy('65', function() {
                 
             $('.searchbox input')[1].focus();
                  

                });





            var self = this;
            // --- additional keyboard ---//
            // KeyCode: + or - (Keypad '+')
            var KC_PLU = 107;
            // KeyCode: Quantity (Keypad '/')
            var KC_QTY = 111;
            // KeyCode: Price (Keypad '*')
            var KC_AMT = 106;
            // KeyCode: Discount Percentage [0..100] (Keypad '-')
            var KC_DISC = 109;
            // --- basic keyboard --- //
            // KeyCode: sign + or - (Keypad 's')
            var KC_PLU_1 = 83;
            // KeyCode: Quantity (Keypad 'q')
            var KC_QTY_1 = 81;
            // KeyCode: Price (Keypad 'p')
            var KC_AMT_1 = 80;
            // KeyCode: Discount Percentage [0..100] (Keypad 'd')
            var KC_DISC_1 = 68;


            //add thu nut o vao ban phim
            var KC_PAY = 79;

            var KC_T = 84;
            var KC_C = 67;
            var KC_F2 = 113;
            var KC_A = 65;


            // KeyCode: Backspace (Keypad 'backspace')
            var KC_BACKSPACE = 8;
            // KeyCode: Enter (Keypad 'enter')
/*            var KC_ENTER = 13;*/
            // KeyCode: Escape (Keypad 'esc')
            var KC_ESCAPE = 27;
            var kc_lookup = {
                48: '0', 49: '1', 50: '2',  51: '3', 52: '4',
                53: '5', 54: '6', 55: '7', 56: '8', 57: '9',
                80: 'p', 83: 's', 68: 'd', 190: '.', 81: 'q',
                96: '0', 97: '1', 98: '2',  99: '3', 100: '4',
                101: '5', 102: '6', 103: '7', 104: '8', 105: '9',
                106: '*', 107: '+', 109: '-', 110: '.', 111: '/'
            };





            //usb keyboard keyup event
            var rx = /INPUT|SELECT|TEXTAREA/i;
            var ok = false;
            var timeStamp = 0;
            $('body').on('keyup', '', function (e){
                var statusHandler  =  !rx.test(e.target.tagName)  ||
                    e.target.disabled || e.target.readOnly;
                if (statusHandler){
                    var is_number = false;
                    var type = self.type;
                    var buttonMode = {
                        qty: 'quantity',
                        disc: 'discount',
                        price: 'price'
                    };
                    var token = e.keyCode;
                    if (((token >= 96 && token <= 105) || token === 110) ||
                        ((token >= 48 && token <= 57) || token === 190)) {
                        self.data.type = type.numchar;
                        self.data.val = kc_lookup[token];
                        is_number = true;
                        ok = true;
                    } else if (token === KC_PLU || token === KC_PLU_1) {
                        self.data.type = type.sign;
                        ok = true;
                    } else if (token === KC_QTY || token === KC_QTY_1) {
                        self.data.type = type.bmode;
                        self.data.val = buttonMode.qty;
                        ok = true;
                    } else if (token === KC_AMT || token === KC_AMT_1) {
                        self.data.type = type.bmode;
                        self.data.val = buttonMode.price;
                        ok = true;
                    } else if (token === KC_DISC || token === KC_DISC_1) {
                        self.data.type = type.bmode;
                        self.data.val = buttonMode.disc;
                        ok = true;
                    } else if (token === KC_BACKSPACE) {
                        self.data.type = type.backspace;
                        ok = true;
                    } /*else if (token === KC_ENTER) {
                        self.data.type = type.enter;
                        ok = true;*/
                    } else if (token === KC_ESCAPE) {
                        self.data.type = type.escape;
                        ok = true;
                    }else if (token === KC_T) {
                        var btnpayment = document.getElementsByClassName("button pay");
                        btnpayment[0].click();
                        ok = true;
                    }else if (token === KC_C) {
                        console.log("đã nhấn phím C");
                        var customer = document.getElementsByClassName("button set-customer ");
                        if(customer != null)
                        {
                            customer[0].click();
                        }
                       
                        ok = true;
                    }else if (token === KC_F2 || token === KC_A) {
                        console.log("đã nhấn phím f2 or  a");
                        $('.searchbox:first input').focus();
                        

                        ok = true;

                    }
                     else {
                        self.data.type = undefined;
                        self.data.val = undefined;
                        ok = false;
                    }

                    if (is_number) {
                        if (timeStamp + 50 > new Date().getTime()) {
                            ok = false;
                        }
                    }

                    timeStamp = new Date().getTime();

                    setTimeout(function(){
                        if (ok) {self.action_callback(self.data);}
                    }, 50);
                }
            );
        },

        // stops catching keyboard events
        disconnect: function(){
            $('body').off('keyup', '');
        }
    });

    return {
        Keypad: Keypad
    };
});
