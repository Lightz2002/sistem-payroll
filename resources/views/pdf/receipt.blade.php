<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
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
    <img width="100" height="100" src="{{ url('storage/images/Logo.jpg') }}" alt="">
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
      <h3 class="text-center text-underline">Slip Gaji Karyawan</h3>
      <h5 class="text-center">Periode {{ $data->date }}</h5>
    </div>

    <div class="content-desc">
      <table width="50%">
        <tr>
          <td>Nama</td>
          <td width="70%">: {{ ucwords($data->employee->name) }}</td>
        </tr>
        <tr>
          <td>NIK</td>
          <td width="70%">: {{ $data->employee->identity_no ?? '-' }}</td>
        </tr>
        <tr>
          <td>Jabatan</td>
          <td width="70%">: {{ $data->employee->roles[0]->name }}</td>
        </tr>
        <tr>
          <td>Status</td>
          <td width="70%">: Karyawan Tetap</td>
        </tr>
        <tr>
          <td>Tanggal</td>
          <td width="70%">: {{ today()->format('d-M-Y') }}</td>
        </tr>
      </table>
    </div>

    <div class="content-main">
        <table width="50%">
          <tr><th colspan="2" class="salary-header">Penghasilan</th></tr>
          <tr>
            <td width="50%">Gaji Pokok</td>
            <td width="50%" class="text-right">{{ number_format($data->total_absence_salary, 2, ',', '.') }}</td>
          </tr>

          @foreach ($data->salary_bonus as $bonus)
          <tr>
            <td width="50%">{{ $bonus->name }}</td>
            <td width="50%" class="text-right">{{ number_format($bonus->amount, 2, ',', '.') }}</td>
          </tr>
          @endforeach

          <tr>
            <td width="50%" class="font-bold">Total Penghasilan</td>
            <td width="50%" class="text-right">{{ number_format($data->total_absence_salary + $data->total_salary_bonus ,2, ',', '.') }}</td>
          </tr>

        </table>
        <table width="50%" >
          <tr><th colspan="2" class="salary-header">Potongan</th></tr>
          @foreach ($data->salary_deductions as $deduction)
          <tr>
            <td width="50%">{{ $deduction->name }}</td>
            <td width="50%" class="text-right">{{ number_format($deduction->amount, 2, ',', '.') }}</td>
          </tr>
          @endforeach

          <tr>
            <td width="50%" class="font-bold">Total Potongan</td>
            <td width="50%" class="text-right">{{ number_format($data->total_salary_deduction ,2, ',', '.') }}</td>
          </tr>

        </table>
    </div>

    <table width="100%">
        <tr>
          <td width="50%" class="highlight text-center">Penerimaan Bersih</td>
          <td width="50%" class="highlight text-center">
            Rp {{ number_format($data->total_amount, 2, ',', '.') }}
          </td>
        </tr>
    </table>

    {{-- <p style="page-break-before: always;">the second page</p> --}}
  </div>
  <div id="footer">
    <br>
    <br>

    <p>Mengetahui</p>
      <br>
      <br>
      <br>
      <p>Direktur</p>
      <p>{{ ucwords(auth()->user()->name) }}</p>
  </div>
</body>
</html>