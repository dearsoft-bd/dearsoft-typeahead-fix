# DearSoft Typeahead Fix

OpenCart 3 OCMOD that fixes the `$(...).typeahead is not a function` JavaScript error by injecting a small, self-contained search-autocomplete fallback. It only activates when `typeahead` is missing and never touches a search box that is already initialised.

- OpenCart 3.x, any theme with `common/header.twig`
- One script tag added before `</head>`; no database changes, no external requests

## Install
1. Download `dearsoft-typeahead-fix.ocmod.zip` from Releases.
2. Extensions > Installer > upload, then Extensions > Modifications > Refresh.

## Configuration
The fallback queries `index.php?route=journal3/search`. For another autocomplete route, set `window.DS_TYPEAHEAD_ROUTE = 'your/route';` before the script loads.

Developed by [DearSoft](https://dearsoft.com.bd). See `LICENSE`.
