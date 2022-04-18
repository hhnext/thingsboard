(function () {
  /* #region  function  */

  var regularPolygonPoints = function (sideCount, radius) {
      var sweep = (Math.PI * 2) / sideCount;
      var cx = radius;
      var cy = radius;
      var points = [];
      for (var i = 0; i < sideCount; i++) {
        var x = cx + radius * Math.cos(i * sweep);
        var y = cy + radius * Math.sin(i * sweep);
        points.push({
          x: x,
          y: y,
        });
      }
      return points;
    },
    starPolygonPoints = function (spikeCount, outerRadius, innerRadius) {
      var rot = (Math.PI / 2) * 3;
      var cx = outerRadius;
      var cy = outerRadius;
      var sweep = Math.PI / spikeCount;
      var points = [];
      var angle = 0;

      for (var i = 0; i < spikeCount; i++) {
        var x = cx + Math.cos(angle) * outerRadius;
        var y = cy + Math.sin(angle) * outerRadius;
        points.push({
          x: x,
          y: y,
        });
        angle += sweep;

        x = cx + Math.cos(angle) * innerRadius;
        y = cy + Math.sin(angle) * innerRadius;
        points.push({
          x: x,
          y: y,
        });
        angle += sweep;
      }
      return points;
    };

  //  Arc
  var myDrawArc = function (
      ctx,
      x,
      y,
      rx,
      ry,
      xRotation,
      largeArc,
      counterClockwise,
      ex,
      ey,
      color,
      lineWidth,
      fill
    ) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;

      var str =
        "m" +
        x +
        "," +
        y +
        "a" +
        rx +
        "," +
        ry +
        " " +
        xRotation +
        " " +
        largeArc +
        " " +
        counterClockwise +
        " " +
        ex +
        "," +
        ey +
        "z";
      console.log(str);

      var p = new Path2D(str);

      ctx.stroke(p);
      ctx.fill(p);
    },
    //  Circle
    myDrawCircle = function (ctx, x, y, r, color, lineWidth, fill) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2, true);
      ctx.closePath();
      if (color != null) {
        ctx.stroke();
      }
      if (fill != null) {
        ctx.fill();
      }
    },
    //  Rectangle
    myDrawRectangle = function (
      ctx,
      x,
      y,
      w,
      h,
      color,
      lineWidth,
      fill,
      angle
    ) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;
      ctx.rotate((Math.PI / 180) * angle);
      if (color != null) {
        ctx.strokeRect(x, y, w, h);
      }
      if (fill != null) {
        ctx.fillRect(x, y, w, h);
      }
      // ctx.setTransform(1, 0, 0, 1, 0, 0);
    },
    //  Shape
    myDrawShape = function (ctx, str, color, lineWidth, fill) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;

      var p = new Path2D(str);
      if (color != null) {
        ctx.stroke(p);
      }
      if (fill != null) {
        ctx.fill(p);
      }
    },
    //  PolygonLine
    myDrawPolygonLine = function (
      ctx,
      points,
      color,
      lineWidth,
      fill,
      angle,
      point
    ) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;
      if (typeof point != "undefined") {
        ctx.translate(point.x, point.y);
      }
      ctx.rotate((Math.PI / 180) * angle);
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }

      ctx.stroke();
      ctx.closePath();
      ctx.fill();
    },
    //  Line
    myDrawLine = function (ctx, x0, y0, x1, y1, color, lineWidth) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      // ctx.closePath();
      ctx.stroke();
    },
    // trapezoid
    getTrapezoidPoints = function (x, y, topWidth, buttomWidth, height) {
      var delta = Math.floor((buttomWidth - topWidth) / 2);
      return [
        {
          x: x,
          y: y,
        },
        {
          x: buttomWidth,
          y: y,
        },
        {
          x: delta + topWidth,
          y: -height,
        },
        {
          x: delta,
          y: -height,
        },
        {
          x: x,
          y: y,
        },
      ];
    };

  /* #endregion */

  /* #region  fabric   */

  // fabric.Canvas.prototype.leftButtonPressed=false;
  // console.log('fabric', fabric);
  fabric.Object.prototype.transparentCorners = false;
  // fabric.Object.prototype.borderColor = 'red';
  fabric.Object.prototype.cornerColor = "#006600";
  fabric.Object.prototype.cornerSize = 8;
  fabric.Object.prototype.zIndex = 0;

  fabric.Object.prototype.toObject = (function (_super) {
    return function () {
      // console.log("insert script", this.shapeScript);
      return fabric.util.object.extend(_super.call(this), {
        shapeScript: this.shapeScript || {},
      });
    };
  })(fabric.Object.prototype.toObject);

  // fabric.Text.prototype.toObject = (function (_super) {
  //   return function () {
  //     //  console.log("insert text", this.text);
  //     return fabric.util.object.extend(_super.call(this), {
  //       text: this.text || " ",
  //     });
  //   };
  // })(fabric.Text.prototype.toObject);

  // fabric.Object.prototype.shapeScript = {};

  //  Property
  var CanvasProperty = [
      "type",
      "width",
      "height",
      "fill",
      "stroke",
      "strokeWidth",
      "sideCount",
      "spikeCount",
    ],
    ObjectProperty = [
      "zIndex",
      "left",
      "top",
      "width",
      "height",
      "angle",
      "fill",
      "opacity",
      "type",
      "scaleX",
      "scaleY",
      "stroke",
      "strokeWidth",
    ],
    RectProperty = [],
    CircleProperty = ["radius", "startAngle", "endAngle"],
    EllipseProperty = ["rx", "ry"],
    TriangleProperty = [],
    LineProperty = ["strokeLineCap"],
    TextProperty = [
      "fontFamily",
      "fontSize",
      "fontWeight",
      "textAlign",
      "fontStyle",
      "text",
      "textBackgroundColor",
    ],
    PolygonProperty = [];

  fabric.Object.prototype.baseProperty = ObjectProperty;
  fabric.Canvas.prototype.property = CanvasProperty;
  fabric.Rect.prototype.property = RectProperty;
  fabric.Circle.prototype.property = CircleProperty;
  fabric.Ellipse.prototype.property = EllipseProperty;
  fabric.Triangle.prototype.property = TriangleProperty;
  fabric.Line.prototype.property = LineProperty;
  fabric.Text.prototype.property = TextProperty;
  fabric.Polygon.prototype.property = PolygonProperty;

  //  Thermometer
  fabric.Thermometer = fabric.util.createClass(fabric.Object, {
    type: "Thermometer",

    initialize: function (options) {
      options || (options = {});

      this.callSuper("initialize", options);

      this.set("width", options.width || 40);
      this.set("height", options.height || 160);
      this.set("fill", options.fill || "red");

      this.set("myValue", options.myValue || 20);
      this.set("start", options.start || 0);
      this.set("end", options.end || 100);
      // this.set('label', options.value || '');
    },

    toObject: function () {
      return fabric.util.object.extend(this.callSuper("toObject"), {
        start: this.get("start"),
        end: this.get("end"),
        myValue: this.get("myValue"),
      });
    },

    _render: function (ctx) {
      // this.callSuper('_render', ctx);

      var x = -this.width / 2,
        y = -this.height / 2;
      var deltax = this.width / 3,
        deltay = 20;
      var newWidth = this.width - 2 * deltax,
        newHeight = this.height - 2 * deltay;

      ctx.font = "20px Helvetica";
      ctx.fillStyle = "#333";
      ctx.fillText(this.myValue, -x - 10, -this.height / 2 + 20);

      ctx.lineWidth = this.strokeWidth;
      ctx.strokeStyle = this.stroke;
      var p = new Path2D(
        "m" +
          (x + deltax) +
          "," +
          (y + deltay) +
          "l0," +
          (newHeight - 30) +
          "a" +
          this.width / 3 +
          "," +
          this.width / 3 +
          " 0 1 0 " +
          newWidth +
          ",0l0,-" +
          (newHeight - 30) +
          "a" +
          newWidth / 4 +
          "," +
          newWidth / 2 +
          " 90 0 0 -" +
          newWidth +
          ",0z"
      );
      ctx.stroke(p);

      var lineargradient = ctx.createLinearGradient(x, 0, -x, 0);
      // lineargradient.addColorStop(0, this.fill);
      lineargradient.addColorStop(0.1, "white");
      lineargradient.addColorStop(1, this.fill);

      ctx.fillStyle = lineargradient;

      var origin =
        ((this.myValue - this.start) * (newHeight - 30)) /
        (this.end - this.start);
      var str =
        "m" +
        (x + deltax) +
        "," +
        (y + deltay + newHeight - 30 - origin) +
        "l0," +
        origin +
        "a" +
        this.width / 3 +
        "," +
        this.width / 3 +
        " 0 1 0 " +
        newWidth +
        ",0l0,-" +
        origin +
        "z";

      var currentP = new Path2D(str);
      ctx.fill(currentP);

      // console.log(this.width/3);
    },
  });

  var ThermometerProperty = ["start", "end", "myValue"];
  fabric.Thermometer.prototype.property = ThermometerProperty;

  fabric.Thermometer.fromObject = function (object, callback) {
    console.log("33333333", object);
    return new fabric.Thermometer(object);
  };

  //  Tank
  fabric.Tank = fabric.util.createClass(fabric.Object, {
    type: "Tank",

    initialize: function (options) {
      options || (options = {});

      this.callSuper("initialize", options);

      this.set("width", options.width || 80);
      this.set("height", options.height || 280);
      // this.set("fill", options.fill || "red");

      this.set("start", options.start || 0);
      this.set("end", options.end || 100);
      this.set("myValue", options.myValue || 20);
      this.set("innerColor", options.innerColor || "#00ff00");
      this.set("subType", options.subType || "1");
    },

    // toObject: function() {
    // return fabric.util.object.extend(this.callSuper('toObject'), {
    // label: this.get('label')
    // });
    // },

    _render: function (ctx) {
      var x = -this.width / 2,
        y = -this.height / 2;
      var deltax = 5,
        deltay = 50,
        newWidth = this.width - 2 * deltax,
        newHeight = this.height - 2 * deltay;
      var origin =
        ((this.myValue - this.start) * ((newHeight * 2) / 3)) /
        (this.end - this.start);

      ctx.lineWidth = this.strokeWidth;
      ctx.strokeStyle = this.stroke;

      // var str="m-10,"+(40-origin)+"l0,"+origin+"a20,20 0 1 0 20,0l0,-"+origin+"z";

      var subTypeStr =
        "m" +
        (x + deltax) +
        "," +
        (y + deltay) +
        "l0," +
        (newHeight * 2) / 3 +
        "l" +
        newWidth / 3 +
        ",40l0," +
        newHeight / 3 +
        "l" +
        newWidth / 3 +
        ",0l0,-" +
        newHeight / 3 +
        "l" +
        newWidth / 3 +
        ",-40l0,-" +
        (newHeight * 2) / 3 +
        "a" +
        newWidth / 4 +
        "," +
        newWidth / 2 +
        " 90 0 0 -" +
        newWidth +
        ",0z";
      // var subTypeStr1="m"+(x+20)+","+(y+40+90-origin)+"l0,"+origin+"l70,10l0,-"+(origin+20)+"z";
      var subTypeStr1 =
        "m" +
        (x + 15) +
        "," +
        (y + deltay + (newHeight * 2) / 3 - origin) +
        "l0," +
        origin +
        "l" +
        (newWidth - 20) +
        ",10l0,-" +
        (origin + 20) +
        "z";
      // var subTypeStr2="m"+(x+48)+","+(y+35)+"l-20,30 l 0,15 l 10,5 l -5,20 l 20,30 l 30,-20l-5,-20l5,-10l0 ,-20z";
      var subTypeStr2 =
        "m" +
        (x + 25) +
        "," +
        (y + deltay) +
        "l-10,20 l 0," +
        ((newHeight * 2) / 3 - 75) +
        " l 10,5 l -5,20 l 20,30 l " +
        (newWidth - 50) +
        ",-20l-5,-20l5,-10l0 ,-" +
        ((newHeight * 2) / 3 - 75) +
        "z";

      if (this.subType === "2") {
        origin =
          ((this.myValue - this.start) * newHeight) / (this.end - this.start);

        subTypeStr =
          "m" +
          (x + deltax) +
          "," +
          (y + deltay) +
          "l0," +
          newHeight +
          "a" +
          newWidth / 4 +
          "," +
          newWidth / 2 +
          " 90 0 0 " +
          newWidth +
          ",0l0,-" +
          newHeight +
          "a" +
          newWidth / 4 +
          "," +
          newWidth / 2 +
          " 90 0 0 -" +
          newWidth +
          ",0z";

        subTypeStr1 =
          "m" +
          (x + 15) +
          "," +
          (y + deltay + newHeight - origin) +
          "l0," +
          origin +
          "l" +
          (newWidth - 20) +
          ",10l0,-" +
          (origin + 20) +
          "z";

        subTypeStr2 =
          "m" +
          (x + 25) +
          "," +
          (y + deltay) +
          "l-10,30 l 0," +
          (newHeight - 88) +
          " l 10,5 l -5,20 l 20,30 l " +
          (newWidth - 50) +
          ",-20l-5,-20l5,-10l0 ,-" +
          (newHeight - 88) +
          "z";
      }

      // console.log(subTypeStr,this.subType);

      var lineargradient = ctx.createLinearGradient(x, 0, -x, 0);
      lineargradient.addColorStop(0, this.fill);
      lineargradient.addColorStop(0.5, "white");
      lineargradient.addColorStop(1, this.fill);

      var p = new Path2D(subTypeStr);
      var p1 = new Path2D(subTypeStr1);
      var p2 = new Path2D(subTypeStr2);

      // p2.addPath(p);

      ctx.font = "30px Helvetica";
      ctx.fillStyle = "#333";
      ctx.fillText(this.myValue, x - 40, -80);

      ctx.fillStyle = "000000";
      ctx.fill(p2);

      ctx.globalCompositeOperation = "source-atop";

      ctx.fillStyle = this.innerColor;
      ctx.fill(p1);

      ctx.globalCompositeOperation = "destination-over";

      ctx.stroke(p);
      ctx.fillStyle = lineargradient;
      ctx.fill(p);

      ctx.globalCompositeOperation = "source-over";
    },
  });

  fabric.Tank.fromObject = function (object, callback) {
    return new fabric.Tank(object);
  };

  var TankProperty = ["start", "end", "subType", "innerColor", "myValue"];
  fabric.Tank.prototype.property = TankProperty;

  //  Lamp
  fabric.Lamp = fabric.util.createClass(fabric.Object, {
    type: "Lamp",

    initialize: function (options) {
      options || (options = {});

      this.callSuper("initialize", options);

      this.set("width", options.width || 40);
      this.set("height", options.height || 120);
      this.set("fill", options.fill || "#C0C0C0");

      this.set("myValue", options.myValue || true);
      this.set("subType", options.subType || "1");
      this.set("poleColor", options.poleColor || "#3CB371");
      this.set(
        "myRadius",
        options.myRadius || Math.min(this.width, this.height) / 1.5
      );
    },

    // toObject: function() {
    // return fabric.util.object.extend(this.callSuper('toObject'), {
    // label: this.get('label')
    // });
    // },

    _render: function (ctx) {
      var x = this.width / 2,
        y = this.height / 2,
        deltax = 5,
        deltay = 5;

      if (this.subType === "1") {
        var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 40);
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(1, "#404040");
        myDrawCircle(
          ctx,
          0,
          0,
          this.myRadius,
          this.stroke,
          this.strokeWidth,
          gradient
        );

        gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 35);
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(1, this.poleColor);
        myDrawCircle(
          ctx,
          0,
          0,
          this.myRadius - 5,
          this.stroke,
          this.strokeWidth,
          gradient
        );

        this.height = this.width = this.myRadius * 2;
      } else if (this.subType === "2") {
      }
    },
  });

  fabric.Lamp.fromObject = function (object, callback) {
    return new fabric.Lamp(object);
  };

  var LampProperty = ["subType", "myValue", "poleColor", "myRadius"];
  fabric.Lamp.prototype.property = LampProperty;

  //  Switch
  fabric.Switch = fabric.util.createClass(fabric.Object, {
    type: "Switch",

    initialize: function (options) {
      options || (options = {});

      this.callSuper("initialize", options);

      this.set("width", options.width || 160)
        .set("height", options.height || 80)
        .set("fill", options.fill || "#606060");

      this.set("myValue", options.myValue || true);
      this.set("subType", options.subType || "1");
      this.set("poleColor", options.poleColor || "#3CB371");
    },

    // toObject: function() {
    // return fabric.util.object.extend(this.callSuper('toObject'), {
    // label: this.get('label')
    // });
    // },

    _render: function (ctx) {
      if (this.subType === "1") {
        ctx.font = "20px Helvetica";
        ctx.fillStyle = "#3CB371";
        ctx.fillText("Start", -55, 75);
        ctx.fillStyle = "#800000";
        ctx.fillText("Stop", 10, 75);
        var angle = 35;
        if (!this.myValue) {
          angle = -35;
        }
        // console.log(angle,this.myValue);
        myDrawCircle(ctx, 0, 0, 40, this.stroke, this.strokeWidth, this.fill);
        myDrawRectangle(
          ctx,
          -5,
          -5,
          10,
          65,
          this.stroke,
          this.strokeWidth,
          this.poleColor,
          angle
        );
        myDrawCircle(ctx, 0, 0, 2, "#FFFFF0", 2, "#FF0000");
      } else if (this.subType === "2") {
      }
    },
  });

  fabric.Switch.fromObject = function (object, callback) {
    return new fabric.Switch(object);
  };

  var SwitchProperty = ["subType", "myValue", "poleColor"];
  fabric.Switch.prototype.property = SwitchProperty;

  //  Motor
  fabric.Motor = fabric.util.createClass(fabric.Object, {
    type: "Motor",

    initialize: function (options) {
      options || (options = {});

      this.callSuper("initialize", options);

      this.set("width", options.width || 160)
        .set("height", options.height || 80)
        .set("fill", options.fill || "black")
        .set("myValue", options.myValue || true)
        .set("subType", options.subType || "2")
        .set("tail", options.tail || true)
        .set("lines", options.tail || true)
        .set(
          "diameter",
          options.diameter || Math.min(this.width, this.height) / 4
        )
        .set("pipeColor", options.pipeColor || "#000000");
    },

    // toObject: function() {
    // return fabric.util.object.extend(this.callSuper('toObject'), {
    // label: this.get('label')
    // });
    // },

    _render: function (ctx) {
      var str = "";
      var lineargradient = ctx.createLinearGradient(0, -40, 0, 40);
      lineargradient.addColorStop(0, this.fill);
      lineargradient.addColorStop(0.5, "white");
      lineargradient.addColorStop(1, this.fill);

      if (this.subType === "1") {
        str = "m-50,-25l100,0l8,10l0,30l-8,10l-100,0a50,50 90 0 1 0,-50z";

        myDrawShape(ctx, str, this.stroke, this.strokeWidth, lineargradient);

        myDrawRectangle(
          ctx,
          59,
          -5,
          15,
          10,
          this.stroke,
          this.strokeWidth,
          this.lineargradient,
          0
        );

        if (this.tail) {
          myDrawRectangle(
            ctx,
            -73,
            -8,
            15,
            16,
            this.stroke,
            this.strokeWidth,
            this.lineargradient,
            0
          );
        }

        if (this.lines) {
          ctx.beginPath();
          ctx.strokeStyle = "#A9A9A9";

          for (var i = 0; i < 6; i++) {
            ctx.moveTo(-45, 16 - 6 * i);
            ctx.lineTo(45, 16 - 6 * i);
          }
        }

        ctx.stroke();
      } else if (this.subType === "2") {
        ctx.save();
        lineargradient = ctx.createLinearGradient(0, -40, 0, 40);
        lineargradient.addColorStop(0, this.pipeColor);
        lineargradient.addColorStop(0.5, "white");
        lineargradient.addColorStop(1, this.pipeColor);
        ctx.translate((-this.diameter * 3) / 4, 0);
        ctx.rotate(-Math.PI / 2);
        this.height = this.width = this.diameter * 4;
        str =
          "m0,-" +
          this.diameter / 2 +
          "a" +
          this.diameter / 2 +
          "," +
          this.diameter / 4 +
          " 90 0 0 0," +
          this.diameter +
          "l" +
          (this.diameter * 7) / 4 +
          ",0l0,-" +
          this.diameter +
          "z";
        myDrawShape(ctx, str, this.stroke, this.strokeWidth, lineargradient);
        myDrawRectangle(
          ctx,
          (this.diameter * 7) / 4,
          (-this.diameter * 5) / 8,
          (this.diameter * 1) / 4,
          (this.diameter * 10) / 8,
          this.stroke,
          this.strokeWidth,
          lineargradient,
          0
        );
        ctx.rotate(Math.PI / 2);
        ctx.translate((this.diameter * 3) / 4, 0);
        ctx.fillStyle = this.fill;
        ctx.beginPath();
        ctx.arc(0, 0, (this.diameter * 5) / 4, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        this.height = this.width = this.diameter * 4;
        str =
          "m0,-" +
          this.diameter / 2 +
          "a" +
          this.diameter / 2 +
          "," +
          this.diameter / 4 +
          " 90 0 0 0," +
          this.diameter +
          "l" +
          (this.diameter * 7) / 4 +
          ",0l0,-" +
          this.diameter +
          "z";
        myDrawShape(ctx, str, this.stroke, this.strokeWidth, lineargradient);
        myDrawRectangle(
          ctx,
          (this.diameter * 7) / 4,
          (-this.diameter * 5) / 8,
          (this.diameter * 1) / 4,
          (this.diameter * 10) / 8,
          this.stroke,
          this.strokeWidth,
          lineargradient,
          0
        );
        ctx.restore();
      }
    },
  });

  fabric.Motor.fromObject = function (object, callback) {
    return new fabric.Motor(object);
  };

  var MotorProperty = ["subType", "myValue", "lines", "tail", "diameter"];
  fabric.Motor.prototype.property = MotorProperty;

  //  Fan
  fabric.Fan = fabric.util.createClass(fabric.Object, {
    type: "Fan",

    initialize: function (options) {
      options || (options = {});

      this.callSuper("initialize", options);

      this.set("width", options.width || 100)
        .set("height", options.height || 100)
        .set("$myValue", options.myValue || false)
        .set("subType", options.subType || "1")
        .set("speed", options.speed || 1);

      Object.defineProperty(this, "myValue", {
        get: function () {
          console.log("getter");
          return this.$myValue;
        },
        set: function (state) {
          console.log("setter", state);
          if (this.$myValue !== state) {
            this.$myValue = state;
            if (state) {
              this.clock = setInterval(() => {
                this.angle += 5;
                if (this.angle >= 360) return 0;
              }, this.speed * 20);
            } else {
              clearInterval(this.clock);
            }
          }
        },
      });
    },

    toObject: function () {
      return fabric.util.object.extend(this.callSuper("toObject"), {
        // start: this.get("start"),
        speed: this.get("speed"),
        $myValue: this.get("$myValue"),
      });
    },

    _render: function (ctx) {
      var x = this.width / 2,
        y = this.height / 2;
      var deltax = 5,
        deltay = 5,
        radius = Math.min(x - deltax, y - deltay);

      var gradient = ctx.createRadialGradient(0, 0, 90, 0, 0, 120);
      gradient.addColorStop(0, "#ffffff");
      // gradient.addColorStop(1, this.fill);

      myDrawCircle(ctx, 0, 0, 100, gradient, this.strokeWidth, "#ff0000");

      var str =
        "m0,0c1,-32 -14,-67 -30,-60c-53,6 -58,39 -62,63c28,-17 68,-10 60,28l37,8l-5,-39z";

      myDrawShape(ctx, str, null, this.strokeWidth, this.fill);
      ctx.rotate((Math.PI / 180) * 120);
      // str="m0,0c1,-32 -14,-67 -30,-60c-53,6 -58,39 -62,63c28,-17 68,-10 60,28l37,8l-5,-39z";
      myDrawShape(ctx, str, null, this.strokeWidth, this.fill);
      ctx.rotate((Math.PI / 180) * 120);
      myDrawShape(ctx, str, null, this.strokeWidth, this.fill);

      this.originX = "center";
      this.originY = "center";

      // gradient = ctx.createRadialGradient(0,0,0,0,0,15);
      // gradient.addColorStop(0,"#ffffff");
      // gradient.addColorStop(1,this.fill);
      // myDrawCircle(ctx,0,0,15,null,this.strokeWidth,gradient);
    },
  });

  fabric.Fan.fromObject = function (object, callback) {
    return new fabric.Fan(object);
  };

  var FanProperty = ["subType", "myValue"];
  fabric.Fan.prototype.property = FanProperty;

  //  Pipe
  fabric.Pipe = fabric.util.createClass(fabric.Object, {
    type: "Pipe",
    offset: 0,

    initialize: function (options) {
      options || (options = {});

      this.callSuper("initialize", options);

      this.set("width", options.width || 100)
        .set("height", options.height || 30)
        .set("fill", options.fill || "black");

      this.set("myValue", options.myValue || true);
      this.set("subType", options.subType || "1");
      this.set("diameter", options.diameter || this.height);
      this.set("innerLineColor", options.innerLineColor || "#0000ff");
      this.set("direction", options.direction || 0);
    },

    toObject: function () {
      return fabric.util.object.extend(this.callSuper("toObject"), {
        subType: this.get("subType"),
      });
    },

    _render: function (ctx) {
      var x = -this.width / 2,
        y = -this.height / 2;
      var str = "";

      var lineargradient = ctx.createLinearGradient(
        0,
        -this.diameter / 2,
        0,
        this.diameter / 2
      );
      lineargradient.addColorStop(0, this.fill);
      lineargradient.addColorStop(0.5, "white");
      // lineargradient.addColorStop(0.75, 'white');
      lineargradient.addColorStop(1, this.fill);

      if (this.subType === "1") {
        this.height = this.width = this.diameter * 2;
        str =
          "m-" +
          this.diameter +
          ",0l0," +
          this.diameter +
          "l" +
          this.width +
          ",0l-" +
          this.diameter +
          ",-" +
          this.diameter +
          "z";

        lineargradient = ctx.createLinearGradient(0, 0, 0, this.diameter);
        lineargradient.addColorStop(0, this.fill);
        lineargradient.addColorStop(0.5, "white");
        lineargradient.addColorStop(1, this.fill);
        myDrawShape(ctx, str, null, this.strokeWidth, lineargradient);

        str =
          "m0,0l0,-" +
          this.diameter +
          "l" +
          this.diameter +
          ",0l0," +
          this.height +
          "z";
        lineargradient = ctx.createLinearGradient(0, 0, this.diameter, 0);
        lineargradient.addColorStop(0, this.fill);
        lineargradient.addColorStop(0.5, "white");
        lineargradient.addColorStop(1, this.fill);
        myDrawShape(ctx, str, null, this.strokeWidth, lineargradient);
      } else if (this.subType === "2") {
        // var offset = 5;
        // 13641071925
        this.height = this.diameter;
        str =
          "m" +
          x +
          "," +
          y +
          "l0," +
          this.diameter +
          "l" +
          this.width +
          ",0l0" +
          ",-" +
          this.diameter +
          "z";
        // console.log(str);
        myDrawShape(ctx, str, null, this.strokeWidth, lineargradient);

        // function draw() {
        ctx.setLineDash([10, 10]);
        ctx.lineDashOffset = -this.offset;
        // str="m"+x+","+(y+this.diameter/2)+"l"+this.width+",0";
        // myDrawShape(ctx,str,this.stroke,this.diameter/5,null);
        myDrawLine(
          ctx,
          x,
          y + this.diameter / 2,
          x + this.width,
          y + this.diameter / 2,
          this.innerLineColor,
          this.diameter / 5
        );
        // }
        // ctx.restore();
        ctx.setLineDash([]);
        // setInterval(function march() {
        // offset++;
        // if (offset > 16) {
        // offset = 0;
        // }
        // draw();
        // setTimeout(march, 20);
        // }

        // march();

        // str="m"+x+","+y+"l"+this.width+",0";
        // myDrawShape(ctx,str,this.stroke,this.strokeWidth,null);

        // str="m"+x+","+(y+this.diameter)+"l"+this.width+",0";
        // myDrawShape(ctx,str,this.stroke,this.strokeWidth,null);
      } else if (this.subType === "3") {
        this.height = this.width = this.diameter * 3;
        var width = this.width / 2,
          height = this.height / 2;

        str =
          "m-" +
          height +
          ",-" +
          this.diameter / 2 +
          "l" +
          this.diameter +
          ",0l" +
          this.diameter / 2 +
          "," +
          this.diameter / 2 +
          "l-" +
          this.diameter / 2 +
          "," +
          this.diameter / 2 +
          "l-" +
          this.diameter +
          ",0z";

        myDrawShape(ctx, str, null, this.strokeWidth, lineargradient);

        lineargradient = ctx.createLinearGradient(
          -this.diameter / 2,
          0,
          this.diameter / 2,
          0
        );
        lineargradient.addColorStop(0, this.fill);
        lineargradient.addColorStop(0.5, "white");
        lineargradient.addColorStop(1, this.fill);

        str =
          "m-" +
          this.diameter / 2 +
          ",-" +
          height +
          "l0," +
          this.diameter +
          "l" +
          this.diameter / 2 +
          "," +
          this.diameter / 2 +
          "l-" +
          this.diameter / 2 +
          "," +
          this.diameter / 2 +
          "l0," +
          this.diameter +
          "l" +
          this.diameter +
          ",0l0,-" +
          this.height +
          "z";

        myDrawShape(ctx, str, null, this.strokeWidth, lineargradient);
      } else if (this.subType === "4") {
        this.height = this.width = this.diameter * 3;
        var width = this.width / 2,
          height = this.height / 2;

        str =
          "m-" +
          width +
          ",-" +
          this.diameter / 2 +
          "l" +
          this.diameter +
          ",0l" +
          this.diameter / 2 +
          "," +
          this.diameter / 2 +
          "l" +
          this.diameter / 2 +
          ",-" +
          this.diameter / 2 +
          "l" +
          this.diameter +
          ",0l0," +
          this.diameter +
          "l-" +
          this.diameter +
          ",0l-" +
          this.diameter / 2 +
          ",-" +
          this.diameter / 2 +
          "l-" +
          this.diameter / 2 +
          "," +
          this.diameter / 2 +
          "l-" +
          this.diameter +
          ",0z";
        // console.log(str);
        myDrawShape(ctx, str, null, this.strokeWidth, lineargradient);

        lineargradient = ctx.createLinearGradient(
          -this.diameter / 2,
          0,
          this.diameter / 2,
          0
        );
        lineargradient.addColorStop(0, this.fill);
        lineargradient.addColorStop(0.5, "white");
        lineargradient.addColorStop(1, this.fill);

        str =
          "m-" +
          this.diameter / 2 +
          ",-" +
          height +
          "l0," +
          this.diameter +
          "l" +
          this.diameter / 2 +
          "," +
          this.diameter / 2 +
          "l-" +
          this.diameter / 2 +
          "," +
          this.diameter / 2 +
          "l0," +
          this.diameter +
          "l" +
          this.diameter +
          ",0l0,-" +
          this.diameter +
          "l-" +
          this.diameter / 2 +
          ",-" +
          this.diameter / 2 +
          "l" +
          this.diameter / 2 +
          ",-" +
          this.diameter / 2 +
          "l0,-" +
          this.diameter +
          "z";

        myDrawShape(ctx, str, null, this.strokeWidth, lineargradient);
      }
      this.setCoords();
    },
  });

  fabric.Pipe.fromObject = function (object, callback) {
    return new fabric.Pipe(object);
  };

  var PipeProperty = [
    "subType",
    "myValue",
    "diameter",
    "direction",
    "innerLineColor",
  ];
  fabric.Pipe.prototype.shapeScript = {
    // offset: "function () {	if (offset > 16)  return  0; return offset++;	  }	",
  };
  fabric.Pipe.prototype.property = PipeProperty;

  //  Dashboard
  fabric.Dashboard = fabric.util.createClass(fabric.Object, {
    type: "Dashboard",

    initialize: function (options) {
      options || (options = {});

      this.callSuper("initialize", options);

      this.set("width", options.width || 160)
        .set("height", options.height || 80)
        .set("fill", options.fill || "black");

      this.set("myValue", options.myValue || 45);
      this.set("subType", options.subType || "1");
      this.set("diameter", options.diameter || this.height);
      this.set("runColor", options.runColor || "#006400");

      this.set("startValue", options.startValue || 0);
      this.set("endValue", options.endValue || 100);
    },

    // toObject: function() {
    // return fabric.util.object.extend(this.callSuper('toObject'), {
    // label: this.get('label')
    // });
    // },

    _render: function (ctx) {
      var x = -this.width / 2,
        y = -this.height / 2;
      var str = "";

      var lineargradient = ctx.createLinearGradient(
        0,
        -this.diameter / 2,
        0,
        this.diameter / 2
      );
      lineargradient.addColorStop(0, this.fill);
      lineargradient.addColorStop(0.5, "white");
      // lineargradient.addColorStop(0.75, 'white');
      lineargradient.addColorStop(1, this.fill);

      if (this.subType === "1") {
        var radius = this.diameter / 2;
        this.height = this.width = this.diameter;
        ctx.save();
        ctx.translate(0, 0);
        // ctx.scale(0.4,0.4);
        // ctx.rotate(Math.PI/2);

        ctx.fillStyle = "#333";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        ctx.save();
        // ctx.font = '15px Helvetica';
        ctx.rotate((90 * Math.PI) / 180);
        for (var i = 0; i < 11; i++) {
          ctx.beginPath();
          ctx.rotate((Math.PI * 30) / 180);
          ctx.moveTo(radius, 0);
          ctx.lineTo(radius * 1.2, 0);
          // ctx.fillText(i, 80, 0);
          ctx.stroke();
        }
        ctx.restore();

        ctx.save();
        ctx.rotate((120 * Math.PI) / 180);
        ctx.lineWidth = 1;
        for (i = 0; i < 50; i++) {
          if (i % 5 != 0) {
            ctx.beginPath();
            ctx.moveTo(radius * 1.05, 0);
            ctx.lineTo(radius * 1.2, 0);
            ctx.stroke();
          }
          ctx.rotate(Math.PI / 30);
        }
        ctx.restore();

        ctx.save();
        ctx.rotate((120 * Math.PI) / 180);
        ctx.strokeStyle = "#D40000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rotate((this.myValue * Math.PI) / 60);
        ctx.moveTo(-radius * 0.1, 0);
        ctx.lineTo(radius * 0.9, 0);
        ctx.stroke();
        ctx.arc(0, 0, 5, 0, Math.PI * 2, true);
        ctx.fillStyle = "#D40000";
        ctx.fill();
        ctx.restore();

        ctx.font = radius * 0.3 + "px Helvetica";
        ctx.fillText(this.myValue, -radius * 0.2, radius * 0.5);

        ctx.font = radius * 0.2 + "px Helvetica";
        ctx.fillStyle = "#0000ff";
        for (var i = 0; i < 11; i++) {
          if (i < 5)
            ctx.fillText(
              i * 10,
              -(radius * 0.9) * Math.cos(((60 - i * 30) * Math.PI) / 180) -
                radius * 0.05,
              radius * 0.8 * Math.sin(((60 - i * 30) * Math.PI) / 180) +
                radius * 0.05
            );
          else if (i === 5)
            ctx.fillText(
              i * 10,
              -(radius * 0.9) * Math.cos(((60 - i * 30) * Math.PI) / 180) -
                radius * 0.1,
              radius * 0.8 * Math.sin(((60 - i * 30) * Math.PI) / 180)
            );
          else
            ctx.fillText(
              i * 10,
              -(radius * 0.9) * Math.cos(((60 - i * 30) * Math.PI) / 180) -
                radius * 0.1,
              radius * 0.8 * Math.sin(((60 - i * 30) * Math.PI) / 180) +
                radius * 0.05
            );
          console.log();
        }

        ctx.strokeStyle = "#D40000";
        ctx.beginPath();
        ctx.arc(
          0,
          0,
          radius * 1.2,
          (120 * Math.PI) / 180,
          (420 * Math.PI) / 180,
          false
        );
        ctx.stroke();

        ctx.restore();
      } else if (this.subType === "2") {
        this.height = this.diameter / 2;
        this.width = this.height * 2;
        ctx.save();
        ctx.translate(0, (this.diameter * 1) / 4);

        ctx.font = this.diameter * 0.3 + "px Helvetica";
        ctx.fillText(this.myValue, -this.diameter * 0.16, 0);

        ctx.lineWidth = this.diameter * 0.3;

        ctx.beginPath();
        ctx.strokeStyle = this.fill;
        ctx.arc(0, 0, (this.diameter * 1) / 2, Math.PI, Math.PI * 2, false);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = this.runColor;
        ctx.arc(
          0,
          0,
          (this.diameter * 1) / 2,
          Math.PI,
          (Math.PI * (this.endValue - this.startValue + this.myValue)) /
            (this.endValue - this.startValue),
          false
        );
        ctx.stroke();

        ctx.font = this.diameter * 0.2 + "px Helvetica";
        ctx.fillText(this.startValue, -this.diameter * 0.9, 0);
        ctx.fillText(this.endValue, this.diameter * 0.65, 0);

        ctx.restore();
      } else if (this.subType === "3") {
      } else if (this.subType === "4") {
      }
      this.setCoords();
    },
  });

  fabric.Dashboard.fromObject = function (object, callback) {
    return new fabric.Dashboard(object);
  };

  var DashboardProperty = [
    "subType",
    "myValue",
    "diameter",
    "runColor",
    "startValue",
    "endValue",
  ];
  fabric.Dashboard.prototype.property = DashboardProperty;

  //  Valve
  fabric.Valve = fabric.util.createClass(fabric.Object, {
    type: "Valve",

    initialize: function (options) {
      options || (options = {});

      this.callSuper("initialize", options);
      this.set("width", options.width || 180)
        .set("height", options.height || 100)
        .set("fill", options.fill || "black");
      this.set("myValue", options.myValue || true);
      this.set("subType", options.subType || "1");
      this.set("valveColor", options.valveColor || "#0000ff");
      this.set("diameter", options.diameter || this.height);
    },

    // toObject: function() {
    // return fabric.util.object.extend(this.callSuper('toObject'), {
    // label: this.get('label')
    // });
    // },

    _render: function (ctx) {
      var x = -this.width / 2,
        y = -this.height / 2;
      var str = "";

      var lineargradient = ctx.createLinearGradient(
        0,
        this.height / 10,
        0,
        this.height / 2
      );
      lineargradient.addColorStop(0, this.fill);
      lineargradient.addColorStop(0.5, "white");
      lineargradient.addColorStop(1, this.fill);

      if (this.subType === "1") {
        ctx.save();
        // ctx.translate(0,0);
        // ctx.scale(0.4,0.4);
        // ctx.rotate(Math.PI/2);

        ctx.fillStyle = "#333";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        // ctx.lineCap = "round";

        myDrawRectangle(
          ctx,
          x,
          this.height / 10,
          (this.width * 5) / 8,
          (this.height * 2) / 5,
          null,
          this.strokeWidth,
          lineargradient,
          0
        );
        myDrawRectangle(
          ctx,
          x + this.width / 32,
          this.height / 20,
          (this.width * 3) / 32,
          (this.height * 1) / 2,
          this.stroke,
          this.strokeWidth,
          lineargradient,
          0
        );

        lineargradient = ctx.createLinearGradient(
          (-this.width * 3) / 8,
          0,
          0,
          0
        );
        lineargradient.addColorStop(0, this.fill);
        lineargradient.addColorStop(0.5, "white");
        lineargradient.addColorStop(1, this.fill);
        myDrawRectangle(
          ctx,
          (-this.width * 5) / 16,
          -this.height / 10,
          (this.width * 4) / 16,
          (this.height * 1) / 5,
          null,
          this.strokeWidth,
          lineargradient,
          0
        );
        myDrawRectangle(
          ctx,
          (-this.width * 3) / 8,
          (-this.height * 3) / 10,
          (this.width * 6) / 16,
          (this.height * 1) / 5,
          null,
          this.strokeWidth,
          lineargradient,
          0
        );
        var str =
          "m-" +
          (this.width * 3) / 32 +
          ",-" +
          (this.height * 3) / 10 +
          "l" +
          (this.width * 3) / 32 +
          ",0l" +
          this.width / 16 +
          ",-" +
          this.height / 20 +
          "l" +
          (this.width * 7) / 16 +
          ",0l0,-" +
          this.height / 10 +
          "l-" +
          (this.width * 7) / 16 +
          ",0z";

        myDrawShape(ctx, str, this.stroke, this.strokeWidth, "#006400");

        ctx.restore();
      } else if (this.subType === "2") {
        this.height = this.width = this.diameter * 2;
        ctx.save();
        lineargradient = ctx.createLinearGradient(0, 0, 0, this.diameter);
        lineargradient.addColorStop(0, this.fill);
        lineargradient.addColorStop(0.5, "white");
        lineargradient.addColorStop(1, this.fill);
        myDrawRectangle(
          ctx,
          x,
          0,
          (this.diameter * 1) / 2,
          (this.diameter * 1) / 1,
          null,
          this.strokeWidth,
          lineargradient,
          0
        );
        myDrawRectangle(
          ctx,
          this.diameter / 2,
          0,
          (this.diameter * 1) / 2,
          (this.diameter * 1) / 1,
          null,
          this.strokeWidth,
          lineargradient,
          0
        );

        lineargradient = ctx.createLinearGradient(
          (-this.diameter * 1) / 2,
          0,
          (this.diameter * 1) / 2,
          0
        );
        lineargradient.addColorStop(0, this.fill);
        lineargradient.addColorStop(0.5, "white");
        lineargradient.addColorStop(1, this.fill);

        myDrawRectangle(
          ctx,
          -this.diameter / 2,
          (this.diameter * 1) / 4,
          (this.diameter * 1) / 1,
          (this.diameter * 1) / 2,
          null,
          this.strokeWidth,
          lineargradient,
          0
        );
        myDrawRectangle(
          ctx,
          -this.diameter / 4,
          (-this.diameter * 1) / 4,
          (this.diameter * 1) / 2,
          (this.diameter * 2) / 4,
          null,
          this.strokeWidth,
          lineargradient,
          0
        );
        lineargradient = ctx.createLinearGradient(
          (-this.diameter * 1) / 2,
          0,
          (this.diameter * 1) / 2,
          0
        );
        lineargradient.addColorStop(0, this.valveColor);
        lineargradient.addColorStop(0.5, "white");
        lineargradient.addColorStop(1, this.valveColor);
        myDrawRectangle(
          ctx,
          (-this.diameter * 4) / 8,
          (-this.diameter * 1) / 1,
          (this.diameter * 8) / 8,
          (this.diameter * 3) / 4,
          null,
          this.strokeWidth,
          lineargradient,
          0
        );

        ctx.restore();
      } else if (this.subType === "3") {
        this.height = this.width = this.diameter * 2;
        ctx.save();
        lineargradient = ctx.createLinearGradient(0, 0, 0, this.diameter);
        lineargradient.addColorStop(0, this.fill);
        lineargradient.addColorStop(0.5, "white");
        lineargradient.addColorStop(1, this.fill);
        myDrawRectangle(
          ctx,
          x,
          0,
          (this.diameter * 1) / 2,
          (this.diameter * 1) / 1,
          null,
          this.strokeWidth,
          lineargradient,
          0
        );
        myDrawRectangle(
          ctx,
          this.diameter / 2,
          0,
          (this.diameter * 1) / 2,
          (this.diameter * 1) / 1,
          null,
          this.strokeWidth,
          lineargradient,
          0
        );

        lineargradient = ctx.createLinearGradient(
          (-this.diameter * 1) / 2,
          0,
          (this.diameter * 1) / 2,
          0
        );
        lineargradient.addColorStop(0, this.fill);
        lineargradient.addColorStop(0.5, "white");
        lineargradient.addColorStop(1, this.fill);

        myDrawRectangle(
          ctx,
          -this.diameter / 2,
          (this.diameter * 1) / 4,
          (this.diameter * 1) / 1,
          (this.diameter * 1) / 2,
          null,
          this.strokeWidth,
          lineargradient,
          0
        );
        myDrawRectangle(
          ctx,
          -this.diameter / 4,
          (-this.diameter * 1) / 4,
          (this.diameter * 1) / 2,
          (this.diameter * 2) / 4,
          null,
          this.strokeWidth,
          lineargradient,
          0
        );
        lineargradient = ctx.createLinearGradient(
          (-this.diameter * 1) / 2,
          0,
          (this.diameter * 1) / 2,
          0
        );
        lineargradient.addColorStop(0, this.valveColor);
        lineargradient.addColorStop(0.5, "white");
        lineargradient.addColorStop(1, this.valveColor);
        ctx.fillStyle = lineargradient;
        ctx.beginPath();
        ctx.arc(
          0,
          (-this.diameter * 1) / 4,
          (this.diameter * 3) / 4,
          (180 * Math.PI) / 180,
          (360 * Math.PI) / 180,
          false
        );
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (this.subType === "4") {
      }
      this.setCoords();
    },
  });

  fabric.Valve.fromObject = function (object, callback) {
    return new fabric.Valve(object);
  };

  var ValveProperty = ["subType", "myValue", "valveColor", "diameter"];
  fabric.Valve.prototype.property = ValveProperty;

  //  Hexagon
  fabric.Hexagon = fabric.util.createClass(fabric.Polygon, {
    type: "Hexagon",

    initialize: function (options) {
      options || (options = {});
      this.callSuper("initialize", options);
      this.set("sideCount", options.sideCount || 5);
    },
    _render: function (ctx) {
      this.callSuper("_render", ctx);
    },
  });

  var HexagonProperty = ["sideCount"];
  fabric.Hexagon.prototype.property = HexagonProperty;
  fabric.Hexagon.fromObject = function (object, callback) {
    return new fabric.Hexagon(object);
  };

  //  StarPolygon
  fabric.StarPolygon = fabric.util.createClass(fabric.Polygon, {
    type: "StarPolygon",

    initialize: function (options) {
      options || (options = {});
      this.callSuper("initialize", options);
      this.set("spikeCount", options.spikeCount || 5);
    },
    _render: function (ctx) {
      this.callSuper("_render", ctx);
    },
  });

  var StarPolygonProperty = ["spikeCount"];
  fabric.StarPolygon.prototype.property = StarPolygonProperty;

  fabric.StarPolygon.fromObject = function (object, callback) {
    return new fabric.StarPolygon(object);
  };

  /* #endregion */
})();

