<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <style>
      /* Style the calendar icon to appear white */
      /* Note: This is specific to WebKit-based browsers (Chrome, Safari) */
      input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
      }
      input[type="month"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
      }
    </style>
    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite('resources/js/app.tsx')
    @inertiaHead
  </head>
  <body class="font-sans antialiased">
    @inertia
  </body>
</html>
