@extends('layouts.app')

@section('title', 'Revisão de Lançamentos')

@section('content')
<div id="revisao-lancamentos-app">
  <div class="page-header" style="margin-bottom:16px;">
    <h1>Revisão de Lançamentos</h1>
  </div>

  <div class="card">
    <h2>Lançamentos pendentes de revisão</h2>
    <table class="data" id="tabela-revisao">
      <thead>
        <tr>
          <th>Data</th>
          <th>Histórico</th>
          <th>Valor</th>
          <th>Débito</th>
          <th>Crédito</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <p class="muted" id="revisao-vazio" style="display:none;">Nenhum lançamento pendente de revisão.</p>
  </div>

  {{-- Modal de reclassificação --}}
  <div id="modal-reclassificar" class="card" style="display:none; margin-top:16px;">
    <h2>Reclassificar lançamento</h2>
    <input type="hidden" id="modal-lancamento-id">
    <div class="form-grid">
      <div class="form-row">
        <label>Conta débito *</label>
        <select id="modal-conta-debito">
          @foreach ($planosConta as $p)
            <option value="{{ $p->id }}">{{ $p->codigo }} — {{ $p->descricao }}</option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Conta crédito *</label>
        <select id="modal-conta-credito">
          @foreach ($planosConta as $p)
            <option value="{{ $p->id }}">{{ $p->codigo }} — {{ $p->descricao }}</option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Centro de custo</label>
        <select id="modal-centro-custo">
          <option value="">—</option>
          @foreach ($centrosCusto as $c)
            <option value="{{ $c->id }}">{{ $c->nome }}</option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Justificativa *</label>
        <input type="text" id="modal-justificativa" maxlength="500">
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" id="modal-cancelar">Cancelar</button>
      <button class="btn btn-primary" id="modal-salvar">Reclassificar</button>
    </div>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/revisao-lancamentos-list.js') }}"></script>
<script src="{{ asset('assets/js/revisao-lancamentos-form.js') }}"></script>
@endpush