class HtavGauge {
  constructor(canvasElement) {
    this.canvas = new fabric.Canvas(canvasElement);
    this.canvas.backgroundColor = "rgba(150, 150, 150, 0.1)";
    this.canvas.activeTool = "Pointer";
    this.canvas.isActiveObjectGroup = "blank"; //  blank ,object , groupObject , activeGroup
    this.canvas.strokeWidth = 2;
    this.canvas.stroke = "#FFCC00";
    this.canvas.fill = "#33CCCC";
    this.canvas.sideCount = 5;
    this.canvas.spikeCount = 5;
    this.canvas.type = "canvas";

    /* #region  mock data  */

    var text1 = "() => {  if ($242 < 50) return false;else return true ; }";
    var text2 = "() => {  if ($242 < 50) return \"green\";else return \"red\" ; }";
    

    var lamp = new fabric.Lamp({
      radius: 60,
      fill: "green",
      left: 35,
      top: 55,
    });
    lamp.shapeScript = {
      poleColor: text2,
    };
    this.canvas.add(lamp);
    // var text = new fabric.Text("0", {
    //   left: 20,
    //   top: 20,
    //   // stroke: "#c3bfbf",
    //   // strokeWidth: 3,
    //   // fontFamily: "Comic Sans",
    //   // fontWeight: "normal",
    //   // fontStyle: "italic",
    // });
    // text.shapeScript = {
    //   text: text1,
    // };
    // this.canvas.add(text);
    var thermometer = new fabric.Thermometer({
      left: -8,
      top: 0,
    });
    thermometer.shapeScript = {
      myValue: "$242",
    };
    this.canvas.add(thermometer);
    var tank = new fabric.Tank({
      left: 110,
      top: -15,
    });
    tank.shapeScript = {
      myValue: "$242",
    };
    this.canvas.add(tank);
    var fan = new fabric.Fan({
      left: 0,
      top: 300,
    });
    fan.shapeScript = {
      myValue: text1,
    };
    this.canvas.add(fan);
    // console.log(fan, typeof fan);

    var mot = new fabric.Motor({
      left: 20,
      top: 140,
    });
    this.canvas.add(mot);

    var valve = new fabric.Valve({
      left: 200,
      top: 200,
    });
    this.canvas.add(valve);

    var dashboard = new fabric.Dashboard({
      left: 300,
      top: 20,
    });
    dashboard.shapeScript = {
      myValue: "$242",
    };
    this.canvas.add(dashboard);

    var toggleSwitch = new fabric.Switch({
      left: 163,
      top: 12,
    });
    this.canvas.add(toggleSwitch);

    var pipe = new fabric.Pipe({
      left: 200,
      top: 140,
      subType: "2",
      width: 160,
      height: 40,
    });
    this.canvas.add(pipe);

    var pipe2 = new fabric.Pipe({
      left: 100,
      top: 20,
      subType: "1",
      width: 20,
      height: 20,
    });
    this.canvas.add(pipe2);

    var pipe4 = new fabric.Pipe({
      left: 100,
      top: 20,
      subType: "4",
      width: 14,
      height: 14,
    });
    this.canvas.add(pipe4);

    var pipe3 = new fabric.Pipe({
      left: 100,
      top: 20,
      subType: "3",
      width: 14,
      height: 14,
    });
    this.canvas.add(pipe3);

    this.jsonData = JSON.stringify(this.canvas);

    console.log(this.jsonData);

    /* #endregion  mock data  */

    this.jsonData='{"objects":[{"type":"Lamp","originX":"left","originY":"top","left":107,"top":36.02,"width":71.11,"height":71.11,"fill":"green","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"shapeScript":{"poleColor":"() => {  if ($242 <50) return \'green\';else return \'red\' ; }"}},{"type":"Thermometer","originX":"left","originY":"top","left":13,"top":3,"width":40,"height":160,"fill":"red","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1.8,"scaleY":1.8,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"shapeScript":{"myValue":"$242"},"start":0,"end":100,"myValue":-11.99},{"type":"Tank","originX":"left","originY":"top","left":250,"top":-19,"width":80,"height":280,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"shapeScript":{"myValue":"$242"}},{"type":"Fan","originX":"center","originY":"center","left":464.59,"top":129.55,"width":100,"height":100,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.83,"scaleY":0.83,"angle":10400,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"shapeScript":{"myValue":"() => {  if ($242 < 50) return false;else return true ; }"},"speed":1,"$myValue":false},{"type":"Motor","originX":"left","originY":"top","left":2,"top":300,"width":80,"height":80,"fill":"black","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1.68,"scaleY":1.68,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"shapeScript":{}},{"type":"Valve","originX":"left","originY":"top","left":434,"top":283.92,"width":180,"height":100,"fill":"black","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"shapeScript":{}},{"type":"Dashboard","originX":"left","originY":"top","left":621.73,"top":39.98,"width":80,"height":80,"fill":"black","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":2.03,"scaleY":2.03,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"shapeScript":{"myValue":"$242"}},{"type":"Switch","originX":"left","originY":"top","left":72,"top":135,"width":160,"height":80,"fill":"#606060","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1.05,"scaleY":1.05,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"shapeScript":{}},{"type":"Pipe","originX":"left","originY":"top","left":563,"top":342.8,"width":160,"height":40,"fill":"black","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"shapeScript":{},"subType":"2"},{"type":"Pipe","originX":"left","originY":"top","left":734.21,"top":303,"width":80,"height":80,"fill":"black","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.5,"scaleY":0.5,"angle":0.28,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"shapeScript":{},"subType":"1"},{"type":"Pipe","originX":"left","originY":"top","left":295,"top":302.73,"width":126,"height":126,"fill":"black","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.33,"scaleY":0.33,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"shapeScript":{},"subType":"4"},{"type":"Pipe","originX":"left","originY":"top","left":283.49,"top":305.21,"width":126,"height":126,"fill":"black","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.33,"scaleY":0.33,"angle":89.54,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"shapeScript":{},"subType":"3"}],"background":"rgba(150, 150, 150, 0.1)"}';

    this.canvasData = {};
    this.canvasDataScript = {};
  }

