@extends('layouts.app')

@section('title', 'Lançamento Manual')

@section('content')
<div id="lancamento-manual-app">
  <h1>Lançamento manual</h1>

  <div class="card">
    <h2>Dados do lançamento</h2>
    <div class="form-grid">
      <div class="form-row">
        <label>Data de competência *</label>
        <input type="date" id="lancamento-data">
      </div>
      <div class="form-row">
        <label>Histórico *</label>
        <input type="text" id="lancamento-historico" maxlength="500">
      </div>
      <div class="form-row">
        <label>Valor *</label>
        <input type="number" step="0.01" min="0.01" id="lancamento-valor">
      </div>
      <div class="form-row">
        <label>Conta débito *</label>
        <select id="lancamento-conta-debito">
          <option value="">—</option>
          @foreach ($planosConta as $p)
            <option value="{{ $p->id }}">{{ $p->codigo }} — {{ $p->descricao }}</option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Conta crédito *</label>
        <select id="lancamento-conta-credito">
          <option value="">—</option>
          @foreach ($planosConta as $p)
            <option value="{{ $p->id }}">{{ $p->codigo }} — {{ $p->descricao }}</option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Centro de custo</label>
        <select id="lancamento-centro-custo">
          <option value="">—</option>
          @foreach ($centrosCusto as $c)
            <option value="{{ $c->id }}">{{ $c->nome }}</option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Pessoa</label>
        <select id="lancamento-pessoa">
          <option value="">—</option>
          @foreach ($pessoas as $p)
            <option value="{{ $p->id }}">{{ $p->nome }} ({{ $p->documento }})</option>
          @endforeach
        </select>
      </div>
    </div>
  </div>

  <div class="form-actions">
    <a href="{{ route('tarefas.entrada') }}" class="btn btn-secondary">Cancelar</a>
    <button class="btn btn-primary" id="lancamento-salvar">Salvar</button>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/lancamento-manual-form.js') }}"></script>
@endpush