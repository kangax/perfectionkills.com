document.observe('dom:loaded', function() {
  new Proto.IPS('status', {
    options: [
      {text: 'Available', className: 'on'},
      {text: 'Free for chat', className: 'on'}, 
      {text: 'Gone fishing...', className: 'half'},
      {text: 'Away', className: 'half'},
      {text: 'Not available', className: 'off'}, 
      {text: 'Occupied', className: 'off'}
    ],
    afterCreate: function() {
      // Safari returns width equal to viewport's one, so set it explicitly :/
      // Please don't do this at home
      /*
      if (Prototype.Browser.WebKit) {
        this.input.setStyle({ width: '202px' })
      }
      var origWidth = parseInt(this.input.getStyle('width')),
          calcWidth = this.input.getWidth(),
          dx = calcWidth - origWidth;
      
      alert([this.input.getStyle('padding'), this.input.getStyle('paddingLeft')]);
      
      // make sure padding/borders don't break input element's width
      this.input.setStyle({
        width: origWidth - dx - 2 + 'px'
      })
      */
    },
    afterShow: function() {
      /*
      this.optionsEl.setStyle({
        top: parseInt(this.optionsEl.getStyle('top')) + 2 + 'px',
        width: this.optionsEl.getWidth() - 4 + 'px'
      })
      */
    }
  });
  //new Image().src = 'http://yura.thinkweb2.com/playground/in-place-select/images/stars.png';
})