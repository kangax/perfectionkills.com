/**
 * @author          Juriy Zaytsev
 * @version         0.2
 * @requires        prototype.js (1.6)
 * @license         MIT
 * @last_modified   12/25/07
 */

if (Object.isUndefined(Proto)) { var Proto = { } };

Proto.IPS = Class.create({
  
  initialize: function(container) {
    
    var e = Prototype.emptyFunction;
    
    this.config = Object.extend({
      beforeShow: e, afterShow: e, beforeUpdate: e,
      afterUpdate: e, afterCreate: e
    }, arguments[1] || { });
    
    this.container = $(container);
    this.options = [];
    this.active = false;
    
    this.build();
    this.buildList();
    
    this.element.update(this.options[0].text);
    
    this.config.afterCreate.call(this);
    
    this.initMouseEvents();
    this.initKeyEvents();
  },
  
  build: function() {
    
    this.container.insert(
      this.wrapper = new Element('div', {className: 'ips_wrapper'})
        .insert(this.element = new Element('div', {
          className: 'ips_text'
        }))
        .insert(this.trigger = new Element('div', {
          className: 'ips_trigger'
        }).update('<span>▼</span>'))
        .insert(this.input = new Element('input', {
          type: 'text',
          className: 'ips_input hidden'
        }))
    )
     
    /*
    <div class="ips_wrapper">
      <div class="ips_text"></div>
      <div class="ips_trigger">▼</div>
      <input type="text" class="ips_input" style="display:none"></input>
    </div>
    
    */
  },
  
  buildList: function() {
    
    this.optionsEl = new Element('ul', {className: 'ips_options_list'});
    
    this.config.options.each(function(option) {
      this.optionsEl.insert(new Element('li', {
        className: option.className || ''
      }).update(option.text));
      this.options.push(option);
    }.bind(this));
    
    this.wrapper.insert(this.optionsEl.hide());
  },
  
  initMouseEvents: function() {
    
    this.wrapper
      .observe('mouseover', Element.addClassName.bind(this, this.wrapper, 'over'))
      .observe('mouseout', function() {
        if (this.active) return;
        this.wrapper.removeClassName('over');
      }.bind(this))
      .observe('click', function(e) {
        this[e.findElement('.ips_trigger') ? 'showOptions' : 'showInput']();
      }.bind(this))
    
    this.trigger
      .observe('mouseover', Element.addClassName.bind(this, this.trigger, 'over'))
      .observe('mouseout', function() {
        if (this.active) return;
        this.trigger.removeClassName('over');
      }.bind(this))
    
    document.observe('click', function(e) {
      if (this.active && !e.findElement('.ips_wrapper'))
        this.save($F(this.input));
    }.bind(this))
    
    if (!this.optionsEl) return;
    
    this.optionsEl
      .observe('click', function(e) {
        e.stop();
        this.save(e.element().innerHTML);
      }.bind(this))
      .observe('mouseover', function(e) {
        if (e.target.tagName.toLowerCase() != 'li') return;
         this.optionsEl.select('li').invoke('removeClassName', 'over');
         e.target.addClassName('over');
      }.bind(this))
    
    this.input
      .observe('focus', this.showInput.bind(this))
      .observe('blur', this.hide.bind(this))
  },
  
  initKeyEvents: function() {
    var selected, next, prev;
    document.observe('keyup', function(e) {
      if (e.keyCode == Event.KEY_ESC)
        this.hide();
      if (e.keyCode == Event.KEY_RETURN)
        this.save($F(this.input));
      /*if (e.keyCode == Event.KEY_DOWN) {
        selected = this.optionsEl.down('.over');
        
        this.optionsEl.select('li').invoke('removeClassName', 'over');
        if (var next = selected.next()) {
          next.addClassName('over');
        }
        else {
          this.optionsEl.down().addClassName('over')
        }
      }*/
    }.bind(this))
  },
  
  showInput: function() {
    if (!this.input.hasClassName('hidden')) return;
    this.input.setValue(this.element.innerHTML).removeClassName('hidden').activate();
    this.active = true;
  },
  
  hide: function() {
    this.input.addClassName('hidden');
    this.optionsEl.hide();
    this.active = false;
    this.wrapper.removeClassName('over');
    this.trigger.removeClassName('over');
  },
  
  save: function(value) {
    this.config.beforeUpdate.call(this, value);
    var exists = this.options.any(function(option){ 
      return option.text == value;
    })
    if (!exists && !value.blank()) {
      this.addOption({text: value});
    }
    if (!value.blank()) {
      this.element.update(value);
      this.config.afterUpdate.call(this, value);
    }
    this.hide();
  },
  
  showOptions: function() {
    
    if (!this.optionsEl) return;
    
    if (this.optionsEl.visible()) {
      this.optionsEl.hide();
      this.active = false;
      return;
    }  
    
    this.config.beforeShow.call(this);
    
    this.optionsEl.show();
    this.active = true;
    
    this.config.afterShow.call(this);
  },
  
  addOption: function(option) {
    this.options.push(option);
    this.optionsEl.insert({
      top: new Element('li', {className: option.className || ''}).update(option.text)
    });
  }
})