  loadCanvasData(canvasData) {
    this.canvas.clear();
    if (canvasData) this.jsonData = canvasData;
    console.log(this.jsonData);
    this.canvas.loadFromJSON(this.jsonData, () => {
      this.canvas.renderAll();
    });

    // console.log(
    //   "================",
    //   this.canvas.item(4),
    //   typeof this.canvas.item(4),
    //   this.canvas.item(4).myValue,
    //   typeof this.canvas.item(4).myValue
    // );

    // this.canvas.item(4).myValue = true;

    // console.log(text1, color1);
    this.getVarScriptMap();

    setInterval(() => {
      this.canvas.renderAll();
    }, 100);
  }

  onRun() {
    var t = 10;
    setInterval(() => {
      if (t < 80)
        this.setData({
          241: (t = t + 1),
          242: t,
        });
      else t = 20;
    }, 1000);
  }

  setData(newData) {
    var newData, newValue;
    // console.log('newDataArray', newDataArray);
    var oldData = this.canvasData;
    console.log(oldData);
    var re = /\$[\d]+/g;
    // var index = newDataArray.length;

    // while (index--) {
    // newData = newDataArray[index];
    for (var key in newData) {
      newValue = newData[key];
      console.log("key:", key, "newValue:", newValue);
      if (newValue === oldData[key]) {
        continue;
      }
      oldData[key] = newValue;

      var script = this.canvasDataScript[key];
      // console.log(this.canvasDataScript);
      if (script) {
        for (var num = 0; num < script.length; num++) {
          var scriptContent = script[num].replace(re, newValue);
          console.log(num, newValue, scriptContent);

          // new Function(scriptContent);
          (() => {
            eval(scriptContent);
          })();
        }
      }
    }
    // }
    this.canvas.renderAll();
  }

