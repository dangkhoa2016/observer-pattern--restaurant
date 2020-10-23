class Food {
  static template = null;
  static #id_increase = 0;
  #parent = null;
  #button = null;
  #element = null;
  #active_class = "";
  #class_name = "";
  #inactive_class = `far fa-square`;
  color = null;
  #bg_color = "";
  #hover_color = "";
  #not_select_text = "Not select";
  #selected_text = "Selected";

  constructor(parent, data) {
    this.name = data["name"] ? data["name"] : data;
    this.#parent = $(parent);
    Food.#id_increase += 1;
    this.id = Food.#id_increase;
    this.#get_color();

    this.#class_name = `food-color-${this.id}`;
    this.#active_class = `fa fa-check-square ${this.#class_name}`;

    this.#register_style();
  }

  #get_color() {
    var color = Helper.random_color();
    var bg_color = Helper.color_shade(color.bg, 40);
    var hover_color = Helper.color_shade(color.bg, 80);
    while (
      hover_color.toLowerCase() === "#fff" ||
      hover_color.toLowerCase() === "#ffffff" ||
      bg_color.toLowerCase() === "#fff" ||
      bg_color.toLowerCase() === "#ffffff"
    ) {
      color = Helper.random_color();
      bg_color = Helper.color_shade(color.bg, 40);
      hover_color = Helper.color_shade(color.bg, 80);
    }

    this.color = color;
    this.#bg_color = bg_color;
    this.#hover_color = hover_color;
  }

  #register_style() {
    var style = $(`<style type="text/css" id="food-style-${this.id}"></style>`);
    var class_name = "." + this.#class_name;
    var arr_style = [];
    /*
    arr_style.push(
      `${class_name} { background-color: ${this.bg_color}; border-color: ${this.bg_color}; }`
    );
    arr_style.push(
      `${class_name}:hover { background-color: ${this.#hover_color}; border-color: ${this.#hover_color}; }`
    );
    */
    arr_style.push(
      `${class_name}.focus { box-shadow: 0 0 0 0.2rem ${Helper.hex_to_rgba(
        this.color.bg,
        ".25"
      )} !important; }`
    );
    style.text(arr_style.join("\r\n")).appendTo($("head"));
  }

  is_selected() {
    return this.#button.hasClass("focus");
  }

  #bind_click() {
    var t = this;
    var btn = t.#button;
    var elem = t.#element;
    if (btn) {
      btn.click(function(e) {
        e.preventDefault();

        t.set_state(!btn.hasClass("focus"));
      });
    }
  }

  set_state(is_selected = false) {
    var t = this;
    var btn = t.#button;
    var elem = t.#element;
    var status = elem.find(".food-status");
    if (is_selected) {
      btn.addClass("focus");
      status.addClass(t.#active_class).removeClass(t.#inactive_class);
      elem.find("label").text(t.#selected_text);
    } else {
      btn.removeClass("focus");
      status.removeClass(t.#active_class).addClass(t.#inactive_class);
      elem.find("label").text(t.#not_select_text);
    }
  }

  render() {
    if (Food.template) {
      var html = Food.template({
        name: this.name,
        status_class: this.#inactive_class,
        class_name: this.#class_name,
        status: this.#not_select_text
      });

      this.#element = $(html);
      this.#button = this.#element.find(".btn").addClass(this.color.css);
      this.#bind_click();
      if (this.#parent.length > 0) {
        this.#parent.append(this.#element);
      }
    }
  }
}
