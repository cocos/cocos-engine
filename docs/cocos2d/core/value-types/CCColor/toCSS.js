var color = cc.Color.BLACK;
color.toCSS();          // "#000";
color.toCSS("rgba");    // "rgba(0,0,0,1.00)";
color.toCSS("rgb");     // "rgba(0,0,0)";
color.toCSS("#rgb");    // "#000";
color.toCSS("#rrggbb"); // "#000000";