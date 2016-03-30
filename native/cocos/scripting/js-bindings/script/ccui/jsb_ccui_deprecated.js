/*
 * Copyright (c) 2013-2016 Chukong Technologies Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// Deprecated functions

var cc = cc || {};

(function() {
    ccui.Text.prototype.setText = function(text){
        this.setString(text || "");
    };

    ccui.Text.prototype.getStringValue = function(){
        return this.getString();
    };

    ccui.TextField.prototype.setText = function(text){
        this.setString(text || "");
    };

    ccui.TextField.prototype.getStringValue = function(){
        return this.getString();
    };

    ccui.ListView.prototype.requestRefreshView = function() {
    	this.forceDoLayout();
    };

    ccui.ListView.prototype.refreshView = function() {
    	this.forceDoLayout();
    };

    ccui.PageView.prototype.addWidgetToPage = function(widget, pageIdx, forceCreate) {
        this.insertPage(widget, pageIdx);
    };

    ccui.PageView.prototype.getCurPageIndex = function() {
        return this.getCurrentPageIndex();
    };

    ccui.PageView.prototype.setCurPageIndex = function(index) {
        this.setCurrentPageIndex(index);
    };

    ccui.PageView.prototype.getPages = function() {
        return this.getItems();
    };

    ccui.PageView.prototype.getPage = function(index) {
        return this.getItem(index);
    };

    ccui.PageView.prototype.setCustomScrollThreshold = function(threshold) {
        
    };

    ccui.PageView.prototype.getCustomScrollThreshold = function() {
        return 0;
    };

    ccui.PageView.prototype.setUsingCustomScrollThreshold = function(threshold) {
        
    };

    ccui.PageView.prototype.isUsingCustomScrollThreshold = function() {
        return false;
    };

    ccui.CheckBox.prototype.setSelectedState = function(selected) {
        this.setSelected(selected);
    };

    ccui.CheckBox.prototype.getSelectedState = function() {
        return this.isSelected();
    }

})();
