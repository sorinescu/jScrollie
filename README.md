jScrollie is a lightweight jQuery plugin that allows you to skin your scroll bars. I wrote it because most of the js scroll bar solutions I had seen felt sluggish and non-native. jScrollie works by pushing the original scroll bar behind a div with overflow-x set to hidden, which lets you maintain your original scrolling mechanism. A "fake", HTML-based scroll bar is then generated and placed where the user expects the original scroll bar to appear.

jScrollie is based almost entirely on http://code.google.com/p/scrollbarpaper/

You can see a demo here: http://joevennix.github.com/jScrollie/

Fork info
=========

The original jScrollie doesn't support embedded scrollbars (i.e. it only works on the 'body' element).
This version aims to fix this.

Version Log
===========

 *  April 26, 2011: v0.1
 *    - works on latest versions of Safari, Chrome, and FF
 *    - (timeout?) bug causes scroll to eventually become extremely
 *      sluggish on Chrome
 *  June 29, 2011:  v0.5
 *    - major code refactor, eliminated need for setTimeout call
 *    - works on IE8+, Safari 2+, FF3.0+, Chrome 1.0+
 *    - next release: embedded jScrollie rather than only around <body>
 *    - problems: no longer supports dynamic resizing (must do manually)
 *  April 11, 2013: v0.6
 *    - if jQuery mutate (http://www.jqui.net/jquery-projects/jquery-mutate-official/) 
 *      is present, use it to monitor height changes and update scrollbar
 *    - jScrollie can be added to any element, not only <body>
 *    - added jScrollieUpdate function, to update scrollbar manually
 *
 *  @author Sorin Otescu
 *  @author Joe Vennix
 *  http://joevennix.com
