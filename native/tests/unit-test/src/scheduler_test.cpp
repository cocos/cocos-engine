/****************************************************************************
 Copyright (c) 2024 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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
#include <vector>
#include <chrono>
#include <thread>

#include "base/Scheduler.h"
#include "utils.h"

using namespace cc;

TEST(schedulerTest, performInCocosThreadOrder) {
    auto scheduler = std::make_shared<Scheduler>();
    
    std::vector<int> orderResult;
    
    for (int i = 0; i < 10; ++i) {
        auto task = [&orderResult, i, scheduler](){
            orderResult.emplace_back(i);
            
            if (i == 5) {
                scheduler->performFunctionInCocosThread([&orderResult](){
                    orderResult.emplace_back(10);
                });
                
                scheduler->performFunctionInCocosThread([&orderResult](){
                    orderResult.emplace_back(11);
                });
                
                scheduler->performFunctionInCocosThread([&orderResult](){
                    orderResult.emplace_back(12);
                });
                
                std::this_thread::sleep_for(std::chrono::milliseconds(100));
            }
        };
        scheduler->performFunctionInCocosThread(task);
    }
    
    scheduler->runFunctionsToBePerformedInCocosThread();
    scheduler->runFunctionsToBePerformedInCocosThread();
    
    const std::vector<int> expectedResult{0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12};
    EXPECT_EQ(orderResult, expectedResult);
}
