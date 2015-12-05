---------------------------------
* unix
cc.path.driname("a/b/c.png");		//-->"a/b"
cc.path.driname("a/b/c.png?a=1&b=2");	//-->"a/b"
cc.path.dirname("a/b/");		//-->"a/b"
cc.path.dirname("c.png");		//-->""
* windows
cc.path.driname("a\\b\\c.png");		//-->"a\b"
cc.path.driname("a\\b\\c.png?a=1&b=2");	//-->"a\b"
