---------------------------------
cc.path.basename("a/b.png");			//-->"b.png"
cc.path.basename("a/b.png?a=1&b=2");		//-->"b.png"
cc.path.basename("a/b.png", ".png");		//-->"b"
cc.path.basename("a/b.png?a=1&b=2", ".png");	//-->"b"
cc.path.basename("a/b.png", ".txt");		//-->"b.png"
