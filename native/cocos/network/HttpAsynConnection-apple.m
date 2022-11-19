/****************************************************************************
 Copyright (c) 2013-2017 Chukong Technologies Inc.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#if (CC_PLATFORM == CC_PLATFORM_MACOS) || (CC_PLATFORM == CC_PLATFORM_IOS)

    #import "network/HttpAsynConnection-apple.h"

@interface HttpAsynConnection ()

@property (readwrite) NSString *statusString;

- (BOOL)shouldTrustProtectionSpace:(NSURLProtectionSpace *)protectionSpace;

@end

@implementation HttpAsynConnection

@synthesize srcURL = srcURL;
@synthesize sslFile = sslFile;
@synthesize responseHeader = responseHeader;
@synthesize responseData = responseData;
@synthesize getDataTime = getDataTime;
@synthesize responseCode = responseCode;
@synthesize statusString = statusString;
@synthesize responseError = responseError;
@synthesize connError = connError;
@synthesize task = task;
@synthesize finish = finish;
@synthesize runLoop = runLoop;

- (void)dealloc {
    [srcURL release];
    [sslFile release];
    [responseHeader release];
    [responseData release];
    [responseError release];
    [runLoop release];
    [connError release];
    [super dealloc];
}

- (void)startRequest:(NSURLRequest *)request {
    #ifdef CC_DEBUG
        // NSLog(@"Starting to load %@", srcURL);
    #endif

    finish = false;

    self.responseData = [NSMutableData data];
    getDataTime = 0;

    self.responseError = nil;
    self.connError = nil;

    session = [NSURLSession sharedSession];

    task = [session dataTaskWithRequest:request
                      completionHandler:^(NSData *data, NSURLResponse *response, NSError *_Nullable error) {
                          if (error != nil) {
                              self.connError = error;
                              finish = true;
                              return;
                          }
                          if (response != nil) {
    #ifdef CC_DEBUG
                // NSLog(@"Received response from request to url %@", srcURL);
    #endif
                              NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
                              //NSLog(@"All headers = %@", [httpResponse allHeaderFields]);
                              self.responseHeader = [httpResponse allHeaderFields];

                              responseCode = httpResponse.statusCode;
                              self.statusString = [NSHTTPURLResponse localizedStringForStatusCode:responseCode];
                              if (responseCode == 200)
                                  self.statusString = @"OK";

                              /*The individual values of the numeric status codes defined for HTTP/1.1
             | "200"  ; OK
             | "201"  ; Created
             | "202"  ; Accepted
             | "203"  ; Non-Authoritative Information
             | "204"  ; No Content
             | "205"  ; Reset Content
             | "206"  ; Partial Content
             */
                              if (responseCode < 200 || responseCode >= 300) { // something went wrong, abort the whole thing
                                  self.responseError = [NSError errorWithDomain:@"CCBackendDomain"
                                                                           code:responseCode
                                                                       userInfo:@{NSLocalizedDescriptionKey : @"Bad HTTP Response Code"}];
                              }

                              [responseData setLength:0];
                          }

                          if (data != nil) {
                              [responseData appendData:data];
                              getDataTime++;
                          }

                          finish = true;
                      }];
    [task resume];
}

//Server evaluates client's certificate
- (BOOL)shouldTrustProtectionSpace:(NSURLProtectionSpace *)protectionSpace {
    if (sslFile == nil)
        return YES;
    //load the bundle client certificate
    NSString *certPath = [[NSBundle mainBundle] pathForResource:sslFile ofType:@"der"];
    NSData *certData = [[NSData alloc] initWithContentsOfFile:certPath];
    CFDataRef certDataRef = (CFDataRef)certData;
    SecCertificateRef cert = SecCertificateCreateWithData(NULL, certDataRef);

    //Establish a chain of trust anchored on our bundled certificate
    CFArrayRef certArrayRef = CFArrayCreate(NULL, (void *)&cert, 1, NULL);
    SecTrustRef serverTrust = protectionSpace.serverTrust;
    SecTrustSetAnchorCertificates(serverTrust, certArrayRef);

    //Verify that trust
    SecTrustResultType trustResult;
    SecTrustEvaluate(serverTrust, &trustResult);

    if (trustResult == kSecTrustResultRecoverableTrustFailure) {
        CFDataRef errDataRef = SecTrustCopyExceptions(serverTrust);
        SecTrustSetExceptions(serverTrust, errDataRef);
        SecTrustEvaluate(serverTrust, &trustResult);
        CFRelease(errDataRef);
    }
    [certData release];
    if (cert) {
        CFRelease(cert);
    }
    if (certArrayRef) {
        CFRelease(certArrayRef);
    }
    //Did our custom trust chain evaluate successfully?
    return trustResult == kSecTrustResultUnspecified || trustResult == kSecTrustResultProceed;
}

- (void)URLSession:(NSURLSession *)session didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge
      completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition disposition, NSURLCredential *_Nullable credential))completionHandler {
    id<NSURLAuthenticationChallengeSender> sender = challenge.sender;
    NSURLProtectionSpace *protectionSpace = challenge.protectionSpace;

    //Should server trust client?
    if ([self shouldTrustProtectionSpace:protectionSpace]) {
        SecTrustRef trust = [protectionSpace serverTrust];
        //
        //        SecCertificateRef certificate = SecTrustGetCertificateAtIndex(trust, 0);
        //
        //        NSData *serverCertificateData = (NSData*)SecCertificateCopyData(certificate);
        //        NSString *serverCertificateDataHash = [[serverCertificateData base64EncodedString] ]
        NSURLCredential *credential = [NSURLCredential credentialForTrust:trust];
        completionHandler(NSURLSessionAuthChallengeUseCredential, credential);
    } else {
        completionHandler(NSURLSessionAuthChallengeCancelAuthenticationChallenge, nil);
    }
}

@end

#endif // #if (CC_PLATFORM == CC_PLATFORM_MACOS) || (CC_PLATFORM == CC_PLATFORM_IOS)
