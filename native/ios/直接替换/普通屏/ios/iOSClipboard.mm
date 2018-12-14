//
//  iOSClipboard.m
//  Clipboard
//
//  Created by 智华信 on 2017/4/18.
//  Copyright © 2017年 智华信. All rights reserved.
//


#include "iOSClipboard.h"
#import <Foundation/Foundation.h>

void iOSClipboard::copy(std::string str) {
    //把string类型转换成为char*
    char*p=(char*)str.data();
    
    //把char*转换成OC的NSString
    NSString *nsMessage= [[NSString alloc] initWithCString:p encoding:NSUTF8StringEncoding];
    
    //获得iOS的剪切板
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    
    //改变剪切板的内容
    pasteboard.string = nsMessage;
}
