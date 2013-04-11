/**
 *  Code based off of: http://code.google.com/p/scrollbarpaper/
 *                                                                    
 *      ,,                                     ,,    ,,    ,,          
 *      db  .M"""bgd                         `7MM  `7MM    db          
 *         ,MI    "Y                           MM    MM                
 *    `7MM `MMb.      ,p6"bo `7Mb,od8 ,pW"Wq.  MM    MM  `7MM  .gP"Ya  
 *      MM   `YMMNq. 6M'  OO   MM' "'6W'   `Wb MM    MM    MM ,M'   Yb 
 *      MM .     `MM 8M        MM    8M     M8 MM    MM    MM 8M"""""" 
 *      MM Mb     dM YM.    ,  MM    YA.   ,A9 MM    MM    MM YM.    , 
 *      MM P"Ybmmd"   YMbmd' .JMML.   `Ybmd9'.JMML..JMML..JMML.`Mbmmd' 
 *   QO MP                                                             
 *   `bmP                                                              
 *
 *    jScrollie is a lightweight jQuery plugin that allows you to skin 
 *  your scroll bars. I wrote it because most of the js scroll bar 
 *  solutions I had seen felt sluggish and non-native.
 *    jScrollie works by pushing the original scroll bar behind a div 
 *  with overflow-x set to hidden, which lets you maintain your original 
 *  scrolling mechanism. A "fake", HTML-based scroll bar is then generated
 *  and placed where the user expects the original scroll bar to appear.
 *  
 *  == Version Log ==
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
 **/

(function($) {
  $.fn.jScrollie = function() {
    this.each(function() {
        $(this).data('jScrollie', new JScrollie($(this)));
    });
    return this;
  }

  $.fn.jScrollieUpdate = function() {
    this.each(function() {
      var jscr = $(this).data('jScrollie');
      if (jscr)
        jscr.update();
    });
    return this;
  }

  function JScrollie($el) {
    // initialize jScrollie
    // jScrollieClear is used to calculate height of the content
    var clearer = $('<div class="jScrollieClear" style="clear:both;"></div>')
                    .appendTo($el);

    // jScrollieMetaContainer is a <div> that wraps <body>'s contents.
    //   It is absolutely positioned to cover the entire window 
    // jScrollie <div> does the actual 'pushing' of the scroll bar (w=110%)
    $el.wrapInner('<div class="jScrollieMetaContainer"><div class="jScrollie">');
    // Insert the following HTML elements just before previous wrap
    var preWrap = $(
      '<div class="jScrollieContainer">' + // set WIDTH of bar on this element
        // the jScrollieContainer sits on right of window, holds "fake" bar
        '<div class="jScrollieTrack">' + // the vertical bar bg (CSS cust.)
          '<div class="jScrollieDrag">' + // the draggable "scrollbar"
            '<div class="jScrollieDragTop">' +    // top "cap" of bar
            '</div>' +
            '<div class="jScrollieDragBottom">' + // bottom "cap" of bar
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    ).prependTo($el);
    $el.wrapInner('<div class="jScrollieAll">');
      
    // "scrollData" holds variables we need to remember (track, clearer, etc)
    // remember our initial state
    this.scrollData = {
      jScroll    : $('.jScrollieContainer', $el),
      track      : $('.jScrollieTrack', $el),
      drag       : $('.jScrollieDrag', $el),
      dragTop    : $('.jScrollieDragTop', $el),
      dragBottom : $('.jScrollieDragBottom', $el),
      content    : $el,
      clearer    : clearer,
      scroller   : $('.jScrollie', $el)
    };

    this.update();

    // if JQuery.Mutate is present, monitor height changes to the root element
    // and update the scrollbar size and visibility
    if ($.fn.mutate) {
      $el.mutate('scrollHeight',function (el,info) {
        $(el).jScrollieUpdate();
      }
    }
  }

  JScrollie.prototype = {
    // set up listeners for scroll/click/drag events
    checkRefresh: function() {
      console.log('checking refresh')
      this.update();
    },

    update: function() {
      // called when a scroll, drag, or click is detected that requires a repaint
      var scrollData = this.scrollData;
      var $el = scrollData.content;
      var contentHeight = scrollData.clearer.position().top - 
                          scrollData.content.position().top;
      // save current height/content height
      scrollData.height = scrollData.scroller.height();
      scrollData.contentHeight = contentHeight;
      scrollData.offset = scrollData.scroller.offset();

      $el.unbind();

      //When you click the track, the scrollbar "jumps" to your mouse
      var ratio = this.scrollData.scroller.height() / contentHeight;
      
      if (ratio < 1) { //content is big enough to show the scrollbar
        scrollData.jScroll.show();
        scrollData.jScroll.height(scrollData.scroller.height());
        var offset = scrollData.scroller.offset();
        var dragHeight = Math.max( Math.round(scrollData.scroller.height() * ratio), 
                                   scrollData.dragTop.height() + scrollData.dragBottom.height() );
        scrollData.drag.height(dragHeight);

        var self = this;
        // Listen for scorll event
        scrollData.scroller.scroll(function(event) {
          self.scrollData.drag.css('top', Math.min(
                          Math.round(self.scrollData.scroller.scrollTop() * ratio), 
                          self.scrollData.scroller.height() - dragHeight) + 'px'
                        );
        });
        scrollData.scroller.scroll();

        var unbindMousemove = function() {
          $el.unbind('mousemove.jScrollie');
        };
        // Listen for a "drag" event on the scrollbar
        scrollData.drag.mousedown(function(event) {
          unbindMousemove();
          var drag = scrollData.drag;
          var offsetTop = event.pageY - drag.offset().top;
          $el.bind('mousemove.jScrollie', function(event) {

            scrollData.scroller.scrollTop((event.pageY - scrollData.scroller.offset().top
                                             - offsetTop) / ratio);
            return false;
          }).mouseup(unbindMousemove);
          return false;
        });
        //When you click the track, the scrollbar "jumps" to your mouse
        scrollData.track.mousedown(function(event) {
          scrollData.scroller.scrollTop(((event.pageY-20) / scrollData.scroller.height()) * contentHeight);
        });
      } else {
        //content is small enough to hide the scroll bar
        this.scrollData.jScroll.hide();
      }
    }
  }  
}(jQuery));
