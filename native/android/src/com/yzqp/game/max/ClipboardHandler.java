/*
 * Copyright (C) 2012 Arink Verma 
 *  
 * This program is free software; you can redistribute it and/or 
 * modify it under the terms of the GNU General Public License as 
 * published by the Free Software Foundation; either version 2 of the 
 * License, or (at your option) any later version. 
 *  
 * This program is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU 
 * General Public License for more details. 
 *  
 * You should have received a copy of the GNU General Public License 
 * along with this program; if not, write to the Free Software 
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 
 * 02111-1307, USA. 
 */
 
package com.yzqp.game.max;
 
import android.annotation.TargetApi; 
import android.app.Activity; 
import android.content.ClipData; 
import android.content.ClipboardManager; 
import android.content.Context;
import android.view.WindowManager;

@TargetApi(11) 
public class ClipboardHandler { 
 public static Activity activity;
 public static String tmpstr;

 public static void Init(Activity context){
  activity = context;

 }


 @SuppressWarnings("deprecation") 
 public static void  putText(final String text){

  Runnable runnable = new Runnable() {
   public void run() {
    int sdk = android.os.Build.VERSION.SDK_INT;
    if(sdk < 11) {
     android.text.ClipboardManager clipboard = (android.text.ClipboardManager) activity.getSystemService(Context.CLIPBOARD_SERVICE);
     clipboard.setText(text);
    } else {
     System.out.println("baihua2001cn"+ Context.CLIPBOARD_SERVICE);
     ClipboardManager  clipboard = (ClipboardManager) activity.getSystemService(Context.CLIPBOARD_SERVICE);
     android.content.ClipData clip = ClipData.newPlainText("simple text",text);
     clipboard.setPrimaryClip(clip);
    }
   }
  };
  activity.runOnUiThread(runnable);
 }



 @SuppressWarnings("deprecation") 
 public static String getText(){

  activity.runOnUiThread(

   new Runnable(){
       String text = "";
       public void run() {

    int sdk = android.os.Build.VERSION.SDK_INT;
    if(sdk < 11) {
     android.text.ClipboardManager clipboard = (android.text.ClipboardManager) activity.getSystemService(Context.CLIPBOARD_SERVICE);
     tmpstr =  clipboard.getText().toString();
    } else {
     android.content.ClipboardManager clipboard = (android.content.ClipboardManager) activity.getSystemService(Context.CLIPBOARD_SERVICE);
     if(clipboard.getText()!=null){
      tmpstr =  clipboard.getText().toString();
     }
    }

    //System.out.println("baihua2001cn  " + tmpstr);

   }

  });

     System.out.println("baihua2001cn  " + tmpstr);
  return tmpstr;
 };

}