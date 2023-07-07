#include "SkinEntry.h"
using namespace spine;

SkinEntry::SkinEntry(size_t slotIndex, const spine::String& name, spine::Attachment* attachment) {
    this->_slotIndex = slotIndex;
    this->_name = name;
    this->_attachment = attachment;
}

SkinEntry::~SkinEntry() {

}