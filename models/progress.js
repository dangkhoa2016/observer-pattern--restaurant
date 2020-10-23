class Progress {
  static template_pg = null;
  static template_pg_bar = null;

  #time_to_complete = 1;
  #parts = [];
  #timeout_next = null;
  #button = null;
  #call_back_complete = null;
  #holder = null;
  #html = "Doing...";
  #icon = "fas fa-clipboard-check";
  #element = null;
  #reference = null;

  constructor(options = {}) {
    this.#time_to_complete = (options.time_to_complete || 3) * 1000;
    this.#call_back_complete = options.call_back_complete;
    this.#reference = options.reference;
    if (options.holder) this.#holder = $(options.holder);
    if (options.html && typeof options.html === "string")
      this.#html = options.html;
    if (options.icon && typeof options.icon === "string")
      this.#icon = options.icon;

    this.#parts = Helper.random_progress_test(100);
    this.render();
    this.#do_step();
  }

  #get_time(percent) {
    return (percent * this.#time_to_complete) / 100;
  }

  #complete_part(skip_timeout = false) {
    var t = this;
    var indx = 0;
    if (typeof indx === "number" && indx < t.#parts.length) {
      if (Progress.template_pg_bar && this.#element) {
        var pg_bar = Progress.template_pg_bar({
          color: Helper.random_color_pg(),
          percent: t.#parts[indx]
        });
        this.#element.find(".progress").append(pg_bar);
        t.#parts.splice(indx, 1);
        t.#do_step(skip_timeout);
      }
    }
  }

  #do_step(skip_timeout = false) {
    var t = this;
    if (t.#parts && t.#parts.length > 0) {
      if (skip_timeout) {
        t.#clear_timeout();
        t.#complete_part(skip_timeout);
      } else {
        t.#timeout_next = setTimeout(function() {
          t.#complete_part();
        }, t.#get_time(t.#parts[0]));
      }
    } else {
      t.#call_complete();
    }
  }

  #call_complete() {
    var t = this;
    if (t.#element) {
      t.#element.find(".text-muted").slideUp(function() {
        if (typeof t.#call_back_complete === "function")
          t.#call_back_complete(t, t.#reference);
      });
    } else {
      if (typeof t.#call_back_complete === "function")
        t.#call_back_complete(t, t.#reference);
    }
  }

  destroy() {
    var t = this;
    if (t.#button) t.#button = null;
    if (t.#element) {
      t.#element.remove();
      t.#element = null;
    }
    t.#clear_timeout();
  }

  render() {
    if (Progress.template_pg) {
      var progress = $(
        Progress.template_pg({
          icon: this.#icon,
          html: this.#html
        })
      );

      this.#button = $(".btn-complete", progress);
      this.#button.tooltip({
        template:
          '<div class="bg-tip tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
        placement: "right"
      });

      if (this.#holder) {
        this.#element = progress;
        progress.appendTo(this.#holder);
        this.#bind_click();
      }
    }
  }

  #clear_timeout() {
    var t = this;
    if (t.#timeout_next) {
      clearTimeout(t.#timeout_next);
      t.#timeout_next = null;
    }
  }

  #bind_click() {
    var t = this;
    if (t.#button) {
      t.#button.click(function(e) {
        e.preventDefault();
        t.#button.tooltip("dispose");

        t.#clear_timeout();
        t.#do_step(true);
      });
    }
  }
}