  getVarScriptMap() {
    var key,
      script,
      scriptValues,
      scriptContent,
      newScriptValues,
      newScriptValue,
      re;
    // this.canvasData.splice(0, this.canvasData.length);
    // this.canvasDataScript.splice(0, this.canvasDataScript.length);

    this.canvasData = {};
    this.canvasDataScript = {};

    for (let i = 0, length = this.canvas.size(); i < length; i++) {
      script = this.canvas.item(i).shapeScript;
      console.log(this.canvas.item(i), script);
      // var scriptKeys = Object.keys(script);
      for (key in script) {
        console.log(key, script[key]);
        re = /\$[\d]+/g;
        scriptValues = script[key].match(re);
        // var scriptContent=script[key].replace(re,'__value');
        scriptContent = script[key];
        scriptContent =
          "this.canvas.item(" +
          i +
          ").set('" +
          key +
          "'," +
          scriptContent +
          ").setCoords()";
        console.log(scriptValues, scriptContent);
        if (scriptValues != null) {
          newScriptValues = scriptValues.filter(
            (v, i, a) => a.indexOf(v) === i
          );
          // console.log(newScriptValues);
          for (
            let j = 0, newScriptValuesLength = newScriptValues.length;
            j < newScriptValuesLength;
            j++
          ) {
            newScriptValue = newScriptValues[j].slice(1);
            // console.log(item, typeof this.canvasDataScript[0]);
            if (typeof this.canvasDataScript[newScriptValue] === "undefined") {
              // console.log('jjj');
              this.canvasDataScript[newScriptValue] = [];
              this.canvasData[newScriptValue] = 0;
            }
            // if (typeof this.canvasDataScript[item]['p' + item[1]] === 'undefined') {
            //   this.canvasDataScript[item[0]]['p' + item[1]] = [];
            //   this.canvasData[item[0]]['p' + item[1]] = 0;
            //   console.log(this.canvasDataScript[item[0]]);
            // }
            this.canvasDataScript[newScriptValue].push(scriptContent);
            console.log(newScriptValue, this.canvasDataScript[newScriptValue]);
          }
        } else {
          console.log(scriptContent);
        }
      }
    }

    console.log(this.canvasDataScript);
    console.log(this.canvasData);
  }
}
