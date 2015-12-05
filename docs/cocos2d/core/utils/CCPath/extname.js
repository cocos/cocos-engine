---------------------------
cc.path.extname("a/b.png");		//-->".png"
cc.path.extname("a/b.png?a=1&b=2");	//-->".png"
cc.path.extname("a/b");			//-->null
cc.path.extname("a/b?a=1&b=2");		//-->null
