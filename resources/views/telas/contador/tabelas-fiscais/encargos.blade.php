@extends('layouts.app')

@section('title', 'Tabela de Encargos')

@section('content')
<div class="page-header" style="margin-bottom:16px;">
  <h1>Tabela de Encargos</h1>
  <a href="{{ route('tabelas-fiscais.index') }}" class="btn btn-secondary">← Voltar</a>
</div>

<div class="card">
  <h2>Encargos vigentes</h2>
  <table class="data" id="tabela-encargos">
    <thead>
      <tr>
        <th>Descrição</th>
        <th>Alíquota</th>
        <th>Vigência</th>
      </tr>
    </thead>
    <tbody>
      @forelse ($tabelas as $t)
        <tr>
          <td>{{ $t->descricao }}</td>
          <td><strong>{{ number_format((float) $t->aliquota, 2, ',', '.') }}%</strong></td>
          <td class="muted">
            {{ $t->data_inicio_validade->format('d/m/Y') }}
            @if ($t->data_fim_validade)
              — {{ $t->data_fim_validade->format('d/m/Y') }}
            @endif
          </td>
        </tr>
      @empty
        <tr><td colspan="3" class="muted">Nenhum encargo vigente.</td></tr>
      @endforelse
    </tbody>
  </table>
</div>
@endsection