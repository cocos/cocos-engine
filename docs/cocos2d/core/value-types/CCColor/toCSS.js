var color = cc.Color.BLACK;
color.toCSS();          // return "#000";
color.toCSS("rgba");    // return "rgba(0,0,0,1.00)";
color.toCSS("rgb");     // return "rgba(0,0,0)";
color.toCSS("#rgb");    // return "#000";
color.toCSS("#rrggbb"); // return "#000000";