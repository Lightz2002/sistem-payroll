<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    .pl {
      padding-left: 0.5rem;
    }

    .font-bold {
      font-weight: bold;
    }
    .text-center {
      text-align: center
    }

    .text-right {
      text-align: right
    }

    .text-underline {
      text-decoration: underline;
    }

    .content-main {
      display: flex;
    }

    .content-main table{
      margin: 1rem 0;
      float: left;
    }

    .content-main::after {
            content: "";
            display: table;
            clear: both;
        }

    .salary-header, .highlight {
      background-color: #667EEA;
      color: white;
      font-weight: bold;
      padding: 0.5rem 0;
    }

   
  </style>
</head>
<body>
  <div id="header" class="text-center">
    <img width="100" height="100" src="{{ url('storage/images/Logo.png') }}" alt="">
      <h1>
        Toko Multi Bintan
      </h1>
      <p>
        Jl. Wisata bahari km.31 Kawal
      </p>
  </div>
  <hr>
  <div id="content">
    <div class="content-header">
      <h3 class="text-center text-underline">Laporan Gaji Karyawan</h3>
      {{-- <h5 class="text-center">Periode {{ $data->date }}</h5> --}}
    </div>


    <table width="100%">
      <tr>
        <th class="highlight">
          No
        </th>
        <th class="highlight">
          Tanggal
        </th>
        <th class="highlight">
          Nama Karyawan
        </th>
        <th class="highlight">
          Jabatan
        </th>
        <th class="highlight">
          Jumlah Gaji Bersih
        </th>
      </tr>

      @foreach ($datas as $data )
      <tr>
        <td class="text-center">
          {{ $loop->iteration }}
        </td>
        <td class="pl">
          {{ $data->date }}
        </td>
        <td class="pl">
          {{ ucwords($data->employee) }}
        </td>
        <td class="pl">
          {{ ucwords($data->role) }}
        </td>
        <td class="text-right">
          {{ number_format($data->total_amount, 2, ',', '.') }}
        </td>
      </tr>
      @endforeach

      <tr>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td colspan="5"></td>
      </tr>
      <tr>
        <td colspan="5"></td>
      </tr>

      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td class="font-bold">
          Total Gaji Bersih
        </td>
        <td class="text-right">
          Rp {{ number_format($datas->sum('total_amount'), 2, ',', '.') }}
        </td>
      </tr>
    </table>
    {{-- <p style="page-break-before: always;">the second page</p> --}}
  </div>
  <div id="footer">
    
  </div>
</body>
</html>