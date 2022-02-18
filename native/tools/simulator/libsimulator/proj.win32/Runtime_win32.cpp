/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


#include <io.h>
#include <direct.h>
#include <stdio.h>
#include <vector>
#include <string>
#include <winsock2.h>
#include <ws2tcpip.h>
#pragma  comment(lib,"ws2_32.lib")

#include "runtime/ConfigParser.h"
using namespace std;

string getIPAddress()
{
    WSADATA wsaData;  
    char name[155]={0};
    char ip[16];
	struct addrinfo hints;
	struct addrinfo *res = nullptr;
	int ret;
	struct sockaddr_in *addr;

    // customized by user
    auto &bindAddress = ConfigParser::getInstance()->getBindAddress();
    if (!bindAddress.empty())
    {
        return bindAddress;
    }

	memset(ip, 0, sizeof(ip));
    if ( WSAStartup( MAKEWORD(2,0), &wsaData ) == 0 )   
    {  
		memset(&hints, 0, sizeof(struct addrinfo));
		hints.ai_family = AF_INET; /* Allow IPv4 */
		hints.ai_flags = AI_PASSIVE; /* For wildcard IP address */
		hints.ai_protocol = 0; /* Any protocol */
		hints.ai_socktype = SOCK_STREAM;

		ret = getaddrinfo(name, NULL, &hints, &res);
		if (ret == 0 && res)
        { 
			addr = (struct sockaddr_in *)res->ai_addr;
			inet_ntop(AF_INET, &addr->sin_addr, ip, 16);
        }   
        WSACleanup( );
    }   
    return ip;
}
