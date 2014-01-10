if (Object.isUndefined(Proto)) {var Proto = {}}
Proto.Lazy = Class.create({
	initialize: function(options) {
		this.options = options || {};
		$$('img').each(function(el){
			if (!this.withinViewport(el, this.options.offset || 0)) {
				el._src = el.src;
				el.src = this.options.placeHolder || '';
				if (this.options.event === 'click') {
					el.observe('click', function(){
						if (this._src) {
							this.src = this._src; delete this._src;
						}
					})
				}
			}
		}.bind(this));
		if (this.options.event !== 'click') {
			Event.observe(window, 'scroll', this.load.bind(this));
			Event.observe(window, 'resize', this.load.bind(this));
		}
	},
	load: function(el) {
		$$('img').each(function(el){
			if (el._src && this.withinViewport(el, this.options.offset || 0)) { el.src = el._src; delete el._src }
		}.bind(this))
	},
	withinViewport: function(el, offset) {
    	var elOffset = el.cumulativeOffset(),
        	vpOffset = document.viewport.getScrollOffsets(),
        	elDim = el.getDimensions(),
        	vpDim = document.viewport.getDimensions();
    	if (elOffset[1] + elDim.height + offset < vpOffset[1] || 
			elOffset[1] - offset > vpOffset[1] + vpDim.height ||
			elOffset[0] + elDim.width + offset < vpOffset[0]  ||
			elOffset[0] - offset > vpOffset[0] + vpDim.width) {
        	return false;
    	}
    	return true;
	}
})