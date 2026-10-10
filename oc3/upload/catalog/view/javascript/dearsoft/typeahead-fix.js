/**
 * DearSoft auto-fixing-module v3.6.0
 * typeahead-fix.js
 * Typeahead / Search Autocomplete Fix
 * OpenCart 3.x (any theme)
 * https://dearsoft.com.bd
 */
;(function () {
  'use strict';

  if (window._dsTypeaheadLoaded) return;
  window._dsTypeaheadLoaded = true;

  if (typeof jQuery === 'undefined') {
    console.error('jQuery: NOT LOADED — aborting typeahead fix');
    return;
  }

  var $ = jQuery;

  /* ── Polyfill: inject only if missing ────────────────────── */
  if (typeof $.fn.typeahead !== 'function') {

    $.fn.typeahead = function (options) {
      return this.each(function () {
        var $input = $(this);
        if ($input.data('_ds_ta')) return;
        $input.data('_ds_ta', true);

        var opts = $.extend({ minLength: 2, highlight: true }, options);
        var $wrap = $input.parent();
        var $drop = $('<ul class="typeahead dropdown-menu"></ul>').css({
          position: 'absolute', zIndex: 9999, display: 'none',
          minWidth: '100%', background: '#fff',
          border: '1px solid #e0e0e0', borderRadius: '4px',
          listStyle: 'none', padding: '4px 0', margin: '2px 0 0',
          boxShadow: '0 4px 16px rgba(0,0,0,.12)'
        });
        $wrap.css('position', 'relative').append($drop);

        function hl(str, q) {
          var safe = $('<span>').text(str).html();
          if (!opts.highlight || !q) return safe;
          return safe.replace(
            new RegExp('(' + q.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + ')', 'gi'),
            '<strong>$1</strong>'
          );
        }

        function render(items, q) {
          $drop.empty();
          if (!items || !items.length) { $drop.hide(); return; }
          $.each(items.slice(0, 10), function (i, item) {
            var lbl = typeof item === 'object'
              ? (item.name || item.label || item.value || '') : String(item);
            $('<li></li>').css({
              padding: '8px 14px', cursor: 'pointer',
              fontSize: '14px', borderBottom: '1px solid #f5f5f5'
            })
            .html(hl(lbl, q))
            .on('mousedown', function (e) {
              e.preventDefault();
              $input.val(lbl).trigger('change');
              $drop.hide();
              $input.trigger('typeahead:select', [item]);
            })
            .hover(
              function () { $(this).css('background', '#f7f7f7'); },
              function () { $(this).css('background', ''); }
            )
            .appendTo($drop);
          });
          $drop.show();
        }

        var _t;
        $input.on('input keyup', function (e) {
          if (e.keyCode === 27) { $drop.hide(); return; }
          var q = $.trim($input.val());
          if (q.length < opts.minLength) { $drop.hide(); return; }
          clearTimeout(_t);
          _t = setTimeout(function () {
            if (typeof opts.source === 'function') {
              opts.source(q, function (d) { render(d, q); });
            }
          }, 200);
        });
        $input.on('blur', function () {
          setTimeout(function () { $drop.hide(); }, 250);
        });
        $(document).on('keydown', function (e) {
          if (e.keyCode === 27) $drop.hide();
        });
      });
    };
  } else {
  }

  /* ── Init on DOM ready ────────────────────────────────────── */
  $(function () {
    var $s = $('#search input[name="search"]');
    if (!$s.length) { console.warn('search input: not found'); console.groupEnd(); return; }
    if ($s.data('_ds_ta') || $s.data('tt-typeahead')) { return;
    }
    try {
      $s.typeahead({
        minLength: 2,
        highlight: true,
        source: function (q, cb) {
          $.getJSON('index.php', { route: (window.DS_TYPEAHEAD_ROUTE || 'journal3/search'), search: q })
            .done(function (d) { cb(Array.isArray(d) ? d : []); })
            .fail(function () { cb([]); });
        }
      });
    } catch (e) {
      console.error('typeahead init error:', e.message);
    }
  });

})();
