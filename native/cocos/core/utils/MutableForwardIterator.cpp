#include "core/utils/MutableForwardIterator.h"

namespace cc {

}

#if UNIT_TEST

void MutableForwardIteratorTest() {
    using namespace cc;

    std::vector<int>            myarr{1, 2, 3, 43, 4, 5};
    MutableForwardIterator<int> iter{myarr};

    iter.fastRemoveAt(2);
    iter.fastRemove(43);
    iter.push(123);
    iter.push(100);
    iter.fastRemove(123);

    for (iter.i = 0; iter.i < static_cast<int32_t>(myarr.size()); ++iter.i) {
        auto &&item = myarr[iter.i];
        printf("item[%d]=%d\n", iter.i, item);
    }

    int a = 0;
}

#endif
