var Notifier = Class.create({

    _events: [[window, 'scroll'], [window, 'resize'], [document, 'mousemove'], [document, 'keydown']],
    _timer: null,
    _idleTime: null,

    initialize: function(time) {
        this.time = time;

        this.initObservers();
        this.setTimer();
    },

    initObservers: function() {
        this._events.each(function(e) {
            Event.observe(e[0], e[1], this.onInterrupt.bind(this))
        }.bind(this))
    },

    onInterrupt: function(e) {
        document.fire('state:active', { idleTime: new Date() - this._idleTime });
        this.setTimer();
    },

    setTimer: function() {
        clearTimeout(this._timer);
        this._idleTime = new Date();
        this._timer = setTimeout(function() {
            document.fire('state:idle');
        }, this.time)
    }
})