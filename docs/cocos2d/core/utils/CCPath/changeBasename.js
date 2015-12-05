----------------------------------
cc.path.changeBasename("a/b/c.plist", "b.plist");		//-->"a/b/b.plist"
cc.path.changeBasename("a/b/c.plist?a=1&b=2", "b.plist");	//-->"a/b/b.plist?a=1&b=2"
cc.path.changeBasename("a/b/c.plist", ".png");			//-->"a/b/c.png"
cc.path.changeBasename("a/b/c.plist", "b");			//-->"a/b/b"
cc.path.changeBasename("a/b/c.plist", "b", true);		//-->"a/b/b.plist"
