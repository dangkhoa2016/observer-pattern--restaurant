class Helper {
  static #food_colors = [
    { css: "bg-secondary text-white", bg: "#6c757d" },
    { css: "bg-secondary2 text-white", bg: "#9a9fa4" },
    { css: "bg-secondary3 text-white", bg: "#767779" },
    { css: "bg-secondary4 text-white", bg: "#c5c5c5" },
    { css: "bg-dark text-white", bg: "#343a40" }
  ];
  static #progress_colors = [
    { css: "bg-primary text-white", bg: "#007bff" },
    { css: "bg-secondary text-white", bg: "#6c757d" },
    { css: "bg-success text-white", bg: "#28a745" },
    { css: "bg-danger text-white", bg: "#dc3545" },
    { css: "bg-warning text-dark", bg: "#ffc107" },
    { css: "bg-info text-white", bg: "#17a2b8" },
    { css: "bg-dark text-white", bg: "#343a40" }
  ];
  static #color_index = -1;
  static #color_pg_index = -1;


  static shuffle() {
    this.#shuffle_array(this.#progress_colors);
    this.#shuffle_array(this.#food_colors);
  }

  /* Randomize array in-place using Durstenfeld shuffle algorithm */
  static #shuffle_array(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  static random_color() {
    if (this.#color_index > this.#food_colors.length - 1)
      this.#color_index = -1;

    this.#color_index += 1;

    var color = this.#food_colors[this.#color_index];
    if (!color) return this.random_color();
    else return color;
  }

  static random_color_pg() {
    if (this.#color_pg_index > this.#progress_colors.length - 1)
      this.#color_pg_index = -1;

    this.#color_pg_index += 1;
    var n = Math.floor(Math.random() * 3);
    if (n > 0) {
      var is_negative = Math.floor(Math.random() * 100) > 50;
      if (is_negative) n = 0 - n;
    }
    var color = this.#progress_colors[this.#color_pg_index];
    if (!color) return this.random_color_pg();
    else return this.color_shade(color.bg, 40 * n);
  }

  static random_color_core() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  static hex_to_rgba(str, dec) {
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/gi.test(str)) {
      var hex = str.substr(1);
      hex = hex.length == 3 ? hex.replace(/(.)/g, "$1$1") : hex;
      var rgb = parseInt(hex, 16);
      return (
        "rgb(" +
        [(rgb >> 16) & 255, (rgb >> 8) & 255, rgb & 255].join(",") +
        ", " +
        dec +
        ")"
      );
    }

    return false;
  }

  static rgb_to_hex(red, green, blue) {
    var out = "#";

    for (var i = 0; i < 3; ++i) {
      var n =
        typeof arguments[i] == "number" ? arguments[i] : parseInt(arguments[i]);

      if (isNaN(n) || n < 0 || n > 255) {
        return false;
      }

      out += (n < 16 ? "0" : "") + n.toString(16);
    }
    return out;
  }

  static color_shade(col, amt) {
    col = col.replace(/^#/, "");
    if (col.length === 3)
      col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];

    let [r, g, b] = col.match(/.{2}/g);
    [r, g, b] = [
      parseInt(r, 16) + amt,
      parseInt(g, 16) + amt,
      parseInt(b, 16) + amt
    ];

    r = Math.max(Math.min(255, r), 0).toString(16);
    g = Math.max(Math.min(255, g), 0).toString(16);
    b = Math.max(Math.min(255, b), 0).toString(16);

    const rr = (r.length < 2 ? "0" : "") + r;
    const gg = (g.length < 2 ? "0" : "") + g;
    const bb = (b.length < 2 ? "0" : "") + b;

    return `#${rr}${gg}${bb}`;
  }

  static random_progress_test(number) {
    var arr = [];
    while (number > 0) {
      var s = Math.round(Math.random() * number);
      if (s > 0) {
        arr.push(s);
        number -= s;
      }
    }
    return arr;
  }
}
