------------------------------
cc.path.join("a", "b.png");        //-->"a/b.png"
cc.path.join("a", "b", "c.png");   //-->"a/b/c.png"
cc.path.join("a", "b");            //-->"a/b"
cc.path.join("a", "b", "/");       //-->"a/b/"
cc.path.join("a", "b/", "/");      //-->"a/b/"
