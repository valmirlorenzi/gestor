@extends('layouts.app')

@section('title', 'Tabela INSS')

@section('content')
<div class="page-header" style="margin-bottom:16px;">
  <h1>Tabela INSS</h1>
  <a href="{{ route('tabelas-fiscais.index') }}" class="btn btn-secondary">← Voltar</a>
</div>

<div class="card">
  <h2>Faixas vigentes</h2>
  <table class="data" id="tabela-inss">
    <thead>
      <tr>
        <th>Faixa</th>
        <th>Valor inicial</th>
        <th>Valor final</th>
        <th>Alíquota</th>
        <th>Vigência</th>
      </tr>
    </thead>
    <tbody>
      @forelse ($tabelas as $t)
        <tr>
          <td>{{ $t->faixa }}ª</td>
          <td>R$ {{ number_format((float) $t->valor_inicial, 2, ',', '.') }}</td>
          <td>R$ {{ number_format((float) $t->valor_final, 2, ',', '.') }}</td>
          <td><strong>{{ number_format((float) $t->aliquota, 2, ',', '.') }}%</strong></td>
          <td class="muted">
            {{ $t->data_inicio_validade->format('d/m/Y') }}
            @if ($t->data_fim_validade)
              — {{ $t->data_fim_validade->format('d/m/Y') }}
            @endif
          </td>
        </tr>
      @empty
        <tr><td colspan="5" class="muted">Nenhuma faixa vigente.</td></tr>
      @endforelse
    </tbody>
  </table>
</div>
@endsection